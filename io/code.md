### 编码与解码
> ASCII码：八个二进制位(一字节),只占用了一个字节的后面7位，最前面的1位统一规定为0,共128个字符编码
>
> Unicode只是一个符号集，它只规定了符号的二进制代码，却没有规定这个二进制代码应该如何存储。UTF-8是Unicode的实现方式之一,UTF-8不是固定字长编码的，而是一种变长的编码方式一个中文 t通常占3个字节，英文一个字节与ASCII相同。

#### Unicode->UTF8的转换过程

1. 对于单字节的符号，字节的第一位设为0，后面7位为这个符号的unicode码。因此对于英语字母，UTF-8编码和ASCII码是相同的。
2. 对于n字节的符号（n>1），第一个字节的前n位都设为1，第n+1位设为0，后面字节的前两位一律设为10。剩下的没有提及的二进制位，全部为这个符号的unicode码。
3. 如果一个字节的第一位是0，则这个字节单独就是一个字符；如果第一位是1，则连续有多少个1，就表示当前字符占用多少个字节。

#### 字符串编码解码

```
const qs = require('querystring');
console.log(qs.escape('我的'));
console.log(qs.unescape('%E6%88%91%E7%9A%84'));
```


#### 对象与string的转换

默认是& 和＝
```
console.log(qs.parse('name=1&age=22'),'&','=');
console.log(qs.stringify({name: 1, age: 22},'&','='));
```

#### URL编码

URL编码不会对ASCII字母、数字、~!@#$&*()=:/,;?+’编码

```
console.log(encodeURI('http://www.baidu.com?name=我的'));
http://www.baidu.com?name=%E6%88%91%E7%9A%84
```


#### URL参数编码
编码范围大，连http:// 都会被编码导致url无法使用，不会对ASCII字母、数字、~!*()'

```
console.log(encodeURIComponent('http://www.baidu.com?name=我的'));
http%3A%2F%2Fwww.baidu.com%3Fname%3D%E6%88%91%E7%9A%84
```

#### 字符串解码器
`string_decoder` 模块提供了一个 API，用于解码 Buffer 对象成字符串。它可以通过以下方式被使用：

```
const StringDecoder = require('string_decoder').StringDecoder;
const decoder = new StringDecoder('utf8');

const cent = Buffer.from([0x31, 0x32]);
console.log(decoder.write(cent)); // 1  2

const euro = Buffer.from([0x33, 0x34, 0x35]);
console.log(decoder.write(euro)); // 3 4 5
console.log(decoder.end(Buffer.from([0x36]))); // 6

```
当一个 Buffer 实例被写入 StringDecoder 实例时，
一个内部的 buffer 会被用于确保解码后的字符串不包含任何不完整的多字节字符。
不完整的多字节字符被保存在 buffer 中，直到下次调用 `stringDecoder.write()` 或直到 `stringDecoder.end() `被调用


参考链接:

* [Unicode与UTF8](http://www.ruanyifeng.com/blog/2007/10/ascii_unicode_and_utf-8.html)