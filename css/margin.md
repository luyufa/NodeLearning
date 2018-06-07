## margin合并与负边距

#### margin合并
> 毗邻的两个块元素垂直方向上margin会叠加

* 毗邻:没被非空内容、padding、border、clear分割开的
* 普通流:除去浮动、绝对定位的其他代码

* 兄弟元素
![1](1)
   1. 普通流中一个元素的 `margtin-bottom` 和它的紧邻的兄弟元素的的 `margin-top`

* 父子元素
![2](2)

  1. 一个元素的`margin-top`和它的第一个子元素的`margin-top`
  2. 一个元素`height:auto `的 `margin-bottom` 和它的最后一个子元素的`margin-bottom`

* 空元素
![3](3)
  1. 一个没有创建 `BFC`、`没有子元素`、`height:0`的元素自身的 `margin-top` 和 `margin-bottom`



ps:特别注意

```
 <div style="margin-bottom: 200px;height: 50px;background-color: yellow">
            <div style="margin-bottom: 100px">
            </div>
</div>
```
1. 子元素的自身`margin-bottom:100px`和`margin-top:0px`合并为`margin-top:100px`
2. 然后子元素合并后的`margin-top:100px`再和父元素的`margin-top:0px`合并最终导致父元素上方产生`margin-top`



###### 防止合并技巧
* 创建了 `BFC` 的元素不会和它的子元素发生外边距叠加(以下三者都会创建`BFC`)
  * 浮动元素和其他任何元素之间不发生外边距叠加 (包括和它的子元素).
创建了
  * 绝对定位元素和其他任何元素之间不发生外边距叠加(包括和它的子元素)
  * `inline-block` 元素和其他任何元素之间不发生外边距叠加 (包括和它的子元素)

* `padding` 或 `border`
* 写结构的时候最好用一个方向，要不都 top 要不都 bottom




#### margin负边距
> 当元素的`margin-top`或`margin-left`为负时会引起元素向前拉(`上`或`左`)；当`margin-right`或`margin-bottom`为负时会导致该`元素右边`或`该元素下边`的元素向前拉(可以看做自身宽度减小了)。



```
 .box {
        width: 100px;
        height: 100px;
        background-color: yellow;
    }
```
 ![1](https://github.com/luyufa/NodeLearning/blob/master/css/margin/1.png)

```
.box {
        width: 100px;
        height: 100px;
        background-color: yellow;
        margin-left: -50px;
        margin-top: -50px;
    }
```
![2](https://github.com/luyufa/NodeLearning/blob/master/css/margin/2.png)
这里的负边距使box感觉被嵌进浏览器了


```
 .box {
        width: 100px;
        height: 100px;
        background-color: yellow;
    }

    .item {
        width: 100px;
        height: 100px;
        background-color: green;
    }
```
![3](https://github.com/luyufa/NodeLearning/blob/master/css/margin/3.png)
两个垂直排列的div在使用负边距之后

```
 .box {
        width: 100px;
        height: 100px;
        background-color: yellow;
        margin-bottom: -50px;
        margin-right: -50px;
    }

    .item {
        width: 100px;
        height: 100px;
        background-color: green;
    }
```

![4](https://github.com/luyufa/NodeLearning/blob/master/css/margin/4.png)
元素自身位置并未发生变化，但是使他下边的div往上拉了


###### [Collapsing margins——合并的外边距](https://geekplux.com/2014/03/14/collapsing_margins.html)