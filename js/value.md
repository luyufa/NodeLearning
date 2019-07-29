## 值传递
> javascript中都是按值传递


什么是值传递？
![4](https://github.com/luyufa/NodeLearning/blob/master/js/4.png)
```js
var value = 1
function change(_value){
    _value = 2;
}
change(value)
console.log(value) // 1;
```
所谓值传递就是把值拷贝一份复制给形参，对其任何修改都不会影响原值


什么是引用传递？
![2](https://github.com/luyufa/NodeLearning/blob/master/js/2.png)
```js
var obj={ value : 1};
function change(_obj){
    _obj.value = 2;
}
change(obj);
console.log(obj.value) //2;
```
所谓引用传递就是传递对象的引用，两者引用同一个对象，对其任何修改都会影响原值

文中开篇即说“javascript中都是值传递”，那么第二个例子何解？再看个例子
```js
var obj={ value : 1};
function change(_obj){
    _obj = {value : 2};
}
change(obj);
console.log(obj.value) //1;
```
![3](https://github.com/luyufa/NodeLearning/blob/master/js/3.png)
可以这样理解，javascript中在传递基本类形时，是直接复制一个值，在传递引用类型时，如果值的数据结构复杂那么容易产生性能问题，此时复制的是该对象的一个引用，由于复制对象引用也算作值的拷贝，所以认为javascript中使用的是值传递