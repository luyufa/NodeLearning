## child_process

> 都是异步方法、都返回一个ChildProcess对象、实现`EventEmitter`、继承`Stdio`


 `const {spawn, exec, execFile, fork}=require('child_process');`

* `execFile` 不生成shell,应用程序使用PATH环境变量、或绝对路径

```
const child_execFile = execFile('node', ['--version']);
child_execFile.stdout.on('data', function (chunk) {
    console.log('child_execFile', chunk.toString());
});
```

 * `exec` 生成一个shell,直接传递完整的命令字符串由shell执行,一次执行多条命令,shell注入,
相对execFile高效

```
const child_exec = exec('node --version ; pwd');
child_exec.stdout.on('data', function (chunk) {
    console.log('child_exec', chunk.toString());
});
```

* `spawn` 处理生成大量数据的应用程序
 内存占用空间不足
 自动处理背压
 在缓冲块中生成或消耗数据。
 事件和非阻塞
 缓冲区允许您解决V8堆内存限制

```
const child_spawn = spawn('node', ['--version']);
child_spawn.stdout.on('data', function (chunk) {
    console.log('child_spawn', chunk.toString());
});
```


* `fork` 专门用于生成新的NodeJS进程 在Node进程之间打开IPC通道,进行消息传递,有自己的V8内存 `child.send()`
` child.on('message)`
` process.send()`
` process.on('message')`

```
const child_fork = fork('./myInternet.js');
child_fork.send('from process');
child_fork.on('message', chunk=>console.log(chunk.toString()));
```
