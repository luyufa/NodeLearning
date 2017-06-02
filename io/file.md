## 文件

>“一切皆是文件”是 Unix/Linux 的基本哲学之一, 不仅普通的文件、目录、字符设备、块设备、套接字等在 Unix/Linux 中都是以文件被对待, 也就是说这些资源的操作对象均为 fd (文件描述符), 都可以通过同一套 system call 来读写.

##### 关于Node里的路径

1. `process.cwd()`执行Node进程所在目录
2. `__dirname`当前执行脚步文件所在目录
3. `__filename`当前执行脚步所在路径
4. `./`当前执行脚本文件所在目录
5. `../`当前执行脚本文件所在目录的上级目录


可以使用`path`模块中`resolve`把路径转换为绝对路径，`join`避免不同系统下连接符差异(linux为/,win为\....)


#### 文件的基本操作

在Node中`fs`模块所有文件操作的方法都提供了`同步`和`异步`两套

##### 1. 查询文件信息

`fs.stat(fs.statSync)`,查询文件信息，文件不存在会抛出异常。返回的stat对象拥有`isFile()` `isDirectory()`等方法

```
const fs = require('fs');
console.log(fs.statSync('./io/buffer.md'))
```

##### 2. 打开文件
>文件描述符（file descriptor）是内核为了高效管理已被打开的文件所创建的索引，其是一个非负整数（通常是小整数），用于指代被打开的文件，所有执行I/O操作的系统调用都通过文件描述符

`fs.open`,打开文件（如果是目录会抛出异常），返回一个整数代表文件描述符。


 * r 打开文本文件进行读取，数据流位置在文件起始处
 * r+ 打开文本文件进行读写，数据流位置在文件起始处
 * w 如果文件存在，将其清零，不存在创建写入文件。数据流位置在文件起始处
 * w+ 打开文件进行读写，如果文件存在，将其清零，不存在创建写入文件。数据流位置在文件起始处
 * a 打开文件写入数据，如果文件存在，将其清零，不存在创建写入文件。数据流位置在文件结尾处，此后的写操作都将数据追加到文件后面
 * a+ 打开文件进行文件读写，如果文件存在，将其清零，不存在创建写入文件。数据流位置在文件结尾处，此后的写操作都将数据追加到文件后面

##### 3. 读取文件写入文件
文件的写入与读取，只要是`fs.write`和`fs.read`通过文件`fd`，`fs.writeFile`和`fs.readFile`通过文件路径

```
const fs = require('fs');
const fd = fs.openSync('./io/stream.md', 'a+');
console.log('fd', fd);

fs.writeSync(fd, Buffer.from('abc'));

const buff = Buffer.alloc(100);
console.log(fs.readSync(fd, buff, 0, buff.length, 0));
console.log('buff.toString()', buff.toString());
```

##### 4. 关闭文件

`fs.close(fd, callback)`,Node进程退出后就会关闭文件。在实际使用中，不能依靠进程退出来关闭文件，因此必须跟踪那些已打开的文件描述，在使用完毕后使用fs.close()方法关闭文件。

```
fs.open('./fs.txt', 'a', function (err, fd) {
    //对文件一些操作

    //操作完成后，关闭文件
    fs.close(fd, function(err){
    })
})
```

##### 5. 文件是否存在

此方法异步版已被废除（回调函数参数和其他node回调函数参数不一致）

```
fs.existsSync()
```
通过fs.stat()获取stat对象存在且stat.isFile()为true就能确认文件存在。

```
fs.stat('/xxx', function(err, stat){
    if(stat&&stat.isFile()) {
	console.log('文件存在');
    } else {
	console.log('文件不存在或不是标准文件');
    }
});
```

`fs.access()`用于检查到指定path路径的目录或文件的访问权限。其回调函数中有一个参数(err)，如果检查失败则会出现错误参数的响应。mode是要检查的权限掩码，它可以是以下枚举值之一:

* `fs.F_OK` - 文件是对于进程是否可见，可以用来检查文件是否存在。也是mode 的默认值
* `fs.R_OK` - 文件对于进程是否可读
* `fs.W_OK` - 文件对于进程是否可写
* `fs.X_OK` - 文件对于进程是否可执行。（Windows系统不可用，执行效果等同fs.F_OK）

```
fs.access('/etc/passwd', function(err) {
    console.log(err ? '文件存在' : '文件不存在');
});
```

##### 6. 文件删除
不在使用的文件可以用`fs.unlink()`方法进行删除，删除前应检查文件是否存在，`fs.unlinkSync()`是其同步版本

##### 7. 目录操作
fs模块对目录的操作主要有：`fs.readdir()`，读取文件夹下所有文件名。`fs.mkdir()`，创建目录。`fs.rmdir()`，删除目录。`fs.mkdir()`创建目录时有第二个可选参数用于指定目录权限，不指定是权限为`0777`。这三个方法都sync同步方法。示例如下：



#### 遍历目录下所有文件

```
const fs = require('fs');
const path = require('path');
function traversingDirectory(dir) {
    const results = [];
    (function traversingDirectoryHandler(dir) {
        if (!fs.existsSync(dir)) {
            throw new Error('dir not found');
        }
        dir = path.resolve(dir);
        const stat = fs.statSync(dir);
        if (stat.isFile()) {
            results.push(dir);
        } else if (stat.isDirectory()) {
            const dirs = fs.readdirSync(dir);
            dirs.forEach(file=>traversingDirectoryHandler(path.join(dir, file)));
        }
    })(dir);
    return results;
}

```

参考链接:

* [Node.js文件操作模块fs](https://itbilu.com/nodejs/core/4y-N3wJS.html)