### npm

> Node的模块管理器

#### 安装
`npm install` 会首先检查node_moduls目录中是否存在该模块，如果存在一个新模块就不会在安装了，即使远程库以有新版本。
如果你希望一个模块是否被安装过，npm都会重新安装则需要指定参数`npm install <packageName> --force`。

全局安装： `npm install -g <packageName>`

`--save`和`--save-dev`,以npm install lodash为例

`--save`:会在`dependencies`中添加依赖，`--save-dev`会在`devDependencies`中添加依赖。产品环境下`npm install --production`不会安装`devDependencies `中的模块到node_modules目录。


#### 更新
`npm update <packageName>`, 首先会在远程库查询最新版本，然后查询本地，如果本地不存在或版本较低就会安装。


#### 卸载
 * `npm unstall 	<packageName>`
 * `npm unstall -g	<packageName>`


#### package.json

* name－包名
* version－版本号
* description－描述
* dependencies－产品环境下依赖列表
* devDependencies－开发环境下依赖列表
* scripts －脚本命令


#### npm脚本
>package.json文件中scripts中定义的脚步命令


```
"scripts": {
    "build": "node test.json"
  }
```
执行`npm run build` 等同于 `node test.json`，如需要执行时传递参数通过`--`分割

```
npm run build -- para1 para2
```

`npm run`不带任何参数可以查看当前所有可以执行的脚步命令

每当执行`npm run`时，会自动创建一个`shell`，因此只要是`shell`可以执行的命令都可以写入其中，该`shell`会把当前目录的`node_modules`暂时加入`path`目录，遵循`shell`脚本规则，若推出码不是`0`则认为执行失败。

