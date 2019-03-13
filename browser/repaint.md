## 浏览器重排重绘
>本文主要结合demo分析浏览器重排和重绘，以及如何提升js操作dom性能。主要问题就一个看下面。

* 如何插入1000div结点到body里？


##### 浏览器渲染过程
 本文开始之前先提一下浏览器渲染过程，在下面五个过程中，其实主要消耗是在**布局**和**绘制**统称为渲染

 1. 解析Html，构造DOM树

 2. 解析CSS，构造CSSOM树

 3. CSSOM+DOM合成渲染树

 4. Layout布局

 5. paint绘制

##### 重排和重绘

 当页面发生如下变动时

  1. 页面初始化

  2. 修改DOM，删除新增可见结点

  3. 修改样式，位置、内外边距、宽高、边框、外观

  4. 鼠标悬停、页面滚动、输入框键入文字、改变窗口等事件

 浏览器会重新渲染，如果需要元素尺寸、位置需要重新计算则会发生**重排reflow**，如果仅是影响元素外观、样色等不涉及位置大小的属性这是仅会发生**重绘repaint**。注意重排必定重绘，重绘未必重排。

 ```
 div.style.color='red' 重绘
 div.style.width=10px  重排+重绘
 div.style.height=(div.style.height+10)px 重绘+重排
 ```

 这里简单的几次操作居然引起了浏览器多次重排和重绘，这样的话性能消耗是急剧增加的。所以浏览器有个很聪明的做法是把这些需要重绘和重排变动都放入一个`queue`中，在一个合适的时机进行，这样等价于把多次变动变为了一次，大大提升了性能。

 有时候我们需要立即获取到浏览器的位置，即需要它立即重排，所以当发生如下操作时会`flush queue`，立即把之前的变动执行。

  * offsetTop、offsetLeft....

  * scrollTop/Left/Width/Height

  * clientTop/Left/Width/Height

  * width,height

  * getComputedStyle()



##### 降低重排重绘次数

1. 属性的读写操作不要穿插，读放到一起，写放到一起，且不要经常访问会引起浏览器flush队列的属性

```
bad
div.style.left = (div.style.left + 10)px 这当于先flush queue了
div.style.top = (div.style.top + 10)px

good

const left=div.style.left,top=div.style.top
div.style.left = (left + 10)px
div.style.top = (top + 10)px
```
实例代码

```
const box = document.querySelector('#box')

    console.time(1);
    const count = 10000;
    for (let i = 0; i < count; i++) {
        box.style.width = (box.offsetWidth + i) + 'px';
        box.style.height = (box.offsetHeight + i) + 'px';
    }
    console.timeEnd(1)

    console.time(2);
    const count = 10000;
    for (let i = 0; i < count; i++) {
        let width = box.offsetWidth, height = box.offsetHeight;
        box.style.width = (width + i) + 'px';
        box.style.height = (height + i) + 'px';
    }
    console.timeEnd(2)

在chrome下测试得出
1:768+ms
2:396+ms
```
上面结果不难看出，第二张远比第一种性能高大约1倍，至于为何，大概猜测下是由于1中每次循环`flush queue`2次，而第二张种中每次循环`flush queue`1次。

2. 不要单独改变样式，整个改变后修改className

```
bad
var left = 10;
var top = 10;
el.style.left = left + "px";
el.style.top  = top  + "px";

good
el.className += " theclassname";
```

3. 使用Document Fragement来进行大量DOM操作



##### 如何插入100div结点到body里

* 直接插入

```
console.time(3)
const count = 1000;
for (let i = 0; i < count; i++) {
    const li = document.createElement('li');
    li.innerHTML = `--${i}--`;
    box.appendChild(li);
    //console.log(li.offsetHeight);
}
console.timeEnd(3)
```

* 字符串拼接插入

```
console.time(4)
const count = 1000;
let str = '';
for (let i = 0; i < count; i++) {
    str += `<li>--${i}--</li>\n`
}
const li = document.createElement('li');
li.innerHTML = str;
box.appendChild(li);
console.timeEnd(4)
```

* documentFragment

```
console.time(5)
const count = 1000;
const fragment = document.createDocumentFragment();
for (let i = 0; i < count; i++) {
    const li = document.createElement('li');
    li.innerHTML = `--${i}--`;
    fragment.appendChild(li);
    //console.log(li.offsetHeight);
}
box.appendChild(fragment);
console.timeEnd(5)
```

以上在count=10000时测试结果分别为 **55ms**  **21ms**  **56ms**，是不是很失望？不是说使用`documentFragment`可以提升dom操作的性能么，怎么这里和直接插入没区别呢？先别着急我们先看字符串插入，这个无疑是效率最高但是维护性最差不需要解释吧。

* `box.appendChild` 把结点放到dom树中，被append进去的元素的样式表的计算是同步发生的，此时getComputedStyle可以得到样式的计算值，但是现代浏览器比较聪明，当你没有引起`flush queue`的操作时，他会等脚本执行完后再同一渲染。

* `fragment.appendChild` 把结点放到`fragment`中最后在放到dom树中,在进行渲染

从上面两点应该能明白为什么两者时间差不多了吧。

那现在我们就来引起`flush queue`，把上面代码中的注释去掉，来看下运行结果(count=1000)

* 直接插入

```
输出30
时间734ms+
```

* documentFragment

```
输出0
时间230ms+
```

此时差别出来了，注意第一种是获取到height为30的(即渲染了)，而后者高依旧是0(没有渲染)。



##### 参考

* [DocumentFragment真的能提高 JS 动态添加 DOM 的性能吗？](https://www.zhihu.com/question/27260165)

* [网页性能管理详解](http://www.ruanyifeng.com/blog/2015/09/web-page-performance-in-depth.html)





