## cluster
> A single instance of Node.js runs in a single thread. To take advantage of multi-core systems, the user will sometimes want to launch a cluster of Node.js processes to handle the load.The cluster module allows easy creation of child processes that all share server ports.


`Node`中的`javascript`是单进程单线程模型的，也就是说`Node`只能利用一个`cpu`，而无法享受多核`cpu`带来的性能提升，于是`Node`官方给出来一个解决方案`cluster`,如上文所说，`cluster`可以创建共享端口的子进程，已达到充分利用`cpu`。


先看个最简单栗子，这是`cluster`模块的基础用法

```
'use strict';
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
    console.log(`master ${process.pid} is running`);

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    cluster.on('exit', function cb(worker) {
        console.log(`worker ${worker.process.pid} exit`);
    });
} else {
    //TODO
     http.createServer((req, res) => {
        res.writeHead(200);
        res.end('hello world\n');
     }).listen(8000);
    console.log(`worker ${process.pid} is running`);
}

```

上面代码很容易引发两个思考
  1. 为什么多次`listen(8000)`，却不会报端口占用？
  2. fork出来的子进程是按照什么规则接收请求的？


要解决上面两个问题我们打开源码`/lib/cluster`，中仅两行

```
const childOrMaster = 'NODE_UNIQUE_ID' in process.env ? 'child' : 'master';
module.exports = require(`internal/cluster/${childOrMaster}`);
```
如果环境变量`env`中不存在`NODE_UNIQUE_ID`为`master`进程，那么就`require('internal/cluster/master')`


```
module.exports = cluster;

cluster.isWorker = false;
cluster.isMaster = true;
var ids = 0;

cluster.fork = function(env) {
  cluster.setupMaster();

  const id = ++ids;
  const workerProcess = createWorkerProcess(id, env);
  const worker = new Worker({
    id: id,
    process: workerProcess
  });
};

function createWorkerProcess(id, env) {
  const workerEnv = util._extend({}, process.env);
  workerEnv.NODE_UNIQUE_ID = '' + id;

  return fork(cluster.settings.exec, cluster.settings.args, {
    env: workerEnv
  });
}
```
来到`lib/internal/cluster/master.js`，可以得知，`master`启动后每`fork`一个`worker`都会赋值一个从零自增的整数`NODE_UNIQUE_ID`。之后使用该字段判断是否为`worker`进程，如是则`require('internal/cluster/child')`

要搞懂第一个问题，我们先打开`lib\net.js`

```
Server.prototype.listen = function(){
    listenInCluster()
}

function listenInCluster(server, address, port, addressType,
                         backlog, fd, exclusive) {

  if (cluster.isMaster) {
    server._listen2(address, port, addressType, backlog, fd);
    return;
  }

  const serverQuery = {
    address: address,
    port: port,
    addressType: addressType,
    fd: fd,
    flags: 0
  };

  // Get the master's server handle, and listen on it
  cluster._getServer(server, serverQuery, listenOnMasterHandle);

  function listenOnMasterHandle(err, handle) {
    // Reuse master's server handle
    server._handle = handle;

    // _listen2 sets up the listened handle
    server._listen2(address, port, addressType, backlog, fd);
  }
}
```
1. 如果是`master`进程就直接监听端口
2. 如果是`worker`进程就调用`worker`进程的`_getServer`方法
`lib/internal/cluster/child.js`,去hack `worker`中的`listen`方法

```
cluster._getServer = function(obj, options, cb) {
const message = util._extend({
    act: 'queryServer'  构造有个queryServer消息
  });
  向master进程发送消息
  send(message, (reply, handle) => {
    if (handle)
      shared(reply, handle, indexesKey, cb);  // Shared listen socket.
    else
      rr(reply, indexesKey, cb);              // Round-robin.
  });
};

function rr(message, indexesKey, cb) {
  function listen(backlog) {
    listen被hack掉了
    return 0;
  }
  function close() {
    send({ act: 'close', key });
    delete handles[key];
    delete indexes[indexesKey];
    key = undefined;
  }
  //listen方法，最终会调用自身_handle属性下listen方法来完成监听动作
  const handle = { close, listen, ref: noop, unref: noop };
  cb(0, handle);//回调listenOnMasterHandle
}
```

接下来看下`master`进程接收到`queryServer`消息


```
function queryServer(){
    handle = new RoundRobinHandle(...);
}
```
位于`lib/internal/cluster/round_robin_handle.js`的主要就负责启了一内部TCP服务，
```
function RoundRobinHandle(){
   this.server = net.createServer(assert.fail);

  if (fd >= 0)
    this.server.listen({ fd });
  else if (port >= 0)
    this.server.listen(port, address);
  else
    this.server.listen(address);  // UNIX socket path.
}
RoundRobinHandle.prototype.distribute = function (err, handle) {
    // 负载均衡地挑选出一个worker
    this.handles.push(handle);
    const worker = this.free.shift();
    if (worker) this.handoff(worker);
};

RoundRobinHandle.prototype.handoff = function (worker) {
    const handle = this.handles.shift();
    const message = { act: 'newconn', key: this.key };
    // 向work进程其发送newconn内部消息和客户端的句柄handle
    sendHelper(worker.process, message, handle, (reply) => {
        this.handoff(worker);
    });
};
```

总结下
 1. 如果是master则，直接监听端口
 2. 如果是worker则，通过`_getServer`hack `listen`方法，并且下`master`发出`queryServer`消息
 3. `master`内部启一个TCP服务,连接`master`与`worker`
 4. `master`收到客户端`connection`事件后，会负载均衡的挑出一个`worker`发送`newconn`事件且将客户端`handle`发往`worker`，至此交由`worker`处理


##### cluster下的负载均衡

