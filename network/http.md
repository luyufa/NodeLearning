## http超文本传输协议

 * TCP/IP协议簇，与互联网相关联的协议的统称(`TCP` `IP` `ICMP` `HTTP` `UDP` `DNS`...)，按层次分为

  1. `应用层`(DNS HTTP):主要关注应用程序活动。
  2. `传输层`(TCP UDP):处于联网状态中的两台计算机的数据传输。
  3. `网络层`(IP):规划传输路径，把数据包传送至目标计算机，数据包是网络传输最小单位。
  4. `数据链路层`(ICMP):网络连接中的硬件相关



 ![TCP/IP协议簇数据](https://github.com/luyufa/NodeLearning/blob/master/network/tcp:ip.png)


 * http通信过程TCP/IP协议簇发挥的作用
  1. DNS 解析域名->IP地址
  2. Http 生成针对web服务器的请求报文
  3. TCP 把报文分割成段，封装为数据包可靠的传输给目标计算机
  4. IP 一边中转一边传送
  5. APR协议寻找MAC地址


 `URL`:统一资源定位符（资源地点，URI子集）
 `ULI`:统一资源标示符（互联网资源）



 #### 一次Http通行由请求和响应组成

 1. 请求报文

 `post(方法)` `/api(URL)` `http/1.1(协议版本)`

 `请求首部字段`

 `空行`

 `请求实体`

2. 响应报文

 `http/1.1(协议版本)` `200(状态码)` `OK(原有短语)`

 `响应首部字段`

 `空行`

 `响应实体`



 #### 持久连接和管线化

 1. 一个请求一个响应需要建立一次TCP连接

 2. `持久连接`,一个请求建立TCP连接，在时间范围内只要某一方未明确提出断开连接则后面的HTTP请求都会复用这个TCP连接。
 3. `管线化`,请求完后不必等待响应即可在此发出请求（请求并行）


 #### 无状态的HTTP协议
 >HTTP协议是无状态德，不对之前的请求做管理，即无法使用之前请求的状态来协助此次请求处理。

 1. 响应首部字段加入 `Set_Cookie`
 2. 请求首部字段带上 `Cookie`


#### HTTP状态码

* `1XX`:请求正在处理
 * 101 由http协议转为使用websockte
* `2XX` 服务器处理完毕
 * 200 服务器处理请求成功
* `3XX` 重定向
 * 302 临时重定向
 * 304 服务器端资源未改变，直接使用浏览器缓存
* `4XX` 客户端异常
 * 400 错误请求
 * 403 服务端拒绝处理本次请求
 * 401 服务端授权验证失败
 * 404 服务器未找到请求资源
* `5XX` 服务器异常
 * 500 服务器错误


#### 代理

拥有转发功能的应用程序，作为客户端与服务器的中间人，接受客户端发送的请求并原样转发给服务器，接受服务器的响应并原样转发给客户端。

#### 常用HTTP首部字段

1. 通用首部字段
 * 报文创建日期
 * `Upgrade` 使用升级协议
 * `Via` 代理服务器信息
 * `Connection` Keep-Alive(默认请求带上) close(关闭TCP连接) ，控制不在转发给代理的首部字段
2. 请求首部字段
 * `Accept` 用户可处理的媒体类型(text/pain text/html...)
 * `Cookie`
 * `Host` 请求资源所在服务器(解决一台物理服务器对应多个虚拟服务器)
 * `User-Agent` Http客户端程序信息
 * `Referer URL` 发起页面
3. 响应首部字段
 * `Location` 重定向至的URL
 * `Server` HTTP服务器信息
 *
4. 实体首部字段
 * `Allow` HTPP支持的方法
 * `Content-Type` 实体类型
 * `Content-Length` 实体大小
 * `EXpires` 实体过期时间



#### HTTP缺陷与HTTPS
> HTTP + 加密 ＋ 认证 ＝ HTTPS，通常HTTP是直接和TCP通信，HTTPS是HTTP和SSL通信在和TCP通信

* HTTP缺陷
 1. 报文存在被篡改可能
 2. 不加密传输存在窃听可能
 3. 不严重通信双方存在伪装可能

* 对称加密：加密解密都使用一个秘钥，存在秘钥被盗窃可能
* 非对称加密：把公钥对任何人公开，使用公钥加密，私钥自己保留，使用私钥解密。

* 数字证书：客户端和服务端都信任的第三方机构
 1. 服务端向机构申请数字证书公钥
 2. 浏览器内置数字证书机构公开秘钥
 3. 服务器将公钥发送给客户端
 4. 验证

* 为什么不一直使用HTTPS？
 HTTPS需要加密和解密，会消耗CPU和内存资源，非敏感信息使用HTTP，敏感信息（登陆和涉及密码等等...）使用HTTPS


 #### 使用浏览器进行全双工通信的WebSocket
 > 一旦客户端和服务端由WebSockte协议建立起通信连接，则可以任意传送任意数据

 * 握手请求

  ```
 GET /chat HTTP/1.1
 Upgrade:websockte
 Connection:Upgrade
  ```
 * 握手响应

 ```
 HTTP/1.1 101
 Upgrade :websockte
 Connection: Upgrade
 ```

 #### 状态管理Cookie

* Set-Cookie字段说明
  1. `NAME=VALU` cookie的名称和值
  2. `expires` 过期时间
  3. `domain` Cookie影响域名和子域名，默认为创建cookie的域名
  4. `Secure` 仅在HTTPS通信时才会带上cookie
  5. `HttpOnly` cookie不能被javascript在页面获取（document.cookie）
  6. `path` 指定path目录下的资源才可以被访问
  7. `Max-Age` 多少秒后过期?
