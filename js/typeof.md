## 类型检测

##### typeof

在`JavaScript`中基本数据类型可分为`Undefined`、`Null`、`Number`、`String`、`Object`、`Boolean`，如果仅仅依靠  `typeof`来判断类型，你就会发现一个不靠谱是的事实
```
typeof null // object
typeof new Number(2) // object
```
除了上面两个较为极端的例子之外诸如`Date`、`Error`、`Regexp`、`Array`等都被检测为`object`

但是typeof在检测以下5种类型时是很好使的
 * typeof 2 //number

 * typeof '2' //string

 * typeof true //boolean

 * typeof undefined //undefined

 * typeof function(){} //function

##### Object.prototype.toString()

记住则张表
```js
var number = 1;          // [object Number]
var string = '123';      // [object String]
var boolean = true;      // [object Boolean]
var und = undefined;     // [object Undefined]
var nul = null;          // [object Null]
var obj = {a: 1}         // [object Object]
var array = [1, 2, 3];   // [object Array]
var date = new Date();   // [object Date]
var error = new Error(); // [object Error]
var reg = /a/g;          // [object RegExp]
var func = function a(){}; // [object Function]
argumnet                 // [obejct Argument]
```

在考虑到性能的影响，我们能用`typeof`的优先使用`typeof`
```
console.time('typeof')
typeof 2
console.timeEnd('typeof')
//0.0038828125ms

console.time('tostring')
Object.prototype.toString.call(2)
console.timeEnd('tostring')
//0.007080078125ms
```

而且需要注意在 IE6 中，`null` 和 `undefined` 会被 `Object.prototype.toString` 识别成 `[object Object]`！

```js
const class2type="Boolean Number String Function Array Date RegExp Object Error"
.split(" ")
.reduce((iter,item)=>{
    iter[`[object ${item}]`]=item.toLowerCase();
    return iter;
},{})
function type(obj){
    if(obj==null){//null undefined
        return obj + '';
    }
    const type = typeof obj

    return type === 'object' ?
           class2type[Object.prototype.toString.call(obj)]||'object'// ES6里的Map Set Symbol不在类型表里
           //Date Error Regexp Array Object Argument
           :
           type
           //function number string boolean
}
```

##### isArray
推荐直接使用`Array.isArray`


##### isEmpty
其实所谓的 isEmptyObject 就是判断是否有属性，for 循环一旦执行，就说明有属性，有属性就会返回 false。

```js
console.log(isEmptyObject({})); // true
console.log(isEmptyObject([])); // true
console.log(isEmptyObject(null)); // true
console.log(isEmptyObject(undefined)); // true
console.log(isEmptyObject(1)); // true
console.log(isEmptyObject('')); // true
console.log(isEmptyObject('1')); // false
console.log(isEmptyObject(true)); // true
```

##### isNaN
由于NaN为数字类型且不等于自身的特性可以使用如下方式判断
```js
function isNaN(value) {
    return typeof value === 'number' && value !== value;
}
```


##### isElement
逻辑运算`&&` `||`都是返回其中的一个值，所以加上`!!`使其转换为布尔值
```
 function isElement(obj) {
    return !!(obj && obj.nodeType === 1);
};
```


##### isWindow
借助window对象有一个window属性指向自身来判断
```
function isWindow( obj ) {
    return !!(obj && obj === obj.window);
}
```




