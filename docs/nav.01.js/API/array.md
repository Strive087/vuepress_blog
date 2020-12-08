# Array.from()和Array.of()

这两个api我老是傻傻分不清楚，做个笔记希望能加深印象。

## Array.from()

将伪数组对象或者可遍历对象转换为真数组

伪数组：一个对象的所有key都是正整数或者零，并且有length属性，array-like object。

Array.from接受三个参数，但只有input是必须的：

- input: 你想要转换的类似数组对象和可遍历对象
- map: 类似于数组的map方法，用来对每个元素进行处理，将处理后的值放入返回的数组
- context: 绑定map中用到的this

## Array.of()

将一系列值转换成数组

```js
let items1 = new Array(2) ;
console.log(items1.length) ; // 2
console.log(items1[0]) ; // undefined
console.log(items1[1]) ;

let items2 = new Array(1, 2) ;
console.log(items2.length) ; // 2
console.log(items2[0]) ; // 1
console.log(items2[1]) ; // 2
```

当使用单个数值参数来调用 Array 构造器时，数组的长度属性会被设置为该参数。 如果使用多个参数(无论是否为数值类型)来调用，这些参数也会成为目标数组的项。数组的这种行为既混乱又有风险，因为有时可能不会留意所传参数的类型。

Array.of基本上可以用来替代Array()或newArray()，并且不存在由于参数不同而导致的重载，而且他们的行为非常统一。
