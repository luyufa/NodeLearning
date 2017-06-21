## Test
> mimimist+assert+mocha+supertest

#### mocha + assert
> npm install --global mocha

测试脚本=测试套件＋测试用例组成

```
describe('#测试套件', function () {
    it('测试用例', function (done) {
        done()
    })
});
```
常用断言

1. 判断是否相等== `assert.equal(b,a,mesage)`
2. 判断是否不相等!= `assert.notEqual(b,a,message)`
3. 判断是非存在if(a) `0 null undefined false ''`都断言错误

`mocha` 常用配置参数

1. `mocha testDir/test.js --bail`只要有一个未通过即停止
2. `mocha testDir/test.js --timeout 4000`每个测试用例默认执行2000毫秒timeout可以改变默认执行时间


`mocha` 对`Promise`进行测试,返回一个`Promise`，不需要显示指明`done`函数，用`then(fun1,fun2)`代替`catch(fun2)`(因为`fun1`中的抛出的断言错误`AssertError`会被传递给`catch`)

```
describe('#测试套件-Promise', function () {
    it('测试用例-Promise', function () {
        return Promise.resolve(1000).then(function (value) {
            assert.equal(value, 1000)
        })
    })
});
```

mocha 四种钩子

```
describe('hooks', function() {

  before(function() {
    // 在本区块的所有测试用例之前执行
  });

  after(function() {
    // 在本区块的所有测试用例之后执行
  });

  beforeEach(function() {
    // 在本区块的每个测试用例之前执行
  });

  afterEach(function() {
    // 在本区块的每个测试用例之后执行
  });

  // test cases
});
```


#### [minimist](https://github.com/substack/minimist)

用于从命令行接收，解析参数

```
process.argv
----> [ '/usr/local/bin/node',
  '/Users/luyufa/workspace/test/node_modules/mocha/bin/_mocha',
  'test/api.js',
  '--module',
  'test' ]


require('minimist')(process.argv.slice(2));
----> { _: [ 'test/api.js' ], module: 'test' }
```


#### [supertest](https://github.com/visionmedia/supertest)

>配合express服务进行api测试

使用agent发起各种http请求,agent可以保存下`Set-Cookie`之后每次请求都带有`cookie`字段

```
const app = require('../app');
const agent = require('supertest').agent(app);
```

```
agent.get('/api/user')
            .query({name: 'sss'})//req.query
            .send({qq:'qq'})//req.body
            .set('name', 'luyufa')//req.headers
            .set('age', 22)
            .expect(200)// 返回http状态码
            .end((err, res)=> {
                assert.equal(res.body.code, 200);
                assert.equal(res.body.data, undefined)
                done()
            })
```


1. `expect(http状态码)`
2. `expect(htpp响应头file,htpp响应头value)`
3. 	`expect(http请求cookie字段value)`
