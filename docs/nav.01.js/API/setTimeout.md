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
