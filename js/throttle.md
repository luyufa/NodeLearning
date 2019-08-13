## 节流
> throttle，函数在规定时间内，仅能被执行一次

比较常见场景如前端类似动画渲染、`resize`、`scroll`，鼠标等事件，使用节流可以减轻浏览器重绘重排渲染压力。


一种采用**时间戳**的实现方式，思路为触发时设置一个时间戳，再次触发时判断当前时间戳-上次时间戳是否大于间隔wait，如果大于则立马执行，且更新时间戳。
```js
function throttle(func, wait) {
    let pre = 0, args;
    const ctx = this;

    return function () {
        const now = new Date();
        args = arguments;
        if (now - pre > wait) {
            func.apply(ctx, args);
            pre = now;
        }
    };
}
```



另一种采用**定时器**的做法，思路为触发时设置一个定时器，再次触发时如果存在定时器则跳过，任由定时器到时触发；如果不存在定时器则设置一个定时器。而这种方法下，再n秒后才会触发第一次

```js
function throttle(func, wait) {
    let timer = null, args;
    const ctx = this;
    return function () {
        args = arguments;
        if (!timer) {
            timer = setTimeout(function () {
                timer = null;
                func.apply(ctx, args);
            }, wait);
        }
    };
}
```



那两者有何区别呢？
1. 第一种方法下会立即执行第一次；而第二种方法会直到n秒后才会执行第一次
2. 第一种方法在停止触发后就不会再有执行；而第二种方法当停止触发后，最长n秒后还有可能再执行一次



###### 首尾兼顾
> 第一次触发即立即执行，停止最后一次触发后还能再执行一次

1. `leading:false`，表示禁止第一次触发即立即执行
2. `trailing:false`，表示停止最后一次触发后，禁止执行

```js
function throttle(func, wait, op) {
    let pre = 0, args, timer;
    let ctx = null;
    const {leading, trailing} = op;

    function throttled() {
        ctx = this;
        args = arguments;

        const now = +new Date();
        if (!pre && !leading) { // 第一次 && 禁用标识
            pre = now;
        }

        const remaining = wait - (now - pre); // 触发后离执行剩余时间
        /**
         * remaining-wait = -(now-pre)
         * remaining-wait = pre-now
         * 因为正常逻辑pre-now恒小于0
         * 所以wait恒大于remaining
         * 即当且仅当手动设置now为过去的时间也会导致立即触发一次执行
         */

        if (remaining <= 0 || wait < remaining) { // 首次触发remaining<0，执行
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
            pre = now;
            func.apply(ctx, args);
        } else if (!timer && !trailing) { //第二次触发，等待计时器到时执行 && 禁止计时器
            timer = setTimeout(function () {
                pre = !leading ? 0 : +new Date(); // 防止判断第一次失效，同一事件，分两个时间段监听，需保证两段内都可以第一次禁用执行

                pre = +new Date();
                timer = null;
                func.apply(ctx, args);
            }, remaining);
        }
    }


    throttled.cancel=function(){

    }

    return throttled;
}
```

2. 立即取消

```
onThrottle.cancel = function () {
        clearTimeout(timer);
        pre = 0; // 恢复pre
        timer = null;
    };
```
