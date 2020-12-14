# 变量对象

如果变量与执行上下文相关，那变量自己应该知道它的数据存储在哪里，并且知道如何访问。这种机制称为变量对象(variable object)。

```text
变量对象(缩写为VO)是一个与执行上下文相关的特殊对象(也就是执行上下文的一个属性)，它存储着在上下文中声明的以下内容：
    变量 (var, 变量声明);
    函数声明 (FunctionDeclaration, 缩写为FD);
    函数的形参
```

```js
activeExecutionContext = {
  VO: {
    // 上下文数据（var, FD, function arguments)
  }
};
```

只有全局上下文的变量对象允许通过VO的属性名称来间接访问(因为在全局上下文里，全局对象自身就是变量对)，在其它上下文中是不能直接访问VO对象的，因为它只是内部机制的一个实现。

## 不同执行上下文中的变量对象

对于所有类型的执行上下文来说，变量对象的一些操作(如变量初始化)和行为都是共通的。从这个角度来看，把变量对象作为抽象的基本事物来理解更为容易。同样在函数上下文中也定义和变量对象相关的额外内容。

```text
抽象变量对象VO (变量初始化过程的一般行为)
  ║
  ╠══> 全局上下文变量对象GlobalContextVO
  ║        (VO === this === global)
  ║
  ╚══> 函数上下文变量对象FunctionContextVO
           (VO === AO, 并且添加了<arguments>和<formal parameters>)
```

### 全局上下文的变量对象

全局上下文中的变量对象——在这里，变量对象就是全局对象自己:

```js
VO(globalContext) === global;
```

基于这个原理，在全局上下文中声明的变量，我们才可以间接通过全局对象的属性来访问它

### 函数上下文的变量对象

在函数执行上下文中，VO是不能直接访问的，此时由活动对象(activation object,缩写为AO)扮演VO的角色。

#### 活动对象是在进入函数上下文时被创建的，它通过函数的arguments属性初始化,arguments属性的值是Arguments对象

这里重点记住，活动对象是在进入函数上下文时被创建的！！！

```js
VO(functionContext) === AO;
AO = {
  arguments: <ArgO>
};
```

Arguments对象是活动对象的一个属性，它包括如下属性：

1. callee — 指向当前函数的引用
2. length — 真正传递的参数个数
3. properties-indexes (字符串类型的整数) 属性的值就是函数的参数值(按参数列表从左到右排列)。 properties-indexes内部元素的个数等于arguments.length，properties-indexes 的值和实际传递进来的参数之间是共享的。

这里重点理解下，properties-indexes 的值和实际传递进来的参数之间是共享的：

```js
function foo(b){
  console.log(arguments.length)
  console.log(b == arguments[0]);
  b = 'test1';
  console.log('b:',b);
  console.log(arguments[0]);
  console.log(b == arguments[0]);
  arguments[0] = 'test2';
  console.log('b:',b);
  console.log(arguments[0]);
  console.log(b == arguments[0]);
  console.log(arguments.length)
}
foo('tset');
foo();
```

![311607778369_.pic_hd](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/311607778369_.pic_hd.jpg)

看上面的例子应该能够理解吧，这是AO作为VO时不一样的地方。

## 处理上下文代码的阶段

现在我们终于到了本文的核心点了。执行上下文的代码被分成两个基本的阶段来处理：

1. 进入执行上下文
2. 执行代码

变量对象的修改变化与这两个阶段紧密相关。

### 进入执行上下文

当进入执行上下文(代码执行之前)时，VO里已经包含了下列属性(前面已经说了)：

- 函数的所有形参(如果我们是在函数执行上下文中)
  - 由名称和对应值组成的一个变量对象的属性被创建；没有传递对应参数的话，那么由名称和undefined值组成的一种变量对象的属性也将被创建。注意这里已经是赋值了！！！

- 所有函数声明(FunctionDeclaration, FD)
  - 由名称和对应值（函数对象(function-object)）组成一个变量对象的属性被创建；如果变量对象已经存在相同名称的属性，则完全替换这个属性。注意函数的优先级最高，而且函数表达是不是函数声明，并未赋值！！！

- 所有变量声明(var, VariableDeclaration)
  - 由名称和对应值（undefined）组成一个变量对象的属性被创建；如果变量名称跟已经声明的形式参数或函数相同，则变量声明不会干扰已经存在的这类属性。注意变量声明优先级最低，而且在这里阶段并未真正赋值，先初始化为undefined！！！

例子：

```js
function test(a, b) {
  var c = 10;
  function d() {}
  var e = function _e() {};
  (function x() {});  //只是一个表达式而已
}
 
test(10); // call

//进入执行上下文阶段
AO(test) = {
  a: 10,
  b: undefined,
  c: undefined,
  d: <reference to FunctionDeclaration "d">
  e: undefined
};
```

### 执行代码

这个周期内，AO/VO已经拥有了属性(不过，并不是所有的属性都有值，大部分属性的值还是系统默认的初始值undefined )。接下来随着代码的执行，AO/VO属性的值将会被修改。（这里需要注意函数声明和函数的所有形参在这个阶段不会再执行，因为已经执行赋值过了）。

我们可以看下例子：

```js
alert(x); // function
 
var x = 10;
alert(x); // 10
 
x = 20;
 
function x() {}; //在代码执行阶段不会再执行函数声明
 
alert(x); // 20
```

看到这里就应该明白变量提升了具体原因了！

## 关于变量

任何时候，变量只能通过使用var、let关键字等才能声明。不使用关键字，这仅仅是给全局对象创建了一个新属性(但它不是变量)。

```js
alert(a); // undefined
alert(b); // "b" 没有声明
 
b = 10;  // 10, 代码执行阶段创建
var a = 20; // 20, 代码执行阶段修改
```

关于变量，还有一个重要的知识点。变量相对于简单属性来说，变量有一个特性(attribute)：{DontDelete},这个特性的含义就是不能用delete操作符直接删除变量属性。
