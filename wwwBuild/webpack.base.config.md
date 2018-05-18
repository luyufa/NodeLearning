## webpack 基本配置

###### 1. entry
```
入口文件，webpack构建开始的第一步
类型可选为 string | obejct | arrary
{
    entry:'index.js',
    entry:['index1.js','index2.js'],
    entry:{
        chunkName1:'index1.js',
        chunkName2:'index2.js'
    }
}
```

`webpack`为生成的每个`chunk`起一个名字
 * 如果`entry`是`string`或`array`，只会生成一个`chunk`，并且名字为`main`
 * 如果`entry`是`object`，则会生成多个`chunk`，每个`chunk`的名字为`object key`

###### 2. output
```
{
    输出文件目录，输出文件在磁盘的存放目录，必须是绝对路径
    path:path.resolve(__dirname,'dist'),

    输出文件名
    filename:'bundle.js', 直接指定生成文件名
    filenmae:'[name].js', string | arrayr = > main 或者 obejct => key
    filename:'[hash:8].js', 文件唯一标识hash
    filename:'[chunkhash:8].js' 文件内容生成hash 可以指定长度默认20

    资源的url前缀 string类型
    publicPath:'' 根目录下
    publicPath:'/assest' 指定目录下
    publicPath:'https:/cdn.com' CDN下


}
```

###### 3. moudle
```
{
    rules:[
    {
        test:/\.js$/,正则匹配要使用loader的文件
        include:[path.resolve('...')], 只会命中里面的文件
        exclude:[path.resolve('...')], 忽略里面的文件

        use:[ 从后自前执行
            'style-loader?query', 通过url querystring 的方式传入参数
            {
                loder:'css-loader', 通过对象传入参数
                options:{
                    min:'xx'
                }
            }
        ]
    }
    }
  ],
  noParse:[忽略的解析模块
      /special-library\.js$/
  ]
}
```



###### 4. plugin
```
{
    plugins:[]
}
```

###### 5. resolve

```
{
    modules:[ 寻找模块的根目录
       'node_modules',
        path.resolve(__dirname, 'app')
    ],
    extensions:['.js','.json','.vue'] 寻找模块时尝试的后缀
    alias:{ 模块别名
        'module':'new-module'
        // import 'module' === import 'new-module'
        // import 'module/file' === import 'new-module/file'
        'only-module$':'new-module'
        // import 'module' === import 'new-module'
        // import 'module/file' !== import 'new-module/file'
    }
    alias:[
       {
        'name':'module',
        'alias':'new-module',
        'onlyModule':true
       }
    ],
    enforceExtension:false  是否强制导入语句必须写文件后缀

}
```

```
引用一个库，但是又不想让webpack打包，并且又不影响我们在程序中以CMD、AMD或者window/global全局等方式进行使用，那就可以通过配置externals
 externals: {  使用来自 JavaScript 运行环境提供的全局变量
    jquery: 'jQuery'
  },
```


`devtool:source-map`

`context:path.resolve(xxx)` webpack 使用的根路径

```
 stats: { // 控制台输出日志控制
    assets: true,
    colors: true,
    errors: true,
    errorDetails: true,
    hash: true,
  }

```



* 想让源文件加入到构建流程中去被 Webpack 控制，配置 entry。
* 想自定义输出文件的位置和名称，配置 output。
* 想自定义寻找依赖模块时的策略，配置 resolve。
* 想自定义解析和转换文件的策略，配置 module，通常是配置 module.rules 里的 Loader。
* 其它的大部分需求可能要通过 Plugin 去实现，配置 plugin。

























