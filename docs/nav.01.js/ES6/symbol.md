# Symbol

Symbol 是 ECMAScript 2015 中新提出的一个**原始数据类型**。简单来说Symbol 是颜色不一样的烟火。它有以下几个特点：

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
