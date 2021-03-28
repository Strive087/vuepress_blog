# 事件循环机制

众所周知，JavaScript是单线程，非阻塞的。

JavaScript的主要用途是与用户互动，以及操作DOM。如果它是多线程的会有很多复杂的问题要处理，比如有两个线程同时操作DOM，一个线程删除了当前的DOM节点，一个线程是要操作当前的DOM阶段，最后以哪个线程的操作为准？为了避免这种，所以JS是单线程的。即使H5提出了web worker标准，它有很多限制，受主线程控制，是主线程的子线程。

而非阻塞则是通过事件循环（event loop）实现的。

因为ECMAScript中没有event loops，event loops是在HTML Standard定义的，所以准确的说应该叫浏览器的event loops或者说是javaScript运行环境的event loops。javaScript引擎只是在需要的时候去执行指定的代码，javaScript引擎没有所谓的时间概念，所以事件的调度必须包含于他所运行的环境。

![XdO77z](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/XdO77z.png)

## task

一个event loop有一个或者多个task队列。当用户代理安排一个任务，必须将该任务增加到相应的event loop的一个tsak队列中。每一个task都来源于指定的任务源，比如可以为鼠标、键盘事件提供一个task队列，其他事件又是一个单独的队列。可以为鼠标、键盘事件分配更多的时间，保证交互的流畅。

task也被称为macrotask，task队列还是比较好理解的，就是一个先进先出的队列，由指定的任务源去提供任务。

task任务源非常宽泛，比如ajax的onload，click事件，基本上我们经常绑定的各种事件都是task任务源，还有数据库操作（IndexedDB ），需要注意的是setTimeout、setInterval、setImmediate也是task任务源。总结来说task任务源：

- setTimeout
- setInterval
- setImmediate
- I/O
- UI rendering

## microtask

每一个event loop都有一个microtask队列，一个microtask会被排进microtask队列而不是task队列。

microtask 队列和task 队列有些相似，都是先进先出的队列，由指定的任务源去提供任务，不同的是一个event loop里只有一个microtask 队列。

HTML Standard没有具体指明哪些是microtask任务源，通常认为是microtask任务源有：

- process.nextTick
- promises
- Object.observe
- MutationObserver

:::tip
Promise的定义在 ECMAScript规范而不是在HTML规范中，但是ECMAScript规范中有一个jobs的概念和microtasks很相似。在Promises/A+规范的Notes 3.1中提及了promise的then方法可以采用“宏任务（macro-task）”机制或者“微任务（micro-task）”机制来实现。
:::

## event loop的处理过程

在规范的Processing model定义了event loop的循环过程：

一个event loop只要存在，就会不断执行下边的步骤：

1. 在tasks队列中选择最老的一个task,用户代理可以选择任何task队列，如果没有可选的任务，则跳到下边的microtasks步骤。
2. 将上边选择的task设置为正在运行的task。
3. Run: 运行被选择的task。
4. 将event loop的currently running task变为null。
5. 从task队列里移除前边运行的task。
6. Microtasks: 执行microtasks任务检查点。（也就是执行microtasks队列里的任务）
7. 更新渲染（Update the rendering）...
8. 如果这是一个worker event loop，但是没有任务在task队列中，并且WorkerGlobalScope对象的closing标识为true，则销毁event loop，中止这些步骤，然后进行定义在Web workers章节的run a worker。
9. 返回到第一步。

event loop会不断循环上面的步骤，概括说来：

- event loop会不断循环的去取tasks队列的中最老的一个任务推入栈中执行，并在当次循环里依次执行并清空microtask队列里的任务。
- 执行完microtask队列里的任务，有可能会渲染更新。（浏览器很聪明，在一帧以内的多次dom变动浏览器不会立即响应，而是会积攒变动以最高60HZ的频率更新视图）

![172f4b0937bc892e](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/172f4b0937bc892e.jpg)

## microtasks检查点

当用户代理去执行一个microtask checkpoint，如果microtask checkpoint的flag（标识）为false，用户代理必须运行下面的步骤：

1. 将microtask checkpoint的flag设为true。
2. Microtask queue handling: 如果event loop的microtask队列为空，直接跳到第八步（Done）。
3. 在microtask队列中选择最老的一个任务。
4. 将上一步选择的任务设为event loop的currently running task。
5. 运行选择的任务。
6. 将event loop的currently running task变为null。
7. 将前面运行的microtask从microtask队列中删除，然后返回到第二步（Microtask queue handling）。
8. Done: 每一个environment settings object它们的 responsible event loop就是当前的event loop，会给environment settings object发一个 rejected promises 的通知。
9. 清理IndexedDB的事务。
10. 将microtask checkpoint的flag设为flase。

