> `Node`的出现使`javascript`脱离了浏览器的束缚，使之在服务端也大放异彩，其中实现`CommonJs`规范更是使`Node`能够承担服务端工程的重要原因之一。


##### 写在之前
在开始阅读本文前，请先思考下如下问题，如果都理解问题的意思、清楚的知道答案，那么恭喜你可以跳过了。

1. `CommonJs`规范是什么？Node如何实现的？

2. 模块分为那三种？

3. 启动一个文件(`node index.js`)和`require('./index.js')`有何异同之处？

4. 加载模块时，是如何定位文件路径的？

5. 循环依赖会怎么？

6. 如何使用C++扩展？适用场景是什么？


##### CommonJS规范
> 根据CommonJS规范，一个单独的文件就是一个模块。
加载模块使用require方法，该方法读取一个文件并执行，最后返回文件内部的module.exports对象

1. 模块定义

   在模块中通过`exports`对象用于导出当前模块的方法或变量**exports=module.exports**,并且是唯一导出口


2. 模块标识

   模块标识即传递给`require`的参数，`相对路径`、`绝对路径`、或`模块名称`

3. 模块引用

   在模块中通过`require`对象导入一个模块的上`exports`挂载的方法和变量


##### 相关源码(8.0.0~)
* `lib/internal/bootstrap/node.js`(启动入口)

* `lib/internal/modules/cjs/loader.js`(Module)

* `lib/internal/bootstrap/loaders.js`(NativeModule)



##### 启动一个文件

我们直接从第一个.js文件开始看，`lib/internal/bootstrap/node.js`，这里有仅有一个匿名函数,该方法主要`require`了`loader`模块，并且执行`runMain`函数
```
(function(){
    function startup(){
    if(process.argv[1] && process.argv[1] !== '-'){
          const CJSModule = NativeModule.require('internal/modules/cjs/loader');
           CJSModule.runMain();
        }
    }
    startup()
})
```
跟着代码走到`lib/internal/modules/cjs/loader.js`下的`runMain`函数，到了这里我把`require`方法顺便摘了出来,可以看到其实**启动文件**和**require文件**本质并无差别，都是`Moule._load`一个文件，仅不过启动文件传入的`isMain:true`，而`require`则是`isMain:false`
```
function Module(){
  this.id = id;
  this.exports = {};
  this.filename = null;
}
Module.runMain=function(){
     Module._load(process.argv[1], null, true);
}
Module.prototype.require = function(id) {
  return Module._load(id, this, /* isMain */ false);
};
```

##### 模块分类

在进入`_load`方法之前，我们先来了解下Node里的主要的模块分类
 
 * 核心模块`native` 包含在Node源码中，我们常用的例如`http` `fs`等
 
 * C/C++模块`built-in` 一般不需要我们直接调用，在`NativeModule`中会先`binding`，在由我们`require`调用，
 
 * 第三方模块
   
   * `.js`我们编码基本都是这里完成
   * `.json`就JSON文件 
   * `.node` 有C/C++编写，使用`node-gyp`编译为`.node`，例如`node-canvas`



##### Module._load

现在我们把焦点聚集到 **Module._load** 这个方法,这个方法里的代码很清晰，主要逻辑

  1. `_resolveFilename`定位文件
  
  2. 是否有缓存，有则直接返回
  
  3. 是否是核心模块，是则使用`NativeModule`
  
  4. 不是核心模块则使用`Module`
  
  5. 设置缓存
  
  6. 使用`tryModuleLoad`加载模块
  
  7. 返回导出对象

```
Module._load = function(request, parent, isMain) {
  
  var filename = Module._resolveFilename(request, parent, isMain);

  var cachedModule = Module._cache[filename];
  
  if (cachedModule) {
    return cachedModule.exports;
  }

  if (NativeModule.nonInternalExists(filename)) {
    return NativeModule.require(filename);
  }

  var module = new Module(filename, parent);

  Module._cache[filename] = module;

  tryModuleLoad(module, filename);

  return module.exports;
};
```

