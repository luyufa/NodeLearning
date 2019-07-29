## Node.js Learning

### Node底层原理
* [架构分层](https://github.com/luyufa/NodeLearning/blob/master/node/framework.md)
* [libuv](https://github.com/luyufa/NodeLearning/blob/master/node/libuv.md)
* [v8](https://github.com/luyufa/NodeLearning/blob/master/node/v8.md)
* [module加载过程](https://github.com/luyufa/NodeLearning/blob/master/node/module.md)
* [Node多进程cluster](https://github.com/luyufa/NodeLearning/blob/master/node/cluster.md)

###### 常见问题
* a.js 和 b.js 两个文件互相 require 是否会死循环? 双方是否能导出变量?
* 如果 a.js require 了 b.js, 那么在 b 中定义全局变量 t = 111 能否在 a 中直接打印出来?
* 如何在不重启 node 进程的情况下热更新一个 js/json 文件?


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


### JS

* [原型到原型链](https://github.com/luyufa/NodeLearning/blob/master/js/prototype.md)
* [call & apply & bind模拟实现](https://github.com/luyufa/NodeLearning/blob/master/js/bind&call&apply.md)
* [闭包](https://github.com/luyufa/NodeLearning/blob/master/js/closure.md)
* [作用域](https://github.com/luyufa/NodeLearning/blob/master/js/scope.md)


* [ES6](https://github.com/luyufa/NodeLearning/blob/master/js/es6.md)
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


### Mysql
* [关系型数据库范式](https://github.com/luyufa/NodeLearning/blob/master/mysql/NF.md)
* [索引](https://github.com/luyufa/NodeLearning/blob/master/mysql/index.md)
* [锁](https://github.com/luyufa/NodeLearning/blob/master/mysql/lock.md)
* [ACID](https://github.com/luyufa/NodeLearning/blob/master/mysql/acid.md)


### Redis

* [五种数据结构](https://github.com/luyufa/NodeLearning/blob/master/redis/data_structure.md)
* [生命周期与过期](https://github.com/luyufa/NodeLearning/blob/master/redis/expire.md)
* [持久化](https://github.com/luyufa/NodeLearning/blob/master/redis/disk.md)
* [缓存、击穿、雪崩、并发](https://github.com/luyufa/NodeLearning/blob/master/redis/concurrency.md)
* [分布式锁](https://github.com/luyufa/NodeLearning/blob/master/redis/lock.md)
* [消息队列](https://github.com/luyufa/NodeLearning/blob/master/redis/queue.md)
* [常见场景](https://github.com/luyufa/NodeLearning/blob/master/redis/scene.md)
* [删除大key](https://github.com/luyufa/NodeLearning/blob/master/redis/del.md)




### Linux基本操作

* [tar](https://github.com/luyufa/NodeLearning/blob/master/linux/tar.md)
* [mv、cp、rm、ls、mkdir](https://github.com/luyufa/NodeLearning/blob/master/linux/fileManage.md)
* [tail、grep](https://github.com/luyufa/NodeLearning/blob/master/linux/tail_grep.md)
* [ps、find](https://github.com/luyufa/NodeLearning/blob/master/linux/ps_find.md)



### css

* [display行内元素与块元素](https://github.com/luyufa/NodeLearning/blob/master/css/display.md)
* [float浮动](https://github.com/luyufa/NodeLearning/blob/master/css/float.md)
* [水平居中](https://github.com/luyufa/NodeLearning/blob/master/css/css-h-center.md)
* [垂直居中](https://github.com/luyufa/NodeLearning/blob/master/css/css-v-center.md)
* [margin collapsing与父边距](https://github.com/luyufa/NodeLearning/blob/master/css/margin.md)
* [三栏布局](https://github.com/luyufa/NodeLearning/blob/master/css/layout.md)
* [position定位](https://github.com/luyufa/NodeLearning/blob/master/css/postion.md)
* [BFC](https://github.com/luyufa/NodeLearning/blob/master/css/bfc.md)
* [各种百分比](https://github.com/luyufa/NodeLearning/blob/master/css/percentage.md)




### 前端工程化

* [模块](https://github.com/luyufa/NodeLearning/blob/master/wwwBuild/module.md)
* [webpack基本配置](https://github.com/luyufa/NodeLearning/blob/master/wwwBuild/webpack.base.config.md)
* [webpack loader](https://github.com/luyufa/NodeLearning/blob/master/wwwBuild/webpack.loader.md)
* [webpack ensure](https://github.com/luyufa/NodeLearning/blob/master/wwwBuild/webpack.ensure.md)
* [webpack缓存实现之hash与chunkhash](https://github.com/luyufa/NodeLearning/blob/master/wwwBuild/webpack.cache.md)
* [webpack commonChunk](https://github.com/luyufa/NodeLearning/blob/master/wwwBuild/webpack.commonChunk.md)
* [webpack hmr](https://github.com/luyufa/NodeLearning/blob/master/wwwBuild/webpack.hmr.md)
* [webpack extractText](https://github.com/luyufa/NodeLearning/blob/master/wwwBuild/webpack.extractText.md)




### Vue

* [vue双向数据绑定](https://github.com/luyufa/NodeLearning/blob/master/vue/mvvm.md)
* [虚拟DOM及diff](https://github.com/luyufa/NodeLearning/blob/master/vue/virtualDom.md)
* [nextTick](https://github.com/luyufa/NodeLearning/blob/master/vue/nextTick.md)
* [vue-lazyload](https://github.com/luyufa/NodeLearning/blob/master/vue/lazyload.md)




### 浏览器与网络

* [DOM&BOM](https://github.com/luyufa/NodeLearning/blob/master/browser/dom_bom.md)
* [输入URL后的网络活动](https://github.com/luyufa/NodeLearning/blob/master/browser/urlToRender.md)
* [渲染](https://github.com/luyufa/NodeLearning/blob/master/browser/render.md)
* [性能监控](https://github.com/luyufa/NodeLearning/blob/master/browser/perfermance.md)
* [重排&重绘](https://github.com/luyufa/NodeLearning/blob/master/browser/repaint.md)
* [同源&跨域](https://github.com/luyufa/NodeLearning/blob/master/browser/cors.md)
* [缓存](https://github.com/luyufa/NodeLearning/blob/master/browser/http-cache.md)
* [https](https://github.com/luyufa/NodeLearning/blob/master/network/https.md)



### 基础算法与数据结构

* [选择排序](https://github.com/luyufa/NodeLearning/blob/master/algorithm/selectSort.md)
* [插入排序](https://github.com/luyufa/NodeLearning/blob/master/algorithm/insertSort.md)
* [冒泡排序](https://github.com/luyufa/NodeLearning/blob/master/algorithm/bubbleSort.md)
* [快速排序](https://github.com/luyufa/NodeLearning/blob/master/algorithm/quickSort.md)
* [归并排序](https://github.com/luyufa/NodeLearning/blob/master/algorithm/mergeSort.md)
* [二分搜索](https://github.com/luyufa/NodeLearning/blob/master/algorithm/binarySearch.md)
* [广度优先搜索(走迷宫最短路径)](https://github.com/luyufa/NodeLearning/blob/master/algorithm/mazeBFS.md)
* [深度优先搜索(走迷宫最短路径)](https://github.com/luyufa/NodeLearning/blob/master/algorithm/mazeDFS.md)
* [二叉树遍历](https://github.com/luyufa/NodeLearning/blob/master/algorithm/binaryTree.md)


* [mimimist+assert+mocha+supertest](https://github.com/luyufa/NodeLearning/blob/master/test/test.md)
* [nginx config](https://github.com/luyufa/NodeLearning/blob/master/nginx/config.md)