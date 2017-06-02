## Stream

>A stream is an abstract interface implemented by various objects in Node.js.

##### 流是什么?

`stream`，也就是流，指的是`NodeJS`中的`stream`模块提供的处理流数据的抽象接口。Node中提供了三大类流：`可读流`、`可写流`、`双工流(可读可写)`

```
const stream = require('stream');
const Readable = stream.Readable;
const Writable = stream.Writable;
const Duplex = stream.Duplex;
const Transform = stream.Transform;

```
而其中具体的流如何产生数据、消耗数据、数据格式需要自己实现

#### 为什么使用流?
考虑这样一个问题，某个需求分析大约500MB的文件，如果直接使用`fs.readFile`，如下

```
const fs = require('fs');
fs.readFile('test.txt', function (err, body) {
    const data = body.toString();
    // TODO
});
```
如果小文件还勉强凑乎可以，但是文件一旦很大`toString`便会抛出 `Error: toString failed`
这样做有两个明显的问题
* 仅仅能得到一个`Buffer`，因为`size`过大无法`toString`
* 必须一次性全读入内存，在高并发下分分钟内存溢出
显然这样类似场景中`fs.readFile`不能够满足需求了。正确的做法是采用`fs.createReadStream`以流式操作。

```
const fs = require('fs');
const rs=fs.createReadStream('test.txt');
rs.pipe(DestinationWriteStream)
```

#### pipe
熟悉`linux`的朋友可能并不陌生，它有点像管道命令`|`，在Node中的可读流便提供了`pipe`方法，用于连接可写流，即`readable.pipe(writeable)`，把可读的上游和可写的下游连接到一起。
pipe返回自身即可以链式调用形成`pipeLine`,入`A.pipe(B).pipe(c)`,其中要求A为`可读流`，B为`双工流`，C为`可写流`。

### Readable
>Readable streams are an abstraction for a source from which data is consumed.

`Readable`可读流,作为上游，为下游提供数据

###### 创建可读流

创建一类可读流需要继承`Readbale`实现一个`_read`方法，调用`push`产生数据存入`Readbale`缓存，当没有数据时`push(null)`。

```
class myReadable extends Readable {
    constructor(highWaterMark) {
        super(highWaterMark);
    }
    _read(size) {
        let i = 65;
        while (i < 91) {
            this.push(String.fromCharCode(i++));
        }
        this.push(null);
    }
}
```
当需要数据是，可读流会自动调用`_read`方法从底层数据源获取数据。

###### end事件
因为流是分次向底层请求数据，需要底层告诉是否还有数据，所以当某次`_read`时调用了`push(null)`，就意味着底层没有可取数据了，就把`state.ended`设置为`true`,故而当且仅当 `(!Readable.cache.length && state.ended)`为`true`才会触发`end`事件

###### readable事件
如果调用`read`方法返回`null`后说明当前缓存数据不够，此时数据消耗方需要等待新数据从新进入可读流缓冲时再次调用`read`，故而，数据到达时`readable`便是通过发送`readable事件`通知消耗方。

###### 内部缓存doRead
可读流内部维护一个缓存，当数据足够多时`read`调用便不会引起`_read`调用，即此次不需要向底层数据源获取数据，

```
if (state.length === 0 || state.length - n < state.highWaterMark) {
  doRead = true
}
当前缓存区为空或缓存区扣除本次请求数据后剩余值小于阀值
```

###### 总结
可读流是获取底层数据的工具，消耗方通过`read`方法调用请求数据，可读流在将缓存中的数据返回并发出`data事件`，如果缓存中数据不足时，调用`_read`方法使用`push`将数据交由可读流处理（缓存或立即输出）。

###### 流式消耗
可读流有两种消耗模式：`暂停模式(paused mode)`、`流动模式(flowing mode)`
可读流内部有一个区别流模式的对象`readable._readableState.flowing`,它三种可能的状态：`true(流动模式)`，`false(暂停模式)`，`null(出始状态)`

在初始状态下，监听`data`事件，会使流进入流动模式。但如果在暂停模式下，监听`data`事件并不会使它进入流动模式。为了消耗流，需要显示调用read()方法。


一般创建流后，监听`data`事件，或者通过`pipe`方法将数据导向另一个可写流，即可进入流动模式开始消耗数据。


### Writable

###### 创建可写流

创建一个可写流需要构造一个`Writable`对象,实现一个`_write(data, enc, next)`方法，调用`next`消耗数据

```
const Writable = require('stream').Writable;

const ws = new Writable();
ws._write = function (chunk, enc, next) {
    console.log('chunk', chunk);
    next();
};

ws.write('a');
ws.write('b');
ws.write('c');
ws.end('d');

ws.on('finish',function () {
   console.log('finish')
});
```
上游调用`write`方法把数据写入可写流内部，`write`方法调用`_write`方法，将`data`消耗，并且调用`next(err)`(可同步也可以异步)告诉流可以开始处理下一个数据。

###### finish事件

