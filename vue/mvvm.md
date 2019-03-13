## vue双向数据绑定
> 个人认为vue最核心的部分就是双向数据绑定了，vue作者在实现双向数据绑定时有很多奇思妙想值得借鉴，很多官网提到的东西都只是说了要这样用，并没说明为什么要这样用比如data是为什么函数、数组的变异方法等，下面看代码的时候可以逐一体会下。

##### 写在之前
>本文围绕vue双向数据绑定解析vue源码，源码看下去比较枯燥，所以大家可带着问题去阅读，有助于更好的理解

* 为什么vue的data属性要传入一个函数?
* `Object.defineProperty`作用是什么？
* 为什么vue衍生出变异数组方法，以及怎么实现的？
* vue中`data`全是响应式的么？即使没被用到仅是定义了。
* vue如何实现依赖收集？
* vue如何实现变动更新？
* `nextTick`的作用是什么？
* `$watcher`如何实现的？


##### 相关源码(v2.5.17-beta.0)

* `src/core/instance/index.js`(Vue构造函数)

* `src/core/instance/init.js`

* `src/core/instance/state.js`

* `src/core/observer/index.js`

* `src/core/observer/dep.js`

* `src/core/observer/watcher.js`

##### 发布订阅模式

发布定于模式是一种一对多的依赖关系，当一个状态变化时，关心这个状态的订阅者都会得到通知。看个最简单的例子

```
   class Publisher {
        constructor() {
            this.listeners = {}
        }

        pus() {
            const args = Array.prototype.slice.call(arguments, 0);
            const ev = args.shift();

            const cb = this.listeners[ev];
            if (cb) {
                cb.apply(this, args);
            }
        }

        sub() {
            const args = Array.prototype.slice.call(arguments, 0);
            const ev = args.shift();
            const listener = args.shift();
            this.listeners[ev] = listener;
        }

        remove(ev) {
            delete this.listeners[ev];
        }
    }

    const test = new Publisher();
    test.sub('hello', function () {
        console.log('hello')
    })
    test.pus('hello')
```


##### defineProperty

Object.defineProperty() 方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性， 并返回这个对象

```
Object.defineProperty(obj, "key", {
  enumerable: false,
  当且仅当该属性的enumerable为true时，该属性才能够出现在对象的枚举属性中。默认为 false

  configurable: false,
  当且仅当该属性的 configurable 为 true 时，该属性描述符才能够被改变，同时该属性也能从对应的对象上被删除。默认为 false

  writable: false,
  当且仅当该属性的writable为true时，value才能被赋值运算符改变。默认为 false

  get:function
  当访问该属性时，该方法会被执行，方法执行时没有参数传入，但是会传入this对象

  set:function
  当属性值修改时，触发执行该方法。该方法将接受唯一参数，即该属性新的参数值
});
```
整个vue进行双向数据绑定的核心思想便是使用它进行数据劫持。但该方法有个缺陷是**不支持ie9以下**。所以vue也就不能用于ie9以下浏览器了。


##### 从new Vue开始

先找到`src/core/instance/index.js` Vue的构造函数这里面主要就调用了`_init`函数

```
function Vue (options) {
  this._init(options)
}

```

跟着代码进入`src/core/instance/init.js`的`_init`函数，这个方法里其实省去了其他和双向数据绑定无关的代码

```
Vue.prototype._init = function (options?: Object) {
    initState(vm)
}
```

一样的继续跟进代码到`src/core/instance/state.js`的`initState`方法，这里面可以看到熟悉的`props` `methods` `data`等Vue属性了，这个方法主要就是初始化它们，我们重点关注`initData`

```
 function initState (vm: Component) {
  vm._watchers = []
  const opts = vm.$options
  if (opts.props) initProps(vm, opts.props)
  if (opts.methods) initMethods(vm, opts.methods)
  if (opts.data) {
    initData(vm)
  } else {
    observe(vm._data = {}, true /* asRootData */)
  }
  if (opts.computed) initComputed(vm, opts.computed)
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch)
  }
}

function initData (vm: Component) {
  let data = vm.$options.data
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {}

  // proxy data on instance
  const keys = Object.keys(data)
  let i = keys.length
  while (i--) {
      const key = keys[i]
      proxy(vm, `_data`, key)
  }

  // observe data
  observe(data, true /* asRootData */)
}
```

