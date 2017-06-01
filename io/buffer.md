#### Buffer

Buffer是用于处理`二进制`数据的类，类似于整数`数组`，其长度自分配后`大小固定`不可动态变化，不受限于v8堆内存。

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

![uint8Array内存分配]()