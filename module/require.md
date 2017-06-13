### 从require开始

Node定义了一个Module构造函数，并且所有模块包括当前模块也是Module实例

```
function Module(id, parent) {
  this.id = id;
  this.exports = {};
  this.parent = parent;
  this.filename = null;
  this.loaded = false;
  this.children = [];
}

module.exports = Module;

var module = new Module(filename, parent);
```

* 如果不存在父模块则`id`为`.`,存在则为该模块的绝对路径
* 如果不存在父模块则`parent`为`null`,存在则为父模块`Module`实例
* `filename`模块的绝对路径
* `loaded`模块是否加载完毕


#### require
每个模块实例都有一个 `require` 方法,内部调用load方法,因此`require`并不是全局方法，仅在模块内部才能使用

```
Module.prototype.require = function(path) {
  return Module._load(path, this);
};
```

* load方法执行过程
 1. 计算绝对路径
 2. 缓存中查找，如命中则直接返回
 3. 生产模块实例
 4. 存入缓存
 5. 加载模块
 6. 导出模块的exports属性


  模块的加载实质上就是，注入exports、require、module三个全局变量，然后执行模块的源码，然后将模块的 exports 变量的值输出

  ```
(function (exports, require, module, __filename, __dirname) {
  // 模块源码
});
  ```

  #####  文件热更新

  1. 首先解除原有的require.cache[absolutePath]的引用
  2. 重新加载模块
  3. 引用赋值（不改变指向内存地址，仅改变内容）

  ```
  function _require(modulePath) {
    const path = require('path');
    const absolutePath = path.resolve(modulePath);
    let module = require(absolutePath);

    function copy(module, newModule) {
        for (let key in module) {
            if (!newModule.hasOwnProperty(key)) {
                delete module[key];
            }
        }

        for (let key in newModule) {
            module[key] = newModule[key];
        }
    }

    setInterval(function () {
        if (require.cache[absolutePath]) {
            delete require.cache[absolutePath];
            let newModule = require(modulePath);
            copy(module, newModule);
        }
    }, 1000);
    return module;
}
const test = require('./test.json');
setInterval(function () {
    console.log(test);
}, 4000);
const fs = require('fs');
setInterval(function () {
    fs.writeFileSync('./test.json','{ "name":"' + Math.random() + '" }')
}, 5000);
```


###### 热更新配置最佳实践方案->存数据库?


参考链接:

* [Node.js 中的循环依赖](https://segmentfault.com/a/1190000004151411)
