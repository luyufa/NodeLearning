## CSS 外边距margin


#### 负边距

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
