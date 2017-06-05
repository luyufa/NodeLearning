### 模块加载机制

#### 1. 模块定义
上下文提供了`exports`对象用于导出当前模块的方法或者变量，并且它是唯一导出的出口。

在模块中，还存在一个`moudle`对象，它代表模块自身，而`exports`是`moudle`的属性。

在NodeJS中，一个文件就是一个模块，将方法挂载在exports对象上作为属性即可定义导出方式。

每个 `node` 进程只有一个 `VM` 的上下文,每个单独的 `.js` 文件并不意味着单独的上下文, 在某个 `.js` 文件中污染了全局的作用域一样能影响到其他的地方。


#### 2. 模块的类型和导入过程

在Node中导入一个模块需要经过三个过程

```
(1)路径分析
(2)扩展名分析
(3)编译执行
```

模块主要分为两类：核心模块和文件模块

```
核心模块：Node提供的模块，已经是编译后二进制文件，部分核心模块直接加载进内存，在步骤1中优先执行，
且2、3可省略，所以它的加载速度最快

文件模块：用户编写的模块，运行时动态加载，需要1，2，3完整的过程，速度比核心模块慢
```

优先从缓存加载

Node引入过的模块都会进行缓存，而且缓存的是编译和执行之后的对象。无论是核心模块还是文件模块，`require`的方式对相同模块的二次加载都一律采用缓存优先的方式。

且核心模块的缓存检查优先于文件模块的缓存检查。

优先级：缓存加载 > 核心模块 > 路径形式文件模块 > 自定义文件模块

#### 3. 路径分析

其中文件模块还包括`路径形式文件模块`（如.、..和./开头的标识符）和`自定义文件模块`（第三方npm包）。

自定义文件模块的查找最耗时也是最慢的一种，查找顺序为：

1. 当前目录下node_modules目录
2. 父目录下node_modules目录
3. 向上逐级递归直到根目录下下node_modules目录


####  4. 扩展名分析

不加扩展名的时候，会按`.js`、`.json`、`.node`的次序补足扩展名，依次尝试。

在尝试的过程中，需要调用`fs`模块同步阻塞式地判断文件是否存在。

因为node单线程特性，为了提高一定的性能问题，有两个解决方案：

```
(1) 加扩展名
(2) 同步配合缓存，可以大幅度缓解Node单线程中阻塞式调用的缺陷

```


require有可能通过文件扩展名之后没有找到对应的文件，但会得到一个目录，Node会将此目录当做一个包处理。依此寻找`index.js`、`index.json`、`index.node`



###### 文件相互require是否会死循环？


`a.js`

```
console.log('a starting');
exports.done = false;
var b = require('./b.js'); // ---> 1
console.log('in a, b.done = %j', b.done);
exports.done = true;
console.log('a done') // ---> 4
```

`b.js`

```
console.log('b starting');
exports.done = false;
var a = require('./a.js');  // ---> 2
// console.log(a);  ---> {done:false}
console.log('in b, a.done = %j', a.done); // ---> 3
exports.done = true;
console.log('b done');
```


`main.js`

```
console.log('main starting');
var a = require('./a.js'); // --> 0
var b = require('./b.js');
console.log('in main, a.done=%j, b.done=%j',a.done,b.done);
```


`输出结果(先require()的导出空对象)`

```
main starting
a starting
b starting
in b, a.done =', false
b done
in a, b.done =', true
a done
```

 
