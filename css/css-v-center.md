## 垂直居中

#### 单行文本、行内元素

1. 设置`line-height`等于`height`

 ```
.container {
        height: 100px;
        line-height: 100px;
        overflow: hidden;
    }
```

2. 无需设置`height`靠`padding`撑开

 ```
.container {
        padding: 40px 0;
    }
```

#### 块级元素(高度已知)

1. `top`和`bottom`同时为`0`导致`margin`使其居中

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

2. `margin-top = height/2`

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


#### 块级元素未知高度

`transform: translateY(-50%)`上移50%

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


#### flex

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