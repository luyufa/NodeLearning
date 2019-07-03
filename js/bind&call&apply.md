## call & apply & bind
> 修改this指向

#### call
> 立即调用一个修改了this指向的函数，可传入参数

1. 立即调用一个修改了this指向的函数,函数所具有的公共方法

* 特性

  ```js
  console.log(Function.prototype.call)
  // [Function: bind]

  const obj = {
    name: 'lu'
  };
  function say() {
    console.log(this.name);
  }
  say.call(obj); // lu  this指向obj，且函数被立即调用

  ```

* 实现

  ```js
  Function.prototype._call = function (ctx) {
    ctx = ctx || global;
    // ctx传入null时，默认this指向global

    ctx.__fn = this;
    // 把当前调用函数作为ctx的一个属性
    const result = ctx.__fn();
    // 这是调用的时候this自然指向ctx
    delete ctx.__fn;
    // 为防止ctx被修改，调用结束后删除
    return result
    // 函数是可以有返回值的
  };
  ```

2. 调用时传入参数

* 特性

  ```js
  function say(age, sex) {
    console.log('this.name', this.name);
    console.log('age', age);
    console.log('sex', sex);
  }
  say.call(obj, 25); // 可传入不确定个数的参数

  // this.name lu
  // age 25
  // sex undefined

  ```

* 实现

  ```js
  Function.prototype._call = function (ctx) {
    ctx = ctx || global;

    const args = [];
    for (let i = 1; i < arguments.length; i++) {
        args.push('arguments[' + i + ']');
    }
    // 先通过arguments获取调用时传入的除ctx之外的参数。

    ctx.__fn = this;
    const result = eval('ctx.__fn(' + args.join(',') + ')');
     //使用eavl传入不确定个数的参数
    delete ctx.__fn;

    return result;
  };
  ```

#### apply
> 和call的作用一样，不过其接受数组作为传入参数

  ```js
   Function.prototype._apply = function (ctx, arr) {
    ctx = ctx || global;
    if (!Array.isArray(arr)) {
        arr = [];
    }

    ctx.__fn = this;

    const args = [];
    for (let i = 0; i < arr.length; i++) {
        args.push('arr[' + i + ']')
    }

    const results = eval('ctx.__fn(' + args.join(',') + ')');
    delete ctx.__fn;
    return results;
  };
  ```
  `ES6实现版`
  ```js
  Function.prototype._applyEs6 = function (ctx, arr) {
    const __fn = Symbol();
    //构造一个唯一key，以防_fn和ctx原有key冲突
    ctx[__fn] = this;
    const results = ctx[__fn](...arr);//简化传入参数
    delete ctx [__fn];
    return results;
}
  ```


#### bind
> 返回一个修改了this指向的函数，可传入参数


1. 返回一个修改了this指向的函数,函数所具有的公共方法

* 特性

  ```js
  console.log(Function.prototype.bind)
  // [Function: bind]

  const t = {name: 'lu'};
  name = 'gl';
  function say() {
     console.log(this.name);
  }
  say(); // gl  name是全局变量，挂载在global对象上，此时的this指向global
  const sayBound = say.bind(t);
  console.log(typeof sayBound)  // function 返回值是函数
  sayBound(); // lu  this指向t

  ```
* 实现

  ```js
  Function.prototype._bind = function (ctx) {// 挂在Function原型上
      const self = this;//当前this即为调用函数
      return function () {
        return self.apply(ctx) // 原函数也是可以有返回值的
      }
  };
  ```

2. 绑定时传入参数、调用时传入参数

* 特性

  ```js
  绑定时和调用时传入参数
  const t = {o: 'person'};
  function say(name, age) {
    console.log(this.o);
    console.log('name is', name);
    console.log('age is', age);
  }
  const sayBound = say.bind(t, 'lu');// 绑定时传入参数
  sayBound(25); // 调用时传入参数

  // person
  // name is lu
  // age is 25
  ```
* 实现

  ```js
  Function.prototype._bind = function (ctx) {
      const self = this;
      const bindArgs = Array.prototype.slice.call(arguments, 1);// 获取绑定时除了ctx之外的剩余参数
      return function () {
          const args = Array.prototype.slice.call(arguments);
          // 获取调用时传入的所有参数
          return self.apply(ctx, bindArgs.concat(args))
      }
  };
  ```

3. 构造函数

* 特性

  ```js
  const t = {o: 'person'};
  function say(name, age) {
    console.log(this.o);
    console.log('name is', name);
    console.log('age is', age);
  }
  say.prototype.top = 'ha';


  const FSay = say.bind(t);
  const fSay = new FSay('lu', 25);
  console.log(fSay.top);


  // undefined  此时this指向实例本身即fSay，绑定时指向的t已失效
  // name is lu 传入的参数依然有效
  // age is 25
  // ha 读取到了原型链上的top属性
  ```
* 实现

  ```js
  Function.prototype._bind = function (ctx) {
    const self = this;
    const bindArgs = Array.prototype.slice.call(arguments, 1);

    function FBound() {
        const args = Array.prototype.slice.call(arguments);

        return self.apply(this instanceof FBound ? this : ctx, bindArgs.concat(args))
        // 如果当前调用方时FBound所构造的实例，那么直接指向this，否则指向ctx
    }

    // 使new出来的实例具有原函数的原型方法
    FBound.prototype = this.prototype;
    return FBound
  };

  优化：FBound和原函数的原型指向同一个对象，当修改FBound的原型时，会干扰原函数

  Function.prototype._bind = function (ctx) {

    const self = this;
    const bindArgs = Array.prototype.slice.call(arguments, 1);

    const NullFun = function () {
    };
    NullFun.prototype = this.prototype;
    NullFun.prototype.constructor = NullFun;

    function FBound() {
        const args = Array.prototype.slice.call(arguments);
        return self.apply(this instanceof FBound ? this : ctx, bindArgs.concat(args))
    }

    FBound.prototype = new NullFun();
    FBound.prototype.constructor = FBound;
    return FBound
   };

   FBound.prototype -> nullFun.__proto__ -> this.prototype  使用空函数中转

  ```