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

* [ES6](https://github.com/luyufa/NodeLearning/blob/master/js/es6.md)
* [闭包](https://github.com/luyufa/NodeLearning/blob/master/js/closure.md)
* 原型 & 继承
* [作用域 & this](https://github.com/luyufa/NodeLearning/blob/master/js/this.md)
* [类型判断](https://github.com/luyufa/NodeLearning/blob/master/js/typeof.md)

###### 常见问题

* 箭头函数中this指向何处由谁决定?
* 闭包的用途?
* const 定义的 Array 中间元素能否被修改? 如果可以, 那 const 修饰对象的意义是?
* == 和 === 和[]==[]?
* javascript引用传递和值传递,如何实现一个json拷贝函数?
* var let const区别?
* apply, call和bind有什么区别?


### Async & Event

* [地狱回调](https://github.com/luyufa/NodeLearning/blob/master/async/callback-hell.md)
* [事件循环](https://github.com/luyufa/NodeLearning/blob/master/async/eventLoop.md)
* [Event](https://github.com/luyufa/NodeLearning/blob/master/async/event.md)
* [异步决绝方案 - Promise](https://github.com/luyufa/NodeLearning/blob/master/async/promise.md)
* [异步决绝方案 - async](https://github.com/luyufa/NodeLearning/blob/master/async/async.md)
* [异步决绝方案 - async await初体验](https://github.com/luyufa/NodeLearning/blob/master/async/async-await.md)


###### 常见问题

* try catch可以捕获异步代码里的error么?为什么?
* 什么是雪崩问题?如何解决?
* 什么是异步?有回调函数就算异步么?
* 线上某个接口中触发了是循环,是否会阻塞整个站点请求?
* 如何实现一个sleep函数?
* catch与then(null,fn)完全一样么?
* then方法中加return与不加有何区别?
* 如何实现异步迭代器顺序执行和并发执行?
* 自定义异步asyncReduce




### 网络

* [http](https://github.com/luyufa/NodeLearning/blob/master/network/http.md)
* [RESTful API](https://github.com/luyufa/NodeLearning/blob/master/network/RESTful.md)
* [同源策略及跨域请求](https://github.com/luyufa/NodeLearning/blob/master/network/cors.md)
* tcp/ip
* cookie & session



### Test

* [mimimist+assert+mocha+supertest](https://github.com/luyufa/NodeLearning/blob/master/test/test.md)



### Mongodb


### Redis

* [redis的五种数据结构](https://github.com/luyufa/NodeLearning/blob/master/redis/data_structure.md)
* [redis的事务](https://github.com/luyufa/NodeLearning/blob/master/redis/transaction.md)
* [键的生存时间](https://github.com/luyufa/NodeLearning/blob/master/redis/expire.md)
* [任务队列的两种实现方式](https://github.com/luyufa/NodeLearning/blob/master/redis/queue.md)


### Linux及Shell编程入门

* [File Permission](https://github.com/luyufa/NodeLearning/blob/master/linux/filePermission.md)
* [File Manage](https://github.com/luyufa/NodeLearning/blob/master/linux/fileManage.md)


### 算法与数据结构

* [选择排序](https://github.com/luyufa/NodeLearning/blob/master/algorithm/selectSort.md)
* [插入排序](https://github.com/luyufa/NodeLearning/blob/master/algorithm/insertSort.md)
* [冒泡排序](https://github.com/luyufa/NodeLearning/blob/master/algorithm/bubbleSort.md)
* [快速排序](https://github.com/luyufa/NodeLearning/blob/master/algorithm/quickSort.md)
* [归并排序](https://github.com/luyufa/NodeLearning/blob/master/algorithm/mergeSort.md)
* [二分搜索](https://github.com/luyufa/NodeLearning/blob/master/algorithm/binarySearch.md)
* [广度优先搜索(走迷宫最短路径)](https://github.com/luyufa/NodeLearning/blob/master/algorithm/mazeBFS.md)
* [深度优先搜索(走迷宫最短路径)](https://github.com/luyufa/NodeLearning/blob/master/algorithm/mazeDFS.md)
* [二叉树遍历](https://github.com/luyufa/NodeLearning/blob/master/algorithm/binaryTree.md)



### 进程

* [Node child_process](https://github.com/luyufa/NodeLearning/blob/master/process/node_child_process.md)

### Angular
* [作用域与事件](https://github.com/luyufa/NodeLearning/blob/master/angular/scope.md)

###### 常见问题

* 夸作用域中常见的通讯方式有那些?


### css

### html

* [浏览器对象模型(BOM)](https://github.com/luyufa/NodeLearning/blob/master/html/bom.md)
* [文档对象模型(DOM)](https://github.com/luyufa/NodeLearning/blob/master/html/dom.md)

