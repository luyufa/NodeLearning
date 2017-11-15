## css三栏布局

![1](https://github.com/luyufa/NodeLearning/blob/master/css/layout/1.png)

#### 1. 流体布局

> `left` `right`模块分别浮动，`main`适配`margin-left` `margin-right`，`main`只能最后加载

 ```
.left {
        float: left;
        width: 200px;
        height: 200px;
        background-color: yellow;
    }

    .right {
        float: right;
        width: 300px;
        height: 200px;
        background-color: #0A9FD7;
    }

     .main {
        margin-left: 210px;
        margin-right: 310px;
        height: 200px;
        background-color: green;
    }
```

 ```
<div class="left"></div>
<div class="right"></div>
<div class="main"></div>
```

#### 2. overflow:hidden
`left` `right`模块分别浮动，`main`隐藏溢出部分，`main`只能最后加载

>

 ```
    .left {
        float: left;
        margin-right: 10px;
        width: 200px;
        height: 200px;
        background-color: yellow;
    }

    .right {
        float: right;
        margin-left: 10px;
        width: 300px;
        height: 200px;
        background-color: #0A9FD7;
    }

    .main {
        height: 200px;
        background-color: green;
        overflow: hidden;
    }
 ```
 ```
 <div class="left"></div>
 <div class="right"></div>
 <div class="main"></div>
 ```


#### 3. Flex

> `flex`布局`left` `right`固定大小，`main`自由放大适配剩余空间，`left`设置`order`排序在第一位，`main`可优先加载，主要存在兼容性问题，主流趋势

 ```
    .container {
        display: flex;
    }

    .left {
        flex: 0 1 200px;//放大 缩小 占据主轴空间
        margin-right: 10px;
        order: -1;
        height: 200px;
        background-color: yellow;
    }

    .right {
        flex: 0 1 300px;
        margin-left: 10px;
        height: 200px;
        background-color: #0A9FD7;
    }

    .main {
        height: 200px;
        flex-grow: 1;
        background-color: green;
    }
 ```


 #### 4. table

 > 无法设置栏间距(`margin`)、`main`模块并非优先加载

 ```
     .container {
        display: table;
        width: 100%;
    }

    .left, .right, .main {
        display: table-cell;
    }

    .left {
        width: 200px;
        height: 200px;
        background-color: yellow;
    }

    .right {
        width: 300px;
        height: 200px;
        background-color: #0A9FD7;
    }

    .main {
        height: 200px;
        background-color: green;
    }
 ```

 ```
 <div class="container">
    <div class="left"></div>
    <div class="main"></div>
    <div class="right"></div>
</div>
 ```


 #### 5. absolute

 > 绝对布局，简单实用 `main`可以优先加载

 ```
     .container {
        position: relative;
    }

    .left, .right {
        position: absolute;
    }

    .left {
        left: 0;
        top: 0;
        width: 200px;
        height: 200px;
        background-color: yellow;
    }

    .right {
        right: 0;
        top: 0;
        width: 300px;
        height: 200px;
        background-color: #0A9FD7;
    }

    .main {
        margin-left: 210px;
        margin-right: 310px;
        height: 200px;
        background-color: green;
    }
 ```

 ```
 <div class="container">
    <div class="main"></div>
    <div class="left"></div>
    <div class="right"></div>
</div>
 ```



 #### 6. 圣杯布局


  ```
  <div class="container">
    <div class="main"></div>
    <div class="left"></div>
    <div class="right"></div>
</div>
  ```

   1. 首先框架基本搭建，三栏装进去，接下来要做就是把左右模块“拉”上去

   ```
        .container {
        margin-left: 200px;
        margin-right: 300px;
        height: 200px;
    }

    .left, .right, .main {
        float: left;
    }

    .main {
        width: 100%;
        height: 200px;
        background-color: green;
    }

    .left {
        width: 200px;
        height: 200px;
        background-color: yellow;
    }

    .right {
        width: 300px;
        height: 200px;
        background-color: #0A9FD7;
    }
   ```
 ![2](https://github.com/luyufa/NodeLearning/blob/master/css/layout/2.png)

  2. 移动`left`模块，先设置`margin-left:-100%`

  ```
  .left {
        margin-left: -100%;
        width: 200px;
        height: 200px;
        background-color: yellow;
    }

  ```
  ![3](https://github.com/luyufa/NodeLearning/blob/master/css/layout/3.png)

  3. 利用相对定位距container右边left自身宽度

  ```
  .left {
        margin-left: -100%;
        position: relative;
        right: 200px;
        width: 200px;
        height: 200px;
        background-color: yellow;
    }

  ```

![4](https://github.com/luyufa/NodeLearning/blob/master/css/layout/4.png)

 4. 相同的方法提升`right`模块,设置`right`模块`margin-right:自身宽度`

  ```
  .right {
        margin-right: -300px;
        width: 300px;
        height: 200px;
        background-color: #0A9FD7;
    }
  ```

![5](https://github.com/luyufa/NodeLearning/blob/master/css/layout/5.png)


#### 7. 双飞翼布局

```
<div class="main-wrapper">
    <div class="main">main</div>
</div>
<div class="left">left</div>
<div class="right">right</div>
```

 1. 首先框架基本搭建，三栏装进去，接下来要做就是把左右模块“拉”上去

```
    .main-wrapper {
        float: left;
        width: 100%;
    }

    .main {
        height: 200px;
        margin-left: 200px;
        margin-right: 300px;
        background-color: green;
    }

    .left {
        width: 200px;
        /*margin-left: -100%;*/
        float: left;
        height: 200px;
        background-color: yellow;
    }

    .right {
        /*margin-left: -300px;*/
        float: left;
        width: 300px;
        height: 200px;
        background-color: #0A9FD7;
    }
```
![6](https://github.com/luyufa/NodeLearning/blob/master/css/layout/6.png)


 2. 设置`left` `margin-left:-100%`(浏览器宽度|最外层)

```
 .left {
        width: 200px;
        margin-left: -100%;
        float: left;
        height: 200px;
        background-color: yellow;
    }
```
 ![7](https://github.com/luyufa/NodeLearning/blob/master/css/layout/7.png)


 3. 设置`right` `margin-left:rightWidth`

```
 .right {
        margin-left: -300px;
        float: left;
        width: 300px;
        height: 200px;
        background-color: #0A9FD7;
    }
```
 ![8](https://github.com/luyufa/NodeLearning/blob/master/css/layout/8.png)
