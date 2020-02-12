## Aync/Await


1. `await` 必须写在`async`函数内
2. `await` 后面跟着`Promise`则取`resolve(value)`中的`value`中

 ```
 function timeout(ms) {
    return new Promise((resolve, reject)=> {
        setTimeout(function () {
            resolve(1);
        }, ms);
    })
}
(async function (ms) {
    console.log(await timeout(ms));
})(1000)
//1
 ```
3. `await` 后面跟着非`Promise`则直接为该值,`await`的作用是把`promise`对象转换成结果（`resolve/reject`的内容)

 ```
 function timeout(ms) {
    return 2
}
(async function (ms) {
    console.log(await timeout(ms));
})(1000)
//2
 ```
4. 使用`try / catch` 捕捉错误

5. 可以使用于循环

 ```
 function timeout(ms) {
    return new Promise((resolve, reject)=> {
        setTimeout(function () {
            resolve(1);
        }, ms);
    })
}
(async function (ms) {
    for (let i = 0; i < 5; i++) {
        console.log(await timeout(1000 * i));
    }
})(1000)
 ```

6. async 函数返回一个Promise

 ```
function timeout(ms) {
    return new Promise((resolve, reject)=> {
        setTimeout(function () {
            resolve(1);
        }, ms);
    })
}
const test = (async function (ms) {
    return await timeout(ms);
})(1000);
console.log('test', test)
test.then(value=>console.log('value', value));
//test Promise { <pending> }
//value 1
```

###### async await
> generator+自动执行器

在深入了解`async await` 之前，必须先知道什么是`generator`

```
let idx = 1;
function * get() {
    idx++;
    yield idx;
    idx++;
    return idx;
}
const iterator = get();
console.log(iterator.next());//{ value: 2, done: false}
console.log(iterator.next());//{ value: 3, done: true}
```
`generator`返回一个迭代器需要手动调用`next`来使代码执行下去。这种方式代码不在从头至尾一次性执行完毕，而是遇到`yield`，暂停代码执行直到调用`next`。当所有的`yield`执行完，会返回一个标示。

基于此我们可以写一个自动执行器来代替手动`next`即可。

```
function run(task) {
    const {done, value}=task.next();
    if (!done) {
        return value.then(function () {
            return run(task);
        });
    } else {
        return value;
    }
}
```
其实`async`就是`Generator`的语法糖 等于`Generator+自动执行器`。
