# CustomEvent

CustomEvent 事件是由程序创建的，可以有任意自定义功能的事件。

例子：

```js
// 添加一个适当的事件监听器
obj.addEventListener("cat", function(e) { process(e.detail) })

// 创建并分发事件
var event = new CustomEvent("cat", {"detail":{"hazcheeseburger":true}})
obj.dispatchEvent(event)
```

实现：

```js
(function(){
    try{
        // a : While a window.CustomEvent object exists, it cannot be called as a constructor.
        // b : There is no window.CustomEvent object
        new window.CustomEvent('T');
    }catch(e){
        var CustomEvent = function(event, params){
            params = params || { bubbles: false, cancelable: false, detail: undefined };
            //创建一个指定类型的事件。其返回的对象必须先初始化并可以被传递给 element.dispatchEvent
            var evt = document.createEvent('CustomEvent');
            evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
            return evt;
        };

        CustomEvent.prototype = window.Event.prototype;

        window.CustomEvent = CustomEvent;
    }
})();
```
