###  async流程控制

> Async is a utility module which provides straight-forward, powerful functions for working with asynchronous JavaScript。[API](http://caolan.github.io/async/)

if any of the tasks pass an error to their own callback, the next function is not executed, and the main callback is immediately called with the erro

1. 顺序执行，并且参数依次传递

 ```
const async = require('async');
async.waterfall([
    (cb)=> {
        setTimeout(function () {
            cb(null, 1);
        }, 1000)
    },
    (value, cb)=> {
        setTimeout(function () {
            cb(null, value, 2);
        }, 1000)
    }
], (err, v1, v2)=> {
    console.log(v1, v2);
});
//1,2
```

2. 顺序执行，不传递参数

  ```
 const async = require('async');
 async.series([
    (cb)=> {
        setTimeout(function () {
            cb(null, 1);
        }, 1000)
    },
    (cb)=> {
        setTimeout(function () {
            cb(null, 2);
        }, 1000)
    }
], (err, results)=> {
    console.log(results);
});
//[1,2]
 ```

3. 并发执行

 ```
const async = require('async');
async.parallel([
    cb=> {
        setTimeout(function () {
            cb(null, 1)
        }, 1000)
    }, cb=> {
        setTimeout(function () {
            cb(null, 2)
        }, 1000)
    },

 ], (err, result)=> {
    console.log(result)
});
//[1,2]
```

4. 循环

 ```
 const async = require('async');

 let stop = true;
 let count = 0;
 async.whilst(
    ()=> stop,
    cb=> {
        setTimeout(function () {
            if (count++ === 2) {
                stop = false
            }
            cb(null, count);
        }, 500)
    },
    (err, results)=> {
        console.log(results);
    });
    //3
 ```

5. 对数组元素调用同一方法不管返回值

 ```
//并发
const async = require('async');
async.each([1, 2, 3], (item, cb)=> {
    setTimeout(function () {
        console.log(item)
        cb('a',item)
    }, 500)
},(err)=>{
    console.log(err)
});
//1 a 2 3


 //顺序执行
const async = require('async');
async.eachSeries([1, 2, 3], (item, cb)=> {
    setTimeout(function () {
        console.log(item)
        cb('a',item)
    }, 500)
},(err)=>{
    console.log(err)
});
//1 a
```


####  异步流程自实现

`异步顺序执行迭代器`

```
function myAsyncIterator(arr, iterator, callback) {
    if (Object.prototype.toString.call(arr) !== '[object Array]') {
        return callback({reason: 'params wrong'});
    }
    let count = 0;
    (function iterate() {
        if (count >= arr.length) {
            return callback()
        } else {
            iterator(arr[count++], function (err) {
                if (err) {
                    return callback(err);
                } else {
                    return iterate();
                }
            })
        }
    })();
}
```


`异步并发执行迭代器`

```
function myAsyncPallIterator(arr, iterator, callback) {
    let count = 0;
    let finish = 0;
    while (count < arr.length) {
        iterator(arr[count++], function (err) {
            if (err) {
                callback(err)
            } else {
                if (finish++ === arr.length) {
                    callback()
                }
            }
        })
    }
}
```

以此基础实现`异步Reduce`

```
const asyncReduce = function (arr, iterator, callback, results) {
    myAsyncIterator(arr, function (item, cb) {
        iterator(results, item, function (err) {
            if (err) {
                callback(err)
            } else {
                cb()
            }
        })
    }, err=> {
        if (err) {
            callback(err)
        } else {
            callback(null, results);
        }
    })
};
```