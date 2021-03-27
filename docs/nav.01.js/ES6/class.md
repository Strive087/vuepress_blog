# Class

具体的使用方法不说，文档都有。主要记录下重点的使用方法，已经手写转换成ES5的代码。

## super关键字

这里的super关键中分为两种情况：

- super作为函数
  当super作为函数调用时，其代表着父类。"子类"的构造函数内部必须调用一次super(),并且super()只能用在子类的构造函数之中，否则会报错的。

  这里需要注意的是，super函数其内部的this指向的是"子类"实例，所以super()相当于``parentClass.prototype.constructor.apply(this)``。
  
  ```js
  class A {
    constructor() {
      //new.target 指向当前正在执行的函数
      console.log(new.target.name);
    }
  }
  class B extends A {
    constructor() {
      super();
    }
  }
  new A() // A
  new B() // B
  ```

- super作为对象

  super作为对象时，在普通方法中，**指向父类的原型对象**；在静态方法中，**指向父类**。

  ES6 规定，在子类普通方法中通过super调用父类的方法时，方法内部的this指向当前的子类实例。在子类的静态方法中通过super调用父类的方法时，方法内部的this指向当前的子类，而不是子类的实例。

注意，使用super的时候，必须显式指定是作为函数、还是作为对象使用，否则会报错。

```js
class A {}

class B extends A {
  constructor() {
    super();
    console.log(super); // 报错
  }
}
```

由于对象总是继承其他对象的，所以可以在任意一个对象中，使用super关键字。

```js
var obj = {
  toString() {
    return "MyObject: " + super.toString();
  }
};

obj.toString(); // MyObject: [object Object]
```
