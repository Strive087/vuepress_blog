# setTimeout 计时器原理和实现

## 实现

```js
function _setTimeout(fn, delay, ...params) {
  const start = +new Date();
  if(!delay) delay = 5;
  function isTimeout() {
    const end = +new Date();
    if (end - start >= delay) {
      if (typeof fn === "function") {
        fn.apply(null,params);
      } else {
        eval(fn + "");
      }
    } else {
      _setTimeout(fn, delay - (end - start), ...params);
    }
  }
  requestAnimationFrame(isTimeout);
}
```

## 参数

setTimeout函数大多数人可能只知道两个参数，其实他可以支持多个参数，第三个参数开始以后的参数作为回调函数的参数使用。
