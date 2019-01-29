## 图片懒加载
> 图片对页面加载有很大的影响，一张图片少说也几十k，这个过程是漫长且不必要的，我们完全可以先把视野内的图片展示出来，等滚动到可视区域时再加载其余图片，这就是图片懒加载的基本思路



##### 各种宽高

这个有个很重要的词**可视区域**，这个可视区域怎么判定呢？这就要先了解一些浏览器里的各种宽高了。

 * `clientHeight` `clientWidth` 可视区域宽度，不包含滚动条 `padding+content`
 * `offsetHeight` `offsetWidth` 可视区域宽高，包含滚动条 `border+padding+content+scrollBar`
 * `scrollHeight` `scrollWidth` 整体区域宽高，不包含滚动条
 `padding+content+隐藏`
 * `scrollTop` `scrollLeft` 隐去的区域宽高
 * `clientTop` `clientLeft` 元素边框厚度
 * `offsetTop` `offsetLeft` 距离最近的position不为static的祖先元素(默认为body);


###### `document.body` `document.documentElement`
* 页面具有 `DTD`，或者说指定了 `DOCTYPE` 时，使用 `document.documentElement。`
* 页面**不**具有 `DTD`，或者说没有指定 `DOCTYPE`，时，使用 `document.body`


所以 我们要判断一个元素是否在可视区域

```
 const exposedHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight; //可见区域高度

const scrollTop = document.documentElement.scrollTop || document.body.scrollTop; //滚动条距离顶部高度

dom.offsetTop < exposedHeight + scrollTop 则说明该dom元素出现在视野内

```


##### 懒加载实现

有了如何判断一个元素是否在视野内，接下来，我们可以把所有需要懒加载的`img`的`src`属性设置为空，把`url`地址设置为`data-src`，当这个`img`出现在视野内时，把`data-src`赋值给`src`即可。具体实现代码如下

```
    const img = document.querySelectorAll('img')
    const num = img.length;
    let curN = 0;//记录加载位置

    const lazy = {
        name: 'lazy',
        load() {
            const exposedHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight; //可见区域高度
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop; //滚动条距离顶部高度
            for (let i = curN; i < num; i++) {
                if (img[i].offsetTop < exposedHeight + scrollTop) {
                    img[i].src = img[i].getAttribute('data-src');
                    curN += 1;
                }
            }
        }
    };

    lazy.load();

    window.onscroll = lazy.load
```


##### 节流优化

浏览器向下滚动时`onscroll`事件被触发频率是很高的，这对于浏览器来说是笔巨大的开销，在将优化之前我们先了解2个概念**节流** **防抖**


 * 防抖
  > 函数在n秒后才会被执行，如果n秒之内再次调用，那么再重新计算执行时间,

  防抖最常见的场景是搜索，用户输入的过程中不需要实时调用，只需在输入停顿100ms后才调用，可以大大减轻服务端压力。

  ```
  function debounce(fn, ms) {
        let timeout = null;
        let that = this;
        return function (...ret) {
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                fn.apply(that, ret)
            }, ms)
        }
    }
  ```

 * 节流
 > 函数在一定时间内只允许被调用一次

 节流常用于`resize`、`scroll`，`mousemove`事件,可以在缩放窗口时限制对应函数的调用次数，提高性能。

 ```
 function throttle(fn, ms) {
        let canRun = true;
        let that = this;
        return function (...ret) {
            if (!canRun) {
                return;
            }
            canRun = false;
            setTimeout(() => {
                fn.apply(that, ret)
                canRun = true;
            }, ms);
        }
    }
 ```

 在图片懒加载这个场景中，节流最合适不过了,稍微修改之前的代码

 ```
  window.onscroll = throttle(lazy.load, 100);//100ms内只允许调用一次
 ```



 ##### [vue-lazyload](https://www.npmjs.com/package/vue-l-lazyload)
 >A lazyload plugin for Vue.js v2.x+

 源码简析

  1. 自定义指令`v-lazy`
 ```
Vue.directive('lazy', { bind: lazy.lazyLoadHandler.bind(lazy)})
 ```

2. 节流绑定处理函数
 ```
 this.lazyLoadHandler = throttle(this._lazyLoadHandler.bind(this), this.options.throttleWait)
 ```

 3. 处理逻辑
 ```
  _lazyLoadHandler () {
      const freeList = []
      this.ListenerQueue.forEach((listener, index) => {
        const catIn = listener.checkInView()
        if (!catIn) return
        listener.load()//src替换为data-src
      })
    }

//判定是否在视野内
checkInView () {
        this.getRect()
        return inBrowser &&
                    (this.rect.top < window.innerHeight * lazyManager.options.preLoad && this.rect.bottom > 0) &&
                    (this.rect.left < window.innerWidth * lazyManager.options.preLoad && this.rect.right > 0)
      },
 ```

 其简单来看整体过程和我们上述分析基本一致。至于具体的项目中参考api文档吧~很简单就可以大大提升你的web性能