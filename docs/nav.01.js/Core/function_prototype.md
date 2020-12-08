# Function.prototype是函数吗

在你浏览器的控制台可以输入一段这样的代码：

```js
Function.prototype.__proto__ === Object.prototype; //true
Object.__proto__ === Function.prototype; //true
typeof Function.prototype === 'function'; //true
typeof Function.prototype.__proto__ === 'object'; //true
```

是不是瞬间不知道 Function.prototype 这个家伙到底是对象呢还是函数呢？

其实 Function.prototype 既是对象也是函数。他是一个函数对象。

在ECMA262文档里有提到，这样做的原因是为了兼容之前的代码，所有我们这里要特别注意。

:::tip ECMA262
The Function prototype object is specified to be a function object to ensure compatibility with ECMAScript code that was created prior to the ECMAScript 2015 specification.
:::