截止目前为止，加载模块的流程应该已经大致清楚了，细节部分我们稍后探讨，先来看**循环依赖**这个问题，那么什么是**循环依赖**呢？即a.js 和 b.js 两个文件互相 require，如下代码展示了循环依赖，其结果也写在注释里了，我们在这个解释下为什么产生这种**先require的undefined**结果。

在模块加载时我们可以看到先设置缓存然后在更新缓存引用的模块，即可能缓存设置完成了，但此时模块并未全加载完，下次在引用模块便直接使用了缓存结果。

结合如下代码来看主要是由于在main.js中require a.js时对a.js文件设置了**缓存**，当执行到b.js中再次引入a.js时，拿到的便是缓存结果，但此时缓存结果中并未`exports`变量，故为`undefined`。
```
/*a.js*/
const b = require('./b.js')
console.log('b.name in a.js', b.name);
exports.name = 'a'
```

```
/*b.js*/
const a = require('./a.js');
console.log('a.name in b.js', a.name);
exports.name = 'b';
```

```
/*main.js*/
require('./a.js')
require('./b.js')
/*
a.name in b.js undefined
b.name in a.js b
*/
```

##### 定位文件路径

整个加载模块的流程里一开始最为重要的便是定位文件,使用`_resolveFilename`定位require('xx')的路径。在**_findPath**里先查看路径是否有缓存。如没有缓存则

 1. 文件存在则返回 例如`require('./a.js')`
 
 2. 依次尝试`.js` `.json` `.node` 例如`require('./a')`会首先尝试->`require('./a.js')`
 
 3. 如果以上解析找不到文件或者最后一个字符是/
 
 4. 读取文件夹内`package.json`中的`main`字段 如果对于文件存在直接返回 例如`{main:'a.js'}`
 
 5. 依次对`mian`字段尝试`.js` `.json` `.node` 例如`require('./a')`会首先尝试->`require('./a.js')`
 
 6. 依次对`mian`字段尝增加index，再依次尝试`.js` `.json` `.node`
 
 7. 最后直接对路径增加index，再依次尝试`.js` `.json` `.node`
 

```
Module._resolveFilename=function(){
    var filename = Module._findPath(request, paths, isMain)
}

Module._findPath = function(request, paths, isMain) {
 
  var entry = Module._pathCache[cacheKey];
  if (entry)
    return entry;

      if (!filename) {
        exts = Object.keys(Module._extensions);
        filename = tryExtensions(basePath, exts, isMain);
    }

    if (!filename && rc === 1) {  // Directory.
      // try it with each of the extensions at "index"
      if (exts === undefined)
        exts = Object.keys(Module._extensions);
      filename = tryPackage(basePath, exts, isMain);
      if (!filename) {
        filename = tryExtensions(path.resolve(basePath, 'index'), exts, isMain);
      }
    }
  }
  return false;
};

function tryPackage(requestPath, exts, isMain) {
  return tryFile(filename, isMain) ||
         tryExtensions(filename, exts, isMain) ||
         tryExtensions(path.resolve(filename, 'index'), exts, isMain);
}

function tryExtensions(p, exts, isMain) {
  for (var i = 0; i < exts.length; i++) {
    const filename = tryFile(p + exts[i], isMain);

    if (filename) {
      return filename;
    }
  }
  return false;
}
```

##### 加载第三方模块;

经过**定位文件**后如果不是`NativeModule`从上面代码可以看到，主要使用的是**tryModuleLoad**进行模块加载。从如下代码我们可以看到
 * `.js` 主要是读取文件源码进行`compile`
 * `.json` 直接`JSON.parse`
 * `.node` 需要`process.dlopen`

```
function tryModuleLoad(module, filename) {
    module.load(filename);
}

Module.prototype.load = function(filename) {

  this.filename = filename;
  Module._extensions[extension](this, filename);
  this.loaded = true;
};

Module._extensions['.js'] = function(module, filename) {
  var content = fs.readFileSync(filename, 'utf8');
  module._compile(stripBOM(content), filename);
};

// Native extension for .json
Module._extensions['.json'] = function(module, filename) {
  var content = fs.readFileSync(filename, 'utf8');
  module.exports = JSON.parse(stripBOM(content));
};

// Native extension for .node
Module._extensions['.node'] = function(module, filename) {
  return process.dlopen(module, path.toNamespacedPath(filename));
};
```


