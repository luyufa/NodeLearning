## Node体系结构

![Node体系结构](https://github.com/luyufa/NodeLearning/blob/master/node/img/1.png)

1. `node standard libary(http buffer event stream fs path)`
2. `node bindings`
3.  * `v8`
    * `libuv`
    * `c_ares`
    * `third-party dependencies(http-parser zlib crypto...) `



`node standard libary`,这是我们日常编写代码所接触到的，包括标准模块、`npm install`的模块，以及自己编写的代码

`node bindings`,链接C C++ javascript的桥梁

`v8` 提供javascript运行环境，将javascript代码编译为机器码然后执行

`libuv` 异步库主要负责一个事件循环、一个线程池、跨平台异步IO

`c_ares` 异步处理DNS

`third-party dependencies` 提供解析http、压缩数据、加密等




