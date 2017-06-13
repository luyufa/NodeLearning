###  async流程控制

> Async is a utility module which provides straight-forward, powerful functions for working with asynchronous JavaScript。[API](http://caolan.github.io/async/)

if any of the tasks pass an error to their own callback, the next function is not executed, and the main callback is immediately called with the erro

1. `waterfall`

 ```
 function asyncWaterfall(tasks, callback) {
    if (!Array.isArray(tasks)) {
        callback(`${tasks} must be an array`);
    }

    (function next(...args) {
        if (args[0]) {
            return callback(args[0]);
        }
        if (tasks.length) {
            const fn = tasks.shift();//如果存在任务就去一个出来执行
            fn.apply(null, Array.prototype.slice.call(args, 1).concat(onlyOnce(next)));//去掉第一个错误参数
        } else {
            callback.apply(null, Array.prototype.slice.call(args));
        }
    })();

    function onlyOnce(next) {
        let flag = false;
        return (...args)=> {//仅允许回调函数执行一次
            if (flag) {
                return next(new Error('cb already called'));
            } else {
                next.apply(null, args);
                flag = true;
            }
        };
    }
}
```

2. `each`

  ```
function asyncEach(items, iterator, callback) {
    if (!Array.isArray(items)) {
        callback(`${items} must be an array`);
    }

    if (typeof iterator !== 'function') {
        return callback(new Error('iterator should be a function!'));
    }

    let count = 0;
    let onlyOnceCallback = false;

    function next(err) {
        if (err && !onlyOnceCallback) {//callback只接受最先抛出的错误
            onlyOnceCallback = true;
            return callback(err);
        }
        if ((++count >= items.length) && !onlyOnceCallback) {
            onlyOnceCallback = true;
            return callback();
        }
    }

    function onlyOnce(fn) {
        let flag = false;
        return err=> {
            if (flag) {
                throw fn(new Error('cb already called'));
            } else {
                fn(err);
                flag = true;
            }
        };
    }

    items.map(task=>iterator(task, onlyOnce(next)));
}
 ```

3. `eachLimit`

 ```
function asyncEachLimit(items, limit, iterator, callback) {
    if (!Array.isArray(items)) {
        return callback(new Error('items should be an array!'));
    }

    if (typeof iterator != 'function') {
        return callback(new Error('iterator should be a function!'));
    }

    let running = 0;
    let onlyOnceCallback = false;

    (function next() {
        while (running < limit && !onlyOnceCallback) {
            let item = items.shift();

            if (!item) {
                if (running <= 0 && !onlyOnceCallback) {
                    onlyOnceCallback = true;
                    return callback();
                }
                return;
            }
            running++;
            iterator(item, function (err) {
                running--;
                if (err && !onlyOnceCallback) {
                    onlyOnceCallback = true;
                    return callback(err);
                } else {
                    next();
                }
            });

        }
    })
    ();
}
```

4. `whilst`

 ```
function asyncWhilst(test, iterator, callback) {
    if (typeof test != 'function') {
        return callback(new Error('iterator should be a function!'));
    }
    if (typeof iterator != 'function') {
        return callback(new Error('iterator should be a function!'));
    }

    (function next() {
        if (test()) {
            iterator(function (err) {
                if (err) {
                    callback();
                } else {
                    next();
                }
            });
        } else {
            callback();
        }
    })();
}

 ```

5. `asyncRedcue`

 ```
 function asyncReduce(items, iterator, callback, results) {
    (function next() {
        let item = items.shift();
        if (!item) {
            callback(null, results);
        } else {
            iterator(item, results, function (err) {
                if (err) {
                    callback(err);
                } else {
                    next();
                }
            });
        }
    })();
}
 ```

6. `parallel`

 ```
 function asyncParallel(tasks, callback) {

    let count = 0;
    let results = [];
    let onlyOnceCallback = false;
    tasks.map(task=> {
        task(function (err, ...args) {
            if (err && !onlyOnceCallback) {
                onlyOnceCallback = true;
                return callback(err, results);
            } else {
                count++;
                results = results.concat(Array.prototype.slice.call(args));
                if ((count === tasks.length) && !onlyOnceCallback) {
                    onlyOnceCallback = true;
                    return callback(null, results);
                }
            }
        });
    });
}

 ```

参考链接:

* [Async 模块实现入门浅析](https://zhuanlan.zhihu.com/p/27303127?group_id=857567989694881792)