##### 加载Native模块;
 加载`NativeModule`还是先看缓存中是否存在，然后设置缓存，在`compile`中,通过`NativeModule._source = process.binding('natives')`获取，Node.js 源码编译的时候，会采用 v8 附带的 js2c.py 工具，将 lib 文件夹下面的 js 模块的代码都转换成 C 里面的数组，生成一个 `node_natives.h` 头文件，`NativeModule._source = process.binding('natives')` 的作用，就是取出这个natives 数组，赋值给NativeModule._source，所以在 getSource 方法中，直接可以使用模块名作为索引，从数组中取出模块的源代。从这里也可以看出核心模块和第三方模块加载最大的不同是获取源码方式不同，第三方模块是通过`fs.readFileSync`获取，核心模块是通过`process.binding('natives')`获取

```
 NativeModule.require = function(id) {
    const cached = NativeModule.getCached(id);
    if (cached && (cached.loaded || cached.loading)) {
      return cached.exports;
    }

    const nativeModule = new NativeModule(id);

    nativeModule.cache();
    nativeModule.compile();

    return nativeModule.exports;
  };
NativeModule.prototype.compile = function() {
    let source = NativeModule.getSource(this.id);
    source = NativeModule.wrap(source);
  }
```

##### 加载built-in模块

对于 built-in 模块而言，它们不是通过 require 来引入的，而是通过 precess.binding('模块名') 引入的。一般我们很少在自己的代码中直接使用 process.binding 来引入built-in模块，而块require 引用native模块，而 native 模块里面会引入 built-in 模块。比如我们常用的 buffer 模块，其内部实现中就引入了 C/C++ built-in 模块，这是为了避开 v8 的内存限制。

```
// lib/buffer.js
'use strict';
// 通过 process.binding 引入名为 buffer 的 C/C++ built-in 模块
const binding = process.binding('buffer');
```

##### warp

在前面无论是Module还是NativeModule都有一个方法叫做 **warp**，那么这个方法是干嘛的呢？其实他们主要作用是在代码前添加一层代码，这样我们的代码其实是包括在一个匿名自执行函数中，然后所使用的`require` `exports`等都是这个函数的参数。
```
Module.wrapper = [
  '(function (exports, require, module, __filename, __dirname) { ',
  '\n});'
];
```

##### vm独立上下文

 我们可以看到以上代码编译完成后都执行了**runInThisContext**，在指定的global对象的上下文中执行vm.Script对象里被编译的代码并返回其结果,即为什么我们可以获取global变量便是因为它。Node对每个文件使用`warp`包裹了一层，因此不会造成作用域污染，但是如果是全局变量，全局变量会挂载在global上，每个文件共享同一个global，因此还是会造成全作用域的污染。
 ```
 /*a.js*/
 require('./b.js')
 console.log(b)

 /*b.js*/
 b='globalVar'
 ```


###### C/C++ 适用的情景：

1. 计算密集型应用。Node.js 的编程模型是单线程 + 异步 IO，大量的计算会阻塞 JavaScript 主线程，导致无法响应其他请求。对于这种场景，就可以使用 C/C++ 扩展模块，来加快计算速度，甚至C/C++，还可以允许开启多线程[thread-a-gogo](github：https://github.com/xk/node-threads-a-gogo)

2. 内存消耗较大的应用。Node.js 是基于 v8 的，而 v8 一开始是为浏览器设计的，所以其在内存方面是有比较严格的限制的，所以对于一些需要较大内存的应用，直接基于 v8 可能会有些力不从心，这个时候就需要使用扩展模块，来绕开 v8 的内存限制，最典型的就是我们常用的 buffer.js 模块，其底层也是调用了 C++，在 C++ 的层面上去申请内存，避免 v8 内存瓶颈。


##### 流程图
![image](https://github.com/luyufa/NodeLearning/blob/master/node/img/node-module-2.png)
![image](https://github.com/luyufa/NodeLearning/blob/master/node/img/node-module-1.png)


###### 参考
* [结合源码分析 Node.js 模块加载与运行原理](http://efe.baidu.com/blog/nodejs-module-analyze/)
* [node源码](https://github.com/nodejs/node)
