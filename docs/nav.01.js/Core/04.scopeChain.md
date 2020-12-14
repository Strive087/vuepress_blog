# 作用域链

这里首先强调下，不要把作用域链和与原型链混淆了！大白话说，作用域链其实就是用来查找解析标识符中的变量的一种机制，查找的过程用也会利用到原型链。而原型链则是实现对象继承相关的一种机制。

函数上下文的作用域链在函数调用时创建的，包含活动对象和这个函数内部的[[scope]]属性。

```js
activeExecutionContext = {
    VO: {...}, // or AO
    this: thisValue,
    Scope: [ // Scope chain
      // 所有变量对象的列表
      // for identifiers lookup
    ]
};
Scope = AO + [[scope]]
```

## 原理分析

先看一下下面的例子：

```js
var x = 10;
 
function foo() {
  var y = 20;
  alert(x + y);
}
 
foo(); // 30
```

知道[变量对象](variableObject.md)创建原理的应该知道，foo函数的AO只包含了y并未有x，那么他是如何访问到x的？理论上函数应该能访问一个更高一层上下文的变量对象。然而这种机制就是通过函数内部的[[scope]]属性实现的。

### 函数创建时——创建[[scope]]

[[scope]]是所有父变量对象的层级链，处于当前函数上下文之上，在函数创建时存于其中。[[scope]]在函数创建时被存储－－静态（不变的），永远永远，直至函数销毁。即：函数可以永不调用，但[[scope]]属性已经写入，并存储在函数对象中。这里要重点记住，用大白话说就是，函数在创建的时候，在创建它的那个位置，已经定死了这个函数的[[scope]]，而且需要记住这个是函数的内部属性不是函数上下文属性。

### 函数激活时——VO|AO+[[scope]]形成作用域链

在函数激活时，变量对象或者活动对象将结合函数[[scope]]属性形成作用域链，这样一来变量优先在函数上下文的活动对象中查找然后沿着作用域到[[scope]]中查找。

下面用个例子来详细说明下：

```js
var x = 10;
 
function foo() {
  var y = 20;
 
  function bar() {
    var z = 30;
    alert(x +  y + z);
  }
 
  bar();
}
 
foo(); // 60
```

1.首先全局上下文的变量对象是全局对象：

```js
globalContext.VO === Global = {
  x: 10
  foo: <reference to function>
};
```

在创建foo时，函数foo内部属性已经被赋值：

```js
foo.[[scope]] = [
  globalContext.VO
];
```

2.然后执行代码,foo函数被激活，foo函数上下文的活动对象为：

```js
fooContext.AO = {
  y: 20,
  bar: <reference to function>
}
```

此时foo函数上下文的作用域链为:

```js
fooContext.Scope = fooContext.AO + foo.[[Scope]]
```

在创建bar时，函数bar内部属性已经被赋值：

```js
bar.[[scope]] = [
  globalContext.VO,
  fooContext.AO
]
```

3.然后执行代码,bar函数被激活，bar函数上下文的活动对象为：

```js
barContext.AO = {
  z: 30
}
```

此时bar函数上下文的作用域链为:

```js
barContext.Scope = barContext.AO + bar.[[Scope]]
```

然后解析到x、y和z时，则沿着作用域链查找：

```js
- "x"
-- barContext.AO // not found
-- fooContext.AO // not found
-- globalContext.VO // found - 10

- "y"
-- barContext.AO // not found
-- fooContext.AO // found - 20

- "z"
-- barContext.AO // found - 30
```

## 常见陷阱

可以来测试下你作用域的掌握程度

### 闭包

```js
var x = 10;
 
function foo() {
  alert(x);
}
 
(function () {
  var x = 20;
  foo(); // 10, but not 20
})();
```

这个不用解释了，不懂再看看上面说的

### Function构造函数创建的函数

```js
var x = 10;
function foo() {
  var y = 20;
  var barFn = Function('alert(x); alert(y);');
  barFn(); // 10, "y" is not defined
}
foo();
```

通过构造函数创建的函数的[[scope]]指向全局对象，这个在[函数](function.html#构造函数function创建的函数)那个笔记中有讲到。

### 二维作用域链查找

```js
function foo() {
  alert(x);
}
 
Object.prototype.x = 10;
 
foo(); // 10
```

这就是开头提到的利用原型链查找。如果一个属性在作用域链中的所有变量对象中没有直接找到，查询将在原型链中继续。

1. 作用域链环节——也就是去沿着作用域链一个个查变量对象

2. 原型链环节——作用域链找不到了，于是在变量对象的原型链查找

### 全局和eval上下文中的作用域链

```js
function foo() {
  var x = 10
  eval('alert(x)');
}
 
var x = 20
eval('alert(x)') //20
foo(); //10
```

代码eval的上下文与当前的调用上下文（calling context）拥有同样的作用域链。

```js
evalContext.Scope === callingContext.Scope;
```

### 代码执行时对作用域链的影响

在代码执行阶段有两个声明能修改作用域链。这就是with声明和catch语句。

```js
Scope = withObject|catchObject + AO|VO + [[Scope]]
```
