###  事件循环

> 单线程、非阻塞IO(non-blocking )、事件驱动(event-driven)


#### 任务队列

`单线程`的`javascript`同一时间只用来做一件事，如果是因为计算（`CPU`占用）导致的无话可说，
但是大部分时候是`IO操作`（数据库、网络、文件），`CPU`处于等待状态却无法处理后续任务，
必须等待上一个任务执行完成才可以继续执行。为此`JS`的做法是`挂起`等待`IO`的操作，继续处理后续任务，等待`IO`完成后，在继续执行`挂起`的任务。

于是所有任务被分为了两种

* （执行队列）同步任务，在主线程中等待，依次被执行
* （事件队列）异步任务，被挂起的任务执行完成后，就在其中添加一个事件


1. 所有同步任务都在主线程上执行，形成一个执行栈
2. 主线程之外，还存在一个"任务队列"（task queue）。只要异步任务有了运行结果，就在"任务队列"之中放置一个事件
3. 一旦"执行栈"中的所有同步任务执行完毕，系统就会读取"任务队列"，看看里面有哪些事件。那些对应的异步任务，于是结束等待状态，进入执行栈，开始执行
4. 主线程不断重复上面的第三步


所谓回调函数便指的是，被挂起的异步任务执行完毕，在事件队列中添加了一个事件，之后主线程循环事件队列，将事件分发出去，回调函数就是此事件的处理者。


###### NodeJS底层借助`libvu`，将不同的任务交有线程去处理

![libvu](https://github.com/luyufa/NodeLearning/blob/master/async/libvu.png)


#### nextTick、then、setTimeout、setImmediate的区别与事件循环有什么关系？

* `nextTick`:放入当前执行队列末尾
* `then`:事件队列开始
* `setTimeout`和`setImmediate`:事件队列尾部

```
setImmediate(function () {
    console.log(7)
});
setTimeout(function () {
    console.log(1)
}, 0);
process.nextTick(function () {
    console.log(6)
    process.nextTick(function () {
        console.log(8)
    })
});
new Promise(function executor(resolve) {
    console.log(2);
    for (var i = 0; i < 10000; i++) {
        i == 9999 && resolve();
    }
    console.log(3);
}).then(function () {
    console.log(4);
});
console.log(5); 
```
执行队列 2 3 5  6 8
事件队列 4 1(7)


NodeJS中的异步大致分为两类,IO操作走libvu和setTimeout等方式实现的

```
function sleep(ms) {
    const now = Date.now();
    const expire = now + ms;
    while (Date.now() < expire) {
    }
}
```