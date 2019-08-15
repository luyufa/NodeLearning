## 数组去重


使用`indexOf`便可以轻易实现一个去重功能，但在之前我们先了解下`indexOf`的实现,可以看到主要还是使用遍历又则返回元素下标，没有则返回-1。
```js
Array.prototype.indexof = function (item, fromIndex = 0) {
    const len = this.length;
    if (!fromIndex) {
        fromIndex = 0;
    }
    if (!len || len - 1 < fromIndex) {
        return -1;
    }
    fromIndex = +fromIndex;
    while (fromIndex < len) {
        if (this[fromIndex] === item) {
            return fromIndex
        }
        fromIndex++;
    }
    return -1;
};
```

在此基础上我们来使用indexOf实现一个去重函数

```js
function uniqueByIndexOf(arr) {
    const res = [];
    for (let i = 0; i < arr.length; i++) {
        const cur = arr[i];
        if (res.indexOf(cur) === -1) {
            res.push(cur)
        }
    }
    return res
}
```

 之前数组的无序的，假如数组是一个有序数组呢？是不是可以直接比较当前值和上一个值是否一样就好了，一样则说明重复了

 ```js
 function uniqueBySortArray(arr) {
    const res = [];
    let pre = null;
    for (let i = 0; i < arr.length; i++) {
        const cur = arr[i];
        if (!pre || pre !== cur) {
            res.push(cur)
        }
        pre = cur;
    }
    return res;
}
 ```

通常我们需要去重的数组，其元素不一定会是一个简单的基础类型，或者我们需要把元素转换一下再做对比，比如不区分大小写等，这时我们就可以提供一个进行“转换”的函数。

```js
function uniqueByIterator(arr, sorted, iterator) {
    const res = [];
    const computedRes = [];
    let pre = null;

    for (let i = 0; i < arr.length; i++) {
        const cur = arr[i];
        const computedCur = typeof iterator === 'function' ? iterator(cur, i, arr) : cur;
        if (sorted) {
            if (!pre || pre !== computedCur) {
                res.push(cur)
            }
            pre = computedCur;
        } else {
            if (computedRes.indexOf(computedCur) === -1) {
                res.push(computedCur);
                res.push(cur)
            }
        }
    }
    return res;
}
```


借助`ES6`的`Set`、`filter`等可以大大简化代码，仅仅一行代码就可以完成去重

```js
const uniqueByES6 = arr => Array.from(new Set(arr));

const uniqueBySortArrayWithFilter = arr => arr.filter((item, index) => index === 0 || item !== arr[index - 1])

```
