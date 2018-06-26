## Node.js模块加载机制

`Node`的出现使`javascript`脱离了浏览器的束缚，使之在服务端也大放异彩，其中实现`CommonJs`规范更是使`Node`能够承担服务端工程的重要原因之一。

##### CommonJS规范
```
(function(module, exports, require){
    //每一个.js文件都由一个匿名自执行函数包裹，提供所需的require、exports
})()
```
1. 模块定义

   在模块中通过`exports`对象用于导出当前模块的方法或变量**exports=module.exports**,并且是唯一导出口


2. 模块标识

   模块标识即传递给`require`的参数，`相对路径`、`绝对路径`、或`模块名称`

3. 模块引用

   在模块中通过`require`对象导入一个模块的上`exports`挂载的方法和变量


##### Node从源码分析模块加载

![image](https://github.com/luyufa/NodeLearning/blob/master/node/img/4.png)
![image](https://github.com/luyufa/NodeLearning/blob/master/node/img/5.png)


* `lib`:`Node javascript`源代码目录，包含了平时所用的`native module`
* `deps`: 包含`v8` `npm` `uv(libuv)`等依赖库
* `src`:`C/C++`源码目录，包含了`built-in module`



* 核心模块：包含在 Node.js 源码中，被编译进 Node.js 可执行二进制文件 JavaScript 模块，也叫 `native` 模块，比如常用的 http, fs 等等

* C/C++ 模块，也叫 `built-in` 模块，一般我们不直接调用，而是在 native module 中调用，然后我们再 require

* 第三方模块：非 Node.js 源码自带的模块都可以统称第三方模块，比如 express，webpack 等等。
  * JavaScript 模块，这是最常见的，我们开发的时候一般都写的是 JavaScript 模块
  * JSON 模块，这个很简单，就是一个 JSON 文件
  * C/C++ 扩展模块，使用 C/C++ 编写，编译之后后缀名为 .node

* Node.js 启动一个文件的过程，其实到最后，也是 require 一个文件的过程，可以理解为是立即 require 一个文件

* 核心模块的源码通过 `NativeModule._source = process.binding('natives')`获取，Node.js 源码编译的时候，会采用 v8 附带的 js2c.py 工具，将 lib 文件夹下面的 js 模块的代码都转换成 C 里面的数组，生成一个 node_natives.h 头文件，`NativeModule._source = process.binding('natives')`; 的作用，就是取出这个`natives 数组，赋值给NativeModule._source`，所以在 `getSource` 方法中，直接可以使用模块名作为索引，从数组中取出模块的源代

* `wrap`方法把代码包含在
```
(function (exports, require, module, __filename, __dirname) {
});
```
* 对于 built-in 模块而言，它们不是通过 require 来引入的，而是通过 precess.binding('模块名') 引入的。一般我们很少在自己的代码中直接使用 process.binding 来引入built-in模块，而块require 引用native模块，而 native 模块里面会引入 built-in 模块。比如我们常用的 buffer 模块，其内部实现中就引入了 C/C++ built-in 模块，这是为了避开 v8 的内存限制
```
// lib/buffer.js
'use strict';

// 通过 process.binding 引入名为 buffer 的 C/C++ built-in 模块
const binding = process.binding('buffer');
// ...
```

* 核心模块和第三方模块加载最大的不同是获取源码方式不同，第三方模块是通过`fs.readFileSync`获取，核心模块是通过`process.binding('natives')`获取

* 第三方尝试扩展名的过程
  * 如果最后一个字符不是`/ `
  * 文件存在则返回 例如`require('./a.js')`
  * 依次尝试`.js` `.json` `.node`  例如`require('./a')`会首先尝试->`require('./a.js')`...
  * 如果以上解析找不到文件或者最后一个字符是`/`
  * 读取文件夹内`package.json`中的`main`字段 如果对于文件存在直接返回  例如`{main:'a.js'}`
  * 依次对`mian`字段尝试`.js` `.json` `.node`  例如`require('./a')`会首先尝试->`require('./a.js')`...
  * 最后对路径增加index
  * 再依次尝试`.js` `.json` `.node`


###### C/C++ 适用的情景：

1. 计算密集型应用。我们知道，Node.js 的编程模型是单线程 + 异步 IO，其中单线程导致了它在计算密集型应用上是一个软肋，大量的计算会阻塞 JavaScript 主线程，导致无法响应其他请求。对于这种场景，就可以使用 C/C++ 扩展模块，来加快计算速度，毕竟，虽然 v8 引擎的执行速度很快，但终究还是比不过 C/C++。另外，使用 C/C++，还可以允许我们开多线程，避免阻塞 JavaScript 主线程，社区里目前已经有一些基于扩展模块的 Node.js 多线程方案，其中最受欢迎的可能是 [thread-a-gogo](github：https://github.com/xk/node-threads-a-gogo)

2. 内存消耗较大的应用。Node.js 是基于 v8 的，而 v8 一开始是为浏览器设计的，所以其在内存方面是有比较严格的限制的，所以对于一些需要较大内存的应用，直接基于 v8 可能会有些力不从心，这个时候就需要使用扩展模块，来绕开 v8 的内存限制，最典型的就是我们常用的 buffer.js 模块，其底层也是调用了 C++，在 C++ 的层面上去申请内存，避免 v8 内存瓶颈。




###### 参考
* [结合源码分析 Node.js 模块加载与运行原理](http://efe.baidu.com/blog/nodejs-module-analyze/)
* [node源码](https://github.com/nodejs/node)