写入数据完成可以调用end方法，`end`方法调用后不可在调用`write`方法（抛出异常），`end方法的调用会触发`finish`事件（没有没有调用`end`方法则不会触发`finish`事件）

###### drain事件

构造可写流时可以通过`highWaterMark`指定阀值，若写入数据超过阀值(来不及调用`next`消耗或者阀值过低却一次写入大量数据), 则`write`返回`false`，为了避免读写速率不匹配而造成内存上涨，可以监听`drain`事件（当`drain`触发时已经表明可以继续接受数据了），等待可写流内部缓存被清空再继续写入。

```
const readStream = fs.createReadStream(filePath);
readStream.on('data', function(data) {
    if(!res.write(data)){
        readStream.pause();
    }
});

res.on('drain', function() {
    readStream.resume();
});
```


### 背压反馈机制
考虑下面的例子：

```
const fs = require('fs')
fs.createReadStream(file).on('data', doSomething)
```
监听`data`事件后文件中的内容便立即开始源源不断地传给`doSomething()`。
如果`doSomething`处理数据较慢，就需要缓存来不及处理的数据`data`，占用大量内存。

理想的情况是下游消耗一个数据，上游才生产一个新数据，这样整体的内存使用就能保持在一个水平。
`Readable`提供`pipe`方法，用来实现这个功能。

`writable`是一个可写流`Writable`对象，上游调用其`write`方法将数据写入其中。
`writable`内部维护了一个写队列，当这个队列长度达到某个阈值`（state.highWaterMark）`时，执行`write()`时返回`false`，否则返回`true`。

于是上游可以根据write()的返回值在流动模式和暂停模式间切换：(pipe核心代码)

```
readable.on('data', function (data) {
  if (!writable.write(data)) {//下游可写队列满了
    readable.pause()//切换至暂停模式
  }
})

writable.on('drain', function () {//数据已被消耗发出drain事件
  readable.resume()//恢复流动模式
})
```

使用`pipe()`时，数据的生产和消耗形成了一个闭环。
通过负反馈调节上游的数据生产节奏，事实上形成了一种所谓的拉式流（pull stream）。

用喝饮料来说明拉式流和普通流的区别的话，普通流就像是将杯子里的饮料往嘴里倾倒，动力来源于上游，数据是被推往下游的；拉式流则是用吸管去喝饮料，动力实际来源于下游，数据是被拉去下游的。

所以，使用拉式流时，是“按需生产”。
如果下游停止消耗，上游便会停止生产。
所有缓存的数据量便是两者的阈值和。

```
const stream = require('stream');
const Readable = stream.Readable;
const Writable = stream.Writable;

let c = 0;
const myReader = new Readable({highWaterMark: 2});
myReader._read = function (size) {
    let data = c < 6 ? String.fromCharCode(c++ + 65) : null;
    console.log(`push data:${data}`);
    this.push(data);
};

const myWriter = new Writable({highWaterMark: 2});
myWriter._write = function (chunk, enc, next) {
    // setTimeout(function () {
    //     next();
    // }, 2000);
    console.log(`chunk:${chunk}`);
};

myReader.pipe(myWriter);

```
* Tick0:`readable.resume()`切换为流动模式
* Tick1:`readable`从底层读取数据(`_read`)
* Tick2:`readable`执行`read(0)`,`push data:A`,`writeable`执行`write(A)`返回`true`
* Tick3:`readable`执行`read(0)`,`push data:B`,`writeable`执行`write(B)`返回`false`,引起`readable.pause()`切换为暂停模式
* Tick4:Tick3中,`readable.read(0)`引起`push('C')`，此时`writeable`中有AB，`readable`中有C，但是在`push('C')`结束时发现可读流缓存中数据小于`highWaterMark`所以准备再取一次数据
* Tick5:`read(0)`,从底层获取数据
* Tick6：`push('D')`,D被加到`readable`缓存中，此时`writable`中有A和B,`readable`中有C和D。`readable`缓存中有2个数据，等于设定的`highWaterMark(2)`，不再从底层读取数据。


### objectMode

对于可读流来说，`push(data)`时，`data`只能是`String`或`Buffer`类型，而消耗时`data`事件输出的数据都是`Buffer`类型。对于可写流来说，`write(data)`时，`data`只能是`String`或`Buffer`类型，`_write(data)`调用时传进来的`data`都是`Buffer`类型。

也就是说，流中的数据默认情况下都是`Buffer`类型。产生的数据一放入流中，便转成`Buffer`被消耗；写入的数据在传给底层写逻辑时，也被转成`Buffer`类型。

但每个构造函数都接收一个配置对象，有一个`objectMode`的选项，一旦设置为`true`，就能出现“种瓜得瓜，种豆得豆”的效果。

```
const Writable = require('stream').Writable;
const Readable = require('stream').Readable;

const rs = new Readable({objectMode: true});
const ws = new Writable({objectMode: true});


rs._read = function () {
    this.push({"name": "luyufa"});
    this.push(null);
};
ws._write = function (chunk, enc, next) {
    try {
        console.log('chunk', chunk)
    } catch (err) {
        return next(err);
    }
    return next()
};
rs.pipe(ws);
```
必须rs和ws都配置objectMode为true，否则抛出异常。


参考链接:

* [stream-handbook](https://github.com/jabez128/stream-handbook)
* [Node.js Stream - 基础篇](http://fe.meituan.com/stream-basics.html)
* [Node.js Stream - 进阶篇](http://fe.meituan.com/stream-internals.html)
* [探究 Node.js 中的 drain 事件](http://taobaofed.org/blog/2015/12/31/nodejs-drain/)