![fork listen](https://github.com/luyufa/NodeLearning/blob/master/node/img/6.png)

我们来模拟一个基于`round-robin`算法的demo

master.js
```
'use strict';
const net = require('net');
const fork = require('child_process').fork;
const numCpu = require('os').cpus().length;
const works = [];
for (let i = 0; i < numCpu; i++) {
    works.push(fork('./work.js'));
}
const server = net.createServer(c => {
    const {_handle} = c;
    const worker = works.pop();
    worker.send({}, _handle);
    works.unshift(worker);
});
server.listen(3000, () => {
    console.log('server listening');
});
```
worker.js
```
'use strict';
console.log('---worker pid', process.pid);
const net = require('net');
process.on('message', function c(m, handle) {
    start(handle);
});
const buf = 'hello Node.js';
const res = [
    'HTTP/1.1 200 OK',
    'content-length:' + buf.length].join('\r\n') + '\r\n\r\n' + buf;
function start(handle) {
    console.log('got a connection on worker, pid = %d', process.pid);
    const socket = new net.Socket({handle});
    socket.readable = socket.writable = true;
    socket.end(res);
}
```
以上算法实现`master`进程监听端口，等待客户端请求，每当接收到请求时，向轮询挑选出一个`worker`，将客户端句柄`_handle`发往`worker`，`worker`使用该句柄`_handle`创建`scoket`，处理业务逻辑


这里不得不提下服务器**惊群**现象，所谓惊群，就是多个进程竞争一个accept，所有进程被内核重新调度唤醒，同时去响应这一个事件，最后却只有一个进程能处理事件成功，其他的进程在处理该事件失败后重新休眠（也有其他选择），这种性能浪费现象就是惊群。



##### 多进程解决方案

* 负载均衡，不多提了，上面已经讨论过了。

* 优雅退出

   Node中我们都知道，如果产生未捕获的错误，就会直接导致进程退出，当进程直接退出时，也许该进程还在处理其他请求，直接退出的话就会导致请求丢失，于产品而言是非常糟糕的。

   当一个worker中遇到未捕获异常时
    1. 使用`process.on('uncaughtException')`或者`process.on('unhandledRejection')`避免进程直接退出
    2. 在对应的回调函数中关闭TCP服务(`server.close()`)停止接收新的请求
    3. 断开和master的IPC通道(`process.disconnect()`)
    4. 随后退出该`worker`，同时在`master`中重新`fork`该`worker`

* 进程守护
    master进程除了负责接收新的连接，分发给各 worker 进程处理之外，主要保障整个应用的稳定性。一旦某个 worker 进程异常退出就 fork 一个新的子进程顶替上去。
```
cluster.on('exit', function () {
    clsuter.fork();
});

cluster.on('disconnect', function () {
    clsuter.fork();
});


+---------+                 +---------+
|  Worker |                 |  Master |
+---------+                 +----+----+
     | uncaughtException         |
     +------------+              |
     |            |              |                   +---------+
     | <----------+              |                   |  Worker |
     |                           |                   +----+----+
     |        disconnect         |   fork a new worker    |
     +-------------------------> + ---------------------> |
     |         wait...           |                        |
     |          exit             |                        |
     +-------------------------> |                        |
     |                           |                        |
    die                          |                        |
                                 |                        |
                                 |                        |
```



* `master` `worker` `agent`模型



我们系统一般存在某些工作并不需要全部worker都去执行，或者说，全部worker都去执行就会乱套(资源竞争)了，同时我们更不应该在master中去完成这些逻辑(以防降低`master`稳定性)，比如说:
1. 每天凌晨 0 点，将当前日志文件按照日期进行重命名
2. 销毁以前的文件句柄，并创建新的日志文件继续写入

对于这一类后台运行的逻辑，我们希望将它们放到一个单独的进程上去执行，这个进程就叫 Agent Worker，简称 Agent。Agent 好比是 Master 给其他 Worker 请的一个『秘书』，它不对外提供服务，只给 App Worker 打工，专门处理一些公共事务


```
+---------+           +---------+          +---------+
|  Master |           |  Agent  |          |  Worker |
+---------+           +----+----+          +----+----+
     |      fork agent     |                    |
     +-------------------->|                    |
     |      agent ready    |                    |
     |<--------------------+                    |
     |                     |     fork worker    |
     +----------------------------------------->|
     |     worker ready    |                    |
     |<-----------------------------------------|
```


1. `Master`启动后先`fork Agent`进程
2. `Agent`初始化成功后，通过`IPC` 通道通知 `Master`
3. `Master` 再 `fork` 多个 `Worker`
4. `Worker` 初始化成功，通知 `Master`
5. 所有的进程初始化成功后，`Master` 通知 `Agent` 和 `Worker` 应用启动成功


##### 进程间通信IPC
> 发生在master和worker之间，worker与worker并不能直接通信,只能通过master转发

上文多次提及进程间IPC通信，下面是一个简单IPC实例

```
'use strict';
const cluster = require('cluster');

if (cluster.isMaster) {
  const worker = cluster.fork();
  worker.send('hi');
  worker.on('message', msg => {
    console.log(`msg: ${msg} from worker#${worker.id}`);
  });
} else if (cluster.isWorker) {
  process.on('message', (msg) => {
    process.send(msg);
  });
}
```



##### ps:参考

* [egg多进程](https://eggjs.org/zh-cn/core/cluster-and-ipc.html#%E8%BF%9B%E7%A8%8B%E5%AE%88%E6%8A%A4)

* [当我们谈论 cluster 时我们在谈论什么(上)](http://taobaofed.org/blog/2015/11/03/nodejs-cluster/)

* [当我们谈论 cluster 时我们在谈论什么（下）](http://taobaofed.org/blog/2015/11/10/nodejs-cluster-2/)
