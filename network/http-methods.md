## Http-Methods


#### POST
>post 发送数据给服务器，具体的数据类型由`Content-Type`决定

 ###### application/x-www-form-urlencoded

 此时服务端收到`para=value&key=value`数据已`&`分隔,以`=`分隔键值，并且非字母和数字会被url编码(所以不支持二进制),本质上是一个http body是的很大的查询字符串

 `request header`

 ```
  Content-Type: application/x-www-form-urlencoded,

  para=value&key=value
 ```

 ###### multipart/form-data

 主要传输二进制数据(文件)，每一个部分都添加`Content-Disposition`去表达`MIME`信息，当传输信息较少时，添加MIME信息就显得浪费资源了，所以一般用于文件上传。

`request header`

```
boundary
Content-Dispostion
空行
value
```

 ```
   Content-Type: multipart/form-data;boundary="l-y-f-boundary"

l-y-f-boundary
Content-Disposition: form-data; name="my_name_key"

my_name_value
l-y-f-boundary
Content-Disposition: form-data; name="my_buffer_key"; filename="example.txt"

my_buffer_value
 ```

参考 [stack overflow:application/x-www-form-urlencoded or multipart/form-dat](https://stackoverflow.com/questions/4007969/application-x-www-form-urlencoded-or-multipart-form-data)

#### HEAD

仅返回`http headers`应该忽略消息实体,并且`head`请求应该与`get`请求的`http headers`一致,因此head请求一般用于检测服务器资源信息。

举个栗子:例如下载前先获知即将下载文件大小(`Content-Type`)，超过某大小在决定使用何种方式下载



#### OPTIONS

 在跨域访问中，浏览器必须首先使用 OPTIONS 方法发起一个预检请求（preflight request），从而获知服务端是否允许该跨域请求。服务器确认允许之后，才发起实际的 HTTP 请求。在预检请求的返回中，服务器端也可以通知客户端，是否需要携带身份凭证（包括 Cookies 和 HTTP 认证相关数据）