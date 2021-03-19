# 响应式原理

vue之所以能数据驱动视图发生变更的关键，就是依赖它的响应式系统了。响应式系统如果根据数据类型区分，对象和数组它们的实现会有所不同；

## 对象的响应式原理

### 对象响应式数据的创建

在组件的初始化阶段，将对传入的状态进行初始化，以下以data为例，会将传入的数据包装为响应式的数据。

```text
对象示例：

main.js
new Vue({  // 根组件
  render: h => h(App)
})

---------------------------------------------------

app.vue
<template>
  <div>{{info.name}}</div>  // 只用了info.name属性
</template>
export default {  // app组件
  data() {
    return {
      info: {
        name: 'cc',
        sex: 'man'  // 即使是响应式数据，没被使用就不会进行依赖收集
      }
    }
  }
}
```

在组件new Vue()后的执行vm._init()初始化过程中，当执行到initState(vm)时就会对内部使用到的一些状态，如props、data、computed、watch、methods分别进行初始化，再对data进行初始化的最后有这么一句：

```js
function initData(vm) {  //初始化data
  ...
  observe(data) //  info:{name:'cc',sex:'man'}
}
```

这个observe就是将用户定义的data变成响应式的数据，接下来看下它的创建过程：

```js
export function observe(value) {
  if(!isObject(value)) {  // 不是数组或对象，再见
    return
  }
  return new Observer(value)
}

export class Observer {
  constructor(value) {
    this.value = value
    this.walk(value)  // 遍历value
  }
  
  walk(obj) {
    const keys = Object.keys(obj)
    for(let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i])  // 只传入了两个参数
    }
  }
}

```

当执行new Observer时，首先将传入的对象挂载到当前this下，然后遍历当前对象的每一项，执行defineReactive这个方法，看下它的定义：

```js
export function defineReactive(obj, key, val) {
  const dep = new Dep()  // 依赖管理器
  
  val = obj[key]  // 计算出对应key的值
  observe(val)  // 递归的转化对象的嵌套属性
  
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get() {  // 触发依赖收集
      if(Dep.target) {  // 之前赋值的当前watcher实例
        dep.depend()  // 收集起来，放入到上面的dep依赖管理器内
        ...
      }
      return val
    },
    set(newVal) {  // 派发更新
      if(newVal === val) {  // 相同
        return
      }
      val = newVal  // 赋值
      observer(newVal)  // 如果新值是对象也递归包装
      dep.notify()  // 通知更新
    }
  })
}
```

这个方法的作用就是使用Object.defineProperty创建响应式数据。首先根据传入的obj和key计算出val具体的值；如果val还是对象，那就使用observe方法进行递归创建，在递归的过程中使用Object.defineProperty将对象的每一个属性都变成响应式数据：info, info.name, info.sex

![hVCULI](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/hVCULI.gif)

### 依赖收集

我们首先说明下这个Watcher类，它类似与之前的VNode类，根据传入的参数不同，可以分别实例化出三种不同的Watcher实例，它们分别是用户watcher，计算watcher以及渲染watcher。

![LzTzdk](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/LzTzdk.gif)

### 派发更新

如果只是收集依赖，那其实是没任何意义的，将收集到的依赖在数据发生变化时通知到并引起视图变化，这样才有意义。

当赋值触发set时，首先会检测新值和旧值，不能相同；然后将新值赋值给旧值；如果新值是对象则将它变成响应式的；最后让对应属性的依赖管理器使用dep.notify发出更新视图的通知。

这里做的事情只有一件，将收集起来的watcher挨个遍历触发update方法。

```js
class Watcher{
  ...
  update() {
    queueWatcher(this)
  }
}

---------------------------------------------------------
const queue = []
let has = {}

function queueWatcher(watcher) {
  const id = watcher.id
  if(has[id] == null) {  // 如果某个watcher没有被推入队列
    ...
    has[id] = true  // 已经推入
    queue.push(watcher)  // 推入到队列
  }
  ...
  nextTick(flushSchedulerQueue)  // 下一个tick更新
}
```

执行update方法时将当前watcher实例传入到定义的queueWatcher方法内，这个方法的作用是把将要执行更新的watcher收集到一个队列queue之内，保证如果同一个watcher内触发了多次更新，只会更新一次对应的watcher

## 数组的响应式原理

再初步了解了响应式的原理后，接下来我们深入响应式，解析数组响应式的原理。
