## htpp缓存

###### 相关header

字段名称 | 描述
---|---
Cache-Control | 控制缓存行为模式
Pragma | http 1.0 遗留 no-cache
Last-Modified| 资源最后一次修改时间
If-Match| 比较ETag是否一致
If-None-Match| 比较ETag是否一致
Last-Modified-Since| 比较资源最后一次更新时间是否一致
Last-Unmodified-Since| 比较资源最后一次更新时间是否不一致
ETag| 资源的标识
Expires| http 1.0 遗留 过期时间



##### http 1.0 时代的缓存
> Pragma(禁用缓存) + expires(启用缓存且设置时间)

`Pragma`优先级高于`Cache-Control`

```
Cache-Control:public , max-age=1000
Pragma:no-cache
```
当设置`Pragma`为`no-cache`时，客户端不会缓存，每次请求都会走服务端。


```
expires:Fri, 30 Mar 2018 07:47:00 GMT
```
设置资源过期时间，如果在此时间之内，则不发请求直接使用缓存数据。

当`Pragma`和`expires`同时存在，`Pragma`优先级高于`expires`，即生效的是`Pragma`



##### Cache-Control
> expires定义的时间是相对服务器而言，无法保证客户端和服务端一致

在http1.1 中新增`Cache-Control` 可分别用于请求首部和响应首部

优先级：`Pragma`>`Cache-Control`>`expires`


字段名称 | 描述
---|---
no-cache  | 不直接使用缓存，发起需要新鲜度校验请求
no-store  | 所有资源都不会缓存
max-age=s  | 告知客户端，在s秒内资源都是新鲜的，不必发起请求


##### 缓存校验

Q:以上如果设置的缓存未过期那么直接从缓存中即可，但是如果缓存已经过期，那就意味着会发请求到服务器，那么是否意味着该请求的响应一定会返回整个资源实体?

A:那么是否有办法让服务器知道客户端现在存有的缓存文件，其实跟自己所有的文件是一致的，然后直接告诉客户端说“这东西你直接用缓存里的就可以了，我这边没更新过呢，就不再传一次过去了


1. `Last-Modified` - `If-Modified-Since`


该请求首部告诉服务器如果客户端传来的最后修改时间与服务器上的一致，则直接返回`304` 和响应报头，具体资源从本地缓存中取，不一致则返回`200`和资源实体

2. `ETag` - `If-None-Match`

在响应客户端时，服务器会为此资源计算一个标识符，一并返回给客户端，客户端保留该字段，下次请求带上该字段，如果和服务器端一直则直接返回304，客户端使用缓存即可。





##### 最佳实践

1. Expires / Cache-Control

`Expires`会受到客户端和服务端时间不一致的影响，而`Cache-Control`解决了这个问题，但是必须在Http1.1，所以最好两个都带上，当同时存在时会优先使用`Cache-Control`

2. Last-Modified / ETag

二者都是通过某个标识值来请求资源， 如果服务器端的资源没有变化，则自动返回 HTTP 304 （Not Changed）状态码，内容为空，这样就节省了传输数据量。而当资源发生变化后，返回和第一次请求时类似。从而保证不向客户端重复发出资源，也保证当服务器有变化时，客户端能够得到最新的资源。

Last-Modified使用文件最后修改作为文件标识值，其一它无法处理文件一秒内多次修改的情况，其二有些变化实质内容并未改变，这类情况下也会返回200

ETag作为“被请求变量的实体值”，其完全可以解决Last-Modified头部的问题，但是其计算过程需要耗费服务器资源。

3. 200 (from-cache) / 304 Not Modified

第一种方式是不向浏览器发送请求，直接使用本地缓存文件。第二种方式，浏览器虽然发现了本地有该资源的缓存，但是不确定是否是最新的，需要发起校验，若服务器认为浏览器的缓存版本还可用，那么便会返回304。

###### ps结论：

* `http1.0`仅支持`expire` `http1.1`中新增`Cache-Control`
* `Last-Modified` 无法支持`1s`内多次修改
* `ETag` 计算需要注意算法一致，有些许开销
* `expire` 存在客户端时间被篡改的可能
* `200 (from cache)` 不发请求直接拿浏览器缓存
* `304 Not Modified` 服务器进行过校验，有些资源例如css等可以以版本号或加成缓存时间的方式减少304响应

![http缓存流程](https://github.com/luyufa/NodeLearning/blob/master/browser/cache.jpg)