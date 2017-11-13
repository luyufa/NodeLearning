#### 行内元素

行内元素或标签内文本通过给父元素设置`text-align:center`


#### 块级元素

1. 定宽
  ```
  .container {
        height: 100px;
        width: 500px;
        margin: 0 auto;//margin-left 与 margin-right 设置为 auto
    }
  ```


2. 不定宽

 * 设置元素为`inline-block`,同时设置父元素为`text-align:center`

  ```
     .container {
        height: 100px;
        width: 500px;
        text-align: center;
    }

    .container item {
        width: ???px
        display: inline-block;
    }
  ```

 * 设置父元素 float,然后给父元素设置 position:relative 和 left:50%，子元素设置 position:relative 和 left: -50% 来实现水平居中

  ```
   .container {
        float: left;
        position: relative;
        left: 50%;
    }

    .container item {
        position: relative;
        left: -50%;
        width: ???px;
    }
  ```



