## 浮动
> 浮动元素自动变成block元素

#### 文档标准流动模型
1. block元素独占1行自上至下排列
2. inline元素自左至右排列自动换行


#### 浮动(float)

浮动模型即是让div脱离标准流动模型，和标准流动模型不是一个层次

![标准流下的div](https://github.com/luyufa/NodeLearning/blob/master/css/float/1.png)


对div2设置了`float:left`左浮动可以看做是漂浮起来向左排列，此时div1和div3按照标准流排列

![一个元素左浮动](https://github.com/luyufa/NodeLearning/blob/master/css/float/2.png)

同时对div2和div3设置左浮动，则div2和div3脱离标准流

![多个元素左浮动](https://github.com/luyufa/NodeLearning/blob/master/css/float/3.png)

当浮动的div上一个元素是浮动元素，那么该div紧跟着上一个浮动元素；如果浮动的div上一个元素是标准流中的元素，那么该div相对垂直位置不会改变（该div的顶部和上一个元素的底部齐平）

![前后左右](https://github.com/luyufa/NodeLearning/blob/master/css/float/4.png)

#### 清除浮动(clear)
> `clear : none | left | right | both`,清除浮动可以理解为打破横向排列。

clear清除浮动只能影响使用clear元素本身，不能影响其他元素。

```
 .c {
        width: 300px;
        height: 100px;
        background-color: yellow;
        float: left;
        clear: left;
    }
```
表示class=c的div左边不能有浮动元素

![清除浮动](https://github.com/luyufa/NodeLearning/blob/master/css/float/5.png)


父容器高度塌陷
```
.warp {
            border: 1px solid black;
            background-color: #00a1ea;
        }
        .box {
            float: left;
            width: 50px;
            height: 50px;
            margin: 5px;
            background-color: yellow;
        }
 <div class="warp">
    <div class="box"></div>
    <div class="box"></div>
    <div class="box"></div>
</div>
```
![父元素高度塌陷](https://github.com/luyufa/NodeLearning/blob/master/css/float/11.png)


```
.warp {
            border: 1px solid black;
            background-color: #00a1ea;
        }
        .box {
            float: left;
            width: 50px;
            height: 50px;
            margin: 5px;
            background-color: yellow;
        }
 <div class="warp">
    <div class="box"></div>
    <div class="box"></div> //clear:left 高度依旧塌陷
    <div class="box"></div>
    <div style="clear:left"> // 可以正确计算高度
</div>
```
![clear恢复父容器高度](https://github.com/luyufa/NodeLearning/blob/master/css/float/12.png)

clear:left属性只是消除其左侧div浮动对它自己造成的影响，而不会改变左侧div甚至于父容器的表现，在父容器看来，三个div还都是float的，所以高度依旧塌陷。但是我们在最后添加了一个非浮动的div，由于它有clear:left属性，所以它会按照左侧div不浮动来定位自己，也就是定位到下一行，而父容器看到有一个非浮动、普通流的子元素元素，会将其包围，这样造成了顺便也把三个浮动元素也包裹起来的效果，高度不再塌陷
