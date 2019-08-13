## 防抖
> debounce，函数在n秒后才会被执行，如果n秒之内再次调用，那么再重新计时

比较常见的场景诸如搜索框输入内容后无需立即调用接口，等待用户输入法停顿完毕后，再调用接口，可大大减轻服务器压力。

1. 由上面简单介绍可以写出如下代码

```js
function debounce(fn, wait) {
    let timeout = null;
    return function () {
        clearTimeout(timeout);
        timeout = setTimeout(fn, wait);
    };
}
```

2. `this`指向,在`js`中当我们为`dom`元素绑定监听器时，该监听器`this`是指向该`dom`元素的，而如果使用了`debounce`，其中的`setTimeout`会使`this`指向`window`

```
function debounce(fn, wait) {
    let timeout = null;
    return function () {
        const ctx = this;
        clearTimeout(timeout);
        timeout = setTimeout(function () {
            fn.apply(ctx);//修正this指向
        }, wait);
    };
}
```


3. `event`对象，事件监听器的第一个参数默认为`event`对象。

```
function debounce(fn, wait) {
    let timeout = null;
    return function () {
        const ctx = this;
        const args = Array.prototype.slice.call(arguments);//获取event对象

        clearTimeout(timeout);
        timeout = setTimeout(function () {
            fn.apply(ctx, args);//修正this指向
        }, wait);
    };
}
```


4. 立即执行+返回值，为了功能更加完善，我们可以支持，先立即执行，随后n秒后才能被再触发；由于使用`setTimeout`，所以在非立即执行下，无法返回函数值；故仅在立即执行的情况下支持函数返回值

![5](https://github.com/luyufa/NodeLearning/blob/master/js/5.png)

```
function debounce(fn, wait, immediate) {
    let timeout = null;
    return function () {
        const ctx = this;
        const args = Array.prototype.slice.call(arguments);

        const callNow = !timeout;
        //第一次调用或计时时间到主动设置为null，此两种情况可以触发立即执行

        clearTimeout(timeout);

        if (immediate) {
            timeout = setTimeout(function () {
                timeout = null;//计时时间到后，可以重新被执行
            }, wait);
            callNow && fn.apply(ctx, args);
        } else {
            timeout = setTimeout(function () {
                fn.apply(ctx, args);
            }, wait);
        }
    };
}
```


5. 立即取消,可以立即取消本次防抖，取消只有在立即执行环境下才有意义

```
function debounce(fn, wait, immediate) {
    let timeout = null;

    function onDebounce() {
        const ctx = this;
        const args = Array.prototype.slice.call(arguments);

        const callNow = !timeout;
        clearTimeout(timeout);

        if (immediate) {
            timeout = setTimeout(function () {
                timeout = null;
            }, wait);
            if (callNow) {
                return fn.apply(ctx, args);
            }
        } else {
            timeout = setTimeout(function () {
                fn.apply(ctx, args);
            }, wait);
        }
    }

    onDebounce.cancel = function () {
        clearTimeout(timeout)//关闭计时器即可
        timeout = null;
    }
    return onDebounce;
}
```