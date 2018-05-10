## BFC
> `Block formating context`=`block level box`+`formating context`

##### BFC是什么？

 * `block level box`块级元素，`display`属性为`block`、`list-item`、`table`的元素称为`block level box`，他们会参与`block formating context`(`BFC`)
 * `inline level box`行内元素，`dispaly`属性为`inline`、`inline-block`、`inline-table`的元素称为`inline level box`，他们会参与`inline formating context`(`IFC`)

`BFC`规定了一块相互独立的区域，拥有自己的渲染规则，决定了其内的`block level box`的定位、相互关系。


##### 如何生成BFC?

 * 根元素
 * `float`不为`none`
 * `overflow`不为`visible`
 * `postion`为`absolute`、`fixed`
 * `display`为`inline-block`、`table-cell`、`table-caption`

只有元素满足以上任意规则，则会生成一块BFC区域

##### BFC中的规则

 1. 每个box左边margin总是与BFC区域左边border接触，即时浮动元素也是
 2. BFC区域与float元素不会重叠
 3. 计算BFC高度时，浮动子元素也参与
 4. 内部的box会垂直排列
 5. 垂直方向的margin会发生塌陷
 6. BFC是页面上独立区域，容器内的元素不会影响容器外的，反之亦然


##### BFC规则应用

1. 每个box左边margin总是与BFC区域左边border接触，即时浮动元素也是

```
        .warp {
            border: 1px solid black;
            height: 100px;
            width: 200px;
        }
        .left {
            width: 100px;
            height: 80px;
            float: left;
            background-color: #00A000;
        }
        .main {
            height: 100px;
            width: 200px;
            background-color: #00a1ea;
        }

<div class="warp">
    <div class="left"></div>
    <div class="main"></div>
</div>
```

![1](https://github.com/luyufa/NodeLearning/blob/master/css/bfc/1.png)


2. BFC区域与float元素不会重叠

```
 .warp {
            border: 1px solid black;
            width: 300px;
        }
        .left {
            width: 100px;
            height: 80px;
            float: left;
            background-color: #00A000;
        }
        .main {
            overflow: hidden;
            height: 100px;
            width: 200px;
            background-color: #00a1ea;
        }

<div class="warp">
    <div class="left"></div>
    <div class="main"></div>
</div>
```

给`.main`增加`overflow:hidden`使之生成BFC区域，故与float元素不发生重叠

![2](https://github.com/luyufa/NodeLearning/blob/master/css/bfc/2.png)


3. 计算BFC高度时，浮动子元素也参与

```
 .warp {
            border: 1px solid black;
            width: 300px;
        }
        .left {
            width: 200px;
            height: 100px;
            float: left;
            background-color: #00A000;
        }

<div class="warp">
    <div class="left"></div>
    <div class="left" style="background-color: #00a1ea"></div>
    <div class="left" style="background-color: yellow"></div>
</div>
```
![3](https://github.com/luyufa/NodeLearning/blob/master/css/bfc/3.png)

此时`.warp`并没有`height`，当把`.warp`加上`orverflow:hidden`时生成一块BFC区域，其内的浮动元素也参与计算高度

```
 .warp {
            border: 1px solid black;
            width: 300px;
        }
        .left {
            width: 200px;
            height: 100px;
            float: left;
            background-color: #00A000;
        }
<div class="warp">
    <div class="left"></div>
    <div class="left" style="background-color: #00a1ea"></div>
    <div class="left" style="background-color: yellow"></div>
</div>
```
![4](https://github.com/luyufa/NodeLearning/blob/master/css/bfc/4.png)


4. 内部的box会垂直排列

.....这个不多解释了

5. 垂直方向的margin会发生塌陷

```
.box {
            width: 50px;
            height: 50px;
            margin: 50px;
            background-color: yellow;
        }

<div class="box"></div>
<div class="box"></div>
```
![5](https://github.com/luyufa/NodeLearning/blob/master/css/bfc/5.png)

同一个BFC中的Box会发生marign塌陷，所以给其中一个放入另一个BFC内即可

```
  .box {
            width: 50px;
            height: 50px;
            margin: 50px;
            background-color: yellow;
        }

        .warp {
            overflow: hidden;
        }

<div class="warp">
    <div class="box"></div>
</div>
<div class="box"></div>
```
![6](https://github.com/luyufa/NodeLearning/blob/master/css/bfc/6.png)