这里有两个重点要说下其一是`proxy(vm, '_data', key)`先看源码。`defineProperty`当大家都很熟悉了不做多解释。从代码可以看出我们在`new Vue`时传入的data属性如果是一个函数，就会执行获取他的返回值即真正的data，想象一下，如果data不是函数会怎样？给个提示从javascript变量传递角度考虑。

再回到`proxy`很简单，主要是把**属性代理到vm._data**上，什么意思呢？就是你可以通过`vm._data.key`访问`vm.options.data.key`的值

```
function proxy (target: Object, sourceKey: string, key: string) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  }
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val
  }
  Object.defineProperty(target, key, sharedPropertyDefinition)
}
```

到这终于和双向数据绑定有关的东西出现了，就是**observe**


##### observer

来到`src/core/observer/index.js`的`observer`方法,构造了一个Observer
对象。首先为对象挂载一个`__ob__`对象指向当前`dep`(后面会说到)接下来由于`defineProperty`是无法劫持数组是否变动的，所以需要分开处理。

```
function observe (value: any, asRootData: ?boolean): Observer | void {
    ob = new Observer(value)
    return ob
}

export class Observer {
  value: any;
  dep: Dep;
  $data

  constructor (value: any) {
    this.value = value

    def(value, '__ob__', this)为对象挂载一个__ob__对象指向当前dep

    if (Array.isArray(value)) {
      const augment = hasProto
        ? protoAugment
        : copyAugment
      augment(value, arrayMethods, arrayKeys)
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }
```


##### observer-非数组对象

如果`$data`不是一个数组，那么直接使用`walk`处理，`defineReactive`这个方法基本是整个vue实现双向数据绑定的核心了其思路可以看出就是
 * 属性的`get`中通过` dep.depend()`收集依赖
 * 属性的`set`中通过` dep.notify()`触发依赖

```
  walk (obj: Object) {
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i])
    }
  }


  function defineReactive ( obj,key, val) {
  const dep = new Dep()
  let childOb = observe(val) 如果当前val是对象那么递归处理
  Object.defineProperty(obj, key, {
    get: function reactiveGetter () {
      const value = getter ? getter.call(obj) : val
      if (Dep.target) {
        dep.depend() 收集依赖
        if (childOb) {
          childOb.dep.depend() 子项收集依赖
          if (Array.isArray(value)) {
            dependArray(value) 数组处理
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      childOb = observe(newVal) 新设置的值有可能是对象页需要观察
      dep.notify() 触发依赖
    }
  })
}
```


##### observer-数组

那如果是数组呢？例如

```
{
    data:function(){
        return {
            numbers:[1,2,3,4,5]
        }
    }
}
```
其实最顶层$data一定是个对象，如果其key有一个数组那么流程应该是这样的所以先到

 1. `walk`
 2. `defineReactive`
 3. 属性numbers是对象调用`observe([1,2,3,4,5])`
 4. `new Observer([1,2,3,4,5])`
 5. 数组变异方法赋值
 6. `observeArray([1,2,3,4,5]])`

之前说过`defineProperty`是无法劫持数组是否变动的，所以Vue采用了一种叫做数组变异方法。先判断`__proto__`能不能用(`hasProto`)，如果能用，则把那个一个继承自`Array.prototype`的并且添加了变异方法的`Object` (`arrayMethods`)，设置为当前数组的`__proto__`，完成改造，如果`__proto__`不能用，那么就只能遍历`arrayMethods`就一个个的把变异方法`def`到数组实例上面去。这样一来发生变动时只要在变异方法里触发依赖就好了

```
function protoAugment (target, src: Object, keys: any) {
  target.__proto__ = src
}
function copyAugment (target: Object, src: Object, keys: Array<string>) {
  for (let i = 0, l = keys.length; i < l; i++) {
    const key = keys[i]
    def(target, key, src[key])
  }
}
```

在`src/core/observer/array.js`中来看下变异方法有哪些

