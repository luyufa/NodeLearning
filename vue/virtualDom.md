## 虚拟DOM
> 虚拟dom属于vue2.0中比较核心的一个概念，本文从源码角度分析什么是虚拟结点？为什么采用虚拟结点？在数据发生变化时，隐藏在代码深处的dom究竟是怎么更新的?


##### 写在之前

 * VNode是什么？
 * VNode的Diff算法过程如何？
 * 为什么采用VNode？


##### 相关源码(v2.5.17-beta.0)
* `src/core/vdom/vnode.js(Vue构造函数)`
* `src\core\instance\lifecycle.js`
* `src\platforms\web\runtime\index.js`
* `src\platforms\web\runtime\patch.js`
* `src\core\vdom\patch.js`

##### virtual dom & VNode

先看下一切的基础 Vnode类的定义在`src/core/vdom/vnode.js`中,此处精简了后面会用到部分属性。
```
class VNode{
     el:对真实结点的引用,
    tag:标签,
    data:结点信息
    children:[子结点],
    text:文本,
    key:唯一标志,用于优化diff算法,
    isComment :是否是注释结点
    ....
}
```
真实dom
```
<h1 class='btn'>
<p>hello</p>
</h1>
```
对应于VNode
```
{
    tag:'h1',
    data:{
        class:'btn'
    },
    children:[
      {
          tag:'p',
          text:'hello'
      }
    ]
}
```
为什么不直接修改`dom`反而使用一层`virtual dom`,其实`virtual dom`很多时候都不是最优的操作，但它具有普适性，在效率、可维护性之间达平衡

##### diff层级

