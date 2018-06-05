## webpack 模块热替换(HMR)


* 保留在完全重新加载页面时丢失的应用程序状态。
* 只更新变更内容，以节省宝贵的开发时间。
* 调整样式更加快速 - 几乎相当于在浏览器调试器中更改样式


###### webpack-dev-middleware && webpack-hot-middleware

1. `webpack-dev-middleware`:监控文件变动，当文件变动时，编译文件。虽然webpack提供了`webpack --watch`的命令来动态监听文件的改变并实时打包，输出新bundle.js文件，这样文件多了之后打包速度会很慢，此外这样的打包的方式不能做到hot replace,而`webpack-dev-server`打包后的资源会保留在内存当中
```
module.exports={
    watchOptions: {//webpack 可以监听文件变化，当它们修改后会重新编译修改的模块
        aggregateTimeout: 300,//编译防抖
        poll: 2000,//轮询检查是否文件变动
        ignored: /node_modules/,
    }
}





```
2. `webpack-hot-middleware`:模块热更新
```
module.exports={
    entry:{
        hot:'webpack-hot-middleware/client?noInfo=true&reload=true'
        relaod表示没有找到对应热更新时，是否需要刷新页面
    },
    plugins:[
        new webpack.HotModuleReplacementPlugin()
    ]
}
```

3. `app.js`增加中间件，简单配置如下

```
    const webpack = require('webpack');
    const webpackConfig = require('./webpack.config');
    const webpackDevMiddleware = require('webpack-dev-middleware');
    const webpackHotMiddleware = require('webpack-hot-middleware');

    const compiler = webpack(webpackConfig);
    app.use(webpackDevMiddleware(compiler, {
        noInfo: true,
        publicPath: webpackConfig.output.publicPath
        由于webpack-dev-middleware不会写入文件至磁盘，而是保留在内存中，最佳实践和webpackConfig中的一致
    }));
    app.use(webpackHotMiddleware(compiler));
```


###### HMR流程

1. 基本流程

  * 首次打开页面后浏览器会主动请求`/__webpack_hmr`,`Data`里关键数据在于`{action:'sync',hash:'hash1xxxxxx'}`
  * 每个一段时间server端主动向浏览器推送消息
  * 当文件变动时，webpack重新编译打包变化文件，且服务端推送一条`{action:'building'}`消息
  * 编译打包完成后服务端再次推送消息`{action:'built',hash:'hash2xxxx'
}`
  * 浏览器以之前的hash1发起两个请求，其中`hash1.hot-update.json`以`XHR`的方式，随后以`script`标签的方式引入`hash1.hot-update.js`
  * 服务端每次发送的hash作为下次请求`hot-update`的`hash`

2. `服务端 webpack-hot-middleware/middleware`

    * 根据webpack编译状态主动推送消息至客户端
    ```
    compiler.plugin("compile", function() {
    eventStream.publish({action: "building"});
    });
    compiler.plugin("done", function(statsResult) {
    // 当首次编译完成 和 修改代码重新编译(热更新)完成时发送
    publishStats("built", latestStats, eventStream, opts.log);
    });
    var middleware = function(req, res, next) {
    if (!pathMatch(req.url, opts.path)) return next();
    // 见下面的 handler 实现，中间件通过 `req.socket.setKeepAlive` 开启长链接通道,
    eventStream.handler(req, res);
    if (latestStats) {
      // 服务端向客户端写入数据，sync 表示告诉客户端热更新已经准备好
       eventStream.publish({
        name: stats.name,
        action: "sync",
        time: stats.time,
        hash: stats.hash,
        warnings: stats.warnings || [],
        errors: stats.errors || [],
        modules: buildModuleMap(stats.modules)
       });
    }
   ```

3. `客户端 webpack-hot-middleware/client`

   * 建立连接 `new window.EventSource`，监听服务端推送
   * 处理不同的action(`building` `built` `sync`)
   ```
     case "building":
      if (options.log) {
        console.log(
          "[HMR] bundle " + (obj.name ? "'" + obj.name + "' " : "") +
          "rebuilding"
        );
      }
      break;
    case "built":
      if (options.log) {
        console.log(
          "[HMR] bundle " + (obj.name ? "'" + obj.name + "' " : "") +
          "rebuilt in " + obj.time + "ms"
        );
      }
      // fall through
    case "sync":
       processUpdate(obj.hash, obj.modules, options)
   ```
   * `built case` 没有 `break`，所以当修改文件时，编译完成发送 `built` 消息时，会依次执行 `built` 和 `sync` 逻辑， 也就是进入 `processUpdate` 流程。`processUpdate` 接收到信息`(hash, module)` 之后， 进入 `module.hot.check` 和 `module.hot.apply` 流程。

4. `module.hot.check`
   * 每次服务端发送的消息(`EventStrean`) 的 `hash` 将作为下次 `hot-update.json` 和 `hot-update.js` 文件的 `hash`
   * 请求`hash1.hot-update.json`和`hash1.hot-update.js`

5. `module.hot.apply`
   * 找到老模块和依赖
   * 从缓存中删除
   ```
        // remove module from cache
        delete installedModules[moduleId];
        // when disposing there is no need to call dispose handler
        delete outdatedDependencies[moduleId];
   ```
   * 新的模块添加到`modules` 中，当下次调用 `__webpack_require__` (`webpack` 重写的 `require` 方法)方法的时候，就是获取到了新的模块代码了

6. `module.hot.accept`

   此时我们得业务代码并不知道模块已经替换了，所以需要一个`module.hot.accept`，接受(accept)给定依赖模块的更新，并触发一个 回调函数 来对这些更新做出响应。

7. `vue-loader`默认开启热重载

   * 当编辑一个组件的 <template> 时，这个组件实例将就地重新渲染，并保留当前所有的私有状态。能够做到这一点是因为模板被编译成了新的无副作用的渲染函数。

   * 当编辑一个组件的 <script> 时，这个组件实例将就地销毁并重新创建。(应用中其它组件的状态将会被保留) 是因为 <script> 可能包含带有副作用的生命周期钩子，所以将重新渲染替换为重新加载是必须的，这样做可以确保组件行为的一致性。这也意味着，如果你的组件带有全局副作用，则整个页面将会被重新加载。

   * <style> 会通过 vue-style-loader 自行热重载，所以它不会影响应用的状态。

   * 默认开启，显示关闭
   ```
   module: {
     rules: [
    {
      test: /\.vue$/,
      loader: 'vue-loader',
      options: {
        hotReload: false // 关闭热重载
      }
    }
     ]
   }
   ```


###### 全局流程图
![5](https://github.com/luyufa/NodeLearning/blob/master/wwwBuild/img/5.jpg)



###### 参考文档
 * [Webpack 热更新实现原理分析](https://zhuanlan.zhihu.com/p/30623057)
 * [Webpack HMR 原理解析](https://zhuanlan.zhihu.com/p/30669007)
 * [EventSource](https://developer.mozilla.org/zh-CN/docs/Server-sent_events/Using_server-sent_events)