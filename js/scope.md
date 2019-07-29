### 作用域
> 代码中定义变量的区域

```js
scope = "global scope";
function checkScope(){
    const scope = "local scope";
    function f(){
        return scope;
    }
    return f;
}
console.log(checkScope()());
```

* 静态作用域(`js`),函数作用域在函数定义的时候就确定了

  以上代码在执行时，先查找f函数内部是否有变量scope，没有的话，根据书写位置(函数定义)，查找父级代码，于是返回scope为local scope

* 动态作用域，函数作用域在函数调用时才确定



#### 执行上下文

1. 提升

   * 变量提升,先声明变量foo,赋值为function1，执行输出foo1，再赋值为function2，执行输出foo2
   ```js
   var foo = function 1() { console.log('foo1');}
   foo();  // foo1

   var foo = function 2() {console.log('foo2');}
   foo(); // foo2
   ```

   * 函数提升，声明函数foo，在声明函数foo，后声明的覆盖了先声明的，随后执行输出foo2，跳过，执行输出foo2
   ```js
   function foo() {  console.log('foo1'); }
   foo();  // foo2

   function foo() {console.log('foo2');}

   foo(); // foo2
   ```

2. 执行上下文栈(ECStack)
> 初始化的时候首先就会向执行上下文栈压入一个全局执行上下文(globalContext)，并且只有当整个应用程序结束的时候，ECStack 才会被清空，当执行一个函数的时候，就会创建一个执行上下文，并且压入执行上下文栈，当函数执行完毕的时候，就会将函数的执行上下文从栈中弹出

```js
var scope = "global scope";
function checkscope(){
    var scope = "local scope";
    function f(){
        return scope;
    }
    return f();
}
checkscope();

// 执行栈分析
ECStack.push(<checkscope> functionCxt)
ECStack.push(<f> functionCxt)
ECStack.pop()
ECStack.pop()
```
```js
var scope = "global scope";
function checkscope(){
    var scope = "local scope";
    function f(){
        return scope;
    }
    return f;
}
checkscope()();

// 执行栈分析
ECStack.push(<checkscope> functionCtx)
ECStack.pop()
ECStack.push(<f> functionCtx)
ECStack.pop()
```

##### 执行上下文之活动对象AO（activation object）
 * 全局上下文中的AO
   * 作为全局变量的宿主
   * javascript中是windows，node中是global
   * 挂载了一堆属性和方法
   * 通过this引用
 * 函数上下文的AO
   1. 进入执行上下文
     * 形参，设置为`undefined`
     * 函数，如果变量对象已经存在相同名称的属性，则完全替换这个属性
     * 变量，如果变量名称跟已经声明的形式参数或函数相同，则变量声明不会干扰已经存在的这类属性
      ```js
      function F(a){
        console.log('1',a) //输出函数
        function a(){}
        var a='ok'
        console.log('2',a) //输出ok
      }
      F('ye')

      进入执行上下文分析：
      1. 先设置形参a为undefined
      2. 声明函数a覆盖
      3. 变量与函数同名，无影响
      AO={
        arguments:{
            0:'ye',
            length:1
        },
        a:reference to function c(){},
      }
      ```
   2. 执行代码
     * 会顺序执行代码，根据代码，修改变量对象的值


#### 作用域链
> 查找变量时，先查找当前上下文中的变量，未找到，则查找父级上下文，一直找到全局变量为止,注意js是静态作用域，根据书写位置去查找父级变量。