![1](https://github.com/luyufa/NodeLearning/blob/master/vue/img/11.png)

这张图很好的诠释了diff的大致过程，即**diff仅会发生在同层级之间**

来看个例子
```
<div>                    层级1
  <p>                    层级2
    <span>diff</Span>    层级3
  </P>
</div>
```
将`span`从`p`中移至`div`中
```
<div>                    层级1
  <p>                    层级2
  </p>
  <span>diff</Span>      层级2
</div>
```

上面可以看到如果直接操作dom的话直接使用`appendChild`就可以把`span`移动到`div`下；但是使用**diff**算法时，它们前后属于不同层级，所以不会相互对比，而是把`span`先从`p`中删除而后在`div`中在添加


##### diff源码分析

铺垫都做完了，接下里便是重点了。在讲双向数据绑定时我们分析过，数据更新时都是`set`方法让闭包中的`dep`调用`notify`通知`watcher`，最后执行`_update`。所以我们到`src\core\instance\lifecycle.js`看下`_update`
很简单对新老vnode使用`__patch__`

```
Vue.prototype._update = function (vnode) {
    const prevVnode = vm._vnode
    vm._vnode = vnode
    vm.$el = vm.__patch__(prevVnode, vnode)
  }
```

接着看跳转到`src\platforms\web\runtime\index.js`找到`__path__`方法

```
import { patch } from './patch'
Vue.prototype.__patch__ = patch
```
额...在接着跳到`src\platforms\web\runtime\patch.js`

```
import { createPatchFunction } from 'core/vdom/patch'
export const patch = createPatchFunction()
```
没办法继续跳转到`src\core\vdom\patch.js`，核心来了，其他多余代码省去了，我们着重看下面，可以看到如果新结点和老结点是`“同一个结点”`那么就执行`patchVnode`

```
function createPatchFunction(){
    return function patch (oldVnode, vnode) {
       if (sameVnode(oldVnode, vnode)) {
          patchVnode(oldVnode, vnode)
      } else{
        const oEl = oldVnode.el
		let parentEle = api.parentNode(oEl)
		createEle(vnode)
		if (parentEle !== null) {
			api.insertBefore(parentEle, vnode.el, api.nextSibling(oEl))
			api.removeChild(parentEle, oldVnode.el)
			oldVnode = null
		}
    }
}
```

那么什么算`“同一个结点”`呢？看代码

满足如下特性视为同一结点

* 唯一标识相同
* 标签相同
* 标签是`input`的时候，type必须相同
* 是否是注释结点

```
function sameVnode (a, b) {
  return
    a.key === b.key &&
    a.tag === b.tag &&
    a.isComment === b.isComment &&
    isDef(a.data) === isDef(b.data) &&
    sameInputType(a, b)
}
```

现在知道了是`“同一个结点”`，值得比较时,则`patchVnode`这个稍后分析；先来看如果不是`“同一个结点”`不值得比较则
 1. 取得`oldvnode.el`的父节点，`parentEle`是真实`dom`
 2. `createEle(vnode)`会为`vnode`创建它的真实`dom`，令`vnode.el =真实dom`
 3. `parentEle`将新的`dom`插入，移除旧的`dom`
**当不值得比较时，新节点插入而老节点删除**



现在来看`“同一个结点”`，值得比较时，在`src\core\vdom\patch.js`里看下`patchVnode`

在进入此方法前要知道`新结点el=null`,所以刚进来有行很重要的代码`const elm = vnode.elm =oldVnode.elm`，新老结点的`el`都指向同一个真实`dom`，也就是说老结点`el`变化新结点也跟着变化。

```
function patchVnode (oldVnode, vnode) {
    if (oldVnode === vnode) {
        return
    }

    const elm = vnode.elm = oldVnode.elm
    const oldCh = oldVnode.children
    const ch = vnode.children
    if (oldVnode.text !== null && vnode.text !== null
    && oldVnode.text !== vnode.text) {
        api.setTextContent(el, vnode.text)
    }else {
        updateEle(el, vnode, oldVnode)
    	if (oldCh && ch && oldCh !== ch) {
	    	updateChildren(el, oldCh, ch)
	    }else if (ch){
	    	createEle(vnode) //create el's children dom
	    }else if (oldCh){
	    	api.removeChildren(el)//remove el's children dom
	    }
    }

  }
```
其次这段代码就简单多了主要逻辑为

1. 新老结点相同，没发生变化直接返回
1. 仅结点文本发生变化，那么仅设置文本即可
2. 如果都有子结点且不相同，那么`updateChildren`
3. 如果**仅**新结点有子结点，那么认为是新增，直接在vnode下新增子结点
4. 如果**仅**老结点有子结点，那么认为是移除，直接在vnode下移除子结点


1245都很容易理解不多解释了，核心看`updateChildren`，其实这也是`diff`算法的核心，先看源码

```
function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
    let oldStartIdx = 0
    let newStartIdx = 0
    let oldEndIdx = oldCh.length - 1
    let oldStartVnode = oldCh[0]
    let oldEndVnode = oldCh[oldEndIdx]
    let newEndIdx = newCh.length - 1
    let newStartVnode = newCh[0]
    let newEndVnode = newCh[newEndIdx]

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (isUndef(oldStartVnode)) {
        oldStartVnode = oldCh[++oldStartIdx] // Vnode has been moved left
      }
      else if (isUndef(oldEndVnode)) {
        oldEndVnode = oldCh[--oldEndIdx]
      }

      //@1
      else if (sameVnode(oldStartVnode, newStartVnode)) {
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue)
        oldStartVnode = oldCh[++oldStartIdx]
        newStartVnode = newCh[++newStartIdx]
      }

      //@2
      else if (sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue)
        oldEndVnode = oldCh[--oldEndIdx]
        newEndVnode = newCh[--newEndIdx]
      }

      //@3
      else if (sameVnode(oldStartVnode, newEndVnode)) {
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue)
        canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm))
        oldStartVnode = oldCh[++oldStartIdx]
        newEndVnode = newCh[--newEndIdx]
      }

      //@4
      else if (sameVnode(oldEndVnode, newStartVnode)) {
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue)
        canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm)
        oldEndVnode = oldCh[--oldEndIdx]
        newStartVnode = newCh[++newStartIdx]
      }

      //@5
      else {
        if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)
        idxInOld = isDef(newStartVnode.key)
          ? oldKeyToIdx[newStartVnode.key]
          : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx)
        if (isUndef(idxInOld)) { // New element
          createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
        } else {
          vnodeToMove = oldCh[idxInOld]
          if (sameVnode(vnodeToMove, newStartVnode)) {
            patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue)
            oldCh[idxInOld] = undefined
            canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm)
          } else {
            // same key but different element. treat as new element
            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
          }
        }
        newStartVnode = newCh[++newStartIdx]
      }
    }

    //@6
    if (oldStartIdx > oldEndIdx) {
      refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm
      addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue)
    }

    //@7
    else if (newStartIdx > newEndIdx) {
      removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx)
    }
  }
```

代码秘密麻麻一大堆直接看很晕，没关系，我来解释给你听，过程可以概括为:`oldCh(oldStartIdx、oldEndIdx)`和`newCh(newStartIdx,newEndIdx)`各有两个指针分别指向头和尾，他们相互比较即4中比较方式

![2](https://github.com/luyufa/NodeLearning/blob/master/vue/img/22.png)

 * `@1 oldStartIdx - newStartIdx` 未发生位置变化，直接`patchVnode`

 * `@2 oldEndIdx - newEndIdx`  未发生位置变化，直接`patchVnode`

 * `@3 oldStartIdx - newEndIdx` 应该把首结点移动至尾，即`insertBefore(parentElm, oldStartVnode.elm, oldEndVnode.elm)`

 * `@4 oldEndIdx - newStartIdx`应该把末结点移动至首， 即`insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm)`

 * 两两比较完后，`key`的作用便体现出来了(结点复用)

   * `有key`，将`oldCh`生成一个`key`表,如果`newStartIdx`在`key`表中，那么`patchVnode`，不在，则直接插入一个新的结点。
   * `无key`，两两比较完后，`key`表为空，所以不会在进行比较了，都是直接插入新结点

 * `@6 oldStartIdx > oldEndIdx`,可以认为`oldCh`遍历完成，此时`newStartIdx`至`newEndIdx`都是新增结点，直接全部插入末尾

 * `@7 newStartIdx > newEndIdx`,可见认为`newCh`遍历完成，此时`oldStartIdx`至`oldEndIdx`都是应移除结点，直接全部删除


看到这你应该大致明白了吧，再扔两个例子检验下(来自于[解析vue2.0的diff算法](https://github.com/aooy/blog/issues/2))

* 未使用key
 ![3](https://github.com/luyufa/NodeLearning/blob/master/vue/img/33.png)

* 使用key
 ![4](https://github.com/luyufa/NodeLearning/blob/master/vue/img/44.png)


##### 总结

* 没事就设置个`key`总是好的
* 不要跨层级修改`DOM`
* 虚拟dom并不一定最高效，但是是在效率、可维护性之间的一种平衡


##### 参考

* [解析vue2.0的diff算法](https://github.com/aooy/blog/issues/2)