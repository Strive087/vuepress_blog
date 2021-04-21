# Object API

今天某公司二面面试官问了好多操作对象的 API，当时有几个记得不是很清楚，一时半会说不出来具体叫啥，有点尴尬。这里做个笔记，加深下记忆。

## Object.assign()

Object.assign() 方法用于将所有可枚举属性的值从一个或多个源对象分配到目标对象。它将返回目标对象。**说白了就是对象合并。**

```js
const target = { a: 1, b: 2 };
const source = { b: 4, c: 5 };

const returnedTarget = Object.assign(target, source);

console.log(target);
// expected output: Object { a: 1, b: 4, c: 5 }

console.log(returnedTarget);
// expected output: Object { a: 1, b: 4, c: 5 }
```

## Object.keys()

这个方法肯定知道就是返回属性嘛，**但要注意的是他是只返回自身（不包含原型链）可枚举的属性！**

## Object.getOwnPropertyNames()

Object.getOwnPropertyNames()方法返回一个由指定对象的所有自身属性的属性名（包括不可枚举属性但不包括Symbol值作为名称的属性）组成的数组。**这个与上面的Object.keys()做对比，差别就是在于这个方法可以返回不可枚举的属性。**

## Object.prototype.hasOwnProperty()

hasOwnProperty() 方法会返回一个布尔值，指示对象自身属性中是否具有指定的属性（也就是，是否有指定的键）。**说白了就是判断这个属性是不是他自己本身的或者说他自己本身有没有这个属性。**

```js
let a = { b: 1 };
let c = Object.create(a, {
  d: {
    value: 2,
    writable: true,
    enumerable: true,
    configurable: true
  }
});

c.hasOwnProperty("b"); // false
c.hasOwnProperty("d"); //true
```

## Object.prototype.isPrototypeOf()

isPrototypeOf() 方法用于测试一个对象是否存在于另一个对象的原型链上。

## 对象屏蔽系列

- Object.preventExtensions()

  让一个对象变的不可扩展，也就是永远不能再添加新的属性。

- Object.seal()
  
  封闭一个对象，阻止添加新属性并将所有现有属性标记为不可配置。当前属性的值只要原来是可写的就可以改变。

- Object.freeze()

  可以冻结一个对象。一个被冻结的对象再也不能被修改；冻结了一个对象则不能向这个对象添加新的属性，不能删除已有属性，不能修改该对象已有属性的可枚举性、可配置性、可写性，以及不能修改已有属性的值。此外，冻结一个对象后该对象的原型也不能被修改。freeze() 返回和传入的参数相同的对象。
