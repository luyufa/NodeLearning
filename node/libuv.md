## libuv
> 计算机基本活动是IO(网络、文件),而libuv的基本目的就是让IO的时候不阻塞CPU


![libuv结构](https://github.com/luyufa/NodeLearning/blob/master/node/img/2.png)

为了使用户可以介入事件循环提供了两种抽象:请求`request`和句柄`handle`
 * 句柄表示一个持久存在的对象,当句柄处于激活时,每次事件循环都会触发callback调用
 * 请求表示一个短暂性一次性的对象

ps: windows上叫句柄,linux上称文件描述符


举个栗子:

```
const http = require('http');
http.createServer(function (req, res) {

});
```
这段代码会监视一个可引用的`http服务的句柄`，每次有新http请求进来时都`被激活`,在`事件循环`时便会`调用callback`


```
const fs = require('fs');
fs.readdir('path', function (err, chunk) {

});
```
这段代码会创建一个请求



对于`网络IO`不同的平台`libuv`会选取最佳轮询机制,`Linux`是`epoll`,`Windows`上为`IOCP`。
对于`文件IO`,`Linux`和`Windows`都会`libuv`会创建全局`Thread Pool`,默认大小是4,并且在事件循环中共享


* `IOCP`:IO完成后给一个事件通知，且封装了IO+异步消息通知机制(造成无法控制IO堵塞)
* `Epoll`:希望进行IO时,向Epoll查询是否可读写,如处于可读写状态则Epoll会以epoll_wait进行通知，不负责IO操作，仅封装了异步消息通知


nodejs中使用了默认的`uv_default_loop`作为自己的主`loop`


#### 事件循环迭代过程

![事件循环](https://github.com/luyufa/NodeLearning/blob/master/node/img/3.png)

1. 事件循环一开始的时候,会更新现在时间(`now`),用于减少关于时间的轮询次数

2. 判断时间循环是否是存活(`alive`),如果一个循环包含`激活的句柄`、`激活的请求`、`正在关闭的句柄`就认为是alive的

3. 执行超时定时器(`due timers`),所有在`now之前`完成的定时器其关联的`callback`都会在此时得到执行
4. 等待中回调(`pending callback`),通常情况下IO完成时对应回调就会在此次事件循环完成，但有时会被推迟至下次事件循环，所有被推迟的`callback`都会在此时得到执行

5. 空转回调(`idle handle callback`),每次事件循环总是执行

6. 预备回调(`prepare callback`), 循环被IO阻塞前调用

7. 计算轮询超时时间(`poll timeout`), 循环被IO阻塞前计算
   * 如果循环带有`UV_RUN_NOWAIT`,则timeout=0
   * 如果如果循环即将停止(`uv_stop()`之前被调用过),则timeout=0
   * 如果`没`有激活的请求,则timeout=0
   * 如果`没`有被激活的闲置句柄,则timeout=0
   * 如果有正在关闭的句柄,则timeout=0
   * 如果不满足以上所有，那么超时时间为定时器中超时间时间最早的一个，如果不存在激活的定时器，则为无限大(`infinity`)
8. 时间循环被IO阻塞，时间为上面所计算的时间,此时所有与IO相关的句柄都会等待一个`read`或`write`操作来被激活他们的回调`callback`
9. 执行检查句柄回调(`check handle callback`)此时IO阻塞结束,立即执行检查句柄回调
10. 执行关闭回调(`close callback`),如果一个句柄调用`uv_close()`,则会关闭其回调
11. 可能IO阻塞事件循环时并没有IO回调被触发,但可能存在某些定时器超时了,如事件循环是以`UV_RUN_ONCE `开始执行的，则此时会执行哪些超时的定时器回调
12. 如果事件循环是以`UV_RUN_NOWAIT`或`UV_RUN_ONCE`开始执行则退出迭代并以`uv_run`返回，如果事件循环以`UV_RUN_DEFAULT`开始那么会进入下一轮迭代。




