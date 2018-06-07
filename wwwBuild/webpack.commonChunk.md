## webpack 代码分包
> 抽取js和css

##### chunk
> 多个模块打包后的集合称为chunk

* 入口文件(`entry`)即`entry chunk`
* 入口文件以及它的依赖文件里通过 code split 分离出来／创建的也是 `chunk`，可以理解这些 `chunk` 为 `children chunk` 。
* `CommonsChunkPlugin` 创建的文件也是 `chunk`，即 `commons chunk`


##### 公共代码提取
> 将常用库与公共模块抽出来与业务代码分割

**1. 最简单粗暴的打包**
```
{
     entry: {
        main: path.join(__dirname, 'main.js')
    },
    plugins:[]
}
```
![1](https://github.com/luyufa/NodeLearning/blob/master/wwwBuild/img/1.png)

此时业务代码和公共库是全部混在一起的，其一是业务代码长变动，而公共库基本保持不变，因此混在无法更好的利用**强制缓存**来提高网站性能，其二是如多个模块引用同一个第三方模块，那么会导致该第三方模块被**下载多次**。


**2. 手动分离**

```
{
     entry: {
        main: path.join(__dirname, 'main.js'),
        vendor: ['lodash'],
    },
    plugins:[
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
        })
    ]
}
```
![2](https://github.com/luyufa/NodeLearning/blob/master/wwwBuild/img/2.png)

此时业务代码`main`和`vendor`已经成功分离，但是随着第三方模块增加，我们必须每次往`vendor`中加入模块名称，这样`entry`便不容易维护

###### name

`CommonsChunkPlugin`可以是已经存在的 `chunk` 的 `name` （一般是入口文件），那么共用模块代码会合并到这个已存在的 `chunk`；否则，创建名字为 `name` 的 `commons chunk` 来合并,我们这里把分割出来的代码合并到名为`vendor`的`chunk`中


**3. 自动分离**

```
{
    entry: {
        main: path.join(__dirname, 'main.js')
    },
    plugins:[
         new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: module => {
                return module.resource && /node_modules/.test(module.resource)
            }
        })
    ]
}
```
![3](https://github.com/luyufa/NodeLearning/blob/master/wwwBuild/img/3.png)

可以看到此时效果和手动一模一样

###### minChunks
* `number`，共用模块被多少个 chunk 使用才能被合并
* `function`
```
function(module,count){
     count >= 2 // 被count个chunk共用才合并
     module.resource && /node_modules/.test(module.resource) 合并node_modules目录下的
}
```


**4. require.ensure懒加载公共模块**

我们在`main.js`中懒加载一个`c.js`(`c.js`中引用`moment`模块)
```
require.ensure([],require=>require('./c.js'),'c')
```
![4](https://github.com/luyufa/NodeLearning/blob/master/wwwBuild/img/4.png)

此时发现，在打包的`c.chunk.js`中依然包含`node_modules`中的代码

###### async
`async` 把懒加载模块中(只有 `code splitting` 產生的 `bundles` 才會成為目标即`children chunk`)的公共代码抽出来

```
{
    entry: {
        main: path.join(__dirname, 'main.js')
    },
    plugins:[
         new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: module => {
                return module.resource && /node_modules/.test(module.resource)
            }
        })
         new webpack.optimize.CommonsChunkPlugin({
            async: 'async',
            minChunks: module => {
                return module.resource && /node_modules/.test(module.resource)
            }
        })
    ]
}
```

#####  webpack runtime提取

问题：在只修改业务代码时，而不改动库代码时，打包出的库代码的`chunkhash`也发生变化，导致浏览器端的长缓存机制失效

原因：这主要是因为使用`CommonsChunkPlugin`提取代码到新的`chunkhash`时，会将`webpack runtime`也提取到打包后的新的`chunkhash`


```
{
    entry: {
        main: path.join(__dirname, 'main.js')
    },
    plugins:[
         new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: module => {
                return module.resource && /node_modules/.test(module.resource)
            }
        })
         new webpack.optimize.CommonsChunkPlugin({
            async: 'async',
            minChunks: module => {
                return module.resource && /node_modules/.test(module.resource)
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: "runtime",
            minChunks: Infinity
        })
    ]
}
```

如上配置项会将项目中`entry chunk`、`children chunk`、`runtime`分别抽出来，这样修改业务代码便不会导致共公库代码的hash变化




###### CommonsChunkPlugin中各个参数

* `name`
* `filenames`  保存到磁盘的`commons chunk`文件名
* `chunks` 指定`source chunk`，默认为所有`entry chunks`。
* `minChunks`
* `async`
* `children` `children` 设为 `true` 时，指定 `source chunks` 为 `children chunk`


###### 参考链接
* [webpack优化与使用](https://github.com/creeperyang/blog/issues/37)
* [webpack大法之code split](https://zhuanlan.zhihu.com/p/26710831?refer=ElemeFE)
