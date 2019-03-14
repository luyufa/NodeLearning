## 分布式锁

先明确一个问题，锁用来干嘛？
 1. 提升效率，保证同一个任务不会被执行多次
 2. 保证正确，保证互斥资源的有序访问


##### nx
`set resource_key rand_value nx px 30000`

* rand_value是由客户端生成的一个随机字符串，它要保证在足够长的一段时间内在所有客户端的所有获取锁的请求中都是唯一的。

* NX表示只有当resource_key对应的key值不存在的时候才能SET成功。这保证了只有第一个请求的客户端才能获得锁，而其它客户端在锁被释放之前都无法获得锁。

* PX 30000表示这个锁有一个30秒的自动过期时间。这个锁必须要设置一个过期时间。否则的话，当一个客户端获取锁成功之后，假如它崩溃了导致它再也无法和Redis节点通信了，那么它就会一直持有这个锁，而其它客户端永远无法获得锁了。获得锁的客户端必须在这个时间之内完成对共享资源的访问。

##### 单台redis实例


```
class Locker {
    constructor() {
        this.client = new Redis({
            port: 6379,
            host: 'localhost'
        });
        this.resourceNames = {};
    }

    async timeout(cb, ms) {
        return new Promise(resolve => {
            setTimeout(async function () {
                resolve(await cb());
            }, ms)
        })
    }

    resourceName(name) {
        return `lock:${name}`
    }

    /**
     *
     * @param resourceName 锁名称
     * @param randValue 客户端随机值，保障锁仅有加锁的客户端可以释放
     * @param timeout 获取锁的超时时间ms
     * @param ex 锁的生命周期ms
     * @param waitInterval 获取锁失败后再次发起请求获取锁的间隔ms
     */
    async lock(resourceName, randValue, timeout = 10000, ex = 800, waitInterval = 1000) {
        if (!resourceName) {
            return false;
        }
        const timeoutAt = timeout + new Date().getTime();//获取锁的超时时间点
        const expireAt = ex + new Date().getTime();//锁的过期时间点
        const key = this.resourceName(resourceName);

        let i = 0;

        async function run() {
            console.log(`第${++i}次尝试获得锁`);
            const _locker = await this.client.set(key, randValue, 'NX');

            //宕机...ing

            if (_locker) {//获取锁成功
                console.log('成功获得锁 success')
                await this.client.expire(key, ex);
                this.resourceNames[resourceName] = expireAt;
                return true;
            }

            const ttl = await this.client.ttl(key);//s

            if (ttl < 0) {//此key未设置过期时间或者该锁被占用,而ttl<0说明key未设置过期时间，可能在如上代码处宕机
                console.log('该锁ttl小于0，取而代之 success')
                await this.client.set(key, randValue, 'PX', ex);
                this.resourceNames[resourceName] = expireAt;
                return true;
            }

            if (timeout <= 0 || timeoutAt < new Date().getTime()) {//在超时时间内可以不断尝试
                console.log('超过超时时间，放弃获取锁 failure')
                return false;
            }

            return this.timeout(run.bind(this), waitInterval)
        }

        return await run.call(this);
    }

    /**
     *
     * @param resourceName 锁名称
     * @param randValue 客户端随机值
     */
    async unlock(resourceName, randValue) {
        const key = this.resourceName(resourceName)
        const value = await this.client.get(key);
        if (value === randValue) {//判断要释放的锁是否为自己加的
            await this.client.del(key);
            delete this.resourceNames[resourceName];
            console.log('解锁成功 success');
            return true;
        }
        console.log('解锁失败 failure');
        return false;
    }
}
```

1. 加锁,先分析加锁需要的必备参数
   * `resourceName`: 针对加锁的资源名称
   * `randValue`: 客户端随机值，保证了一个客户端释放的锁必须是自己持有的那个锁。考虑下面bad case
      1. A获取锁成功。
      2. A在某个操作上阻塞了很长时间。
      3. A获得的锁过期时间到了，锁自动释放了。
      4. B获取到了对应同一个资源的锁。
      5. A从阻塞中恢复过来，释放掉了B持有的锁。
      6. 之后，B在访问共享资源的时候，就没有锁为它提供保护了
    * `timeout`: 获取锁的超时时间
    * `ex`: 锁的生命周期
    * `waitInterval`:获取锁失败后再次发起请求获取锁的间隔(在超时时间内)

2. 解锁，解锁相对简单，就是传入指定的资源名字，需要注意的是，需要传入`randValue`来确认释放的锁的自己加的。


