## Node.js Learning

### IO
* [buffer](https://github.com/luyufa/NodeLearning/blob/master/io/buffer.md)
* [stream流](https://github.com/luyufa/NodeLearning/blob/master/io/stream.md)
* [stdio和console](https://github.com/luyufa/NodeLearning/blob/master/io/stdio.md)
* [编码与解码](https://github.com/luyufa/NodeLearning/blob/master/io/code.md)
* [文件系统](https://github.com/luyufa/NodeLearning/blob/master/io/file.md)

###### 常见问题

* Buffer 一般用于处理什么数据? 其长度能否动态变化?
* Buffer有关的内存泄漏?
* Stream 的 highWaterMark 与 drain 事件是什么? 二者之间的关系是?
* Stream 的 pipe过程中的读写速率不匹配是如何解决的?
* 什么是文件描述符? 输入流/输出流/错误流是什么?
* 如何实现一个 console.log?
* 如何遍历文件夹?


### Module

* [CommonJS规范的实现](https://github.com/luyufa/NodeLearning/blob/master/module/commonJS.md)
* [npm](https://github.com/luyufa/NodeLearning/blob/master/module/npm.md)
* [模块加载机制](https://github.com/luyufa/NodeLearning/blob/master/module/module.md)
* [从require开始](https://github.com/luyufa/NodeLearning/blob/master/module/require.md)

###### 常见问题

* a.js 和 b.js 两个文件互相 require 是否会死循环? 双方是否能导出变量?
* 如果 a.js require 了 b.js, 那么在 b 中定义全局变量 t = 111 能否在 a 中直接打印出来?
* 如何在不重启 node 进程的情况下热更新一个 js/json 文件?



### JS

* ES6
* 闭包
* 原型 & 继承
* 作用域 & this
* 类型判断

### Async & Event

* [事件循环](https://github.com/luyufa/NodeLearning/blob/master/async/eventLoop.md)
* [Event](https://github.com/luyufa/NodeLearning/blob/master/async/event.md)
* 异步决绝方案 - Promise
* 异步决绝方案 - async

###### 常见问题

* try catch可以捕获异步代码里的error么?为什么?
* 什么是雪崩问题?如何解决?
* 什么是异步?有回调函数就算异步么?
