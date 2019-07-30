## this

##### 按规范解读this


1. 计算`MemberExpression`赋值给`ref`
2. 如果 `ref` 是 `Reference`
   * `IsPropertyReference(ref)` 是 `true`, 那么 `this` 的值为 `GetBase(ref)`

   * `base value` 值是 `Environment Record`, 那么this的值为 `ImplicitThisValue(ref)`，该函数始终返回`undefined`

3. 如果 `ref` 不是 `Reference`，那么 `this` 的值为 `undefined`


###### 1.什么是MemberExpression
先看几个例子
```js
function foo() {
    console.log(this)
}

foo(); // MemberExpression 是 foo

function foo() {
    return function() {
        console.log(this)
    }
}

foo()(); // MemberExpression 是 foo()

var foo = {
    bar: function () {
        return this;
    }
}

foo.bar(); // MemberExpression 是 foo.bar
```
可以这样理解，MemberExpression是()左边的部分


###### 2.怎么判断为Reference类型

 * `foo()`->`foo` 是
 * `bar.foo()`->`bar.foo` 是
 * `(bar.foo)()`->`(bar.foo)` 是, 其中`()`不参与`MemberExpression`计算，所以等同于`bar.foo`
 * `(foo.bar = foo.bar)()`->`(foo.bar = foo.bar)` 否,赋值操作`=`
 * `(false || foo.bar)()`->`(false || foo.bar)` 否,逻辑与位运算



###### 3.到底什么是Reference
> 存在于规范的抽象类型，不真实存在于代码中


1. `Reference`由三部分组成
   * `base value`就是属性所在的对象或者就是 `EnvironmentRecord`，它的值只可能是 `undefined`, `an Object`, `a Boolean`, `a String`, `a Number`, `an environment record` 其中的一种
   * `reference name` 属性的名称
   * `strict` 严格模式

```js
var foo = 1;

// 对应的Reference是：
var fooReference = {
    base: EnvironmentRecord,
    name: 'foo',
    strict: false
};
```

```js
var foo = {
    bar: function () {
        return this;
    }
};

foo.bar(); // foo

// bar对应的Reference是：
var BarReference = {
    base: foo,
    name: 'bar',
    strict: false
};
```


2. `GetBase` ,返回`base value`

3. `IsPropertyReference`,如果 `base value` 是一个对象，就返回`true`




##### 在场景下按规范解读this


* 作为对象调用时，指向该对象
```js
var name='global'
var foo={
   name:'inner',
   bar:function(){
      console.log(this.name)
   }
}
foo.bar()//inner

1. MemberExpression: foo.bar
2. foo.bar是一个Reference
ref={
  base:foo,
  name:'name',
  strict:false
}
3. IsPrototypeReference(foo): true
4. this=getBase(ref)=foo
即:this指向foo
```

* 作为函数调时指向全局
```
var name='global'
var foo={
   name:'inner',
   bar:function(){
      console.log(this.name)
   }
}
var b=foo.bar;
b()//global

1. MemberExpression: b
2. b是一个Reference
ref={
   base:environmentRecord,
   name:'b',
   strict:false
}
3. base vlaue是EnvironmentRecord
4. this=ImplicitThisValue()=undefined;
即:this指向undefined，非严格模式下undefined隐式转换为全局window
```

* 作为构造函数实例调用，this指向该实例

* 作为call、apply调用` obj.b.apply(object, [])`，this指向object

* 特殊例子
```js
var name='global'
var foo={
   name:'inner',
   bar:function(){
      console.log(this.name)
   }
}
(foo.bar)()//inner
括号()不参与MemberExpression计算，故等价于foo.bar

(false||foo.bar)()// globa
逻辑运算使MemberExpression不是一个Reference，顾伟undefined

```
