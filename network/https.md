## https

##### HTTP+TLS=HTTPS

1. TCP/IP 四层模型

![TCP/IP](https://github.com/luyufa/NodeLearning/blob/master/network/https/1.png)

`HTTP`位于应用层，主要定义数据如何包装，传输数据主要靠`TCP`协议，`HTTP`是直接把封装好的数据给到`TCP`传输，而`HTTPS`便是在把数据给到`TCP`之前通过安全套接层`TLS`进行加密，在进行传输。

![TCP/IP](https://github.com/luyufa/NodeLearning/blob/master/network/https/2.png)