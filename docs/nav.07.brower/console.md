# 控制台

## 异步控制台

异步控制台说的是控制台I/O会延迟，输出出人意外的结果，举个例子:

```js
var a = {
  index : 1
}
console.log(a);
a.index++;
```

这是大部分人都会人会控制台此时应输出{index : 1},但是浏览器可能后延迟，等到要输出时a.index++已经执行完了，所以会出现{index : 2}。

这种情况比较少见，且无法预期，所以最好使用断点调试，而不是用控制台输出。
