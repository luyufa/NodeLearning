## this

>函数运行时上下文


1. 纯函数调用,this=global

 ```
 global.name = 'global';
const o = {
    name: 'o',
    sayHello: function () {
        console.log(this.name)
    }
};
const _o = o.sayHello;
_o();
//global
 ```

2. 对象方法调用,this= 当前对象

 ```
 const x  = 1;
global.x = 2;
function hello() {
    console.log(this.x);
}
const o = {};
o.x=4;
o.hello = hello;
o.hello();
//4
 ```

3. 实例对象（new）调用,this=当前实例对象

 ```
 const x  = 1;
global.x = 2;
function Hello() {
    this.x     = 3;
    this.hello = function () {
        console.log(this.x);
    }
}
new Hello().hello();
//3
 ```

4. `call`、`apply`调用,动态的改变函数运行时上下文环境,即改变`this`指向;第一个参数都是指定`this`指向的环境,`call`接受依次参数,`apply`接收参数数组;

 ```
 const apple = {color: 'red'}, banana = {color: 'yellow'};
function sayYourColor() {
    this.color = 'default';
    this.say   = function (oo) {
        console.log(`my color is ${this.color},  oo is ${oo}`);
    }
}
const fruit = new sayYourColor();
fruit.say('a');//my color is default,  oo is a
fruit.say.call(apple, 'b');//my color is red,  oo is b
fruit.say.apply(banana, ['c']);//my color is yellow,  oo is c
 ```

5. `bind`和箭头函数,只有第一次`bind`会生效;箭头函数定义时会绑定父环境中的`this`,不会运行时动态变化,即使`bind`也无法改变

 ```
 function setTimeOutSelf() {
    this.x    = 'self';
    this.out1 = function () {
        setTimeout(function () {
            console.log(`this.x -> ${this.x}`);
        }, 1000)
    };
    this.out2 = function () {
        setTimeout(function () {
            console.log(`this.x -> ${this.x}`);
        }.bind({x:'out'}).bind(this), 1000);
    };
    this.out3 = function () {
        setTimeout((()=> {
            console.log(`this.x -> ${this.x}`);
        }).bind({x:'out'}), 1000)
    }
}
const TOS=new setTimeOutSelf();
TOS.out1();//this.x -> undefined
TOS.out2();//this.x -> out
TOS.out3();//this.x -> self
 ```



//bind 实现

```
Object.prototype._bind = function (context) {
    const self = this;
    return function (...ret) {
        self.apply(context, ret);
    };
};
```