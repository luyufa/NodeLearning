## 浏览器的同源策略和HTTP的跨域请求

#### 同源策略SOP

URL = 协议＋域名＋端口＋路径

如果两个URL的协议、域名、端口全部相同则说明它们同源

* 举个栗子(`http://www.example.com/a`)
 1. `http://www.example.com/b` 同源
 2. `http://example.com/a` 不同源，域名不同
 3. `http://v2.www.example.com/a` 不同源，域名不同
 4. `http://example.com:8200/a` 不同源，端口不同


#### 跨域请求解决方案一 代理转发Proxy

由于SOP的限制是浏览器实现的，如果请求不是从浏览器发出自然就不存在跨越问题了，即：

1. 其他域的请求A替换为本域下的请求B
2. 本域服务器转发请求B
3. 本域服务器收到请求B的响应
4. 本域服务器响应请求A

#### 跨域请求解决方案二 跨域请求资源共享CORS

在进行CORS请求之前，浏览器会发送一次HTTP预检请求，判断当前请求域名是否在服务器许可范围之内，如果通过则发起HTTP请求，否则报错，此类报错无法通过HTTP状态吗识别，因为有可能状态码是200。

1. CORS请求(api.alice.com)－>(api.bob.com)

 ```
PUT /cors HTTP/1.1 （api.bob.com）
X-Custom-Header1 : value1
X-Custom-Header2 : value2
Access-Control-Expose-Headers : token
```
2. 预检请求

 ```
 OPTIONS /cors HTTP/1.1 采用OPTIONS方法
 Origin: http://api.bob.com 请求域名
 Access-Control-Request-Method: PUT 用什么HTTP方法进球跨越请求
 Access-Control-Request-Headers: X-Custom-Header1,X-Custom-Header2 跨域时带上的header
 Host: api.alice.com
 ```
3. 预检请求响应

 ```
 HTTP/1.1 200 OK
 Access-Control-Allow-Origin: http://api.bob.com 可以跨越的域名，*号为所有域都行
 Access-Control-Allow-Methods: GET, POST, PUT 支持的跨域请求方法
 Access-Control-Allow-Headers: X-Custom-Header1,X-Custom-Header2 允许带上的带上的头信息字段
 Access-Control-Allow-Credentials: true 表示是否允许发送cookie（要么存在要么为true）
 Access-Control-Max-Age: 24*3600 预检请求有效期
 Access-Control-Expose-Headers: getResponseHeader的基本字段＋token
 ```

4. 通过预检请求后HTTP请求

 ```
PUT /cors HTTP/1.1
Origin: http://api.bob.com 每次请求头中都带上Origin字段
Host: api.alice.com
X-Custom-Header1: value1
X-Custom-Header2: value2
 ```

5. 通过预检请求后HTTP响应

 ```
 Access-Control-Allow-Origin: http://api.bob.com 每次响应头中都带上Access-Control-Allow-Origin字段
 Content-Type: text/html; charset=utf-8
 ```