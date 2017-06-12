function asyncIterator(arr, iterator, callback) {
    if (Object.prototype.toString.call(arr) !== '[object Array]') {
        return callback({reason: 'params wrong'});
    }
    let count = 0;
    (function iterate(arr) {
        if (count === arr.length) {
            return callback(null);
        }
        iterator(arr[count++], function (err) {
            if (err)
                return callback(err);
            else
                return iterate(arr);
        })
    })(arr);
}


function asyncPall(arr, iterator, callback) {
    let count = 0;
    let current = 0;
    while (count < arr.length) {
        iterator(arr[count++], function (err) {
            if (err)                 return callback(err);
            if (current++ === arr.length) {
                return callback();
            }
        })
    }
}


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

asyncReduce([1, 2, 3], (results, item, cb)=> {
    setTimeout(function () {
        results.push(item * 2)
        cb();
    }, 1000)
}, function (err, results) {
    console.log('err', err)
    console.log('results', results)
}, [])


function sleep(ms) {
    const now = Date.now();
    const expire = now + ms;
    while (Date.now() < expire) {
    }
}

// sleep(10000)
console.log(1);