```
const methodsToPatch = ['push','pop','shift','unshift','splice','sort','reverse']

const arrayProto = Array.prototype
export const arrayMethods = Object.create(arrayProto)

methodsToPatch.forEach(function (method) {

  const original = arrayProto[method]//原方法

  def(arrayMethods, method, function mutator (...args) {//定义变异方法
    const result = original.apply(this, args)//执行基本的逻辑
    const ob = this.__ob__
    ob.dep.notify()//变动通知
    return result
  })
})
```


##### Dep

**dep** 这个对象在上文中一共定义了两次

1. `definedReactive`闭包中的`dep`
2. `Observe`类中的实例属性`dep`

再来看下使用了几次呢？前三个使用的是第一个闭包中的`dep`，数组中的使用的是`Observe`实例属性`dep`

1. `definedReactive`的`get`方法中`dep.depend()` 收集依赖
2. `definedReactive`的`get`方法中`childOb.dep.depend()` 子项收集依赖
3. `definedReactive`的`set`方法中`dep.notify()`触发依赖
4. 数组变异方法中`ob.dep.notify()` 变动通知，触发依赖

目前我们只要知道`Dep`的作用是**收集依赖-触发依赖**的桥梁。先看下Dep的构造函数`src/core/observer/dep.js`

```
default class Dep {
  static target: ?Watcher;
  id: number;
  subs: Array<Watcher>;

  constructor () {
    this.id = uid++
    this.subs = []
  }

  addSub (sub: Watcher) {
    this.subs.push(sub)
  }

  removeSub (sub: Watcher) {
    remove(this.subs, sub)
  }

  depend () {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }

  notify () {
    const subs = this.subs.slice()
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }
}
Dep.target = null
```
代码很简单，前面用的几个方法都出现了，但现在又出来了一个新东西**watcher** 这是什么？这里还有个地方要留意，看`depend`方法里`Dep.target.addDep(this)`我们一直说调这个方法是收集依赖，但它却调用的`target.addDep`奇不奇怪?

##### Watcher

这段将主要解决大家前面的疑惑，一探**Watcher**的究竟。前面`Dep`中应该能看出来的是`target`是`Watcher`实例。`src/core/observer/watcher.js`代码精简后不多，因为关联较大，不好分开讲，故全部放出来，先浏览下，在细看。

```
class Watcher {

  constructor (vm,expOrFn,cb) {
    this.vm = vm
    this.cb = cb
    this.id = ++uid // uid for batching
    this.deps = []
    this.newDeps = []

    if (typeof expOrFn === 'function') {
      this.getter = expOrFn
    } else {
      this.getter = parsePath(expOrFn)
    }

    this.value = this.get()
  }


 parsePath (path){
   const segments = path.split('.')
   return function (obj) {
    for (let i = 0; i < segments.length; i++) {
      if (!obj) return
      obj = obj[segments[i]]
    }
    return obj
  }
}


  get () {
    Dep.target = this;
    let value
    const vm = this.vm
    value = this.getter.call(vm, vm)
    Dep.target = null;
    return value
  }



  addDep (dep: Dep) {
    const id = dep.id
    if (!this.newDepIds.has(id)) {
      this.newDepIds.add(id)
      this.newDeps.push(dep)
      if (!this.depIds.has(id)) {
        dep.addSub(this)
      }
    }
  }


  update () {
  id(this.sync){
   this.run()
  }else{
      queueWatcher(this)
  }
  }


  run () {
      this.getAndInvoke(this.cb)
  }


  getAndInvoke (cb: Function) {
    const value = this.get()
    const oldValue = this.value
    this.value = value
    cb.call(this.vm, value, oldValue)
  }


  depend () {
    if (this.dep && Dep.target) {
      this.dep.depend()
    }
  }
}
```
前面我们讲**Dep**的时候说过`targte`是`Watcher`实例下面贴出来的代码就是收集依赖的核心部分，获取值的时候就触发下面的逻辑了。

那么什么时候获取这个值呢？我们可以看到在watcher构造函数里，先是解析`expOrFn`，这个变量你可以想象为你在Vue template中使用的`{{person.name}}`变量，然后在`parsePath`中构造`getter`，然后设置`target`指向自身`watcher`，随后就调用获取值，然后触发下面逻辑了。

