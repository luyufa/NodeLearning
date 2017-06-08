###  Event

> 能触发事件的对象都是EventEmitter的实例，emit分发事件，on监听事件，同步触发。


####  监听器参数与内部this

this被特定指向了emitter

```
const EventEmitter = require('events');

const emitter = new EventEmitter();
this.name = 'out'

emitter.on('ok', function(,a,b,c) {
    console.log('this', this)
});
emitter.emit('ok',1,2,3);

//this EventEmitter {....}
```

但是，当使用箭头函数时,则为当前父环境this（）

```
const EventEmitter = require('events');

const emitter = new EventEmitter();
this.name = 'out'

emitter.on('ok', (...paras)=> {
    console.log('this', this)
});
emitter.emit('ok',1,2,3);
//this { name: 'out' }
```

所有的监听器都是按照注册顺序依次同步触发

`once`与`on`，仅触发一次，添加 listener 函数到名为 eventName 的事件的监听器数组的末尾。 不会检查 listener 是否已被添加。 多次调用并传入相同的 eventName 和 listener 会导致 listener 被添加与调用多次，返回一个 EventEmitter 引用，可以链式调用。




如果没有注册`error`事件，当`error`事件发生时，会打印错误堆栈，退出进程,此时有两种解决方案：

```
process.on('uncaughtException', function (err) {

});
emitter.on('error', function (err) {

});
```

`newListener`与`removeListener`事件

emitter每个事件重复注册默认最大上限是10，超过则抛出warnning,
`emitter.setMaxListeners(0)`,可以解除此限制

```
//emitter.setMaxListeners(0)
for (let i = 0; i < 11; i++) {
    emitter.on('event', function () {

    })
}
```


雪崩问题？在没有缓存（站点刚刚启动）时，大量请求需要同一数据，此时会加大数据库压力，造成整体站点速度下降，为此，将这一批请求加入事件队列，第一个到的去执行数据库查询，完事后分发事件所有请求共享一批数据。

![利用once事件解决雪崩问题](https://github.com/luyufa/NodeLearning/blob/master/async/once.png)




