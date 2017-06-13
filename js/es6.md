### ES6常用特性

1. `let` `const` `var`

 * let const不具有覆盖声明、变量提升，以及作用域范围为块级会减低犯错机会

 * const声明的变量引用不会改变，编译时会有性能优化

 |        | var   | let  | const|
|  ----- | ----  | ---- |---|
|作用域范围| 函数  |  块  |       块    |
|   否覆盖声明     |   true    |   err     |      err    |
|   变量提升      |   true    |   false     |    false       |
|   再次赋值     |    true   |   true     |       err    |



2. 模版字符串,可以保留空格、换行、变量
 ```
 console.log(`i am an
${'阳光'} boy`);
 ```

3. 初始化赋值

 ```
 function init(arr = [], callback = ()=> {
 }) {

 }
 ```



4. 解构赋值
 >解构不成功会被赋值为undefined,可以指认默认值

 `对象解构`，对象的属性没有次序，变量必须与属性同名,`提取JSON数据`

 ```
 function done(data = {}) {
    const {id = '123', name = 'L', age = 18}=data;
    console.log(id, name, age)
}
 ```

   `对象解构`，变量名字与属性名不一样时`age :newAge = 18`

 ```
function done(data = {}) {
    const {id = '123', name = 'L', age :newAge = 18}=data;
    console.log(id, name, newAge)
}

 ```

 `数组解构`，数组的元素是按次序排列的，变量的取值由它的位置决定

 ```
 function done(data = []) {
    const [id = '123', name = 'L', age = 18]=data;
    console.log(id, name, age)
 }
 ```

 `字符串解构`，字符串被拆开为类数组

 ```
 const [a, b, c, d, e] = 'hello';
console.log(a, b, c, d, e);
 ```

 `函数参数解构`,参数表面上是一个数组，但在传入参数的那一刻，数组参数就被解构成变量x和y

 ```
 function done([x,y]) {
    return x + y;
}
 ```

5. 箭头函数

 > 箭头函数中没有`this`，是绑定的其`父环境`下的`this`,由其调用者`this`决定他的`this`, 故而不能使用new(报错)，bind(无效)

 ```
const obj = {
    test() {
        const arrow = () => {
            // 这里的 this 是 test() 中的 this，由 test() 的调用方式决定
            console.log(this === obj);
        };
        arrow();
    },

    getArrow() {
        return () => {
            // 这里的 this 是 getArrow() 中的 this，由 getArrow() 的调用方式决定
            console.log(this === obj);
        };
    },

    getFunction() {
        return function () {
            // 这里的 this 是 getArrow() 中的 this，由 getArrow() 的调用方式决定
            console.log(this === obj);
        };
    }
};
obj.test();//true
obj.getArrow()();//true
obj.getFunction()()//false
const a = obj.getArrow;a()();//false
 ```

6. `rest`参数
 > `...变量名`，只能是最后一个参数，不再使用`arguments`

 ```
 function paras(error, ...args) {
    console.log('error', error)
    console.log('args', args, args instanceof Array)
}
paras('err', 1, 2, 3, 4);
//error err
//args [ 1, 2, 3, 4 ] true
 ```

7. `calss`类与`extends`继承
 > `class`定义类，必然含有一个`constructor `方法作为构造方法，
 所有类方法都定义`portotype`上,`this`标示其实例对象，直接使用 `new`关键字创建实例，super继承父类的构造函数...未完待续