## DNS解析原理

##### 1. 为什么需要DNS解析？

绝大部分网络通讯基于TCP/IP,所以必须确认IP地址，而IP地址不易记住所以有一个DNS服务器把域名翻译为IP地址


##### 2. DNS解析过程

以浏览器解析DNS为例分析

![dns解析过程](https://github.com/luyufa/NodeLearning/blob/master/network/dns/1.png)



##### 3.NDS Prefetch

*  **自动解析**

   chrome遇到`a`标签，自动将`href`中的域名解析为`ip`地址，此过程与用户浏览网页并行，同时`https`页为安全起见不做自动预解析

* **手动强制解析**

   ```
   <link ref="dns-prefetch" href="//www.baidu.com">
   ```
   上面的`link`标签会让`www.baidu.com`预解析


* **自动解析控制**

  当我们希望在HTTPS页面开启自动解析功能时，添加如下标记

   ````
  <meta http-equiv="x-dns-prefetch-control" content="on">
   ```

  当我们希望在HTTP页面关闭自动解析功能时，添加如下标记
  ```
  <meta http-equiv="x-dns-prefetch-control" content="off">
  ```

*  **正确的使用姿势**

  1. 对静态资源做手动prefetch
  2. 对js里发起的跳转、重定向等手动做prefetch
  3. 不用对超链接做prefetch，chorme会自动处理
  4. prefetch网络消耗低，延时长