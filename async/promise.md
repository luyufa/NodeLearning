### Promise

> 身怀异步请求，无论是与非，承诺未来某一刻把结果告诉你。


```
    const STATUS = {
        pending: 1,
        resolved: 2,
        rejected: 3
    };
```
Promise就像状态机一样，内部维护一个status,表明当前promise状态，仅可以由`pending->resolved`,`pending->rejected`，一旦转变不可在发生变化


```

    function _Promise(executor) {
        const self = this;

        let data = null;
        let status = STATUS.pending;

        self.onResolvedCallback = [];
        self.onRejectedCallback = [];

        //闭包实现变量私有化,不允许外部修改
        this.getStatus = function () {
            return status;
        };
        this.getData = function () {
            return data;
        };


        function resolve(value) {
            if (status === STATUS.pending) {
                status = STATUS.resolved;
                data = value;
                self.onResolvedCallback.forEach(fun=>fun(value));
            }
        }

        function reject(err) {
            if (status === STATUS.pending) {
                status = STATUS.rejected;
                data = err;
                self.onRejectedCallback.forEach(fun=>fun(err))
            }
        }

        try {//捕获同步代码中的异常
            executor(resolve, reject);
        } catch (err) {
            return reject(err);
        }

    }

```
构造函数，初始化一个promsie时便`立即执行`,其内部变量status外部不可访问，执行时若抛出同步错误可以被后续catch捕获。



```
somePromise().then(function () {
  // I'm inside a then() function!
});

```
What can we do here? There are three things:

1. `return` otherPrmise
2. `return` syncValue(undefined)
3. `throw` syncError


```
  _Promise.prototype.then = function (onResolved, onRejected) {//挂在原型链
        //返回新Promise,Promise的状态一经确定不允许在修改,链式调用
        const self = this;

        //穿透性,只接受函数作为参数
        onResolved = typeof onResolved === 'function' ? onResolved : function (value) {
            return value;
        };
        onRejected = typeof  onRejected === 'function' ? onRejected : function (err) {
            return err;
        };

        switch (self.getStatus()) {
            case STATUS.resolved:
                return new _Promise((resolve, reject)=> {
                    process.nextTick(function () {//then方法异步调用setTimeout/setImmediate
                        try {
                            const value = onResolved(self.getData());
                            if (value instanceof _Promise) {
                                value.then(resolve, reject);//如果返回值是一个promise则,递归执行下去,直到不返回promise为止。
                            } else {
                                resolve(value);//如果返回值是一个同步值或undefined,直接resolve
                            }
                        } catch (err) {
                            return reject(err);//如果抛出一个同步错误,直接reject
                        }
                    });
                });

            case STATUS.rejected:
                return new _Promise((resolve, reject)=> {
                    process.nextTick(function () {
                        try {
                            const value = onRejected(self.getData());
                            if (value instanceof _Promise) {
                                value.then(resolve, reject);
                            } else {
                                reject(value);
                            }
                        } catch (err) {
                            return reject(err);
                        }
                    });
                });

            case STATUS.pending://因为promise中或许会有异步代码,所以先把用户的回调函数保存下来,等到调用resolve时在执行。
                return new _Promise((resolve, reject)=> {
                    self.onResolvedCallback.push(()=> {
                        try {
                            const x = onResolved(self.getData());
                            if (x instanceof _Promise) {
                                x.then(resolve, reject);
                            } else {
                                resolve(x);
                            }
                        } catch (err) {
                            reject(err);
                        }
                    });

                    self.onRejectedCallback.push(()=> {
                        try {
                            const x = onRejected(self.getData());
                            if (x instanceof _Promise) {
                                x.then(resolve, reject);
                            } else {
                                reject(x);
                            }
                        } catch (err) {
                            reject(err);
                        }
                    });
                });

        }

    };
```

`then`方法，在事件循环开始之前，同步队列执行完成之后，获得执行，仅接受函数作为参数（非函数会被忽略即`穿透性`）,永远返回一个`新promise`。


catch就是封装过的then,但用起来却有所差异

```
somePromise().then(function () {
  throw new Error('oh noes');
}).catch(function (err) {
  // I caught your error! :)
});


somePromise().then(function () {
  throw new Error('oh noes');
}, function (err) {
  // I didn't catch your error! :(//then方法的第一个函数抛出的错误无法捕获
});

```

Promise.resolve实现,返回一个promise

```
_Promise.resolve = function (value) {// 类方法
        return new _Promise((resolve, reject)=> {
            resolve(value);
        });
    };
```

###### Puzzle #1
```
doSomething().then(function () {
  return doSomethingElse();
}).then(finalHandler);

doSomething
|-----------------|
                  doSomethingElse(undefined)
                  |------------------|
                                     finalHandler(resultOfDoSomethingElse)
                                     |------------------|
```

###### Puzzle #2

```
doSomething().then(function () {
  doSomethingElse();
}).then(finalHandler);

doSomething
|-----------------|
                  doSomethingElse(undefined)
                  |------------------|
                  finalHandler(undefined)
                  |------------------|
```


###### Puzzle #3

```
doSomething().then(doSomethingElse())
  .then(finalHandler);

  doSomething
|-----------------|
doSomethingElse(undefined)
|---------------------------------|
                  finalHandler(resultOfDoSomething)
                  |------------------|
```

###### Puzzle #4

```
doSomething().then(doSomethingElse)
  .then(finalHandler);

  doSomething
|-----------------|
                  doSomethingElse(resultOfDoSomething)
                  |------------------|
                                     finalHandler(resultOfDoSomethingElse)
                                     |------------------|
```


###### promise并发控制

```
function concurrency(urls, limit) {
    return new Promise(resolve=> {
        limit = urls.length < limit ? urls.length : limit;
        let finish = 0;
        const results = [];

        function _load(url) {
            return new Promise(r=>setTimeout(()=>r(url), 2000 + Math.random() * 2000));
        }

        function _next() {
            const url = urls.shift();
            if (url) {
                _load(url).then(res=> {
                    results.push(res);
                    _next();
                })
            } else if (++finish === limit) {
                return resolve(results);
            }
        }

        for (let i = 0; i < limit; i++) {
            _next();
        }
    })
}
```


参考链接:

* [promise实现](https://github.com/xieranmaya/blog/issues/3)
* [promise解惑](https://pouchdb.com/2015/05/18/we-have-a-problem-with-promises.html)
