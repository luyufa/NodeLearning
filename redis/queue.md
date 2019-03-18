## redis实现消息队列
> 异步执行、解耦

消息队列的主要特点是`异步处理`，主要目的是减少请求响应时间和`解耦`。所以主要的使用场景就是将比较耗时而且不需要即时（同步）返回结果的操作作为消息放入消息队列。同时由于使用了消息队列，只要保证消息格式不变，消息的发送方和接收方并不需要彼此联系，也不需要受对方的影响，即解耦和。



##### list & blocking lists

都知道队列是一种先进先出(`FIFO`)的结构,在redis中的list提供了`LPUSH `来推数据进队列，也叫生产者，`RPOP`取数据，也叫消费者于是我们很容易写出如下代码

```
setInterval(function(){
    let task=redis.rpop()
    if(task){
        task()//todo
    }
},100)
```
这是最简单的消费者代码，无限循环每隔100毫秒去查询redis list中是否存在待执行任务，有则取出执行。这让写的问题是显而易见的
  1. 存在100毫秒的延时
  2. 无论是否有数据都去轮询，增加reids负载


为了解决上面两个问题，redis提供了一种阻塞的队列操作来实现消息队列，`BRPOP`（`BLPOP`）,该操作可以阻塞直到队列中返回数据或超时(0为不限时)

```
brpop tasks 5
等待列表中的元素tasks，但是如果5秒后没有元素可用则返回
```
于是有如下
```
while(true){
    let task=redis.brpop([tasks],0)
    task()
}
```

##### 优先级队列

 * 简单优先级队列
 加入存在三个优先级高、中、低，那么我们可以设置三个队列，将不同优先级任务放入不同队列，由于redis的`brpop`是提供多个队列的阻塞读取操作的，于是读取时在按队列优先级读取。

```
while(true){
    let task=redis.brpop([highTasks,middleTasks,lowTasks],0)
    task()
}
```
如上代码便完成了一个简单的优先级队列，如上方法仅适用于优先级是高、中低，这样有限可枚举的。但是像优先级是0-100这样的不确定权值则不适用了，看到权值很容易联想到redis的`zset`(有序集合)，幸运的是zset在5.0.0以上版本支持了`BZPOPMAX`来阻塞的返回集合中分值最大的元素

于是权值类的优先级队列
```
while(true){
    let task=redis.bzpopmax([tasks],0)
    task()
}
```


那么如果不支持`BZPOPMAX`操作的redis上如何实现权重优先级队列呢？我们可以每次入队列时保障顺序即可，假设当前队列`[1,4,6,8,99]`，当一个权重为2的任务需要入队列时，我们可以

```
const count=redis.zcard(key)
有了最大元素个数后，使用2分查找依次比较，选定合适的位置插入待入队列数据
此时消费端只需按顺序`BRPOP`消费即可
```



##### 参考

* [消息队列的使用场景是怎样的？](https://www.zhihu.com/question/34243607)
* [redis命令](https://redis.io/commands)
* [基于redis构建消息队列](https://lanjingling.github.io/2016/01/29/messagequeue-redis/)