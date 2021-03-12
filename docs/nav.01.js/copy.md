# 浅拷贝和深拷贝

js中的浅拷贝和深拷贝，其实就是针对引用类型的复制问题。这里我们主要讲数组和对象的浅拷贝和深拷贝。

二者区别如下：

- 浅拷贝（shallow copy）：只复制指向某个对象的指针，而不复制对象本身，新旧对象共享一块内存
- 深拷贝（deep copy）：复制并创建一个一摸一样的对象，不共享内存，修改新对象，旧对象保持不变

## 浅拷贝实现

浅拷贝的意思就是只复制引用，而未复制真正的值，有时候我们只是想备份数组，但是只是简单让它赋给一个变量，改变其中一个，另外一个就紧跟着改变，但很多时候这不是我们想要的。

1. 普通的赋值
2. slice和concat（内部数据为引用值类型）
3. ES6扩展运算符（内部数据为引用值类型）
4. Object.assign( {}, ...originObject )（内部数据为引用值类型）

## 深拷贝实现

深拷贝实现原理主要是三种：

- 利用递归来实现每一层都重新创建对象并赋值
- 利用 JSON 对象中的 parse 和 stringify
- 使用第三方工具

### 递归拷贝

递归拷贝主要思想就是遍历对象、数组直到里边都是基本数据类型，然后再去复制，就是深度拷贝。

```js
function isObject(obj){
  return typeof obj === 'object' && obj !== null;
}
function deepClone(source,hash = new WeakMap()){
  if(!isObject(source)) return source
  if(hash.has(source)) return hash.get(source)
  var target = Array.isArray(source)?[]:{};
  hash.set(source,target)
  for(key in source){
      target[key] = deepClone(source[key],hash);
  }
  return target;
}
```

### JSON.parse(JSON.stringify())

JSON.stringify()是前端开发过程中比较常用的深拷贝方式。原理是把一个对象序列化成为一个JSON字符串，将对象的内容转换成字符串的形式再保存在磁盘上，再用JSON.parse()反序列化将JSON字符串变成一个新的对象。

```js
function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj))
}
let arr = [1, 3, {
    username: ' koala'
}];
let arr4 = deepClone(arr);
arr4[2].username = 'smallKoala';
console.log(arr4);// [ 1, 3, { username: 'smallKoala' } ]
console.log(arr);// [ 1, 3, { username: ' koala' } ]
```

JSON.stringify()实现深拷贝注意点:

- 拷贝的对象的值中如果有函数,undefined,symbol则经过JSON.stringify()序列化后的JSON字符串中这个键值对会消失
- 无法拷贝不可枚举的属性，无法拷贝对象的原型链
- 拷贝Date引用类型会变成字符串
- 拷贝RegExp引用类型会变成空对象
- 对象中含有NaN、Infinity和-Infinity，则序列化的结果会变成null
- 无法拷贝对象的循环应用(即obj[key] = obj)
