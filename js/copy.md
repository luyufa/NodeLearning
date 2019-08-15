## 拷贝


针对数组的拷贝我们可以使用诸如`concat`、`slice`来技巧性的实现，但这样的拷贝仅是浅拷贝，为什么这样说呢？看个例子就明白了

```js
const source = [1, {name: 'l'}];
const target = source.concat();
source[0] = 2;
source[1].name = 'y';
console.log(source, target);
// [ 2, { name: 'y' } ] [ 1, { name: 'y' } ]
```
可以看到，可以看到第一个元素基本数据类型，没因为原数组的修改而发生变化；但是第一个引用类型的数组却变了。如果数组元素是基本类型，就会拷贝一份，互不影响，而如果是对象或者数组，就会只拷贝对象和数组的引用，这就能说明以上两个方法是浅拷贝，而这种复制引用的拷贝就叫做浅拷贝。


有一个可以实现安全JSON的深拷贝的奇淫技巧

```js
 JSON.parse(JSON.stringify([1,2,{name:'l'}]]))
```


 上面说那些都是取巧的做法，下面来看看如何实现一个基本的深浅拷贝函数



 ###### 浅拷贝


 ```js
 function shallowCopy(obj) {
    if (typeof obj !== 'object') return;
    if (obj === null) return null;
    const res = Array.isArray(obj) ? [] : {};
    for (const key in obj) { // 实例属性+原型属性
        if (obj.hasOwnProperty(key)) { // 仅实例属性
            res[key] = obj[key];
        }
    }
    return res;
}
 ```

 ###### 深拷贝
 ```js
 function deepCopy(obj) {
    if (typeof obj !== 'object') return;
    if (obj === null) return null;
    const res = Array.isArray(obj) ? [] : {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            res[key] = typeof obj[key] === 'object' ? deepCopy(obj[key]) : obj[key];
            // 递归下即可
        }
    }
    return res;
}
 ```



###### assign

以浅拷贝为基础我们来写一个`assign`函数，当两个对象出现相同字段时，后者覆盖前者，但是不会进行深层次覆盖。就像下面这样

```
const a = {person: {name: 'lu'}};
const b = {person: {age: '24'}};
assign(a, b);// {person: { age: '24' } }
```

```
function assign() {
    const args = Array.prototype.slice.call(arguments);
    const target = args[0];
    for (let i = 1; i < args.length; i++) {
        const obj = args[i];
        for (const key in obj) {
            if (obj.hasOwnProperty(key) && obj[key] !== undefined) {
                target[key] = obj[key];
            }
        }
    }
    return target;
}
```


如果以深拷贝为基础写一个`assign`函数的话，当两个对象出现相同字段时，后者覆盖前者，同时会进行深层次覆盖（递归）。就像下面这样

```
const a = {person: {name: 'lu'}};
const b = {person: {age: '24'}};
assign(a, b);// {person: { name:'lu', age: '24' } }
```

```
function assign() {
    const args = Array.prototype.slice.call(arguments);
    let target = args[0];
    if (typeof target !== 'object') {
        target = {};
    }
    for (let i = 1; i < args.length; i++) {
        const obj = args[i];
        for (const key in obj) {
            if (obj.hasOwnProperty(key) && obj[key] !== undefined) {
                target[key] = typeof obj[key] === 'object' ? assign(target[key], obj[key]) : obj[key];
            }
        }
    }
    return target;
}
```

上面的拷贝仅仅是简单实现，并未做一些边界问题、类似null、undefined、数组合并等问题，以供参考