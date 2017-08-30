## Redis实现任务队列
> 生产者RPUSH任务进LIST，消费者使用LPOP消费


```
while(true){ //无限循环读取队列中的任务
  const task = LPOP queue
  if(task){ //任务存在则执行
     exec(task)
  }else{
     sleep(1000) //不存在则等1s在轮询
  }
}
```

#### BLPOP queue1 [queue2 ...] timeout（优先级队列queue1>queue2）

`BLPOP`命令与`LPOP`并无差别，只是前者会阻塞连接，直到queue1和queue2种中至少存在一个有元素才会返回（都没元素才会阻塞）。如果queue1和queue2中都有元素，从左至右返回第一个元素。timeout表示超时时间，如果为0则表示不限制等待时间。

```
while(true){
  const task[1] = BLPOP queue1 queue2 0 //都没有元素则阻塞，否则返回数组，queue1优先级高
  if(task[1]){
    exec(task[1])
  }
}
```


#### 发布订阅模式
> 订阅者可以订阅一个或多个频道，发布者可以向指定频道发送消息，所有该频道的订阅者都会收到消息

发布者发布消息: `PUBLISH channel message`,发布后的消息不会持久话，即客户端订阅前发布的消息是无法接收到的

订阅者订阅频道: `SUBSCRIBE channel [channel ...]`

一旦客户端执行`SUBSCRIBE`进入订阅状态后，就无法使用除了`SUBSCRIBE`,`UNSUBSCRIBE`,`PSUBSCRIBE`,`PUNSUBSCRIBE`

SUBSCRIBE channel
PSUBSCRIBE 正则表达式channel (同时订阅多个)




