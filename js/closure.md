## closure
> 函数和声明函数的词法环境的组合

通俗易懂的讲
`闭包=函数+函数能访问的自由变量(函数中使用却不是函数参数也不是函数局部变量)`


举个栗子

```js
var x='global x'
function say(){
    return x;
}
say();
```
以上代码`say`是一个函数，并且它可以访问`x`，`x`既不是函数参数也不是其局部变量，那么`say+x`就构成了一个闭包


所以一个技术理论上来看：任何函数都是闭包！！，为什么呢？函数在定义时就打包了全局变量，而全局变量对于这个函数来说既不是函数参数，也不是函数局部变量。

但是呢从另一个实践角度来看，满足以下两点才算闭包
 1. 引用了自由变量
 2. 创建它的上下文已经销毁，他任然存在


```js
var scope = "global scope";
function checkscope(){
    var scope = "local scope";
    function f(){
        return scope;
    }
    return f;
}

var foo = checkscope();
foo();//local scope
```
我们来分析下执行过程

1. ECStack.push(globalCxt)，创建全局上下文，且压入全局上下文栈
2. 执行全局上下文初始化

2. ECStack.push(<checkscope> checkscopeCtx)，执行函数checkscope，压入栈
3. checkscope执行上下文初始化，创建变量对象、this、作用域等
4. ECStack.pop()弹出checkscopeCtx，checkscope执行完毕

5. ECStack.push(<foo> fooCtx)，执行函数foo，压入栈
6. foo执行上下文初始化，创建变量对象、this、作用域等
7. ECStack.pop()弹出fooCtx，foo执行完毕


那么问题来了？以上代码最终输出`local scope`,可问题是当foo执行时，checkscope已经释放了啊。那么是如何读取到checkscope域下局部变量呢？

我们需要知道foo执行时维护了一个作用域链
```js
fooCtx={
    scope:[AO,checkscoepCtx.AO,globalCtx.AO]
}
```
当foo函数引用了checkscopeCtx.AO中的值的时候，即使 checkscopeCtx 被销毁了，但是 JavaScript 依然会让checkscopeCtx.AO活在内存中，foo 函数依然可以通过 foo 函数的作用域链找到它，正是因为 JavaScript 做到了这一点，从而实现了闭包这个概念




看一个经典的栗子

```js
var data = [];

for (var i = 0; i < 3; i++) {
  data[i] = function () {
    console.log(i);
  };
}

data[0]();//3
data[1]();//3
data[2]();//3

data[0].Ctx={
    scope:[AO , globalCtx.AO]
}
在执行data[0]时，data[0].ctx的AO中并没有变量i，
于是向上级globalCtx的AO中寻找，而循环结束后i为3，且i是全局变量，所以输出3
```

使用闭包的情况
```js
var data = [];

for (var i = 0; i < 3; i++) {
  data[i] = (function fun(i) {
        return function(){
            console.log(i);
        }
  })(i);
}

data[0]();//0
data[1]();//1
data[2]();//2


在使用闭包的情况下，作用域链发生了改变
data[0].Ctx={
    scope:[AO ,funCtx.AO, globalCtx.AO]
}
此时funCtx={
    AO:{
        argumnets:{
            0:0,
            length:1
        },
        i:0
    }
}
在执行data[0]时，data[0].ctx的AO中并没有变量i，
于是向上级funCtx的AO中寻找，所以输出0。
```

使用let
```js
var data = [];

for (let i = 0; i < 3; i++) {
  data[i] = function () {
    console.log(i);
  };
}

data[0]();//0
data[1]();//1
data[2]();//2


 let 关键字将 for 循环的块隐式地声明为块作用域。
 而 for 循环头部的 let 不仅将 i 绑定到了 for 循环的块中，事实上它将其重新绑定到了循环的每一个迭代中，
 确保使用上一个循环迭代结束时的值重新进行赋值。


可以这样理解：
var data = [];

var _loop = function _loop(i) {
data[i] = function () {
console.log(i);
};
};

for (var i = 0; i < 3; i++) {
_loop(i);
}

```


##### 实用场景

1. 模拟私有变量
2. 中间件定制化(委托模式)


#### ps

*  [JavaScript深入之闭包 ](https://github.com/mqyqingfeng/Blog/issues/9)
*  [闭包](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Closures)