到现在依赖是如何收集的？以及收集的究竟是什么？应该清楚了吧，只要`Watcher`构造传入`expOrFn`，那么便会生成一个`expOrFn`对应的`watcher`实例,存入`defineProperty`闭包中的`dep`里。

```
observer.js
defineProperty中get(){
    if (Dep.target) {
        dep.depend()
    }
}

dep.js
depend(){
  Dep.target.addDep(this)
}

watcher.js
 addDep (dep: Dep) {
    dep.addSub(this)
    }
  }

```
收集清楚了，那么接下来是触发的过程，其实很简单在`defineProperty`中`set`使用闭包中的`dep`调用`notify`触发，取出其中的`watcher`,每一个`watcher`调用自身`update`方法里面主要是执行了一个**callback(value,oldValue)**

```
observer.js
defineProperty中set(){
   dep.notify() 触发依赖
}

dep.js
 notify () {
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }

watcher.js
update () {
    const value = this.get()
    const oldValue = this.value
    this.value = value
    cb.call(this.vm, value, oldValue)
  }
```

如果下面代码执行
```
for(let i=0;i<100;i++){
    $data.name='hello'+i;
}
```
按照上面的逻辑会触发100次更新，这样是很耗性能的，所以Vue进行了优化，不会每触发一次就立即执行更新，而是放到`queueWatcher`中去重，在`nextTick`再集中调用这样就变为1次更新。至于`nextTick`不在本文讲述范围内不多提了。

##### compiler

到这里基本收集-触发逻辑就理清楚了，现在剩余两个问题，其一，什么时候对data调用`new Watcher`，肯定不是对所有的data都构建一个Watcher去监听的，这样无疑浪费资源，那么什么时候`new Watcher`呢？其二上面`update`中的`callback`是什么？想要解开这些疑问接着看双向数据绑定之`compiler`


```
class Watcher{
    constructor(...isRenderWatcher){
        if (isRenderWatcher) {
        vm._watcher = this
       }
    }
}
```
注意看上面Watcher构造函数把当前`watcher`实例赋值给Vue实例`vm`
`src\platforms\weex\runtime\recycle-list\virtual-component.js`
编译模板时调用了且传入`isRenderWatcher`

```
new Watcher(vm, updateComponent, noop, null, true:isRenderWatcher)
```
在vue2.0+时，一个组件的模板会被编译成一个渲染函数。每个组件有一个Watcher用来监听模板中所使用到的数据、当这些数据发生变化时，通过VirtualDOM进行更新组件的视图。




##### 1.0+ -> 2.0+

由于1.0+到2.0+`compile`模板变动较大，读者还未来得及读其中代码，但本文基本把双向数据绑定说明白了，故止于此。


##### 流程图
![mvvm](https://github.com/luyufa/NodeLearning/blob/master/vue/img/mvvm.png)

* [模拟实现vue mvvm-dep](https://github.com/luyufa/NodeLearning/blob/master/vue/src/mvvm/dep.js)

* [模拟实现vue mvvm-watcher](https://github.com/luyufa/NodeLearning/blob/master/vue/src/mvvm/watcher.js)

* [模拟实现vue mvvm-observe](https://github.com/luyufa/NodeLearning/blob/master/vue/src/mvvm/observe.js)

* [模拟实现vue mvvm-compile](https://github.com/luyufa/NodeLearning/blob/master/vue/src/mvvm/compile.js)

* [模拟实现vue mvvm-mvvm](https://github.com/luyufa/NodeLearning/blob/master/vue/src/mvvm/mvvm.js)

* [模拟实现vue mvvm-实例](https://github.com/luyufa/NodeLearning/blob/master/vue/src/mvvm/index.html)


##### 参考

* [vue-官网列表渲染](https://cn.vuejs.org/v2/guide/list.html)

* [剖析vue实现原理，自己动手实现mvvm](https://github.com/DMQ/mvvm)

* [Vue 模板编译原理](https://github.com/berwin/Blog/issues/18)

