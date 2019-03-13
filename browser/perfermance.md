## 前端性能监控(关键数据)


##### 页面生命周期
> DOMContentLoaded & load
在聊前端性能监控之前 我们先了解下页面的生命周期，而`DOMContentLoaded`和`load`是便其中的关键。

###### DOMContentLoaded
> 浏览器已完成html的下载解析，并且构建完成DOM树，但是需要注意此时像img和外部样式并不一定下载解析完
```
document.addEventListener('DOMContentLoaded',evev=>{
    console.log('DOMContentLoaded call')
})
```

* `script`(无论内联或者外部引入)
   
  `script`会阻塞浏览器解析构建DOM树的（UI线程和V8一定是互斥的哦），所以，`DOMContentLoaded`会等待所有的`script`执行完毕才会执行    

* `async script`
  当`script`带有`async`时，浏览器继续解析html，在后台无阻碍的下载js脚本,并且下载完成就立即执行，也就是说它们页面中的顺序不影响执行顺序。于是乎会出现
     1. 页面解析完成 `async script`还未下载完，此时`DOMContentLoaded`执行
     
     2. 页面未解析完，`async script`下载完成，此时`DOMContentLoaded`，等待js执行完，并且等待页面解析完成，才获得调用

* `defer script`
   当`script`带有`defer`时，浏览器继续解析html，在后台无阻碍下载js脚本，并且等页面解析完成，才会按**顺序**执行，所以这时只会有一种情况
    1.  `defer`脚本一定在`DOMContentLoaded`之前执行


![async、defer script ](https://github.com/luyufa/NodeLearning/blob/master/browser/perfermance1.png)


* 样式表
  样式表下载解析并不会阻塞DOM树的构建，也就是样式表不会对`DOMContentLoaded`造成影响，但是需要注意样式表的下载解析会阻塞`script`的执行。所以样式表是有可能间接影响`DOMContentLoaded`的
  
  ```
  <link type="text/css" rel="stylesheet" href="style.css">
   <script>
    脚本直到样式表加载完毕后才会执行。
   </script>
  ```
  
  
###### onload
> 浏览器已经加载了所有的资源，包括图像，样式表等

```
window.load=evet=>{
    console.log('load call')
}
```


##### 白屏时间
> 输入url按下回车，到浏览器开始显示内容的时间，通常认为解析完`head`即完成白屏时间

```
<html>
  <head>
    <script>pageStaartTime=new Date()</script>
    <link></link>
    <link></link>
    <link></link>
    <script>pageEndTime=new Date()</script>
    <script>
    白屏时间=pageEndTime - (performance.timing.navigationStart||pageStartTime)
    </script>
  </head>
  <body>
  </body>
</html>
```

##### 可操作时间
> 认为dom解析完成时间，为用户可操作时间借助H5 perfermance很容易实现

```
performance.timing.domInteractive - performance.timing.navigationStart
```


##### 首屏时间
> 输入url按下回车，到浏览器完整显示的时间，通常来说在首屏渲染中图片资源是加载最慢的。所以我们以首屏加载的最后一张图片为结束首屏渲染时间点。


 1. 首屏模块标记法
 > 无需XML HttpRequest获取数据和图片不是主要展示内容时，有效

 ```
 <html>
   <head>
   <script>pageStaartTime=new Date()</script>
   ......
   </head>
   <body>
     <div>..</div>
     <div>..</div>
     <div>..</div>
     <script>
        firstScreenTime = Date.now();//认为此处已完成首屏展示
     </script>
     <script>
    首屏时间=firstScreenTime - (performance.timing.navigationStart||pageStaartTime)
     </script>
     <div>..</div>
   </body>
 </html
 ```
 
 2. 统计首屏图片加载完成时间
 > DOM树构建完成后，遍历`img`标签，绑定`onload`事件。

 ```
 const times=[];
 document.addEventListener('DOMContentLoaded',evev=>{
    document.querySelectorAll('img').forEach(item=>{
        const onLoad=item.onload;
        item.onload=function(){
            times.push(new Date())
            if(typeof onLoad === 'function'){
               onLoad.call(this) 
            }
           
        }
    })
})
 window.onload = function () {
  首屏时间 = min(times) -(performance.timing.navigationStart||pageStaartTime)
}
 ```
 

##### performance
> web性能接口

  1. **Navigation Timing**,整体页面的加载时间
     ```
     timing=perfermance.timing
     {
         loadEventEnd:onload回调时间
         navigationStart:可以理解为页面最初的时间
         
         domainLookupEnd:DNS查询结束
         domainLookupStart:DNS查询开始
         
         requestStart: 开始请求文档时间
         responseStart: 开始接收响应，获取第一个字节时间
         responseEnd: 响应接收完成时间
         
         connectStart: tcp开始建立时间
         connectEnd: tcp建立完成时间
         
         domLoading: 开始解析DOM树时间
         domInteractive: 完成DOM树解析时间
         domComplete: DOM树解析完成，且资源也加载完成
         
         domContentLoadedEventStart:DOMContentLoaded事件的开始时间,
         domContentLoadedEventEnd:DOM解析完成后，网页内资源加载完成的时间（图片、async script下载执行）
     }
     ```
     * TCP 建立时间 `connectEnd-connectStart`
     
     * 页面加载完成时间 `loadEventEnd-navigationStart`
     
     * DNS查询时`domainLookupEnd-domainLookupStart`
     
     * TTFB(Time To Fisrt Byte),网络请求被发起到从服务器接收到第一个字节：`responseStart-requestStart`
     
     * 文档下载时间 `responseEnd-requestStart`
     
     * Dom解析时间 `domInteractive-domLoading`


  2. **Resource Timing**,每个资源加载时间,如下分析仅针对静态资源,在进行静态资源加载分析时应该先调用`performance.clearResourceTimings`清除所有资源的缓存。
     ```
     timings=performance.getEntries();
     [{
         entryType:'resource',
         name:'http://....../public/test.css',//资源路径
         initiatorType:'css'|'img'|'link'|'script'|'xmlhttprequest',
         startTime:'开始请求资源时间',
         duration:'获取资源耗时'(`responseEnd-startTime`)
         
     }]
     ```
     
     
     
###### 推荐
推荐一个Node的项目[webpagetest](https://github.com/marcelduran/webpagetest-api)，只需npm完后便可直接使用测试网页性能