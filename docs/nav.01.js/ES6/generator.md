# Generator

![16f11da907f74194](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/16f11da907f74194.jpg)

生成器对象是由一个 generator function 返回的,并且它符合可迭代协议和迭代器协议。

语法：

```js
function* gen() {
  yield 1;
  yield 2;
  yield 3;
}

let g = gen();
// "Generator { }"
```

方法:

- Generator.prototype.next() : 返回一个由 yield表达式生成的值。
- Generator.prototype.return() : 返回给定的值并结束生成器。
- Generator.prototype.throw() : 向生成器抛出一个错误。

## 迭代器和生成器

### 迭代器

在 JavaScript 中，迭代器是一个对象，它定义一个序列，并在终止时可能返回一个返回值。 更具体地说，迭代器是通过使用 next() 方法实现迭代协议的任何一个对象，该方法返回具有两个属性的对象： value，这是序列中的 next 值；和 done ，如果已经迭代到序列中的最后一个值，则它为 true 。如果 value 和 done 一起存在，则它是迭代器的返回值。

一旦创建，迭代器对象可以通过重复调用next（）显式地迭代。 迭代一个迭代器被称为消耗了这个迭代器，因为它通常只能执行一次。 在产生终止值之后，对next（）的额外调用应该继续返回{done：true}
。

### 迭代协议

迭代协议具体分为两个协议：可迭代协议和迭代器协议。

#### 可迭代协议

可迭代协议允许 JavaScript 对象定义或定制它们的迭代行为，例如，在一个 for..of 结构中，哪些值可以被遍历到。一些内置类型同时是内置可迭代对象，并且有默认的迭代行为，比如 Array 或者 Map，而其他内置类型则不是（比如 Object）。

要成为可迭代对象， 一个对象必须实现 @@iterator 方法。这意味着对象（或者它原型链上的某个对象）必须有一个键为 @@iterator 的属性，可通过常量 Symbol.iterator 访问该属性：

![elPlQ0](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/elPlQ0.png)

当一个对象需要被迭代的时候（比如被置入一个 for...of 循环时），首先，会不带参数调用它的 @@iterator 方法，然后使用此方法返回的迭代器获得要迭代的值。

值得注意的是调用此零个参数函数时，它将作为对可迭代对象的方法进行调用。 因此，在函数内部，this关键字可用于访问可迭代对象的属性，以决定在迭代过程中提供什么。

此函数可以是普通函数，也可以是生成器函数，以便在调用时返回迭代器对象。 在此生成器函数的内部，可以使用yield提供每个条目。

#### 迭代器协议

迭代器协议定义了产生一系列值（无论是有限个还是无限个）的标准方式。当值为有限个时，所有的值都被迭代完毕后，则会返回一个默认返回值。

只有实现了一个拥有以下语义（semantic）的 next() 方法，一个对象才能成为迭代器：

![fuKBLA](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/fuKBLA.png)

### 可迭代对象(iterable)

若一个对象拥有迭代行为，比如在 for...of 中会循环哪些值，那么那个对象便是一个可迭代对象。一些内置类型，如 Array 或 Map 拥有默认的迭代行为，而其他类型（比如Object）则没有。

为了实现可迭代，一个对象必须实现 @@iterator 方法，这意味着这个对象（或其原型链中的任意一个对象）必须具有一个带 Symbol.iterator 键（key）的属性。

可以多次迭代一个迭代器，或者只迭代一次。 程序员应该知道是哪种情况。 只能迭代一次的Iterables（例如Generators）通常从它们的@@iterator方法中返回它本身，其中那些可以多次迭代的方法必须在每次调用@@iterator时返回一个新的迭代器。

所有的可迭代对象，必定会有一个Symbol.iterator方法，通过调用可迭代对象的Symbol.iterator方法就能获取默认迭代器，这一过程是由JS引擎完成的。

