### CommonJS规范

> 为什么需要模块？可以方便的代码重用、组织代码结构，致力于让js运行在任何环境


#### Node如何实现CommonJS规范

1. #####模块引用
在｀CommonJS｀规范中，存在｀require()｀方法，这个方法接受模块标识，以此引入一个模块的API到当前上下文中。

2. #####模块定义
提供exports对象导出当前模块挂载在exports上的方法和变量，并且是唯一的导出出口。
存在module对象，代表模块自身，而exports是module的属性,
在Node中一个文件就是一个模块。

 ```
const module = {
    exports: {

    }
};
exports = module.exports;
```
exports 是一个引用，直接赋值给它，只是让这个变量等于另外一个引用,只有通过 module.exports 才能真正修改到 exports 本身

3. #####模块标示
模块标示就是传递给`require()`方法以小驼峰形式命名的参数，可以是`相对路径`或`绝对路径`或`模块名字`，可以有后缀(`.json` `.js`)也可以没有。