# libuv事件循环

![QmiVap](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/QmiVap.png)

上图是一个libuv引擎中的事件循环的模型。

## 执行过程

node中事件循环的顺序

外部输入数据 --> 轮询阶段（poll） --> 检查阶段(check) --> 关闭事件回调阶段(close callback) --> 定时器检查阶段(timer) --> I/O 事件回调阶段(I/O callbacks) --> 闲置阶段(idle, prepare) --> 轮询阶段...

这些阶段大致的功能如下：

- 定时器检测阶段(timers): 这个阶段执行定时器队列中的回调如 setTimeout() 和 setInterval()。
- I/O事件回调阶段(I/O callbacks): 这个阶段执行几乎所有的回调。但是不包括close事件，定时器和setImmediate()的回调。
- 闲置阶段(idle, prepare): 这个阶段仅在内部使用，可以不必理会
- 轮询阶段(poll): 等待新的I/O事件，node在一些特殊情况下会阻塞在这里。
- 检查阶段(check): setImmediate()的回调会在这个阶段执行。
- 关闭事件回调阶段(close callbacks): 例如socket.on('close', ...)这种close事件的回调

### poll

这个阶段是轮询时间，用于等待还未返回的 I/O 事件，比如服务器的回应、用户移动鼠标等等。
这个阶段的时间会比较长。如果没有其他异步任务要处理（比如到期的定时器），会一直停留在这个阶段，等待 I/O 请求返回结果。

### check

该阶段执行setImmediate()的回调函数。

### close

该阶段执行关闭请求的回调函数，比如socket.on('close', ...)。

### timer

这个是定时器阶段，处理setTimeout()和setInterval()的回调函数。进入这个阶段后，主线程会检查一下当前时间，是否满足定时器的条件。如果满足就执行回调函数，否则就离开这个阶段。

### I/O callback

除了以下的回调函数，其他都在这个阶段执行：

- setTimeout()和setInterval()的回调函数
- setImmediate()的回调函数
- 用于关闭请求的回调函数，比如socket.on('close', ...)

## 宏任务和微任务

宏任务：

- setImmediate
- setTimeout
- setInterval
- script（整体代码)
- I/O 操作等。

微任务：

- process.nextTick
- new Promise().then(回调)

### process.nextTick

process.nextTick 是一个独立于 eventLoop 的任务队列。

在每一个 eventLoop 阶段完成后会去检查 nextTick 队列，如果里面有任务，会让这部分任务优先于微任务执行。是所有异步任务中最快执行的。

