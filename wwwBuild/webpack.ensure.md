## webpack require-ensure
> 懒加载、代码切割

###### 为什么需要懒加载?

在单页应用中，如果未使用懒加载(代码切割)，那么webpack打包的文件会非常大，首页加载时容易长时间白屏，而懒加载则是把打包代码切割，在使用这个模块时webpack构造script dom 由浏览器异步加载



###### 原理
把一些js模块给独立出一个个js文件，然后需要用到的时候，在创建一个script对象，加入
到document.head对象中即可
```
btn.click(function() {
  //获取 文档head对象
  var head = document.getElementsByTagName('head')[0];
  //构建 <script>
  var script = document.createElement('script');
  //设置src属性
  script.async = true;
  script.src = "http://map.baidu.com/.js"
  //加入到head对象中
  head.appendChild(script);
})
```
在webpack中
```
btn.click(function(){
    require.ensure([A],function(){
         var baidumap = require('./baidumap.js') //baidumap.js放在我们当前目录下
    })
})
```

1. `webpack`仅会静态地解析代码中的 `require.ensure()`，`webpack`通过`jsonp`按需加载
2. `require.ensure([],callback)`回调里面的require是我们想要独立切割出去的文件
```
var sync = require('syncdemo.js')

btn.click(function() {
  require.ensure([], function() {
    var baidumap = require('./baidumap.js') //这个会独立出去
    var sync = require('syncdemo.js')  //这个不会独立出去，因为它已经加载到模块缓存中了
  })
})
```
3. webpack会把参数里面的依赖异步模块和当前的需要分离出去的异步模块给一起打包成同一个js文件，会出现一个重复打包的问题
```
require.ensure(['./a.js'], function(require) {
    require('./b.js');
}); a.js和b.js被打包未一个js文件

require.ensure(['./a.js'], function(require) {
    require('./c.js');
}); a.js和c.js被打包成一个js文件

所以a.js被重复打包
```
4. `equire.ensure`在下载完依赖的模块后并不会立即执行,需要执行时在`require`即可
```
require.ensure(["./module1"], function(require) {
    console.log("aaa");
    require("./module1");//这时候才执行
}, 'test');

aaa
module1
```



##### require-amd

* 说明: 同`AMD`规范的`require`函数，使用时传递一个模块数组和回调函数，模块都被下载下来且都被执行后才执行回调函数
* 语法: `require(dependencies: String[], [callback: function(...)])`
* 参数
dependencies: 模块依赖数组
callback: 回调函数
```
require(["./module1"], function(module1) {//下载完就执行
    console.log("aaa");
}, 'test');


module1
aaa
```

