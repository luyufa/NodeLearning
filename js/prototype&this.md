## 原型链
> prototype 、\_\_proto\_\_


一张图表示原型链是什么

![1](https://github.com/luyufa/NodeLearning/blob/master/js/1.png)

如下为代码解释
```js
function Person() {
}

const p = new Person();

//原型链
console.log(p.__proto__ === Person.prototype);
console.log(p.__proto__.__proto__ === Object.prototype);
console.log(p.__proto__.__proto__.__proto__ === null);

//构造函数
console.log(Person.prototype.constructor === Person);
console.log(Object.prototype.constructor === Object);
```

`prototype`是每一个函数特有的一个属性，而`__proto__`是每一个对象(`null`、`undefined`除外)特有的属性。而正好`Function.prototype===function.__proto__`