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
