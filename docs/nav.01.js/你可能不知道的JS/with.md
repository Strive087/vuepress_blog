# With改变作用域链

在代码执行过程中，如果使用with或者catch语句就会改变作用域链。而这些对象都是一些简单对象，他们也会有原型链。这样的话，作用域链会从两个维度来搜寻。

- 首先在原本的作用域链
- 每一个链接点的作用域的链（如果这个链接点是有prototype的话）


```js
Object.prototype.x = 10;

var w = 20;
var y = 30;

// 在SpiderMonkey全局对象里
// 例如，全局上下文的变量对象是从"Object.prototype"继承到的
// 所以我们可以得到“没有声明的全局变量”
// 因为可以从原型链中获取

console.log(x); // 10

(function foo() {

  // "foo" 是局部变量
  var w = 40;
  var x = 100;

  // "x" 可以从"Object.prototype"得到，注意值是10哦
  // 因为{z: 50}是从它那里继承的

  with ({z: 50}) {
    console.log(w, x, y , z); // 40, 10, 30, 50
  }

  // 在"with"对象从作用域链删除之后
  // x又可以从foo的上下文中得到了，注意这次值又回到了100哦
  // "w" 也是局部变量
  console.log(x, w); // 100, 40

  // 在浏览器里
  // 我们可以通过如下语句来得到全局的w值
  console.log(window.w); // 20

})();
```

![YjoIcx](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/YjoIcx.png)

# 参考链接

[深入理解JavaScript系列](https://www.cnblogs.com/TomXu/archive/2012/01/12/2308594.html)