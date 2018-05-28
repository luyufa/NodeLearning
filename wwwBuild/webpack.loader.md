## webpack loader

###### sass-loader
> 把scss/sass文件编译成css文件

 `npm install sass-loader node-sass --save-dev`

 ```
{
    module:{
        rules:[
           {
               test:/\.scss$/,
               use:['style','css','sass']
           }
        ]
    }
}
```

###### css-loader style-loader
> 先打包成css文件，再通过`<style>`标签注入`css`到`dom`中

 `npm install --save-dev css-loader`

 ```
 {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [ 'style-loader',
               {
                  loader:'css-loader',
                  options:{
                      minimize:true, css压缩优化
                      sourceMap:true
                  }
               }
         ]
      }
    ]
  }
}
```

###### file-loader url-loader
> `url-loader`将小于limit的图片打包称为`Data URL`内嵌在`css`中，如果大于则使用`file-loader`


`Data URL` 由四个部分组成：前缀（数据:)，指示数据类型的`MIME`类型，如果非文本则为可选的base64令牌，数据本身：

数据格式 `data:[<mediatype>][;base64],<data>`


1. 当图片体积小且没有重复使用时，占用一个http会话不值得(很多浏览器限制了http并发数，大多为4)
2. base64编码会比原数据(二进制)大1/3左右
3. Data URL 不会被浏览器缓存(可以通过放到css文件中，css会被缓存)
4. 如果页面图片需要根据用户动态显可以使用Data URL （例如注册页面的验证码图片）

`npm install --save-dev url-loader file-loader`

```
     {
         test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
         loader: 'file-loader'
     },

    {
         test: /\.(png|jpe?g|gif|svg)(\?\S*)?$/,
         loader: 'url-loader',
         options: {
             name: '[name].[ext]?[hash]'
             limit: 8192
         }
    }
```


###### babel-loader
>将js代码转换为指定版本

`npm install babel-loader babel-core babel-preset-env webpack`

```
    {
        test: /\.js$/,
        loader: 'babel-loader?cacheDirectory ',
        exclude: /node_modules/
    },
```
`cacheDirectory`开启缓存加速编译


`.babelrc`(默认读取里面的配置文件)
```
{
  "plugins": [
    "transform-runtime"
  ],
  "presets": [
    "es2015",
    "stage-2"
  ]
}
```
编译顺序
* `plugings`优先于`presets`编译
* `plugins`按照数组的index增序
* `presets`倒叙


默认下`bable-loader`会在每一个转换的文件中插入辅助代码，采用`transform-runtime`将禁止在每个文件中插入辅助代码，而是从这里引用

如何选择`presets`
* 要编译ES7
 1. `stage-3`支持`async await`语法 支持`**`幂操作
 2. `stage-2` 覆盖了`stage-3`，同时增加了解构赋值的扩展`transform-object-rest-spread`
 ```
 const a={a:1},b={b:2,...a}
 console.log(b)//{b: 2, a: 1}
 ```
 3 `staeg-1 stage-0`,依次覆盖下一版本

 * 要编译ES6
 1. `es2015`


###### vue-loader

1. 当`vue-loader`检测到项目存在`babel-loader`时，将会使用它来处理`.vue`文件的`<script>`部分
2. `css`作用域，当一个`<style>`标签具有`scoped`属性时，它的`css`将只应用于当前组件的元素，可以在同一个vue文件同时存在全局样式和本地样式
```
<style>
/* 全局样式 */
</style>

<style scoped>
/* 本地样式 */
</style>
```
3. 使用`scoped`后，父组件的样式不会渗透到子组件，不过一个子组件的根节点会同时受其父组件的 scoped CSS 和子组件的 scoped CSS 的影响这样设计是为了让父组件可以从布局的角度出发，调整其子组件根元素的样式
4. 深度作用选择器`>>>` `/deep/`
```
.css >>> x
.scss /deep/
```
5. css module ,必须通过向 css-loader 传入 modules: true 来开启
```
<style module>
.red {
  color: red;
}
.bold {
  font-weight: bold;
}
</style>
<template>
  <p :class="$style.red">
    This should be red
  </p>
</template>
```