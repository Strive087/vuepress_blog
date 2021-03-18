# beforeMount&&mounted

```js
this._init() 方法的最后：

... 初始化

if (vm.$options.el) {
  vm.$mount(vm.$options.el)
}
```

如果用户有传入el属性，就执行vm.$mount方法并传入el开始挂载。这里的$mount方法在完整版和运行时版本又会有点不同，他们区别如下：

```js
//运行时版本：
Vue.prototype.$mount = function(el) { // 最初的定义
  return mountComponent(this, query(el));
}

//完整版：
const mount = Vue.prototype.$mount
Vue.prototype.$mount = function(el) {  // 拓展编译后的

  if(!this.$options.render) {            ---|
    if(this.$options.template) {         ---|
      ...经过编译器转换后得到render函数  ---|  编译阶段
    }                                    ---|
  }                                      ---|
  
  return mount.call(this, query(el))
}

-----------------------------------------------

export function query(el) {  // 获取挂载的节点
  if(typeof el === 'string') {  // 比如#app
    const selected = document.querySelector(el)
    if(!selected) {
      return document.createElement('div')
    }
    return selected
  } else {
    return el
  }
}
```

完整版有一个骚操作，首先将$mount方法缓存到mount变量上，然后使用函数劫持的手段重新定义$mount函数，并在其内部增加编译相关的代码，最后还是使用原来定义的$mount方法挂载。

所以核心是要了解最初定义$mount方法时内的mountComponent方法：

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

首先将传入的el赋值给vm.$el，这个时候el是一个真实dom，接着会执行用户自己定义的beforeMount钩子。接下来会定义一个重要的函数变量updateComponent，它的内部首先会执行vm._render()方法，将返回的结果传入vm._update()内再执行。我们这章主要就来分析这个vm._render()方法做了什么事情，来看下它的定义：

```js
Vue.prototype._render = function() {
  const vm = this
  const { render } = vm.$options

  const vnode = render.call(vm, vm.$createElement)
  
  return vnode
}
```

首先会得到自定义的render函数，传入vm.$createElement这个方法(也就是上面例子内的h方法)，将执行的返回结果赋值给vnode，这里也就完成了render函数内数据结构转为vnode的操作。而这个vm.$createElement是在之前初始化initRender方法内挂载到vm实例下的，接着调用render生成vnode。