```js
var arr = [10, 2, 3, 5];    // 数组是个可迭代对象

var it = arr[Symbol.iterator]();    // 调用可迭代对象的Symbol.iterator方法可以获取默认迭代器，将迭代器引用赋给it变量
console.log(it.next());     // {value: 10, done: false}
console.log(it.next());     // {value: 2, done: false}
console.log(it.next());     // {value: 3, done: false}
console.log(it.next());     // {value: 5, done: false}
console.log(it.next());     // {value: undefined, done: true}
```

在这段代码中，通过Symbol.iterator获取了数组values的默认迭代器，并用它遍历数组中的元素。在JavaScript引擎中执行for-of循环语句也是类似的处理过程。

所以可以用Symbol.iterator来检测对象是否为可迭代对象：

```js
function isIterator(obj) {
    // return typeof obj[Symbol.iterator] === "function";   // 这种方法也可以选用
    return Object.prototype.toString.call( obj[Symbol.iterator] ) === "[object Function]";
}
console.log(isIterator([10, 2, 3, 4, 5]));      // true
console.log(isIterator(new Set()));             // true
console.log(isIterator(new Map()));             // true
console.log(isIterator("abc"));                 // true
```

### 内置可迭代对象

String、Array、TypedArray、Map 和 Set 都是内置可迭代对象，因为它们的原型对象都拥有一个 Symbol.iterator 方法。

### 用于可迭代对象的语法

一些语句和表达式专用于可迭代对象，例如 for-of 循环，展开语法，yield* 和 解构赋值。

### 生成器函数

虽然自定义的迭代器是一个有用的工具，但由于需要显式地维护其内部状态，因此需要谨慎地创建。生成器函数提供了一个强大的选择：它允许你定义一个包含自有迭代算法的函数， 同时它可以自动维护自己的状态。 生成器函数使用 function*语法编写。 最初调用时，生成器函数不执行任何代码，而是返回一种称为Generator的迭代器。 通过调用生成器的下一个方法消耗值时，Generator函数将执行，直到遇到yield关键字。

可以根据需要多次调用该函数，并且每次都返回一个新的Generator，但每个Generator只能迭代一次。

我们现在可以调整上面的例子了。 此代码的行为是相同的，但实现更容易编写和读取。

### 通过生成器给迭代器传参

在生成器函数内部使用yield关键字暂停，在该函数执行返回的迭代器上调用next()获得暂停时的返回值。其实next()方法可以接收参数，这个参数的值会代替生成器内部上一条yield语句的返回值。

```js
// 生成器
function *createIterator() {
    var first = yield 2;
    var second = yield first * 3;
    yield second + 3;
}

// 创建迭代器实例
var it = createIterator();

// 启动迭代器
it.next();      // {value: 2, done: false}
it.next(4);     // {value: 12, done: false}
it.next(7);     // {value: 10, done: false}
it.next();      // {value: undefined, done: true}
```

最后总结下，迭代器是可迭代对象，具有Symbol.iterator方法和next()方法，可以通过for..of代替普通for循环来迭代，省去循环引用变量，简化了循环过程。而生成器是创建迭代器的函数，生成器函数内部有yield关键字来提供暂停接口，作为创建的迭代器调用next()方法执行的节点。生成器函数与普通函数的区别是前者在function关键字后有星号(*)，并且生成器函数执行后会创建一个新的迭代器实例，其他则和普通函数一样，可以传参和返回值。迭代器的next()方法可以传入参数，传入的参数值将会代替迭代器内上一条yield语句的返回值。

## 生成器委托

实际场景中我们可能会遇到从一个生成器调用另一个生成器，这是我们可能会使用co工具库来自动执行。但是我们更好的方式是通过生成器委托来完成。具体语法是 yield * ，举例如下：

```js
function *foo() {
  var r2 = yield request('http://url2);
  var r3 = yield request('http://url3);
  return r3;
}
function *bar(){
  var r1 = yield request('http://url1');
  var r3 = yield *foo();
  console.log(r3)
}
run(bar);
```
