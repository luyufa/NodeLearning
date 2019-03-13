## 浏览器渲染
> 写代码的时候一直不明白但知道要把`<script></script>`这样的代码放在`body`最底部，把`<link><link>`放到`head`开始，今天打算彻底搞明白，整个过程持续蛮长时间，网络资源各说其词，不细看没毛病，一细想就觉得有问题，最后结合很多资源和demo+timeline分析才有了这篇文章。


##### 写在前面

当你在url里敲入地址，然后帅气的按下回车，最终漂亮的页面便呈现在你眼前了，本文挑了这一整个过程中一小段即`浏览器渲染`来聊聊，这里主要是`html`、`css`、`javascript`的渲染，老规矩，先上几个问题。

* `display:none`和`visibility:hiddle`有何区别?
* 什么是渲染阻塞资源？有哪些？
* CSS有可能阻塞DOM解析么？
* 为什么CSS通配符*效率低？
* `async`和`defer`的异同及作用？
* 为什么`<script></script>`这样的代码放在`body`最底部，把`<link><link>`放到`head`开始？


##### DOM和CSSOM
> 文档对象模型和层叠样式表对象模型

浏览器最开始拿到的一定是`html`，当从`http`响应中读出后会经过如下过程

1. 编码 : 将`html`编码为文件指定的字符编码

2. 令牌化 : 记录标签的开始和结束、子标签(例如`<html>`还未遇到`</html>`便遇到`<body>`标签，那么`body`标签就是`html`标签的子标签)

3. 对象化 : 每对令牌都将转换为拥有特定属性的结点对象

4. DOM树 : 至此对象结点集合形成一颗树形结构称`DOM树`

其实整个`DOM树`的构建过程其实就是： **字节** -> **字符** -> **令牌** -> **节点对象** -> **对象模型**

构建CSSOM树的过程与此雷同，预下载`link`标签内的资源，然后解析构建CSSOM


##### 渲染树

 DOM树仅描述了文档的结构和内容，CSSOM树则描述了网页样式。所以想要渲染出页面，就要把二者合二为一称**渲染树**
 浏览器会按照如下方式进行渲染树构建

 1. DOM树根节点遍历每个可见结点，注意`display:none`的是为不可见结点，但是`visibility:hiddle`仅是隐藏结点，依旧占据布局空间,也就是说`display:none`是不在DOM树内的

 2. 对每个可见结点对应其css样式

 3. 至此渲染树构建完成，既描述了文档结构和内容同时还包含其样式规则

然后根据渲染树，从根结点开始采用**盒模型**的方式计算结点在页面的大小和位置，布局完成后开始将渲染树绘制成像素

这里要强调下把DOM树和CSS树合二为一过程中匹配CSS规则是**自右向左**，放到CSSOM树里来看就是从叶子结点开始往上匹配。那么为什么不是自左向右呢？我们来看下

```
.a p div span{}


<div class='a'>
  <p>
    <div>
       <span></span>
       <p></p>
    <div>
       <span></span>
  <p>
</div>
```
先假设是自左向右，那么匹配路径如下，整个过程匹配了三条路径共10次

 1. `div:a->p->div->span` 命中
 2. `div:a->p->div->p` 接下来应该是span，故未命中
 3. `div:a->span` 接下来应该是p，故未命中

再来看下自由向左，整个过程匹配两条路径共6次

 1. `span->div->p>div:a` 命中
 2. span->p 接下来应该是div，故未命中

且随着css规模和dom规模越来越大这个**自右向左**在第一次就过滤掉大量的不符合结点的优势会越来越明显，这也就侧面解释了为什么通配符`*`效率低下了。

##### 关键渲染路径

当前用户操作内容，即浏览器收到html、css、javascript到呈现页面的过程。关键渲染路径分为六步。当接收到html后开始边解析边预下载相关javascript、css等资源。
 1. DOM树：下载html，解析html，构建DOM树

 2. CSSOM树：等待CSS下载完构建CSSOM树

 3. 渲染树：CSSOM树完成后开始和DOM合成渲染树

 4. 计算结点大小和位置即布局

 5. 绘制





##### 阻塞渲染资源
> CSS不阻塞DOM解析，阻塞页面渲染，阻塞脚本执行；JS阻塞DOM解析，阻塞页面渲染

