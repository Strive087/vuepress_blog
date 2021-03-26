# Symbol

Symbol 是 ECMAScript 2015 中新提出的一个**原始数据类型**。每个从Symbol()返回的symbol值都是唯一的。一个symbol值能作为对象属性的标识符；这是该数据类型仅有的目的。它有以下几个特点：

- Symbol() 是函数，有一个可选的字符串参数
- 返回的是原始数据类型 Symbol
  
  ```js
  const ELEME = Symbol('Eleme')
  typeof ELEME  // symbol
  console.log(ELEME)  // Symbol(Eleme)
  ```

- 具有唯一性

  ```js
  Symbol('Eleme') === Symbol('Eleme')  // false
  ```

- 不允许作为构造器使用，即不允许使用 new
- 不允许隐式转换成字符串,不允许转换成数字
- 有两个静态方法 for 和 keyFor,有几个内置 Symbol 属性

## 静态方法 for 和 keyFor

Symbol.for(key) : 使用给定的key搜索现有的symbol，如果找到则返回该symbol。否则将使用给定的key在全局symbol注册表中创建一个新的symbol。

```js
let s1 = Symbol.for('Eleme');
let s2 = Symbol.for('Eleme');
console.log(s1 === s2); // true
```

Symbol.keyFor(sym): 从全局symbol注册表中，为给定的symbol检索一个共享的 symbol key。

```js
let s = Symbol.for('Eleme');
console.log(Symbol.keyFor(s)); //Eleme
```
