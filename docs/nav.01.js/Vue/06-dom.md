# 虚拟Dom到真实Dom

再有一棵树形结构的JavaScript对象后，我们现在需要做的就是将这棵树跟真实的Dom树形成映射关系，首先简单回顾之前遇到的mountComponent方法：

```js
export function mountComponent(vm, el) {
  vm.$el = el
  ...
  callHook(vm, 'beforeMount')
  ...
  const updateComponent = function () {
    vm._update(vm._render())
  }
  ...
}
```

我们已经执行完了vm._render方法拿到了VNode，现在将它作为参数传给vm._update方法并执行。vm._update这个方法的作用就是就是将VNode转为真实的Dom，不过它有两个执行的时机：

- 首次渲染

    当执行new Vue到此时就是首次渲染了，会将传入的VNode对象映射为真实的Dom。

- 更新页面

    数据变化会驱动页面发生变化，这也是vue最独特的特性之一，数据改变之前和之后会生成两份VNode进行比较，而怎么样在旧的VNode上做最小的改动去渲染页面，这样一个diff算法还是挺复杂的。如再没有先说清楚数据响应式是怎么回事之前，而直接讲diff对理解vue的整体流程并不太好。所以我们这章分析完首次渲染后，下一章就是数据响应式，之后才是diff比对。
