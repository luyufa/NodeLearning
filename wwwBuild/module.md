## 模块化

##### CommonJs规范

1. 所有代码都运行在模块作用域，不会污染全局作用域。

```
(function(module,exports,require){

})()
```

2. 模块可以多次加载，但是只会在第一次加载时运行一次，然后运行结果就被缓存
3. 模块加载的顺序，按照其在代码中出现的顺序。**同步加载**,由于同步加载问题在浏览器端使用会导致网页失去响应时间。服务端则不存在此问题，加载时间基本就是从磁盘读取时间

4. `require` 引入模块、`module`导出模块

```
exports=module.exports={

}
```
5. Node实现了CommonJs规范，浏览器端不原生支持

##### AMD规范

1. 模块使用`define`定义
```
//a.js
define([其他依赖],function(其他依赖形参){
    return {
        hello:function(){...导出的函数}
    }
})
```
2. 模块通过require**异步**加载
```
require(['a','jquery'],function(a,$){

})
```
3. 前置执行:异步加载的模块`a`和`jquery`下载下来后，全部执行（执行顺序不一定）完毕才会进入require的回调函数中

4. require.js实现了AMD规范,浏览器端不原生支持


##### CMD规范

1. 模块define
```
//a.js
define(function(module,exports,require){
    require('a')
    require('b')
    return {
        hello:function(){...导出的函数}
    }
})
```
2. 模块通过require**异步**加载

3. 就近执行:加载的模块`c`和`b`下载下来后，进入reuqire回调函数，其后谁先被引用则先执行谁。(执行顺序是一定的)

4. sea.js实现了CMD规范，浏览器端不原生支持

##### ES6 import

1. `export` 导出模块内的接口

 * 变量重命名
```
const count = 1;
export {
    count as total,
    count as xxx
}
```
 * export命令规定的是对外的接口，必须与模块内部的变量建立一一对应关系
```
const count=1;
export count //error
export 1 //error
export {count}//ok
export const count=1 //ok
export function(){} //error
```
 * export语句输出的接口，与其对应的值是动态绑定关系
```
let count = 1;
setInterval(function () {
    count++;
}, 1000);
export {count}
```
 * 必须在模块中的顶级作用域


2. `import` 导入其他模块接口

 * 导入变量重命名
 ```
 import {count as total} from 'a.js'
 import {count} from 'a.js'
 import * as ob from 'a.js' //使用*号全部加载
 import _ from 'a.js'
 ```
 * 默认导出导入
 ```
 const count=0;
 export default count;

 import count_xxx from 'a.js' //加载默认导出模块时，可以随意起名字
 ```

 * import 导入属性等价于const定义的变量，不允许修改其指向内存地址，但是可以修改其属性，且修改之后导入的该变量属性全都变了

 * import是**静态执行**，所以不能使用表达式和变量，引擎处理import语句是在编译时，这时不会去分析或执行if语句，所以import语句放在if代码块之中毫无意义，因此会报句法错误，而不是执行时错误。也就是说，import和export命令只能在模块的顶层
 ```
报错
import { 'f' + 'oo' } from 'my_module';

报错
let module = 'my_module';
import { foo } from module;

报错
if (x === 1) {
  import { foo } from 'module1';
} else {
  import { foo } from 'module2';
}
 ```
 * 重复执行同一句import语句，那么只会执行一次


参考文献
ps:
  * [npm+webpack+es6](https://segmentfault.com/a/1190000006966358)
  * [js模块化历程](http://web.jobbole.com/83761/)
  * [前端模块化，AMD与CMD的区别](https://blog.csdn.net/jackwen110200/article/details/52105493)
  * [import、require、export、module.exports 混合详解](https://github.com/ShowJoy-com/showjoy-blog/issues/39)