* javascript

  由于JS可以修改DOM结构，所以当浏览器的HTML解析器遇到一个script标记时会暂停构建DOM。然后将控制权移交至JavaScript引擎，这时引擎会开始下载然后执行JavaScript脚本，直到执行结束后，浏览器才会从之前中断的地方恢复，然后继续构建DOM。

  JS不仅仅会阻塞DOM构建，当JS脚本之前的CSS未解析完成，则会等待前面的CSS解析完成才会执行自身。


* css

  从CSS下载到CSSOM构建完成之前浏览器是不会傻傻等待的，依旧进行DOM解析(构建DOM树)；但是渲染呢？从前面知道，想要构建渲染树那么势必要先 有CSSOM树，即CSS是会阻塞渲染的。想象一下如果CSS不阻塞页面渲染，浏览器先是呈现一个界面，等待CSS下载解析完成刷的一下又变为其他样式。而且渲染本身是有成本的。

* 图片资源

  图片资源并不属于阻塞资源，也就是说图片即不阻塞DOM解析也不阻塞渲染，背景图属性写在CSS文件里，则CSS文件下载并执行`Recalculate Style`的时候才会请求图片

##### async & defer
> 并行下载、下载过程不影响页面解析

我们先看一个普通的例子，这个例子浏览器会如下处理，也就是这里的`script`会阻塞DOM解析。

 1. 暂停解析DOM

 2. 请求a.js

 3. 执行a.js

 4. 继续解析DOM

```
<script src='a.js'></script>
```

如果加上`defer`属性呢？

 1. DOM解析不受影响

 2. 并行请求a.js和b.js，直至下载完成

 3. 在`DOMContentLoaded`触发前（即所有元素解析完成之后）再按文中顺序依次执行

这里加上defer有那么多好处那么是否可以使用defer完全替换普通script呢？答案是否定的，因为JS是有可能修改DOM的。一般defer声明即表明这个脚本不应该修改DOM

```
<script src='a.js' defer></script>
<script src='b.js' defer></script>
```

再来看看`async`的情况

 1. DOM解析不受影响

 2. 并行请求a.js和b.js

 3. 下载完成后a.js和b.js的执行顺序不一定

```
<script src="a.js" async></script>
<script src="b.js" async></script>
```

需注意两者在浏览器同时支持的情况下同时出现会已`async`为主

