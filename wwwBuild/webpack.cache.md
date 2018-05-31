## webpack缓存实现之hash与chunkhash

###### 使用情景

浏览器强制缓存可以不主动发起http请求，直接使用本地资源，以提升网站性能。但存在一个问题，在缓存有效期内想更新资源怎么办？唯一解决办法就是使强制缓存失效，通常使用文件名变更
```
index.js?v=1
```

因为只要做到每次发布的静态资源(css, js, img)的名称都是独一无二的，那么：

1. 针对 html 文件：不开启缓存，把 html 放到自己的服务器上，关闭服务器的缓存，自己的服务器只提供 html 文件和数据接口
2. 针对静态的 js，css，图片等文件：开启 cdn 和缓存，将静态资源上传到 cdn 服务商，我们可以对资源开启长期缓存，因为每个资源的路径都是独一无二的，所以不会导致资源被覆盖，保证线上用户访问的稳定性。
3. 每次发布更新的时候，先将静态资源(js, css, img) 传到 cdn 服务上，然后再上传html文件，这样既保证了老用户能否正常访问，又能让新用户看到新的页面。


webpack通过`hash`|`chunkhash`占位符，在每次生成打包文件时，都会通过文件内容生成唯一的hash，并添加到输出的文件名中
```
{
    output:{
        filename:'[hash].js'
    }
}
```


###### hash
> compilation的hash值

`comilation`对象代表某个版本资源的编译进程，每当检测到文件变动时便创建一个新的`comilation`

* `compiler`对象代表的是配置完备的`webpack`环境，是针对`webpack`的，在启动时 构建一次，是不会发生变动的
* `compilation`对象针对的是随时可变的项目文件，只要文件有改动，`compilation`就会被重新创建

在多文件入口下,由于hash是compilation对象计算所得，而不是具体的项目文件计算所得。所以如下配置的编译输出文件，所有的文件名都会使用相同的hash，这样有个问题是其中一个改的会导致其他的文件名改的，最后会导致浏览器中**缓存失效**
```
{
    entry:{
        main:'main.js',
        sub:'sub.js'
    },
    output:{
        filemname:'[name].[hash:8].js'
    }
}
```


###### chunkhash
> chunk的hash值

由于chunkhash是根据具体的文件内容计算的hash值，某个文件的修改的只会影响自身，不会导致其他文件名变化，即不会影响其他文件的缓存。
```
{
    entry:{
        main:'main.js',
        sub:'sub.js'
    },
    output:{
        filemname:'[name].[chunkhash:8].js'
    }
}
```



1. 问题：`webpack`理念是所有的文件都一`js`文件为汇聚点，不支持`js`以外的文件为入口。此模式下有个问题是`webpack`默认将`js/style`文件编译到一个`js`文件中，我们可以借助`extract-text-webpack-plugin`将`style`文件单独编译输出，但是使用`chunkhash`配置输出文件名时，编译的结果是`js`和`css`文件的`hash`值**完全相同**,不论是单独修改了`js`代码还是`style`代码，编译输出的`js/css`文件都会打上全新的相同的`hash`值。

2. 解决方案：`extract-text-webpack-plugin`提供了另外一种`hash`值：`contenthash` 或者 `md5:contenthash`代表的是文本文件内容的`hash`值，也就是只有style文件的hash值这样编译出来的`js`和`css`将会有独立的`hash`值


ps:参考链接

* [Webpack中hash与chunkhash的区别，以及js与css的hash指纹解耦方案](https://www.cnblogs.com/ihardcoder/p/5623411.html)
* [webpack 持久化缓存实践](https://github.com/happylindz/blog/issues/7)