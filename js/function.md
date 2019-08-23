## 函数

##### 函数柯里化
> 一个n元函数 转换 为n个一元函数


柯里化要求被传入函数所有参数都被明确的定义，当使用部分参数调用时，他会返回一个新的函数，在真正调用之前等待外部提供剩余参数。可以简单的理解为，在所有参数被提供之前，挂起或延迟函数的执行

```
function add(a, b, c) {
    return a + b + c;
}
正常调用:add(1,2,3) //6
柯里化调用:
           addCurry=curry(add);
           addCurry(1)(2)(3) //6
```

个人觉得函数柯里化实际应用场景可能有限，特别在多人协同项目中，其中的逻辑稍显复杂，就容易晕，但是我们还是先看一看如何实现一个柯里化函数

```
const curry = function (fn, args = []) {
    const length = fn.length;
    const slice = Array.prototype.slice;
    return function () {
        args = args.concat(slice.call(arguments));
        if (args.length >= length) { //实参个数 >= 形参个数,参数足够可直接执行函数
            return fn.apply(this, args)
        } else {
            return curry.call(this, fn, args);
        }
    }
}
```

##### 偏函数
> 一个n元函数 转化 为一个n-x元函数

偏函数是固定一个函数的一些参数，然后产生另一个更小元的函数。比如我们经常使用的`bind`函数就是一个偏函数

```
const objs = [{name: 'lu'}, {name: 'x'}]
function say(them, name) {
    console.log(them + name)
}
const sayGuoqing = say.bind(null, '国庆')
for (let i = 0; i < objs.length; i++) {
    sayGuoqing(objs[i].name)
}
```


##### 惰性函数
> 没调用返回该函数第一次调用时的值


在为DOM 事件添加中，为了兼容现代浏览器和IE浏览器，我们需要对浏览器环境进行一次判断

```
function addEvent (type, el, fn) {
    if (window.addEventListener) {
        el.addEventListener(type, fn, false);
    }
    else if(window.attachEvent){
        el.attachEvent('on' + type, fn);
    }
}
```
这样每次都会执行判断逻辑，这时我们可以考虑使用惰性函数来解决问题

```
function addEvent (type, el, fn) {
    if (window.addEventListener) {
        addEvent = function (type, el, fn) {
            el.addEventListener(type, fn, false);
        }
    }
    else if(window.attachEvent){
        addEvent = function (type, el, fn) {
            el.attachEvent('on' + type, fn);
        }
    }

    addEvent(type, el, fn)
    //在第一次执行的时候，addEvent并不会绑定事件，
    //只是对addEvent重新赋值了一次,所以需要调用一次来完成赋值
}
```



##### 函数记忆
> 函数记忆是指将上次的计算结果缓存起来，当下次调用时，如果遇到相同的参数，就直接返回缓存中的数据

```
function memoize(f) {
    var cache = {};
    return function(){
        var key = arguments.length + Array.prototype.join.call(arguments, ",");
        if (key in cache) {
            return cache[key]
        }
        else {
            return cache[key] = f.apply(this, arguments)
        }
    }
}
```

这是一一个最简单的可记忆函数，不支持参数类型诸如`object`（`toString`会变成`[object Object]`）等