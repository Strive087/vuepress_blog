# EventListener

事件监听

## addEventListener

```js
target.addEventListener(type, listener, {
    capture: false, //捕获
    passive: false, 
    once: false    //只触发一次
})
```

### passive

这里具体记录下passive。

从[浏览器渲染机制](/brower/render.html#chrome线程化渲染框架)那里我们可以知道，用户输入事件可以分为两类：

- 在内核线程处理的事件
- 直接由合成线程处理的事件

但passive为true时，则可以跳过内核线程检查是否有preventDefaultEvent，直接由合成线程处理。这个选项一般用于滚动事件。

![Dry3ao](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/Dry3ao.png)

### 特性

addEventListener可以添加多个事件，并且都会执行，而onEvent只能执行一次。

## removeEventListener

```js
target.removeEventListener(type, listener[, options]);
target.removeEventListener(type, listener[, useCapture]);
```

需要注意的就是这三个参数需要和添加的监听一致，可看[mdn](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/removeEventListener)

## 参考链接

[Passive Event Listeners](https://blog.csdn.net/dj0379/article/details/52883315)