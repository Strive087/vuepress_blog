# async/await

## async的作用

async 函数返回的是一个 Promise 对象，在函数中 return 一个直接量，async 会把这个直接量通过 Promise.resolve() 封装成 Promise 对象。

```js
async function foo() {
  return 'p'
}
const result = foo();
console.log(result);//Promise {<fulfilled>: "p"}
```

由于async函数返回一个promise对象，那么就可以直接配合then函数使用,async里面的函数会马上执行，这个就类似Generator的‘*’。

```js
foo().then(val=>{
  console.log(val); //p
})
```

## await的作用

await后面可以是Promise对象或其他表达式，如果不是Promise对象，直接执行。如果是Promise对象会阻塞后面的代码，Promise 对象 resolve，然后得到 resolve 的值，作为 await 表达式的运算结果。

```js
function getSomething() {
    return "something";
}
async function testAsync() {
    return Promise.resolve("hello async");
}
async function test() {
    const v1 = await getSomething();
    const v2 = await testAsync();
    console.log(v1, v2); //something 和 hello async
}
test();
```

所以这就是await必须用在async的原因，async刚好返回一个Promise对象，可以异步执行阻塞。

## async和await结合作用

async/await 其实就是 Generator+Promise 的语法糖。

主要是处理Promise的链式回调或函数的地狱回调 回到Generator中要求函数valOne，valTwo，valThree函数依次执行,并且可以处理异常。

```js
async function run() {
    try {
        await Promise.reject(new Error("Oops!"));
    } catch (error) {
        error.message; // "Oops!"
    }
}
```

## 事假循环中的执行机制

先看下如下代码：

```js
async function async1() {
  console.log('a')
  await async2()
  console.log('b')
}
async function async2() {
  console.log('c')
}

async1()

new Promise((resolve) => {
  console.log('d')
  resolve()
}).then(() => {
  console.log('e')
})
```

不同chrome版本表现不同，有以下两种情况：

- a c d b e
- a c d e b

### 最新ECMAScript规范

最新ECMAScript规范中，await直接使用Promise.resolve()相同语义，也就是说，如果await后跟的是一个Promise，则直接返回Promise本身，如果不是，则使用Promise.resolve包裹后返回，上述代码执行过程可以简化理解为：

```js
console.log('a')
new Promise(resolve => {
  console.log('c')
  resolve()
}).then(() => {
  console.log('b')
})
new Promise((resolve) => {
  console.log('d')
  resolve()
}).then(() => {
  console.log('e')
})
```

console.log('b')在第一轮事件循环时就加入微任务队列，然后console.log('e')才加入微任务队列，故b的打印顺序在先。

### 老版ECMAScript规范

await后不论是否为Promise，都会产生一个新的Promise，再将后面跟的内容resolve出去。

根据老版规范，上述代码执行过程可以简化理解为：

```js
console.log('a')
new Promise((resolve1) => {
  resolve1(new Promise(resolve2 => {
    console.log('c')
    resolve2()
  }))
}).then(() => {
  console.log('b')
})
new Promise((resolve) => {
  console.log('d')
  resolve()
}).then(() => {
  console.log('e')
})
```

由于resolve1内又resolve了一个Promise，所以在这里已经是异步任务了，而不是立即变为fulfilled的状态，所以console.log('b')并不是在第一轮事件循环中被加入微任务队列，而console.log('e')仍然是在第一轮事件循环中就被加入微任务队列，所以e先于b打印，最终打印顺序为a c d e b。
