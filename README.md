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
* 文件热更新

###### 常见问题

* a.js 和 b.js 两个文件互相 require 是否会死循环? 双方是否能导出变量? 如何从设计上避免这种问题? [more]
* 如果 a.js require 了 b.js, 那么在 b 中定义全局变量 t = 111 能否在 a 中直接打印出来? [more]
* 如何在不重启 node 进程的情况下热更新一个 js/json 文件? 这个问题本身是否有问题? [more]

