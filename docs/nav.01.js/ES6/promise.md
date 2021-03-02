# Promise

## 手写Promise

```js

```

## 手写Promise.resolve

Promise.resolve创建一个决议已结束的Promise，参数分为以下几种情况：

1. Promise实例：返回该实例

2. thenable值： 递归拆解thenable得到最终值传入并创建Promise实例

3. 普通值： 传入并创建Promise实例

这里需要注意Promise.resolve返回的是一个决议已结束的Promise，有可能是拒绝决议也有可能完成决议。

```js
resolve = function (arg) {
  if (
    arg &&
    (typeof arg === "object" || typeof arg === "function") &&
    typeof arg.then === "function"
  ) {
    if (arg instanceof Promise) {
      return arg;
    } else {
        return new Promise(arg.then);
    }
  } else {
    return new Promise(function (resolve) {
      resolve(arg);
    });
  }
};
```

## 手写Promise.reject

Promise.reject相比Promise.resolve来说，逻辑比较简单，就是无论传入什么参数，它的最终返回值都是一个拒绝决议状态且值为传入参数的Promise实例。

```js
reject = function (arg){
    return new Promise(function (resolve,reject){
        reject(arg);
    })
}
```

## Promise工厂

将普通的异步函数，包装成为promise形式的异步模式，增加程序可靠性：

先是一段err-first风格的异步回调代码，然后借助promisory生成一个函数，该函数返回一个Promise，将控制反转再反转回我们手中。

```js
//err-first风格
function foo(arg1, cb) {
  console.log("sync start");
  setTimeout(function () {
    arg1++;
    console.log("async start");
    console.log("arg1:", arg1);
    console.log("async over");
    //假设异步操作成功
    cb(null, arg1);
    //假设异步操作失败
    // cb({err:'err'});
  }, 1000);
  console.log("sync over");
}

foo(1, function (err, data) {
  if (err) {
    console.log(err);
  } else {
    console.log(data);
  }
  return "cb";
});

//promisory

Promise.promisory = function (fn) {
  return function () {
    let args = [].slice.apply(arguments);
    return new Promise((resolve, reject) => {
      fn.call(null, ...args, function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  };
};

foopromise = Promise.promisory(foo);

foopromise(1).then(
  function fulfilled(value) {
    console.log(value);
  },
  function rejected(err) {
    console.log(err);
  }
);

```
