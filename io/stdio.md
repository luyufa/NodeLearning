### stdio和console

>stdio 对应 输入流`process.stdin(Readable)` 输出流`process.stdout(Writable)`  错误流`process.stderr(Writable)`


Node进程启动时，首先fork当前shell进程(Node进程父进程id为shell进程id，ps命令可以查看)，由此shell进程的stdio被直接继承给了Node进程，所以Node进程里面将数据写入到 stdout, 也就是写入到了 shell 的 stdout, 即在当前 shell 上显示了。

##### 自定义console

```
function console() {
    function toString(o) {
        if (Object.prototype.toString.call(o) === '[object Array]') {
            let str = '[ ';
            o.forEach(item=> {
                str += toString(item) + ',';
            });
            str = str.slice(0, str.length - 1);
            str += ' ]';
            return str;
        }
        else if (Object.prototype.toString.call(o) === '[object Object]') {
            let str = '{ ';
            Object.keys(o).forEach(key=> {
                str += key + ':' + toString(o[key]) + ',';
            });
            str = str.slice(0, str.length - 1);
            str += ' }';
            return str;
        }
        else {
            return o;
        }
    }

    let totalLength = 0;
    const bufferList = (Array.prototype.slice.apply(arguments) || []).map(item=> {
        let buf = Buffer.from(toString(item));
        totalLength += buf.length;
        return buf;
    });

    process.stdout.write(Buffer.concat(bufferList, totalLength));
    process.stdout.write('\n');
}

```