## nextTick

##### macro-task和micro-task
> 一个浏览器环境，只有一个事件循环，可以有多个任务队列，每个任务都有一个任务源

* 执行过程 ：
   1. 取`macro-task queue`(也叫任务队列)中的**一个**任务执行
   2. 完成后取`micro-task queue`中的**所有**任务执行，
   3. 渲染**UI**
   4. 再取`macro-task queue`中的**一个**任务,周而复始，直至两个队列都为空。

* 任务源分类：
  1. `macro-task`：`script整体代码`、`setTimeout`、`setImmediate`、`setInterval`、`UI render`
  2. `micro-task`：`promise.then` `prcess.nextTick` `MutationObserver`


`Vue nextTick`实现

`Vue` 在内部尝试对异步队列使用原生的 `Promise.then` 和 `MessageChannel`，如果执行环境不支持，会采用 `setTimeout(fn, 0)` 代替

`macro-task`
> `setImmediate`||`MessageChannel`||`setTimeout`


```
if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  macroTimerFunc = () => {
    setImmediate(flushCallbacks)
  }
} else if (typeof MessageChannel !== 'undefined' && (
  isNative(MessageChannel) ||
  MessageChannel.toString() === '[object MessageChannelConstructor]'
)) {
  const channel = new MessageChannel()
  const port = channel.port2
  channel.port1.onmessage = flushCallbacks
  macroTimerFunc = () => {
    port.postMessage(1)
  }
} else {
  macroTimerFunc = () => {
    setTimeout(flushCallbacks, 0)
  }
}
```

`micro-task`
> `promise.then`||`macro-task`

```
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  const p = Promise.resolve()
  microTimerFunc = () => {
    if (isIOS) setTimeout(noop)
  }
} else {
  microTimerFunc = macroTimerFunc//不支持promise.then则降级为宏任务
}
```


`nextTick`
```
function nextTick (cb?: Function, ctx?: Object) {
  let _resolve
  callbacks.push(() => {
      cb.call(ctx)
  })
  if (useMacroTask) {
    macroTimerFunc()
  } else {
    microTimerFunc()
  }
}
```

使用以上方法来产生提供异步api，在当前同步代码执行完毕后，执行异步回调，用户可能在代码中多次修改,每次修改都会，进入属性的`set`方法调用闭包内`dep.notify`通知所有订阅数据的`watcher`,将所有`watcher`加入数组，等当前同步代码执行完毕，对所有`watcher`完成数据真正写入到`DOM`上的操作，这样即使之前的task里改了一个`watcher`的依赖100次，最终仅修改DOM1次
