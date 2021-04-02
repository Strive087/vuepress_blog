# Tapable

tapable 是一个类似于 Node.js 中的 EventEmitter的库，但更专注于自定义事件的触发和处理。webpack 通过 tapable 将实现与流程解耦，所有具体实现通过插件的形式存在。

这个小型库是 webpack 的一个核心工具，但也可用于其他地方， 以提供类似的插件接口。 在 webpack 中的许多对象都扩展自 Tapable 类。 它对外暴露了 tap，tapAsync 和 tapPromise 等方法， 插件可以使用这些方法向 webpack 中注入自定义构建的步骤，这些步骤将在构建过程中触发。

具体用法可以看[官方文档](https://github.com/webpack/tapable),下面我简单做个基本的介绍。

tapable 中主要提供了同步与异步两种钩子。

## 同步钩子

SyncHook是tapable中很常见的同步钩子，通过new SyncHook来创建一个实例，这个实例可以通过tap(name, callback)方法来自定义一个钩子，call()来触发实例内的所有钩子。

```js
const {SyncHook} = require('tapable');

class Day{
  constructor(){
    this.hooks = {
      weakup : new SyncHook(['time']),
    }
  }
  tap(){
    this.hooks.weakup.tap('weakup1',(time)=>{
      console.log('weakup1:',time);
    })
    this.hooks.weakup.tap('weakup2',(time)=>{
      console.log('weakup2:',time);
    })
  }
  start(){
    this.hooks.weakup.call('6:0 am')
  }
}

const day = new Day();
day.tap();
day.start();
```

可以看到当我们执行 day.start(); 时会依次执行前面 hook.tap(name, callback) 中的回调函数。通过 SyncHook 创建同步钩子，使用 tap 注册回调，再调用 call 来触发。这是 tapable 提供的多种钩子中比较简单的一种，通过 EventEmitter 也能轻松的实现这种效果。

此外，tapable 还提供了很多有用的同步钩子：

- SyncBailHook：类似于 SyncHook，执行过程中注册的回调返回非 undefined 时就停止不在执行。
- SyncWaterfallHook：接受至少一个参数，上一个注册的回调返回值会作为下一个注册的回调的参数。
- SyncLoopHook：有点类似 SyncBailHook，但是是在执行过程中回调返回非 undefined 时继续再次执行当前的回调。

## 异步钩子

除了同步执行的钩子之外，tapable 中还有一些异步钩子，最基本的两个异步钩子分别是 AsyncParallelHook 和 AsyncSeriesHook 。其他的异步钩子都是在这两个钩子的基础上添加了一些流程控制，类似于 SyncBailHook 之于 SyncHook 的关系。

- AsyncParallelHook：顾名思义是并行执行的异步钩子，当注册的所有异步回调都并行执行完毕之后再执行 callAsync 或者 promise 中的函数。

  ```js
  const { AsyncParallelHook } = require('tapable');
  const hook = new AsyncParallelHook(['name']);

  hook.tapAsync('hello', (name, cb) => {
    setTimeout(() => {
      console.log(`hello ${name}`);
      cb();
    }, 2000);
  });
  hook.tapPromise('hello again', (name) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`hello ${name}, again`);
        resolve();
      }, 1000);
    });
  });


  hook.callAsync('ahonn', () => {
    console.log('done');
  });
  // hello ahonn, again
  // hello ahonn
  // done
  ```

- AsyncSeriesHook：顺序的执行异步函数

  ```js
  const { AsyncSeriesHook } = require('tapable');
  const hook = new AsyncSeriesHook(['name']);

  hook.tapAsync('hello', (name, cb) => {
    setTimeout(() => {
      console.log(`hello ${name}`);
      cb();
    }, 2000);
  });
  hook.tapPromise('hello again', (name) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`hello ${name}, again`);
        resolve();
      }, 1000);
    });
  });

  hook.callAsync('ahonn', () => {
    console.log('done');
  });
  // hello ahonn
  // hello ahonn, again
  // done
  ```

同样的，异步钩子也有一些带流程控制的钩子：

- AsyncParallelBailHook：执行过程中注册的回调返回非 undefined 时就会直接执行 callAsync 或者 promise 中的函数（由于并行执行的原因，注册的其他回调依然会执行）。
- AsyncSeriesBailHook：执行过程中注册的回调返回非 undefined 时就会直接执行 callAsync 或者 promise 中的函数，并且注册的后续回调都不会执行。
- AsyncSeriesWaterfallHook：与 SyncWaterfallHook 类似，上一个注册的异步回调执行之后的返回值会传递给下一个注册的回调。

参考链接：

- [webpack/tapable](https://github.com/webpack/tapable#usage)
- [tapable](https://webpack.docschina.org/api/plugins/#tapable)
- [关于 tapable 你需要知道这些](https://zhuanlan.zhihu.com/p/79221553)