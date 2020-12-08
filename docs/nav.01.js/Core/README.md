# 先考考你几题

1.实现如下语法的功能：var a = (5).plus(3).minus(6); //2

```js
Number.prototype.plus = function(num){
  return Number(this.valueOf()+num);
}
Number.prototype.minus = function(num){
  return Number(this.valueOf()-num)
}
```

2.实现如下语法的功能：var a = add(2)(3)(4); //9

```js
function add(num1){
  var f = function(num2){
    return add(num1+num2);
  }
  f.toString = f.valueOf = function(){
    return num1;
  }
  return f;
}
```

3.判断一下输出，并阐述原理

```js
if (!("a" in window)) {
    var a = 1;
}
alert(a);
```

解答：最终输出的是undefined，首先变量声明提升导致代码未执行前，a已经挂载到window上，此时a为undefined，其次在条件判断中最终为false，所以a并未赋值，所以最终输出undefined。

4.判断一下输出，并阐述原理

```js
function b(x, y, a) {
    arguments[2] = 10;
    alert(a);
}
b(1, 2, 3);
```

解答：arguments在函数中与传入参数共享同一值，这里的共享不是引用同一值，他们有不同的地址来维护，只是在js引擎有单独的算法来维护他们两个值相同，如果参数和arguments中任意一方修改都将影响，但是如果arguments修改并未存在的参数，arguments中的值则与参数不相同，所以说他们是共享同一值而不是直接引用。下面举例说明一下：

```js
function foo(x,y){
  arguments[1] = 1;
  alert(arguments[1]); //1
  alert(y); //undefined
}
foo(0)
```
