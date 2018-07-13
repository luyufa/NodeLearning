## Vue MVVM实现
> 在vue中实现双向数据绑定主要基于`Watcher` `Dep` `Compile` `Observe`通过`definedReactive`劫持数据实现

##### 1. 怎样收集依赖

通过`observe`监测对象的每一个`key`
```
  defineReactive: function (data, key, value) {
        const dep = new Dep();//每一个key对应一个Dep实例

        Object.defineProperty(data, key, {
            configurable: false,
            enumerable: true,
            get: function () {
                if (Dep.target) {//Watcher 实例
                    dep.depend();//收集依赖
                }
                return value;
            },
            set: function (newVal) {
                if (newVal === value) {
                    return;
                }
                value = newVal;
                childObj = observe(newVal);//新设置的属性可能是对象
                dep.notify();//通知视图更新
            }
        })
    }
```

##### 2. 触发收集依赖
由`definedReactive`特性可以知道只要使用该属性(`object.key`)即可。

`compile.js`
```
 updaterFn && updaterFn(node, this._getVMVal(vm, exp));//第一次初始化时

        new Watcher(vm, exp, function (value, oldValue) {//监听之后的变化
            updaterFn && updaterFn(node, value, oldValue);
        });
```
`watcher.js`
```
get: function () {
        Dep.target = this;
        const value = this.getter.call(this.$vm, this.$vm);//这里获取值的时候会触发observe中的get，导致收集依赖
        Dep.target = null;
        return value;
    },
```

 * 在`compile`模板时初始化模板中需要替换的变量，此时会触发收集依赖，但是此时监听器(`Dep.target`)为`null`
 * 随后创建一个监听器实例`new Watcher()`(可以调用`vm.$watch`主动触发)此时构造函数中会调用`get`方法获取变量值，导致收集依赖流程被触发即(`dep.depend()`)


`dep.js`
```
depend: function () {
        //Dep.target为Watcher实例
        //调用Watcher的addDep方法，将自身(Dep实例)传递过去
        Dep.target.addDep(this);
    }
```

`watcher.js`
```
  addDep: function (dep) {
        if (!this.depIds.hasOwnProperty(dep.id)) {
        //先判断是否已经监听该属性
            dep.addSub(this);
            this.depIds[dep.id] = dep;
        }
    },
```
 * 每一个`vm.data`上的`key`对应一个`dep`实例,当被收集时把`watcher` `push`入`dep.subs`
 * 如果`dep.id`已经在当前`watcher`的`depIds`里，则表明不是一个新属性，而是值改变而已
 * 假设当前`watcher`的是`'a.b.c'`,那么`a,b,c`这三个属性的`dep`都会加入当前`watcher`

 ![1](https://github.com/luyufa/NodeLearning/blob/master/vue/img/1.png)

 * 假设`a`属性被多次收集，则`a`属性对应多个`watcher`

 ![2](https://github.com/luyufa/NodeLearning/blob/master/vue/img/2.png)

##### 3. 更新视图

* 由`definedReactive`特性可以知道只要修改属性即触发属性`set`函数，导致`dep.notify()`

`dep.js`

```
notify: function () {
        this.subs.forEach(function (sub) {
            sub.update();
        });
    },
```

`watcher.js`
```
update: function () {
        this.run();
    },
    run: function () {
        const value = this.get();//变化后的值
        const oldVal = this.value;//变化前的值
        if (value !== oldVal) {
            this.value = value;
            this.$cb.call(this.$vm, value, oldVal);//触发更新视图的`callback`
        }
    },
```
![mvvm流程图](https://github.com/luyufa/NodeLearning/blob/master/vue/img/mvvm.png)


* [模拟实现vue mvvm-dep](https://github.com/luyufa/NodeLearning/blob/master/vue/src/mvvm/dep.js)
* [模拟实现vue mvvm-watcher](https://github.com/luyufa/NodeLearning/blob/master/vue/src/mvvm/watcher.js)
* [模拟实现vue mvvm-observe](https://github.com/luyufa/NodeLearning/blob/master/vue/src/mvvm/observe.js)
* [模拟实现vue mvvm-compile](https://github.com/luyufa/NodeLearning/blob/master/vue/src/mvvm/compile.js)
* [模拟实现vue mvvm-mvvm](https://github.com/luyufa/NodeLearning/blob/master/vue/src/mvvm/mvvm.js)
* [模拟实现vue mvvm-实例](https://github.com/luyufa/NodeLearning/blob/master/vue/src/mvvm/index.html)

##### ps:参考文档
[剖析vue实现原理，自己动手实现mvvm](https://github.com/DMQ/mvvm)