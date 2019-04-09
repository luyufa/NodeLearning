## redis常见场景
> redis不是必须使用的，但是它是使提升性能最简单直接的方式


##### 最新

1. 需求：找出最新修改的10条帖子
2. 方案：通常面对此类需求难免需要在数据库中查询，
经测试在80w+数据中排序完后再进行查询，大致需要花费4.5s左右，这样是难以接受的。

```
select * from post where order by updatedAt desc limit 10
```
但如果我们在更新帖子时将帖子id作为key,同时写入redis list
```
mysql --
        update post where id=id
redis --
        ltrim new_post 0 8 删除索引在0-9之外的元素
        rpush new_post id 写入队头

最新 --
        ids=lrange new_post 0 9
        select * from post where id in (ids)
```
如上以id作为主键去查询得话，性能提升明显；为了保障业务完善，可以在redis因为各种原因不足10个id时，依然可以准确输出10条最新帖子，我们还要在业务代码中判断下
```
if(ids.length<10){
   select * from post where order by updatedAt desc limit (10-ids.length）
   和redis中已有的ids的时间比较下，排序再写入redis
}
```



##### 最热（排行）

 1. 需求：实时展示用户得分排行榜
 2. 方案：因为得分是实时变化的，所以如果想每次查询都只能走数据库，无法使用缓存，这时用户量大的话mysql便难以承担了,但我们借助redis的有序集合`zset`就很容易了

```
更新得分 zadd rank score uid
排名榜Top10  zrevrange rank 0-10
用户排名 zrank rank uid
```

##### 特定用户访问特定资源

 1. 需求：帖子不可重复点赞，保障充分使用缓存且实时获取点赞信息
 2. 方案：当我们打开帖子详情页时，往往需要获取两个属性是否点赞、点赞数量、甚至点赞人列表，但是帖子基本是发出来很少会变动而点赞属于实时变化的，如果两者一起做缓存，那么会造成频繁删除缓存，这样于性能不利。所以点赞应该单独放入`redis`，我们只需使用帖子`id`为`key`，就像这样`page:pageId`使用`zset`结构，便可轻易实现。

```
点赞帖子 sadd page:pageId uid
帖子获赞总数 scard page:pageId
点赞列表 smembers page:pageId
是否点赞 sismember page:pageId uid
取消点赞 srem page:pageId uid
```

如此在获取文章详情时可以如下操作
```
 page = redis.get(pageId) || select * from pages where id=pageId 从数据库或者换成中拿出文章详情

 page.like={
     is:sismember page:pageId uid,
     total:scard page:pageId,
     uids:smembers page:pageId
 }

```


##### token登录

1. 需求：自动登录,唯一设备登录，状态保持，下次无需登录。
2. 方案：先提交用户名和密码通过验证后，生成一个token唯一关联用户，保存用户关键信息，且将token下发于客户端，之后请求都带上该token。

```
第一次login：user=select * from users where name='xxx' and password='xxx'
             const token='随机唯一'
             redis.hset(token,user,expireTime)
             http response.cookie('sid',token,expireTime)

无需登录：token=http request.cookie.sid
            const user=redis.hget(token)
            if(user){
               redis.expire(token,expireTime)//延迟到期时间
            }
            http response.cookie('sid',token,expireTime)
```



##### 防刷

1. 需求：避免暴力调用接口，例如一些消费接口(短信、邮件)，或者安全接口（登录、注册）
2. 方案：对限制的资源设置一个自增长(`incr`原子操作)数字和过期时间，在期限之内达到次数则禁止调用

```
const count = redis.incr('ip:xxx')
```



##### 限流
1. 避免因接口并发大于系统承受上限时，导致系统瘫痪
2. 方案：`token bucket`令牌桶

   * 算法描述
      * 存在一个`token bucket`，不断向其中投入`token`，每次请求取出`token`，请求获取到`token`视为合法，未获取到采取其他策略
      * 触发式添加令牌，取令牌时，计算上一次和当前时间差，计算这段时间应该添加令牌数`(now - lastTimestamp)/1000 * rate`，`rate`是添加令牌速率
      * 取令牌
