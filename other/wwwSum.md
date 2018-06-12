1. HTML5新特性?
 * 新增<!doctype html>
 * 语义化标签（符合内容结构的标签）`nav` `footer` `header` `aside` `article ` `section` `address` `figure` `figcaption` `video` `audio`
 *  增强型表单元素－input类型 `email` `url` `number` `range` `color` `date`
 *  增强型表单元素－input属性 `max`,`min`,`step` `autofocus` `placeholder` `required`
 * 本地存储

2. 本地存储？
> [cookie && webStroage](https://segmentfault.com/a/1190000010400892?utm_source=tuicool&utm_medium=referral)


\ | cookie|sessionStroage|localStroage
---|---|---|--
生命周期 |服务器生成，可设置过期时间Max-Age |当前会话有效，关闭浏览器或关闭当前页则失效(刷新也存在) | 永久存在直到被清除
存储容量 | 4Kb|5MB| 5MB
使用特性 | 浏览器会自动加入http请求头中，cookie过大会造成性能问题|仅咋客户端使用 | 仅在客户端使用
使用场景 | 数据过大容易性能问题，所以一般携带登录凭证|填写表单时的信息防丢失| 容易产生本地数据的页面如游戏


 使用前先判断是否存在

```
if(window.localStorage){
 alert('This browser supports localStorage');

 localStroage.x='xxxxx' //存储(getItem)
 localStroage.x='yyyyy' // 更新(setItem)
 localStroage.x //获取
 localStroage.getItme('x')／／获取
 localStroage.reomveItem('x')// 删除


}else{
 alert('This browser does NOT support localStorage');
}
```


3. 浏览器标准模式和怪异模式？

在标准模式下，浏览器按照HTML与CSS标准对文档进行解析和渲染；而在怪异模式下，浏览器则按照旧有的非标准的实现方式对文档进行解析和渲染,浏览器开头的` DOCTYPE`决定使用哪种模式


4. data-* 的好处？
> 自定义数据属性 横线自动转驼峰,可直接使用`el.dataset`

```
<div id="xx" data-name='lz' data-age="24" data-my-parent="ly">aa</div>
const el = document.querySelector('#xx');
    console.log(el.getAttribute('data-name'));
    console.log(el.dataset)
    DOMStringMap{
        name: "lz",
        age: "24",
        myParent: "ly"
    }
```

5. meta元数据的用处？
> [meta 总结](https://segmentfault.com/a/1190000004279791)


```
<meta name="参数" content="概述">。
<meta name="keywords" content="网站关键字">
<meta name="description" content="网站主要内容">
<meta name="author" content="作者信息">
<meta name="renderer" content="webkit"> //默认webkit内核
<meta name="renderer" content="ie-comp"> //默认IE兼容模式
<meta name="renderer" content="ie-stand"> //默认IE标准模式
<meta charset="utf-8">
<meta http-equiv="cache-control" content="no-cache">w网页缓存
<meta http-equiv="expires" content="Sunday 26 October 2016 01:00 GMT" />网页到期时间
<meta http-equiv="x-dns-prefetch-control" content="on"> dsn预解析
```

6. 盒模型？
每个元素都被表示为一个矩形，每个盒子由`margin` `padding` `border` `content`构成。

  * IE 盒模型：`width height` 不包含`border、padding`
  * w3c 盒模型：`width height` 包含`border、padding`

使用`box-sizing` 可以设置采用哪种盒模型，默认值为`content-box`标准盒模型，可以修改为`border-box`IE盒模型


7. CSS3 过渡 动画 形变？

  * 过渡

`transition:<prototype durtion time-func delay>`

time-fun 可选函数有 `ease`(减缓) `linear`(线性) `step-end`(起点－终点) `steps(3,end)`(起点－终点中发生几次变化)

prototype all 表示所有属性
```
.case {
            color: #000;
            font-size: 14px;
            transition: font-size 2s linear 1s, color 2s ease 1s
        }
        .case:hover {
            color: red;
            font-size: 64px;
            transition: font-size 2s steps(4, end) 1s, color 2s step-end 1s;
        }
```


 * 动画

```
        .circle {
            animation-name: amplify;
            /*动画帧集合名*/
            animation-timing-function: linear;
            /*变化趋势*/
            animation-delay: 0s;
            /*元加载完后延迟时间*/
            animation-duration: 3s;
            /*播放时间*/
            animation-direction: alternate;
            /*正常播放normal alternate正向之后方向播放*/
            animation-iteration-count: 4;
            /*重复次数 infinite number*/
            animation-fill-mode: forwards
            /* forwards(最后一帧) backforwards(第一帧) none(默认)*/
        }

        @keyframes amplify {
            /*关键帧 from(0%)  to(100%)*/
            from {
                width: 50px;
                height: 50px;
                border-radius: 50px;
                background-color: red;
            }
            50%{
            }
            to {
                width: 300px;
                height: 300px;
                border-radius: 300px;
                background-color: yellow;
            }
        }
```


 * 形状转换(块级元素生效)

```
.transform {
            margin: 200px auto;
            width: 500px;
            height: 300px;
            background-color: blueviolet;
            transform-origin: 50% 50% 0;
            /*旋转围绕点*/
            transform: rotate(30deg);
            /*旋转*/
            transform: translate(-100px, 30px);
            /*移动 translateX translateY*/
            transform: scale(1.5, 0.5);
            /*缩放 scaleX scaleY */
            transform:skew(-30deg)
            /*倾斜 skewX skewY*/

        }
```



8. 隐藏页面的方式？

 * 设置透明度为0 ，依然占据空间，会影响布局,会响应用户交互，仅仅是视觉不可见

 ```
 .hide{
     opacity:0
 }
 ```
 * 不会响应交互、会影响布局
 ```
 .hide{
     visibility:hidden
 }
 ```
 * 真正的隐藏、不占据空间、连和盒模型都不生产
 ```
 .hide{
     display:none
 }
 ```

 * 将布局移出视图
 ```
 .hide{
  postion:absolute
  top:-99999
  left:-99999
 }
 ```

 9. 如何实现水平居中?

  * 行内元素
  ```
  text-align:center
  ```
  * 块级元素

  定宽
  ```
  .content{
      width:100px;
      height:50px
      margin 0 auto;
  }
  ```
  不定宽
  ```
  .container{
      text-align:center
  }
  .container .content{
      display:inline-block
  }
  ```
  flex 布局
  ```
   .container {
       display: flex;
       flex-direction: row;
       justify-content: center;
    }
  ```

.wrap 使用 float 是为了让 .wrap 的宽度等于 .inner 的宽度
让 .wrap 的左边在父层的中线上， 让.inner 的左边相对 .wrap 向左移动一半， 这样就可以实现 .inner 在.wrap 的父层的中间。
```
        .wrap {
            background-color: brown;
            float: left; /* 自适应内容宽度，使warp宽度等于inner宽度 */
            position: relative;
            left: 50%;
        }
        .inner {
            position: relative;
            left: -50%;
        }
```


 10. 如何实现垂直居中?

 * 单行文本设置高度等于行高  或者 无需设置height靠padding撑开
 ```
 .content{
     height:10px
     line-height:10px
 }
 .content{
     padding:0 40px;
 }
 ```
  * 设置绝对定位，`top bottom`为`0` ，靠`margin`使其居中

 ```
  .container {
       position: relative;
       width: 400px;
       height: 400px;
   }

 .item {
       position: absolute;
       top: 0;
       bottom: 0;
       margin: auto 0;
       width: 200px;
       height: 200px;
   }
 ```
  * `margin-top = -height/2`

 ```
 .container {
       position: relative;
       width: 400px;
       height: 400px;
       background-color: yellow;
   }

   .item {
       position: absolute;
       top: 50%;
       height: 200px;
       width: 50px;
       margin-top: -100px;
       background-color: green;
   }
 ```

 * 高度未知利用transform上移元素

  ```
  .container {
        position: relative;
        width: 400px;
        height: 400px;
    }

    .item {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
    }
  ```

  * flex布局

  ```
  .container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 400px;
        height: 400px;
        background-color: yellow;
    }
  ```


11. 绝对定位和相对定位，元素浮动后的display值?

    浮动或绝对定位的元素，会被转换成块级元素。相对定位不变,`"position:absolute"` 和 `"position:fixed"` 优先级最高，有它存在的时候，浮动不起作用

12. link和@import引入css的区别?
> 推荐使用link

    * link属于XHTML标签，而@import完全是CSS提供的一种方式,所以 import春装兼容性问题，儿link不存在
    * 当一个页面在加载的时候，link会同时加载，@importh会等到页面全下载完在加载
    * 使用DOM控制样式时的，`document.styleSheets`只能使用link标签，@import无法被dom控制

13. `iline` `block`  `inline-block`区别与特点?
   * 行内元素`display:inline`，设置宽高无效，内容宽高就是容器宽高，自左向右排列，上下margin无效;`img` `a` `span`
   * 块元素`display:block`，总是从新行开始缺省宽高为父容器宽高;`div` `p` `ul`
   * 行内块元素`display:inline-block` 具有行内元素的同行显示特性、也具备块元素的宽高特性;`input`

14. attribute和prototype的区别?

attribute是一个特性节点，每个DOM元素都有一个对应的attributes属性来存放所有的attribute节点，attributes是一个类数组的容器，说得准确点就是NameNodeMap

property就是一个属性，如果把DOM元素看成是一个普通的Object对象，那么property就是一个以名值对(name=”value”)的形式存放在Object中的属性

input中的value attribute的改变会同步到prototype，反之则不会

```
const el = document.getElementById(1);
el.setAttribute('value',6)
console.log(el.value)//6

el.value=8
console.log(el.getAttribute('value'))//6

```


很多元素的attribute都会有一个相对应的prototype属性，例如id class等，它们之间数据双向绑定，无论使用哪种方法都可以访问和修改

```
const el = document.getElementById(1);
el.id=2;
console.log(el.getAttribute('id'))//2

el.setAttribute('id',3)
console.log(el.id)//3
```

对于一些自定义属性，两者便没有关系

```
const el = document.getElementById(1);
el.test=2;
console.log(el.getAttribute('test'))//undefined

el.setAttribute('ok',3)
console.log(el.ok)//undefined

```

`ps:注意IE6-7没有任何区分`


DOM元素一些默认常见的attribute节点都有与之对应的property属性，比较特殊的是一些值为Boolean类型的property，如一些表单元素

```
<input type="radio" checked="checked" id="raido">
var radio = document.getElementById( 'radio' );
console.log( radio.getAttribute('checked') ); //checked
console.log( radio.checked ); // true

```

推荐使用prototype，操作简单方便，自动处理布尔类型attribute的转换



15. CSRF跨站请求伪造[CSRF攻击](https://zhuanlan.zhihu.com/p/22521378?utm_medium=social&utm_source=qq)

诱导用户在不知情的情况下冒用其身份发起一个请求(用户过分信任网站)

原理：攻击者知道了网站后台某个功能的请求地址，诱导用户点击或自动加载(嵌入img标签)，用户在不知情登陆下访问了该地址，会被服务器误认为是用户的合法操作。

防范：`csrf-token`

 * 服务端在收到路由请求时，生成一个随机数，在渲染请求页面时把随机数埋入页面（一般埋入 form 表单内，<input type="hidden" name="_csrf_token" value="xxxx">）
 * 服务端设置setCookie，把该随机数作为cookie或者session种入用户浏览器
 * 当用户发送 GET 或者 POST 请求时带上_csrf_token参数（对于 Form 表单直接提交即可，因为会自动把当前表单内所有的 input 提交给后台，包括_csrf_token）
* 后台在接受到请求后解析请求的cookie获取_csrf_token的值，然后和用户请求提交的_csrf_token做个比较，如果相等表示请求是合法的。


16. XSS跨站脚本攻击[XSS](https://www.cnblogs.com/dsky/archive/2012/04/06/2434768.html)

 XSS本质是html注入，输入一个带有特殊标识，能够被客户端识别为指令的输入(网站过分信任用户)

 原理：在页面恶意植入`script`代码

 分为两大类，一类是存储型XSS，其具体流程是，用户输入恶意脚步->传入服务器->存入数据库->其他人访问；另一类是反射型XSS，将脚本代码加入URL地址的请求参数里，请求参数进入程序后在页面直接输出，用户点击类似的恶意链接就可能受到攻击。

 防范：完善输入过滤体系，存储用户数据时进行html标签转换

17. `overflow:hidden`
   * 可以创建一块BFC区域，防止包裹浮动元素时高度坍塌
   * 隐藏溢出

18. `display:none`和`visibility:hidden`
   * `display:none` 元素不可见且不占据空间，不影响其他元素布局
   * `visiblity:hidden` 元素不可见 但是依旧占据空间，影响其他元素布局
19. `inline-block`间隙问题

```
<div style="display: inline-block;width: 50px;height: 50px;background-color: yellow;">a</div>
<div style="display: inline-block;width: 50px;height: 50px;background-color: red">b</div>
<div style="display: inline-block;width: 50px;height: 50px;background-color: blue">c</div>
```
`display:inline-block`的元素水平排列会产生间隙

  * 产生原因：书写的时候标签段之间的空格。
  * 方案一:<div><div>同行书写即可，但不便于阅读所以不可取
  * 方案二:`margin`负值(-5px)，但是此值不易把握，不建议采用
  * 方案三:`font-size:0`
  * 方案四:`letter-spacing: -4px;`,字符间距
  * 方案四:`word-spacing: -4px;`，单词间距
