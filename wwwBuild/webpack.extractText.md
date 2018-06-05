## webpack抽离css
> css请求并行、css单独缓存、额外的http请求

```
const ExtractTextPlugin = require("extract-text-webpack-plugin");


module.exports={
    module:{
      rules:[
       {
           test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        scss: ExtractTextPlugin.extract({
                            use: 'css-loader?minimize!sass-loader',
                            fallback: 'vue-style-loader'
                        }),
                        css: ExtractTextPlugin.extract({
                            use: 'css-loader?minimize',
                            fallback: 'vue-style-loader'
                        })
                    }
                }
       },
       {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader?minimize']
                })
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader?minimize', 'sass-loader']
                })
            }
    ]
    },
    plugins:[
     new ExtractTextPlugin({
        allChunks: true,
        filename: '[name].[contenthash].css'
    }),
    ]
}
```

* 当**code splite**时`allChunks:true`
* `fallback` 当设置禁用`disable:ture`时，便会采用`fallback`来处理，即这里使用`style-loader`将解析完的`css`放在·style·标签内并插入`head`中


###### 参考文档
[官方文档-ExtractTextWebpackPlugin](https://webpack.docschina.org/plugins/extract-text-webpack-plugin/)