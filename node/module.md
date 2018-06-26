## Node.js模块加载机制

`Node`的出现使`javascript`脱离了浏览器的束缚，使之在服务端也大放异彩，其中实现`CommonJs`规范更是使`Node`能够承担服务端工程的重要原因之一。

##### CommonJS规范
```
(function(module, exports, require){
    //每一个.js文件都由一个匿名自执行函数包裹，提供所需的require、exports
})()
```
1. 模块定义

   在模块中通过`exports`对象用于导出当前模块的方法或变量**exports=module.exports**,并且是唯一导出口


2. 模块标识

   模块标识即传递给`require`的参数，`相对路径`、`绝对路径`、或`模块名称`

3. 模块引用

   在模块中通过`require`对象导入一个模块的上`exports`挂载的方法和变量


##### Node模块加载
![image](https://github.com/luyufa/NodeLearning/blob/master/node/img/4.png)
![image](https://github.com/luyufa/NodeLearning/blob/master/node/img/5.png)