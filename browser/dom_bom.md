## 浏览器对象模型(BOM)
> BOM提供了访问浏览器的功能、控制浏览器行为

#### window

`BOM`的核心对象，表示一个浏览器实例，作为`js`访问浏览器窗口的接口、同时也是`ECMScrpit`规定了`Global`对象，因此在网页中定义的任何对象、变量、函数都会作为其属性挂载在`window`下

```
var age=24;
function say(){
   console.log(this.age)
}
console.log(this.age)//24 this指向window
console.log(say())//24
console.log(window.age)//24
```

直接定义全局变量无法被删除，而在window上作为属性赋值则可以删除

```
window.test1='ok'
var test2='ok'
delete window.test1
delete window.test2 //false
```

直接访问一个不存在的全局变量会抛出错误，但是通过`window`的属性访问则返回`undefined`

#### 超时计时器setTimeout和间隔计时器setInterval

JavaScript 是一个单线程序的解释器，因此一定时间内只能执行一段代码。为了控制要执行的代码，就有一个 JavaScript 任务队列。这些任务会按照将它们添加到队列的顺序执行。setTimeout() 的第二个参数告诉 JavaScript 再过多长时间把当前任务添加到队列中。如果队列是空的，那么添加的代码会立即执行；如果队列不是空的，那么它就要等前面的代码执行完了以后再执行

#### location

window.location与document.location引用的是同一个对象，保存着当前文档信息和将url解析为独立片段

`http://127.0.0.1:3000/a?page=b#c`
prototype | explain
---|---|----
hash | URL#号后所跟字符串,把浏览器定位到id=c的位置
host | 域名:端口号127.0.0.1:3000
hostname | 域名127.0.0.1
href | 当前页面完整的url
port | 端口3000
href | 当前页面完整的url
protocol | protocol 协议一般为http https
search | 以?开始的查询字符串?page=b

#### 获取url中的查询参数

```
function buildQueryPara(url) {
    return function (name) {
        const reg = new RegExp(`(\\?|&)${name}=([^&]*)([$&#])`);
        const r = url.match(reg);
        return r ? r[2] : null;
    }
}
```

通过location改变浏览器url，如果调用 reload() 时不传递任何参数，页面就会以最有效的方式重新加载。也就是说，如果页面自上次请求以来并没有改变过，页面就会从浏览器缓存中重新加载。如果要强制从服务器重新加载，则需要像下面这样为该方法传递参数 true

```
window.location='http://www.baidu.com'//底层调用assign、会在浏览器留下记录
location.href='http://www.baidu.com'//底层调用assign、会在浏览器留下记录
location.assign('http://www.baidu.com')会在浏览器留下记录
location.replace('http://www.baidu.com')不会在浏览器留下记录
location.load(true)
```

#### history

`history`保存着浏览器窗口自打开以来的历史纪录

```
// 后退一页
history.go(-1);

// 前进一页
history.go(1);

// 后退一页
history.back();

// 前进一页
history.forward();

if (history.length == 0){
    //这应该是用户打开窗口后的第一个页面
}
```

### navigator
包含了浏览器相关信息


prototype | explain
---|---
appCodeName | 浏览器代码名
platform | 运行浏览器的平台
userAgent | 代理信息
cookieEnabled | 是否启用cookie




## 文档对象模型(DOM)
> DOM将HTML描绘成一个唯一根结点的层次结构树


#### Node类型

在js中所有的结点都继承自Node类型,

* Document 类型表示整个文档，是一组分层节点的根节点
* Element 节点表示文档中的所有 HTML 或 XML 元素
* 另外还有一些节点类型，分别表示TEXT文本内容、COMMENT注释、文档类型、CDATA 区域和文档片段。


`NodeList`不是数组实例，但提供`forEach`方法进行迭代,`NodeList`是动态对应`DOM`结点

以下代码将会无限循环
```
var i,div,divs = document.getElementsByTagName("div");
for (i=0; i < divs.length; i++){
    div = document.createElement("div");
    document.body.appendChild(div);
}
```


1. 常用的Node操作方法
`appendChild` `insertBefore` `replaceChild` `removeChild`

2. 常用的Node属性
`nodeType` `nodeName` `nodeValue` `firstChild` `lastChild` `childNodes` `parentChild`


#### 查找Dom树种的一个元素的方法
1. 通过id查找
`document.getElementById() ele`

2. 通过class查找
`document.getElementsByClassName() [ele]`

3. 通过标签名字查找`*`会取出全部元素
`document.getElementsByTagName() [ele]`

4. 通过元素中含有name属性的值来查找
`document.getElementsByName()`

5. 所有image `document.images`

6. 所有的带href的a链接 `document.links`

7. `document.querySelector() document.querySelectorAll()`