microtask checkpoint所做的就是执行microtask队列里的任务。什么时候会调用microtask checkpoint呢?

- 当上下文执行栈为空时，执行一个microtask checkpoint。（这里要牢记）
- 在event loop的第六步（Microtasks: Perform a microtask checkpoint）执行checkpoint，也就是在运行task之后，更新渲染之前。

## 执行栈

我们知道，当我们调用一个方法的时候，js会生成一个与这个方法对应的执行环境（context），又叫执行上下文。这个执行环境中存在着这个方法的私有作用域，上层作用域的指向，方法的参数，这个作用域中定义的变量以及这个作用域的this对象。 而当一系列方法被依次调用的时候，因为js是单线程的，同一时间只能执行一个方法，于是这些方法被排队在一个单独的地方。这个地方被称为执行栈。

![9Hj2Lm](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/9Hj2Lm.gif)

当一个脚本第一次执行的时候，js引擎会解析这段代码，并将其中的同步代码按照执行顺序加入执行栈中，然后从头开始执行。如果当前执行的是一个方法，那么js会向执行栈中添加这个方法的执行环境，然后进入这个执行环境继续执行其中的代码。当这个执行环境中的代码 执行完毕并返回结果后，js会退出这个执行环境并把这个执行环境销毁，回到上一个方法的执行环境。这个过程反复进行，直到执行栈中的代码全部执行完毕。

## 宏任务和微任务触发样例

先来个动图的样例：

![1460000022805531](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/1460000022805531.jpg)

再举个简单的例子，假设一个script标签的代码如下：

```js
Promise.resolve().then(()=>{
    console.log('promise1')
});

setTimeout(()=>{
    console.log('setTimeout1')
    Promise.resolve().then(()=>{
        console.log('promise2')
    })
})

setTimeout(()=>{
    console.log('setTimeout2')
})
```

运行过程：

script里的代码被列为一个task，放入task队列。

循环1：

- 【task队列：script ；microtask队列：】

  从task队列中取出script任务，推入栈中执行。
  promise1列为microtask，setTimeout1列为task，setTimeout2列为task。

- 【task队列：setTimeout1 setTimeout2；microtask队列：promise1】

  script任务执行完毕，执行microtask checkpoint，取出microtask队列的promise1执行。

循环2：

- 【task队列：setTimeout1 setTimeout2；microtask队列：】

  从task队列中取出setTimeout1，推入栈中执行，将promise2列为microtask。

- 【task队列：setTimeout2；microtask队列：promise2】

  执行microtask checkpoint，取出microtask队列的promise2执行。

循环3：

- 【task队列：setTimeout2；microtask队列：】

  从task队列中取出setTimeout2，推入栈中执行。

  setTimeout2任务执行完毕，执行microtask checkpoint。

- 【task队列：；microtask队列：】

## 更新渲染

这是event loop中很重要部分，在第7步会进行Update the rendering（更新渲染），规范允许浏览器自己选择是否更新视图。也就是说可能不是每轮事件循环都去更新视图，只在有必要的时候才更新视图。

- 在一轮event loop中多次修改同一dom，只有最后一次会进行绘制。
- 渲染更新（Update the rendering）会在event loop中的tasks和microtasks完成后进行，但并不是每轮event loop都会更新渲染，这取决于是否修改了dom和浏览器觉得是否有必要在此时立即将新状态呈现给用户。如果在一帧的时间内（时间并不确定，因为浏览器每秒的帧数总在波动，16.7ms只是估算并不准确）修改了多处dom，浏览器可能将变动积攒起来，只进行一次绘制，这是合理的。
- 如果希望在每轮event loop都即时呈现变动，可以使用requestAnimationFrame（requestAnimationFrame也是一个task，在它完成之后会运行run microtasks）。

## nodejs环境

在node中，事件循环表现出的状态与浏览器中大致相同。不同的是node中有一套自己的模型。node中事件循环的实现是依靠的libuv引擎。我们知道node选择chrome v8引擎作为js解释器，v8引擎将js代码分析后去调用对应的node api，而这些api最后则由libuv引擎驱动，执行对应的任务，并把不同的事件放在不同的队列中等待主线程执行。 因此实际上node中的事件循环存在于libuv引擎中。

有关libuv运行机制这里不详细记录，请移步到[Nodejs-libuv](../nav.05.nodejs/libuv)了解