![async、defer script ](https://github.com/luyufa/NodeLearning/blob/master/browser/perfermance1.png)



##### script和link的位置对渲染的影响

把`<script></script>`这样的代码放在`body`最底部，把`<link><link>`放到`head`开始，应该每一个前端都知道得，但是为何这样做？现在我们给几个例子从浏览器渲染过程分析为什么?

这里必须先区分下页面渲染出来了这个概念大致可理解为如下两种

 1. 页面完全渲染出来了
 2. 首屏渲染出来了

对于第一种我觉得放在任何位置没所谓，无论在哪最终页面完全渲染完总是要经历js执行、cssom构建、dom解析这些过程，总的时间影响不大。本文探讨的主要是第二种**首屏渲染**，什么是首屏渲染就是你实实在在的看到画面了，只是未必可以交互而已。

在开始例子之前先了解两个基本常识

 1. 对于外部资源浏览器肯定不是解析到html对于标签时才去请求的，浏览器会预先偷看然后在合适的时候发送请求，这个时机可以是解析html的一开始或者发生耗时操作时，就去请求后面的资源。

 2. 页面绘制并不会再html全部解析完成才绘制，而是解析一部分，就绘制一部分，以此渐进式的渲染。


* 先看第一个例子`script`放到`head`中打开浏览器`performance`(`timeline`) 查看`eventLog`

```
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="http://127.0.0.1:8080/style_now.css">
    <script src='http://127.0.0.1:8080/b_now.js'></script>
    <script src='http://127.0.0.1:8080/a_sleep_10.js'></script>
</head>
<body>
<p>ok</p>
</body>
</html>
```

1. 针对index.html`Send Rquest->Recive Response`->`Recive Data`->`Finish Loading`

2. `Parse HTML`->`Send Request`同时发送三个请求下载相关资源

3. `Finish Loading css` css下载完成，开始解析`Parse Stylesheet`

4. `Finish Loading b_now.js`下载完成，立即开始执行`Evaluate Script`

5. 直到`Finish Loading a_sleep_10.js` 下载完后，立即执行`Evaluate Script`

6. `Parse HTML`继续解析html

7. `Recalculate Style`->`Layout`->`Paint`

    结论:放到`head`的`a_sleep_10.js`阻塞DOM解析，页面直到其执行完会解析DOM




*  第二个例子`script`放到`</body>`之前

```
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="http://127.0.0.1:8080/style_now.css">
</head>
<body>
<p>ok</p>
 <script src='http://127.0.0.1:8080/b_now.js'></script>
 <script src='http://127.0.0.1:8080/a_sleep_10.js'></script>
</body>
</html>
```

1. 针对index.html`Send Rquest->Recive Response`->`Recive Data`->`Finish Loading`

2. `Parse HTML`->`Send Request`同时发送三个请求下载相关资源

3. `Finish Loading css` css下载完成，开始解析`Parse Stylesheet`

4. `Finish Loading b_now.js`下载完成，立即开始执行`Evaluate Script`

5. `Recalculate Style`->`Layout`->`Paint`

6. `Finish Loading a_sleep_10.js` 下载完后，立即执行`Evaluate Script`

7. `Parse HTML`继续解析html

8. `Recalculate Style`->`Update Layer Tree`->`Composite Layer`

    结论:放到`</body>`的`a_sleep_10.js`不影响其所在位置前面内容的显示，前面的DOM构建完成后，只要有样式解析完成便提前开始绘制。


3.  第三个例子`script`放到`body`元素之间

```
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="http://127.0.0.1:8080/style_now.css">
</head>
<body>
<p id='hh'>okokok</p>
<script src='http://127.0.0.1:8080/b_now.js'></script>
<script src='http://127.0.0.1:8080/a_sleep_10.js'></script>
<p>nonono</p>
</body>
</html>
```

1. 针对index.html`Send Rquest->Recive Response`->`Recive Data`->`Finish Loading`

2. `Parse HTML`->`Send Request`同时发送三个请求下载相关资源

3. `Finish Loading css` css下载完成，开始解析`Parse Stylesheet`

4. `Finish Loading b_now.js`下载完成，立即开始执行`Evaluate Script`

5. `Recalculate Style`->`Layout`->`Paint` 页面看得到okokok

6. `Finish Loading a_sleep_10.js` 下载完后，立即执行`Evaluate Script`

7. `Parse HTML`继续解析html

8. `Recalculate Style`->`Update Layer Tree`->`Paint` 页面后半部分nonono显示出来

    结论: 和第一个例子一样，js阻塞DOM解析，但浏览器是渐进式渲染，并非DOM完全构建完成才绘制，有可能是多次绘制的结果


*  第四个例子，这个比较特殊，主要是测试延迟加载css。

```
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="http://127.0.0.1:8080/style_sleep_10.css">
</head>
<body>
<p id='hh'>ok</p>
<script src='http://127.0.0.1:8080/b_now.js'></script>
</body>
</html>
```

1. 针对index.html`Send Rquest->Recive Response`->`Recive Data`->`Finish Loading`

2. `Parse HTML`->`Send Request`同时发送两个个请求下载相关资源

3. `Finish Loading b_now.js`下载完成，注意这里不执行

4. `Finish Loading css` css下载完成，开始解析`Parse Stylesheet`

5. `b_now.js`立即开始执行`Evaluate Script`

6. `Parse HTML`继续解析html

8. `Recalculate Style`->`Update Layer Tree`->`Paint`

   结论: css不阻塞DOM解析，但是阻塞渲染，而且需要留意这里的js下载完成了也未立即执行，而是推迟到了css下载完成后才执行


* 四个例子的总结:

  1. js阻塞解析、阻塞渲染。

  2. css不阻塞解析、阻塞渲染。

  3. 页面想要绘制必须等**所有css**加载、解析完成即CSSOM构建完成。

  4. 浏览器绘制并不是一次性的，是渐进式的，只要CSSOM构建完成，就在合适的时机就进行绘制，无论DOM解析是否全部完成。

  5. 浏览器并不会等待解析到标签`script` `link`才去下载相关资源，而是会**预加载**

  6. `<script></script>`这样的代码放在`body`最底部，把`<link><link>`放到`head`开始是合理的。


###### 参考
* [聊聊浏览器的渲染机制理](https://segmentfault.com/a/1190000007766425#articleHeader2)
* [浏览器渲染过程与性能优化](https://sylvanassun.github.io/2017/10/03/2017-10-03-BrowserCriticalRenderingPath/)
* [JS 一定要放在 Body 的最底部么？聊聊浏览器的渲染机制](https://segmentfault.com/a/1190000004292479)
* [defer和async的区别](https://segmentfault.com/q/1010000000640869)
* [原来 CSS 与 JS 是这样阻塞 DOM 解析和渲染的](https://juejin.im/post/59c60691518825396f4f71a1)
