## new
> 构造一个自定义类型的对象实例

1. 访问构造函数里、原型链上的属性

* 特性

  ```js
  function P(){
   this.name='A'
  }
  P.prototype.age=24
  const p=new P();
  console.log(p.name)//访问构造函数的属性
  console.log(p.age)//访问原型链上的属性

  ```

* 实现

  ```js
  function ObjectNew(){
      var obj = Object.create(null);

      //继承原型链属性
      const Constructor = [].shift.call(arguments);
      obj.__proto__= Constructor.prototype;

      //继承构造函数属性
      Constructor.apply(obj , Array.prototype.slice.call(arguments))

      return obj;
  }
  ```

2. 返回值为Object时，仅能访问该Object的属性

* 特性

  ```js
  function P(){
   this.name='A'
   return {
      name1:'B'
   }
  }
  const p=new P();
  console.log(p.name1) //B,返回值为Object时，仅能访问该Object的属性
  console.log(p.name) //undefined
  ```

* 实现

  ```js
  function ObjectNew(){
      var obj = Object.create(null);

      //继承原型链属性
      const Constructor = [].shift.call(arguments);
      obj.__proto__= Constructor.prototype;

      //继承构造函数属性
      const ret = Constructor.apply(obj , Array.prototype.slice.call(arguments))

      return typeof ret === 'Object' ? ret||obj : obj ;
  }
  ```


 需要注意`Object.create(null)与{}`的差别，`Object.create(null)`直接创建一个纯空的对象，没有任何属性;而`{}`会创建一个继承了原型`Object.prototype`的对象。

 也就是说`Object.create(Object.prototype)==={}`