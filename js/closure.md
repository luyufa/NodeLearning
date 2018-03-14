## 闭包

##### 执行环境
在javscript中执行环境主要分为两种

* `全局执行环境`:NodeJs中为global，所有的全景属性和方法全都挂在gloabl上，可以在任意地方访问，其生命周期直至程序退出时销毁。
* `函数执行环境`:当执行一个函数时，v8引擎进入函数执行环境，函数代码执行完毕则销毁。

所有的执行环境以栈的形式管理，底部是全局执行环境，顶部是当前函数执行环境。
```
function outer() {
    function inner() {

    };
    inner();
}
outer();
```
执行outer函数时执行环境栈为：（顶部）inner函数执行环境－outer函数执行环境－global全局执行环境（底部）

每一个执行环境都对应一个变量对象，保存着`形参`、`var定义的变量`、`函数声明`

##### 作用域链

作用域链是当前执行环境所关联变量对象列表，在函数定义时创建，当查找变量时，从自身变量对象一直向父环境变量对象查找（就近原则）

```
//test.js
color = 'yellow';
var color = "blue";
function getColor() {
    var color = "red";
    return color;
}
console.log(getColor());
```
这里存在三个执行环境，因此关联三个变量对象,查找变量时依次从1-2-3顺序查,找到即停。

 1. 函数getColor之内
 2. getColor之外test.sj文件之内
 3. 全局global，

#### 闭包
闭包是一个可以访问其他函数内部变量的函数。（闭包就是能够读取其他函数内部变量的函数）

* 变量私有化参考Promise实现
* 闭包缓存变量于内存
* 访问外部变量 参考worktile privliiege返回函数
