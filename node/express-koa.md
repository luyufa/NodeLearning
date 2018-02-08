## express vs koa

1. express集成了路由、模板等功能，而koa仅仅是一个框架，需要路由就npm路由中间件(koa-route),从这点出发，express功能全且多，koa更像是一个架子，需要其他模板按上去使用，更为精简。


2. 两者都封装了`request`和`response`，但是`koa`把`request`和`response`挂在`ctx`上，而express直接作为参数暴露

koa实例
```
const koa = require('koa');
const router = require('koa-route');
const static = require('koa-static');
const app = new koa();
app.use(static(__dirname));
app.use(router.get('/api', (ctx, next) => {
    ctx.response.body = 'hello world';
}));
app.listen(8000,function () {
    console.log('listen 8000')
});
```
express实例
```
const express = require('express');
const app = express();
app.use(express.static(__dirname));
app.get('/api', function (req, res, next) {
    return res.send('hello world')
});
app.listen(8000);
```


3. 异步流程控制

express采用callback的方式，核心思想就是维护一个中间件数组，需要调用下一个时就next。
   * 将所有 处理逻辑函数(中间件) 存储在一个list中；
   * 请求到达时 循环调用 list中的 处理逻辑函数(中间件)；

```
const middleWares = [
    async function (next) {
        console.log(1);
        await next();
        console.log(2)
    },
    async function (next) {
        console.log(3);
        await next();
        console.log(4)
    },
    async function (next) {
        console.log(5);
        await next();
        console.log(6);
    }
];
function run() {
    let i = 0;
    function next(err) {
        if (err) {
            throw err;
        }
        if (i < middleWares.length) {
            middleWares[i++](next);
        }
    }
    next();
}
run();//1 3 5 6 4 2
```

koa采用promise的方式进行流程控制,其思想差不多维护一个中间件数组，需要调用时next，但是promise封装过一层。

原版
```
function compose (middleware) {
    return function (context, next) {
        let index = -1
        return dispatch(0)
        function dispatch (i) {
            if (i <= index) return Promise.reject(new Error('next() called multiple times'))
            index = i
            let fn = middleware[i]
            if (i === middleware.length) fn = next
            if (!fn) return Promise.resolve()
            try {
                return Promise.resolve(fn(context, function next () {
                    return dispatch(i + 1)
                }))
            } catch (err) {
                return Promise.reject(err)
            }
        }
    }
}
```

简化版，和express易做对比
```
const middleWares = [
    async function (next) {
        try {
            console.log(1);
            await next();
            console.log(2)
        } catch (err) {
            console.log('err', err);
        }
    },
    async function (next) {
        console.log(3);
        await next();
        console.log(4)
    },
    async function (next) {
        console.log(5);
        await next();
        console.log(6);
    }
];

function run() {
    let i = 0;

    function next(err) {
        if (err) {
            throw err;
        }
        if (i < middleWares.length) {
            return Promise.resolve(middleWares[i++](next));
        }
    }
    next();
}

run();
```

由于底层异步流程控制实现不同，Express 使用 callback 捕获异常，对于深层次的异常捕获不了，
Koa 使用 try catch，能更好地解决异常捕获。

