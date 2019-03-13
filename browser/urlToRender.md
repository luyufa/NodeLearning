## 从输入url到页面加载
> 输入url，敲下回车，到页面呈现短短几秒究竟经历了什么，本文围绕这一过程展开叙述

##### 过程概述

 1. `DNS解析`->`IP地址`
 2. `HTTP请求与响应`
 3. `TCP连接`
 4. `解析HTML代码`
 5. `浏览器渲染`




##### DNS(Domain Name System)解析

###### DNS报文格式
>DNS协议是我们所讲的第一个位于应用层的协议

1. 首部

![5](https://github.com/luyufa/NodeLearning/blob/master/browser/5.png)

 * ID：占16位，由客户端设置的标识，应答报文需要带上同样的标识，用于区分是哪个查询的应答报文。

 * * QR：占1位，用于表示报文类型
   * 0是请求报文
   * 1是应答报文

 * Opcode：4位，定义查询和应答的类型。
   * 0表示标准查询
   * 1表示反向查询,由IP地址获得主机域名,
   * 2表示请求服务器状态。

* AA、TC、RD、RA：各占1位。

* Z：占3位，未用保留值，值都为0。

* RCODE：占4位，返回码，通常为0(没有差错)和3(名字差错)

* QDCOUNT：占16位，指明报文请求段中的问题记录数，就是要查询的域名，一般为1。

* ANCOUNT：占16位，指明报文回答段中的回答记录数

* NSCOUNT：占16位，指明报文授权段中的授权记录数

* ARCOUNT：占16位，指明报文附加段中的附加记录数

2. 请求

![6](https://github.com/luyufa/NodeLearning/blob/master/browser/6.png)

 * QNAME：不定长，为查询的域名，是可变长的。
 * QTYPE：占16位，表示查询类型，共有16种
    * A记录，请求主机IP地址
    * NS，请求授权DNS服务器
    * CNAME别名查询
 * QCLASS：占16位，表示查询类别
    * IN,表示查询IP
    * CS
    * CH
    * HS

3. 响应

![7](https://github.com/luyufa/NodeLearning/blob/master/browser/7.png)

 * NAME：不定长，回复查询域名
 * TYPE：占16位，同上
 * CLASS：占16位，同上
 * TTL：占32位，缓存的时间，0表示不能被缓存
 * RDLENGTH：占16位，2个字节无符号整数表示RDATA的长度
 * RDATA：不定长字符串来表示记录，格式根TYPE和CLASS有关


###### 域名(domain)
> 域名可以说是一个IP地址的代称，目的是为了便于记忆,访问时由域名系统（DNS）将它转化成便于机器识别的IP地址。

![1](https://github.com/luyufa/NodeLearning/blob/master/browser/1.png)



**ICANN**是全世界域名的最高管理机构，其规定了哪些字符串可以当**顶级域名TLD(top level domain)**

TLD简单来说就是网址的最后一个部分，例如www.google.com的TLD是`.com`

每个TLD都找会一个托管商，就好像`.cn`域名的托管商就是`中国互联网络信息中心`,它决定了`.cn`域名的各种政策

从右向左为顶级域名、二级域名、三级域名等，用点隔开

举个栗子

`www.google.com.`

 * `.` 所有域名根域名默认为`.`通常省略，在进行DNS解析时自动加上
 * `com`是顶级域名
 * `google`是二级域名
 * `www`是三级域名


###### 域名解析流程

 1. 浏览器DNS缓存(`chrome://net-internals/#dns`)
 2. hosts文件
 3. 本地DNS解析器缓存(`ipconfig /displaydns`)
 4. TCP/IP参数中设置的首选DNS服务器，在此我们叫它本地DNS服务器
 5. 本地DNS服务器向根域名发请求并且根域名服务器告诉它管理(.com)域名的服务器ip
 6. 本地DNS服务器向顶级域名.com发请求，并且拿到管理google.com域名的服务器ip
 7. 本地DNS服务器向二级域名`google.com`发请求，并且拿到管理`www.google.com`域名的服务器ip
 8. 本地DNS服务器向三级域名`www.google.com`发请求，拿到最终ip地址


###### CDN
> Content Delivery Network即内容分发网络,实时地根据网络流量和各节点的连接、负载状况以及到用户的距离和响应时间等综合信息将用户的请求重新导向离用户最近的服务节点


1. 设置本地DNS服务器CNAME（下一次查询域名）指向CDN服务商
2. 本地DNS服务器会最终将域名的解析权交给CNAME指向的CDN专用DNS服务器
3. CDN的DNS服务器将CDN的全局负载均衡设备IP地址返回客户端
4. 客户端向CDN的全局负载均衡设备发起请求，CDN全局负载均衡设备根据客户端IP地址，选择一台客户端所属区域的区域负载均衡设备
5. 区域负载均衡设备会向全局负载均衡设备返回一台缓存服务器的IP
6. 全局负载均衡设备把服务器的IP地址返回给用户

![2](https://github.com/luyufa/NodeLearning/blob/master/browser/2.png)


###### 浏览器NDS Prefetch

1. 提前解析域名，节省时间
2. **自动解析**
`<a></a>`中的`href`域名会自动解析为IP地址，这个解析过程是与用户浏览网页并行处理的。但是为了确保安全性，在HTTPS页面中不会自动解析。
3. **手动解析**特定域名`<link ref="dns-prefetch" href="www.baidu.com">`
4. 当我们希望在**HTTPS**页面开启`<a></a>`自动解析功能时，添加如下标记

```
<meta http-equiv="x-dns-prefetch-control" content="on">
```
5. 当我们希望在**HTTP**页面关闭`<a></a>`自动解析功能时，添加如下标


```
<meta http-equiv="x-dns-prefetch-control" content="off">
```





##### HTTP请求与响应
>Hyper Text Transfer Protocol 超文本传输协议，是客户端终端（UA）和服务器端（网站）请求和应答的标准。


###### HTTP请求报文

   ![8](https://github.com/luyufa/NodeLearning/blob/master/browser/8.png)



请求行由请求方法字段、URL字段和HTTP协议版本字段3个字段组成，它们用空格分隔。例如`GET /index.html HTTP/1.1`

   * 请求方法
      * **GET**向指定的资源发出“显示”请求。使用GET方法应该只用在读取数据， 而不应当被用于产生“副作用”的操作中，请求参数和对应的值附加在URL后面，以`?`开始，以`&`分隔。例如`/index?id=xxx&name=xxx`,参数直接在浏览器地址栏里暴露不合适传递隐私数据，而且浏览器对地址字符也有限制，不合适传递大量数据(如何传递数组?)

      * **HEAD**与GET方法一样，都是向服务器发出指定资源的请求。只不过服务器将不传回资源的本文部分,此方法通常用于测试超文本链接的有效性，可访问性和最近的修改，例如下载前先获知即将下载文件大小，超过某大小在决定使用何种方式下载

      * **POST**向指定资源提交数据，请求服务器进行处理（例如提交表单或者上传文件）。数据被包含在请求本文中。这个请求可能会创建新的资源或修改现有资源，或二者皆有，数据以`名称:值`的形式出现，可以传输大量数据

      * **PUT**向指定资源位置上传其最新内容

      * **DELETE**请求服务器删除Request-URI所标识的资源

      * **OPTIONS**旨在发送一种“探测”请求以确定针对某个目标地址的请求必须具有怎样的约束，然后根据其约束发送真正的请求。例如针对“跨域资源”的预检（Preflight）请求采用的HTTP方法就是OPTIONS。

    * 安全和幂等
      * 安全: 对于`GET`和`HEAD`方法而言，除了进行获取资源信息外，这些请求不应当再有其他意义。也就是说，这些方法应当被认为是“安全的”。 客户端可能会使用其他“非安全”方法，例如POST，PUT及DELETE，应该以特殊的方式（通常是按钮而不是超链接）告知客户可能的后果
      * 幂等: 若干次请求的副作用与单次请求相同或者根本没有副作用,`POST`是非幂等的；其余`GET``PUT``DELETE`是幂等的。


  * URL和URI
    * URI统一资源**标识**符，某一规则下能把一个资源独一无二地标识出来。

    * URL统一资源**定位**符

    * 例子：假设这个世界上所有人的名字都不能重复，那么名字就是URI的一个实例，通过名字这个字符串就可以标识出唯一的一个人。现实当中名字当然是会重复的，所以身份证号才是URI，通过身份证号能让我们能且仅能确定一个人；`动物住址协议://地球/中国/北京/五道口/搜狐网络大厦/10层/SH-10F-N-10-01/卢余发`这样也可以确定唯一的一个我，这就是URL，是以位置来描述唯一一个人的。

  * 协议版本
    * **HTTP1.0**,短连接,每一个请求建立一个TCP连接，请求完成后立马断开连接，TCP连接要客户端和服务器三次握手，并且开始时发送速率较慢
    * **HTTP1.1**,
       * `连接复用`，tcp连接默认不关闭，可以被多个请求复用，不用声明`Connection:keep-alive`,客户端和服务器发现对方一段时间没有活动，就可以主动关闭连接。不过，规范的做法是，客户端在最后一个请求时，发送`Connection:close`，明确要求服务器关闭TCP连接

       * `管道机制`,同一个tcp连接里面，客户端可以同时发送多个请求,举个栗子，客户端需要请求两个资源。以前的做法是，在同一个TCP连接里面，先发送A请求，然后等待服务器做出回应，收到后再发出B请求。管道机制则是允许浏览器同时发出A请求和B请求，但是服务器还是按照顺序，先回应A请求，完成后再回应B请求

       * `分块传输`，`Transfer-Encoding:chunked`，产生一块数据，就发送一块，采用"流模式"（stream），表明回应将由数量未定的数据块组成。每个非空的数据块之前，会有一个16进制的数值，表示这个块的长度。最后是一个大小为0的块，就表示本次回应的数据发送完了

       * `Head-of-line-blocking`队头阻塞，同一个TCP连接里面，所有的数据通信是按次序进行的。服务器只有处理完一个回应，才会进行下一个回应。要是前面的回应特别慢，后面就会有许多请求排队等着；而浏览器是限制tcp连接数的(同一个域名下chorme限制为6)，所以这导致了很多的网页优化技巧，比如合并脚本和样式表、将图片嵌入CSS代码(dataUrl)、雪碧图等。

       * `Host` ,请求的主机名，允许多个域名同处一个IP地址，即虚拟主机，需要注意`一个域名对应多个IP地址，一个IP地址也可以对应多个域名`。

       * `动词方法` 新增`OPTIONS`,`PUT`, `DELETE`等为`RestFul api`流行打下基础

  * 回车是光标移动到本行开头

  * 换行是光标移动到下一行，光标的垂直位置不变


######  HTTP响应报文

   ![9](https://github.com/luyufa/NodeLearning/blob/master/browser/9.png)


状态行由协议版本、状态码、状态码描述3个字段组成，他们使用空格分隔。例如`HTTP/1.1 200 OK`

  * 状态码
    * 1XX 这一类型的状态码，代表请求已被接受，需要继续处理。
      * 101 Switching Protocols  服务器已经理解了客户端的请求，并将通过Upgrade消息头通知客户端采用不同的协议来完成这个请求

    * 2XX 这一类型的状态码，代表请求已成功被服务器接收、理解、并接受
      * 200 OK 请求已成功，请求所希望的响应头或数据体将随此响应返回

      * 201 Created 一个新的资源已经依据请求的需要而建立

      * 204 No Content 服务器成功处理了请求，没有返回任何内容

    * 3XX 这一类状态码代表需要客户端采取进一步的操作才能完成请求
       * 301 Moved Permanently 永久重定向

       * 302 Found(Moved Temporarily) 临时重定向

       * 304 Not Modified 表示资源在由请求头中的If-Modified-Since或If-None-Match参数指定的这一版本之后，未曾被修改。在这种情况下，由于客户端仍然具有以前下载的副本，因此不需要重新传输资源

    * 4XX 这类的状态码代表了客户端看起来可能发生了错误，妨碍了服务器的处理
       * 400 Bad Request 客户端参数错误、路由不正确、语法不错

       * 401 Unauthorized 未认证身份

       * 403 Forbidden 拒绝服务，没有权限

       * 404 Not Found 不存在此资源

    * 5XX 表示服务器无法完成明显有效的请求
       * 500 Internal Server Error 服务端意料之外的错误

       * 502 Bad Gateway 网关错误，nginx下大部分是因为在代理模式下后端服务器出现问题引起的

       * 504 Gateway Timeout 超时



######  HTTP首部字段
  * 通用首部字段
    >请求报文和响应报文双方都会使用的首部

    * `Cache-Control`、`Pragma` 缓存相关

    * `Connection`
       * `Connection: 不再转发的首部字段名`
        ![10](https://github.com/luyufa/NodeLearning/blob/master/browser/10.jpg)

       * `Connection:keep-alive`(`close`可以关闭TCP连接复用) HTTP/1.1版本默认连接是持久连接。客户端和服务器只需建立一次TCP连接，就可以相互进行多次HTTP通信。直到有一方明确表示需要断开TCP连接，持久连接才会结束。

    * `Transfer-Encoding` **传输编码**传输报文主体时采用的编码方式，仅对分块传输编码有效，目前只有一个值`chunked`，每个分块包含十六进制的长度值和数据，长度值独占一行，长度不包括它结尾的 CRLF（\r\n），也不包括分块数据结尾的 CRLF。最后一个分块长度值必须为 0，对应的分块数据没有内容，表示实体结束

    * `Upgrade`
       * 协议升级
       > 由客户端主动发起且含有`Connection: Upgrade` `Upgrade: protocols`的请求。

       举个例子由`http1.0`升级至`websocket`
       ```
       GET /chat HTTP/1.1
       Connection: Upgrade
       Upgrade: websocket
       ```
       ```
       HTTP/1.1 101 Switching Protocols
       Connection: Upgrade
       Upgrade: websocket
       ```



  * 请求首部字段
    >请求报文特有

      * Accept 客户端用来告知服务端，自己可以处理的内容类型(`MIME`)
        * `text/html`

        * `application/json`

        * `text/css`

        * `image/*`

      * Accept-Charset、Accept-Encoding、 Accept-Language

           客户端用来告知服务端，自己可以处理的字符集、支持的编码方式、可以理解的自然语言。如果服务器不能提供可以匹配的语言的版本、编码或者字符集，那么理论上来说应该返回一个 406 (Not Acceptable，不被接受) 的错误码。但是为了更好的用户体验，这种方法很少被采用，取而代之的是将其忽略

      * Host
             请求头指明了服务器的域名（对于虚拟主机来说），以及（可选的）服务器监听的TCP端口号，HTTP/1.1 的所有请求报文中必须包含一个Host头字段。如果一个 HTTP/1.1 请求缺少 Host 头字段或者设置了超过一个的 Host 头字段，一个400（Bad Request）状态码会被返回。

      * `If-None-Match` `If-Modified-Since` 缓存相关

      * Referer 部包含了当前请求页面的地址

      * User-Agent 首部包含了一个特征字符串，用来让网络协议的对端来识别发起请求的用户代理软件的应用类型、操作系统、软件开发商以及版本号


  * 响应首部字段
    >响应报文特有

      * ETag 缓存相关

      * Server 服务器信息

      * Date 响应时间

      * Location 重定向至的URL

  * 实体首部字段
    >请求报文和响应报文中的实体部分所使用的首部，用于补充内容的更新时间等与实体相关的信息

      * Content-Encoding对实体的主体部分选用的内容编码方式。主要采用4种内容编码方式：`gzip`、`compress`、`deflate`、`identity`

      * Content-Length实体大小

      * Content-Type实体主体内对象的媒体类型
         * `text/plain`
         * `application/json`

###### HTTP缓存

![](https://mdn.mozillademos.org/files/13777/HTTPCachtType.png)

   * 相关header

字段名称 | 描述
---|---
Pragma（通用） | http 1.0 遗留 no-cache
Expires（响应）| http 1.0 遗留 过期时间
Cache-Control（通用） | 控制缓存行为模式
Last-Modified（响应）| 最后一次修改时间
Last-Modified-Since（请求）| 服务器只在所请求的资源在给定的日期时间之后对内容进行过修改的情况下才会将资源返回，状态码为 200
Last-Unmodified-Since（请求）| 只有当资源在指定的时间之后没有进行过修改的情况下，服务器才会返回请求的资源
ETag（响应）| 资源的标识
If-Match（请求）| 服务器仅在请求的资源满足此首部列出的 ETag 之一时才会返回资源
If-None-Match（请求）| 当且仅当服务器上没有任何资源的 ETag 属性值与这个首部中列出的相匹配的时候，服务器端会才返回所请求的资源，响应码为  200


  * http 1.0 时代的缓存
> Pragma(禁用缓存) + expires(启用缓存且设置过期时间)

```
Pragma:no-cache
```
当设置`Pragma`为`no-cache`时，客户端不会缓存，每次请求都会走服务端。


```
expires:Fri, 30 Mar 2018 07:47:00 GMT
```
设置资源过期时间，如果在此时间之内，则不发请求直接使用缓存数据。

当`Pragma`和`expires`同时存在，`Pragma`优先级高于`expires`，即生效的是`Pragma`


 * http 1.1时代的缓存`Cache-Control`

 在http1.1 中新增`Cache-Control` 可分别用于请求首部和响应首部

 优先级：`Pragma`>`Cache-Control`>`expires`

 可选值 | 描述
---|---
no-cache  | 不直接使用缓存，发起需要新鲜度校验请求
no-store  | 所有资源都不会缓存
max-age=s  | 告知客户端，在s秒内资源都是新鲜的，不必发起请求

 * 缓存校验

   1. `Last-Modified` - `If-Modified-Since`

        服务器只在所请求的资源在给定的日期时间之后对内容进行过修改的情况下才会将资源返回，状态码为 200，否则直接返回`304` 和响应报头，具体资源从本地缓存中取。

   2.  `ETag` - `If-None-Match`

        在响应客户端时，服务器会为此资源计算一个标识符，一并返回给客户端，客户端保留该字段，下次请求带上该字段，如果和服务器端一致则直接返回304，客户端使用缓存即可。

 * request中的cache-control

   * no-cache 表示不管服务端有没有设置Cache-Control，都必须从重新去获取请求

   * max-age=0表示不管response怎么设置，在重新获取资源之前，先检验

###### HTTP状态cookie
>HTTP 是无状态协议，它不能以状态来区分和管理请求和响应。也就是说，无法根据之前的状态进行本次的请求处理

   cookie 会根据从服务器端发送的响应报文内的一个叫做`Set-Cookie`的首部字段信息，通知客户端保存Cookie。当下次客户端再往该服务器发送请求时，客户端会自动在请求报文中加入`Cookie`值后发送出去。

      * Set-Cookie
          * name=value;

          * max-age=s

          * path

          * domain

          * Secure 仅在https下才发送cookie

          * HttpOnly js获取不到cookie(document.cookie)
      * Cookie
          * name=vaue;

##### TCP协议

##### TCP报文
> TCP报文=TCP头+数据(应用层报文)

![11](https://github.com/luyufa/NodeLearning/blob/master/browser/11.png)

  * 源端口 2字节 一般为客户端自动选择的临时端口号
  * 目的端口 2字节 服务端指定的端口号
  * 序号seq 4字节
    ```
    tcp是面向字节流传输的，在一个tcp连接中传输的字节流中的每个字节
    都按照顺序编号,主要用来解决网络报乱序的问题
    ```

  * 确认号ack 4字节

    ```
    表示期望收到对方下一个报文段的序号值,其值应为上次已成功收到数据
    字节序号加1。若确认号=N，则说明N-1之前的数据都正确接受到，主要用来解决不丢包的问题
    ```


  * 数据偏移 4位 TCP报文段首部长度

    ```
    4位二进制数能表示最大十进制数为15，数据偏移的单位为4字节，所以TCP首部最大长度为60byte
    ```

  * 保留字段 6位 目标置为0

  * URG 1位
  * ACK 1位

    ```
     当ACK=1，确认号字段才有效，当ACK=0，确认号字段无效。
     TCP规定，在连接建立后所有传送的报文段都必须把ACK置1
    ```
  * PSH 1位
  * RST 1位
  * SYN 1位
   ```
     在建立连接时用来同步序号，当SYN=1&&ACK=0，表示这是一个请求连接
     的报文段。
   ```
  * FIN 1位
  ```
  用来释放一个连接，当FIN=1，表示此报文段发送方的数据发送完毕，并要求释放连接
  ```
  * 窗口 16位 从本报文段首部中的确认号算起，接收方目前允许对方发送的数据量，用于对方控制发送速度
  ```
  假如确认号是 701 ，窗口字段是 1000。这就表明，从 701
  号算起，发送此报文段的一方还有接收 1000 （字节序号是 701 ~ 1700） 个字节的数据的接收缓存空间。
  ```
  * 校验和 16位 使用CRC算法检测传输过程中数据报是否损坏

  * 紧急指针 16位

  * 选项 最长40字节 ，最短0 ，因此TCP首部最小20字节，最大60字节


###### 三次握手

![12](https://github.com/luyufa/NodeLearning/blob/master/browser/12.png)


![13](https://github.com/luyufa/NodeLearning/blob/master/browser/13.png)


  1. 第一次握手：建立连接。客户端发送连接请求报文段，将`SYN位置为1`，`Sequence Number为x`；然后，客户端进入`SYN_SEND`状态，等待服务器的确认；
  2. 第二次握手：服务器收到SYN报文段，需要对这个SYN报文段进行确认，设置`Acknowledgment Number为x+1(Sequence Number+1)`；同时，自己自己还要`发送SYN请求`信息，将SYN位置为1，`Sequence Number为y`,设置应答段`ACK=1`；此时服务器进入`SYN_RECV`状态；
  3. 第三次握手：客户端收到服务器的SYN+ACK报文段。然后将`Acknowledgment Number设置为y+1`，设置应答段`ACK=1`，这个报文段发送完毕以后，客户端和服务器端都进入`ESTABLISHED`状态，完成TCP三次握手。
完成了三次握手，客户端和服务器端就可以开始传送数据。以上就是TCP三次握手的总体介绍。


###### 数据传输

![14](https://github.com/luyufa/NodeLearning/blob/master/browser/14.png)

###### 四次挥手

![15](https://github.com/luyufa/NodeLearning/blob/master/browser/15.png)

 1. 第一次挥手：主机1（可以使客户端，也可以是服务器端），设置Sequence Number和Acknowledgment Number，向主机2发送一个`FIN`报文段；此时，主机1进入`FIN_WAIT_1`状态；这表示主机1没有数据要发送给主机2了；
 2. 第二次挥手：主机2收到了主机1发送的FIN报文段，向主机1回一个ACK报文段，`Acknowledgment Number为Sequence Number加1`；主机1进入FIN_WAIT_2状态；主机2告诉主机1，我“同意”你的关闭请求；
 3. 第三次挥手：主机2向主机1发送`FIN`报文段，请求关闭连接，同时主机2进入LAST_ACK状态；
 4. 第四次挥手：主机1收到主机2发送的FIN报文段，向主机2发送`ACK`报文段，然后主机1进入TIME_WAIT状态；主机2收到主机1的ACK报文段以后，就关闭连接；


##### IP协议

IP协议处于网络层，而网络层的目的是实现两个端系统之间的数据透明传送，具体功能包括寻址和路由选择、连接的建立、保持和终止等

IP地址目前采用ipv4，32个二进制位组成，通常使用四段的十进制数表示IP地址，从0.0.0.0一直到255.255.255.255。

MAC地址是绑定在网卡上的，IP地址则是管理员分配的，它们只是随机组合在一起


##### IP报文格式

![16](https://github.com/luyufa/NodeLearning/blob/master/browser/16.png)

 * 版本 4位 目前广泛使用的为ipv4

 * 首部长度 4位 4位二进制数能表示最大十进制数为15，首部长度单位为4 字节，所以IP首部最大长度为60byte

 * 服务 8位

 * 总长度16位 首部及数据总长度，单位为字节，因此IP数据报最大为65535

 * 标识 16位
 * 标志 3位
 * 片偏移 13位

 * 生存时间 8位 TTL每经过一个路由器时,就把TTL减去数据报在路由器消耗掉的一段时间.若数据报在路由器消耗的时间小于 1 秒,就把TTL值减 1.当 TTL值为 0时,就丢弃这个数据报

 * 协议:8位 协议字段指出此数据报携带的数据是使用何种协议,以便使目的主机的IP层知道应将数据部分上交给哪个处理过程

 * 首部校验和 16位

 * 源地址 32位
 * 目的地址 32位



##### 数据链路层
>MAC(媒体访问控制地址)地址,也被叫做以太网地址或物理地址，MAC地址用于在网络中唯一标示一个网卡，确认网络设备位置的地址

###### MAC帧格式
 ![17](https://github.com/luyufa/NodeLearning/blob/master/browser/17.png)

  * 目的地址 6字节，目标mac地址
  * 源地址 6字节，本机mac地址
  * 类型 2字节，标志上层协议
  * FSC 4字节，填充字段，保证mac帧最小长度为64字节

MAC帧头的长度，固定为18字节；"数据"的长度，最短为46字节，最长为1500字节。因此，整个"帧"最短为64字节，最长为1518字节。如果数据很长，就必须分割成多个帧进行发送。