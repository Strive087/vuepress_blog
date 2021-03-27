# 你不知道的new运算符

## new.target

new.target属性允许你检测函数或构造方法是否是通过new运算符被调用的。在通过new运算符被初始化的函数或构造方法中，new.target返回一个指向构造方法或函数的引用。在普通的函数调用中，new.target 的值是undefined。

new.target属性适用于所有函数访问的元属性。在箭头函数中，new.target 指向最近的外层函数的new.target。

```js
function Foo() {
  if (!new.target) throw "Foo() must be called with new";
  console.log("Foo instantiated with new");
  const arrow = ()=>{
    console.log('Name',new.target.name);
  }
  arrow()
}

Foo(); // throws "Foo() must be called with new"
new Foo(); // logs "Foo instantiated with new" Name:Foo
```
