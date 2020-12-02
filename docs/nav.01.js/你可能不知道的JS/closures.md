# 闭包

闭包是一系列代码块（在ECMAScript中是函数），并且静态保存所有父级的作用域。通过这些保存的作用域来搜寻到函数中的自由变量。

请注意，因为每一个普通函数在创建时保存了[[Scope]]，理论上，ECMAScript中所有函数都是闭包。

还有一个很重要的点，几个函数可能含有相同的父级作用域（这是一个很普遍的情况，例如有好几个内部或者全局的函数）。在这种情况下，在[[Scope]]中存在的变量是会共享的。一个闭包中变量的变化，也会影响另一个闭包的。

```js
function baz() {
  var x = 1;
  return {
    foo: function foo() { return ++x; },
    bar: function bar() { return --x; }
  };
}

var closures = baz();

console.log(
  closures.foo(), // 2
  closures.bar()  // 1
);
```

![pN1XGN](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/pN1XGN.png)