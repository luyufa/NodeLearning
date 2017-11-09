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
> `clear : none | left | right | both`

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