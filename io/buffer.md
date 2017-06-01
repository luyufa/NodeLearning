### Buffer

Buffer是用于处理`二进制`数据的类，类似于整数`数组`，其长度自分配后`大小固定`不可动态变化，不受限于v8堆内存。

##### Buffer的创建

自Node6之后new Buffer()就废弃不在使用，创建一个Buffer可以通过如下三种方式

| 接口          | 说明           |
|---------------|---------------|
| Buffer.from        | 通过已有数据生存buffer           |
| Buffer.alloc        | 分配一个安全(初始化)后的buffer           |
| Buffer.allocUnsafe        | 分配一个不安全(未初始化)后的buffer           |


* Buffer.from(string),通过字符串生产一个新的buffer

```
const buff1 = Buffer.from('abcde');
```
 * Buffer.from(buffer),通过buffer复制一个buffer，不共享内存

```
const buff1 = Buffer.from('abc');
const buff2 = Buffer.from(buff1);
buff1[0] = 0x62;
console.log(buff1);<Buffer 62 62 63>
console.log(buff2);<Buffer 61 62 63>
```

* Buffer.from(uint8Array.buffer)通过typedArray附生一个buffer，与uint8Array共享内存

```
const uint8Arr = new Uint8Array([5000, 4000]);
console.log(uint8Arr)//Uint8Array [ 136, 160 ]
const buf = Buffer.from(uint8Arr.buffer)
console.log(buf);//<Buffer 88 a0>
uint8Arr[0] = 256;//最大值
console.log(buf);//<Buffer 00 a0>
```

***

* Buffer.alloc(size,fill)创建指定size大小的buffer，如果fill存在就调用buffer.fill(fill)填充buffer，默认使用0填充

```
console.log(Buffer.alloc(5,'a'));//<Buffer 61 61 61 61 61>
```

***

* Buffer.allocUnsafe(size)，创建指定size大小的buffer，这样方式创建的buffer是底层未初始化的，可能怀有旧数据，最后紧接着使用fill填充。

Buffer在分配是会预分配一个	`Buffer.poolSize`,`Buffer.allocUnsafe(szie).fill`与`Buffer.alloc(size,fill)`的关键区别在于此，如果`size`小于`Buffer.pollSzie一半`前者依旧会使用此内部Buffer池，但是后者则不会使用此内部Buffer池。所以从性能上讲`Buffer.allocUnsafe`优先于`Buffer.alloc`


ps:Node Buffer基于TypedArray(Uint8Array)实现

![uint8Array内存分配](https://github.com/luyufa/NodeLearning/blob/master/io/TypedArray.png)



##### Buffer不得不提的8kb

buffer著名的8KB载体，举个例子好比，node把一幢大房子分成很多小房间，每个房间能容纳8个人，为了保证房间的充分使用，只有当一个房间塞满8个人后才会去开新的房间，但是当一次性有多个人来入住，node会保证要把这些人放到一个房间中，比如当前房间A有4个人住，但是一下子来了5个人，所以node不得不新开一间房间B，把这5个人安顿下来，此时又来了4个人，发现5个人的B房间也容纳不下了，只能再开一间房间C了，这样所有人都安顿下来了。但是之前的两间房A和B都各自浪费了4个和3个位置，而房间C就成为了当前的房间。

具体点说就是当我们实例化一个新的Buffer类，会根据实例化时的大小去申请内存空间，如果需要的空间小于8KB，则会多一次判定，判定当前的8KB载体剩余容量是否够新的buffer实例，如果够用，则将新的buffer实例保存在当前的8KB载体中，并且更新剩余的空间。

我们做个简单的实验，模拟一个比较严重的内存泄露情况

```
var os = require('os');
var leak_buf_ary = [];
var show_memory_usage = function(){ //打印系统空闲内存
    console.log('free mem : ' + Math.ceil(os.freemem()/(1024*1024)) + 'mb');
}

var do_buf_leak = function(){
    var leak_char = 'l'; //泄露的几byte字符
    var loop = 100000;//10万次
    var buf1_ary = [];
    while(loop--){
        buf1_ary.push(Buffer.alloc(4096)); //申请buf1，占用4096byte空间，会得到自动释放

        //申请buf2，占用几byte空间，将其引用保存在外部数据，不会自动释放
        leak_buf_ary.push(Buffer.from(loop+leak_char));
    }
    console.log("before gc")
    show_memory_usage();
    buf1_ary = null;
    return;
}


console.log("process start")
show_memory_usage()

do_buf_leak();

var j =10000;
setInterval(function(){
    console.log("after gc")
    show_memory_usage()
},1000*60)
```

虽然我们释放了4096byte的buffer，但是由于那几byte的字节没有释放掉，将会造成整个8KB的内存都无法释放，如果继续执行循环最终我们的系统内存将耗尽，程序将crash。如果申请的buffer内存大于8kb则使用`slowbuffer`


##### buffer字符串的连接
我们接受post数据时，node是以流的形式发送上来的，会触发ondata事件，所以我们见到很多代码是这样写的：

```
 stream.on('data',function(chunk){
	//console.log(Buffer.isBuffer(chunk))
	body +=chunk
  })
```
这样的代码在非UTF8时容易出现乱码问题，而且性能较差（每一次连接都会toString()）,更多时候下面的代码更合适.

```
 let list=[];
 let length=0;
 stream.on('data',function(chunk){
	//console.log(Buffer.isBuffer(chunk))
	list.push(chunk);
	length+=chunk.length;
  })
  Buffer.concat(list,length);
```

##### buffer的释放和清空

我们无法手动对buffer实例进行GC，只能依靠V8来进行，我们唯一能做的就是解除对buffer实例的引用

刷掉一块buffer上的数据最快的办法是buffer.fill(0)