```
'use strict';
class Limiter {
    constructor(key) {
        this.apps = [];
    }
    /**
     * 0 未配置令牌桶
     * 1 获取成功
     * -1 获取失败
     */
    acquire(key, needTokens) {//当前资源对应的令牌桶key，该次请求需要的令牌数
        let {app, maxTokens, curTokens, lastTimestamp, rate} = redis.hmget(key);
        //管理app名称
        //最大令牌数
        //当前剩余令牌数
        //上次获取令牌时间
        //添加令牌速率(token/s)

        const now = new Date();
        if (this.apps.indexOf(app) === -1) {//先验证该应用是否在开启名单之内
            return 0;
        }

        let localTokens = curTokens;//本地拥有的令牌数

        if (!lastTimestamp) {//令牌桶首次创建，没有上次读取时间
            localTokens = maxTokens;
        } else {
            const incrementTokens = (now - lastTimestamp) / 1000 * rate;
            //本次时间和上次时间差*速率获取应该新增的令牌数
            const expectMaxTokens = incrementTokens + curTokens;
            localTokens = Math.min(expectMaxTokens, maxTokens);
            //当前拥有令牌数不能超过最大令牌数
        }

        let ret = -1;
        if (localTokens - needTokens >= 0) {//拥有足够的令牌
            ret = 1;
            redis.hset(key, {
                curTokens: localTokens - needTokens,
                lastTimestamp: now
            })
        } else {
            redis.hset(key, {
                curTokens: localTokens,
                lastTimestamp: now
            })
        }
        return ret;
    }
};

```



##### 秒杀

1. 需求：秒杀系统，需注意“超卖”和“数据库压力”
2. 方案
    1. `前端限流`，在秒杀时间节点一到时，瞬间服务器爆炸，响应变慢，这时用户难免会不停的去点按钮，不断发送请求，无辜消耗服务器资源。所以此时，我们需要前端限流，从产品层面考虑可以把提交按钮置灰等表明不可再次点击，从技术角度考虑可以限制短时间内只允许一次提交。
    2. `静态页面`,在秒杀前用户往往会高频次刷新，我们可以将秒杀页面写成静态html文件，放到cdn上
    3. `后端限流`，针对用户id限制访问频率，避免恶意的脚本请求
    4. `redis`,使用具有原子性的`lpush`和`rpop`或者`decr`，保证只有抢到的用户能够进入数据库操作
    ```
    设置秒杀库存
    redis.set('goodCount',100);

    秒杀
    if(redis.decr('goodCount')>0){
        //TODO
    }else{
        return '已售空'
    }
    ```

    ```
    设置特殊的秒杀商品
    redis.lpush('goods',goodId);

    秒杀
    let good = redis.rpop();
    if(good){
        //TODO
    }else{
        return '已售空'
    }

    ```


##### 好友关系

1. 需求：类微博的好友关系即A关注B，B也关注A，则AB互为好友。
2. 方案：其实A关注B，B也关注A这句话用代码翻译就是A的follower和A的follow交集，而redis 集合中`sinter`命令便可以快速完成交集计算。

```
A:follower A的粉丝id
A:follow A的关注id

A的好友：redis.sinter(A:follower,A:follow)

与A共同关注:redis.sinter(A:follow,B:follow)

与A共同粉丝:reids.sinter(A:follower,B:follower)

A关注的人也关注了B:redis.sinter(A:follow,B:follower)
```

#### 参考

* [How to take advantage of Redis just adding it to your stack](http://oldblog.antirez.com/post/take-advantage-of-redis-adding-it-to-your-stack.html)
* [基于Redis的限流系统的设计](https://mp.weixin.qq.com/s?__biz=MzI0MTk0NTY5MA==&mid=2247483711&idx=1&sn=28780c8b26f24ac6314ff5c599bb622c&chksm=e9029c0ade75151c353cd6b720ce438b4342afd8ef3a7d03c61712554c6a000ac3646bbc3124&scene=38#wechat_redirect)
* [redis应用场景](https://www.scienjus.com/redis-use-case/)