# keep-alive原理

keep-alive是一个抽象组件：它自身不会渲染一个 DOM 元素，也不会出现在父组件链中；使用keep-alive包裹动态组件时，会缓存不活动的组件实例，而不是销毁它们。

## 用法

- 动态组件：

  ```html
  <keep-alive :include="whiteList" :exclude="blackList" :max="amount">
    <component :is="currentComponent"></component>
  </keep-alive>
  ```

- vue-router：

  ```html
  <keep-alive :include="whiteList" :exclude="blackList" :max="amount">
    <router-view></router-view>
  </keep-alive>
  ```

include定义缓存白名单，keep-alive会缓存命中的组件；exclude定义缓存黑名单，被命中的组件将不会被缓存；max定义缓存组件上限，超出上限使用LRU的策略置换缓存数据。

## 源码

```js
// src/core/components/keep-alive.js
export default {
  name: 'keep-alive',
  abstract: true, // 判断当前组件虚拟dom是否渲染成真是dom的关键

  props: {
    include: patternTypes, // 缓存白名单
    exclude: patternTypes, // 缓存黑名单
    max: [String, Number] // 缓存的组件实例数量上限
  },

  created () {
    this.cache = Object.create(null) // 缓存虚拟dom
    this.keys = [] // 缓存的虚拟dom的健集合
  },

  destroyed () {
    for (const key in this.cache) { // 删除所有的缓存
      pruneCacheEntry(this.cache, key, this.keys)
    }
  },

  mounted () {
    // 实时监听黑白名单的变动
    this.$watch('include', val => {
      pruneCache(this, name => matches(val, name))
    })
    this.$watch('exclude', val => {
      pruneCache(this, name => !matches(val, name))
    })
  },

  render () {
    // 先省略...
  }
}
```

可以看出，与我们定义组件的过程一样，先是设置组件名为keep-alive，其次定义了一个abstract属性，值为true。这个属性在vue的官方教程并未提及，却至关重要，后面的渲染过程会用到。props属性定义了keep-alive组件支持的全部参数。

keep-alive在它生命周期内定义了三个钩子函数：

- created

  初始化两个对象分别缓存VNode（虚拟DOM）和VNode对应的键集合

- destroyed

  删除this.cache中缓存的VNode实例。我们留意到，这里不是简单地将this.cache置为null，而是遍历调用pruneCacheEntry函数删除。

  ```js
  // src/core/components/keep-alive.js
  function pruneCacheEntry (
    cache: VNodeCache,
    key: string,
    keys: Array<string>,
    current?: VNode
  ) {
    const cached = cache[key]
    if (cached && (!current || cached.tag !== current.tag)) {
      cached.componentInstance.$destroy() // 执行组件的destory钩子函数
    }
    cache[key] = null
    remove(keys, key)
  }
  ```

- mounted

  在mounted这个钩子中对include和exclude参数进行监听，然后实时地更新（删除）this.cache对象数据。pruneCache函数的核心也是去调用pruneCacheEntry。

### render

```js
// src/core/components/keep-alive.js
render () {
  const slot = this.$slots.default
  const vnode: VNode = getFirstComponentChild(slot) // 找到第一个子组件对象
  const componentOptions: ?VNodeComponentOptions = vnode && vnode.componentOptions
  if (componentOptions) { // 存在组件参数
    // check pattern
    const name: ?string = getComponentName(componentOptions) // 组件名
    const { include, exclude } = this
    if ( // 条件匹配
      // not included
      (include && (!name || !matches(include, name))) ||
      // excluded
      (exclude && name && matches(exclude, name))
    ) {
      return vnode
    }

    const { cache, keys } = this
    const key: ?string = vnode.key == null // 定义组件的缓存key
      // same constructor may get registered as different local components
      // so cid alone is not enough (#3269)
      ? componentOptions.Ctor.cid + (componentOptions.tag ? `::${componentOptions.tag}` : '')
      : vnode.key
    if (cache[key]) { // 已经缓存过该组件
      vnode.componentInstance = cache[key].componentInstance
      // make current key freshest
      remove(keys, key)
      keys.push(key) // 调整key排序
    } else {
      cache[key] = vnode // 缓存组件对象
      keys.push(key)
      // prune oldest entry
      if (this.max && keys.length > parseInt(this.max)) { // 超过缓存数限制，将第一个删除
        pruneCacheEntry(cache, keys[0], keys, this._vnode)
      }
    }

    vnode.data.keepAlive = true // 渲染和执行被包裹组件的钩子函数需要用到
  }
  return vnode || (slot && slot[0])
}
```

- 第一步：获取keep-alive包裹着的第一个子组件对象及其组件名；
- 第二步：根据设定的黑白名单（如果有）进行条件匹配，决定是否缓存。不匹配，直接返回组件实例（VNode），否则执行第三步；
- 第三步：根据组件ID和tag生成缓存Key，并在缓存对象中查找是否已缓存过该组件实例。如果存在，直接取出缓存值并更新该key在this.keys中的位置（更新key的位置是实现LRU置换策略的关键），否则执行第四步；
- 第四步：在this.cache对象中存储该组件实例并保存key值，之后检查缓存的实例数量是否超过max的设置值，超过则根据LRU置换策略删除最近最久未使用的实例（即是下标为0的那个key）。
- 第五步：最后并且很重要，将该组件实例的keepAlive属性值设置为true。这个在@不可忽视：钩子函数 章节会再次出场。

## 渲染

### Vue的渲染过程

![16a85ce5bfb8040f](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/16a85ce5bfb8040f.jpg)

1. Vue在渲染的时候先调用原型上的_render函数将组件对象转化为一个VNode实例；而_render是通过调用createElement和createEmptyVNode两个函数进行转化；
2. createElement的转化过程会根据不同的情形选择new VNode或者调用createComponent函数做VNode实例化；
3. 完成VNode实例化后，这时候Vue调用原型上的_update函数把VNode渲染为真实DOM，这个过程又是通过调用__patch__函数完成的（这就是pacth阶段了）

### keep-alive组件的渲染

```js
// src/core/instance/lifecycle.js
export function initLifecycle (vm: Component) {
  const options = vm.$options
  // 找到第一个非abstract的父组件实例
  let parent = options.parent
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent
    }
    parent.$children.push(vm)
  }
  vm.$parent = parent
  // ...
}
```

Vue在初始化生命周期的时候，为组件实例建立父子关系会根据abstract属性决定是否忽略某个组件。在keep-alive中，设置了abstract: true，那Vue就会跳过该组件实例。

最后构建的组件树中就不会包含keep-alive组件，那么由组件树渲染成的DOM树自然也不会有keep-alive相关的节点了

### keep-alive包裹的组件使用缓存

在patch阶段，会执行createComponent函数：

```js
// src/core/vdom/patch.js
function createComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
  let i = vnode.data
  if (isDef(i)) {
    const isReactivated = isDef(vnode.componentInstance) && i.keepAlive
    if (isDef(i = i.hook) && isDef(i = i.init)) {
      i(vnode, false /* hydrating */)
    }

    if (isDef(vnode.componentInstance)) {
      initComponent(vnode, insertedVnodeQueue)
      insert(parentElm, vnode.elm, refElm) // 将缓存的DOM（vnode.elm）插入父元素中
      if (isTrue(isReactivated)) {
        reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm)
      }
      return true
    }
  }
}
```

- 在首次加载被包裹组件时，由keep-alive.js中的render函数可知，vnode.componentInstance的值是undefined，keepAlive的值是true，因为keep-alive组件作为父组件，它的render函数会先于被包裹组件执行；那么就只执行到i(vnode, false /*hydrating*/)，后面的逻辑不再执行；
- 再次访问被包裹组件时，vnode.componentInstance的值就是已经缓存的组件实例，那么会执行insert(parentElm, vnode.elm, refElm)逻辑，这样就直接把上一次的DOM插入到了父元素中。

## 钩子函数

可以看出，当vnode.componentInstance和keepAlive同时为truly值时，不再进入$mount过程，那mounted之前的所有钩子函数（beforeCreate、created、mounted）都不再执行。

```js
// src/core/vdom/create-component.js
const componentVNodeHooks = {
  init (vnode: VNodeWithData, hydrating: boolean): ?boolean {
    if (
      vnode.componentInstance &&
      !vnode.componentInstance._isDestroyed &&
      vnode.data.keepAlive
    ) {
      // kept-alive components, treat as a patch
      const mountedNode: any = vnode // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode)
    } else {
      const child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance
      )
      child.$mount(hydrating ? vnode.elm : undefined, hydrating)
    }
  }
  // ...
}
```

在patch的阶段，最后会执行invokeInsertHook函数，而这个函数就是去调用组件实例（VNode）自身的insert钩子

```js
// src/core/vdom/patch.js
function invokeInsertHook (vnode, queue, initial) {
  if (isTrue(initial) && isDef(vnode.parent)) {
    vnode.parent.data.pendingInsert = queue
  } else {
    for (let i = 0; i < queue.length; ++i) {
      queue[i].data.hook.insert(queue[i])  // 调用VNode自身的insert钩子函数
    }
  }
}

// src/core/vdom/create-component.js
const componentVNodeHooks = {
  // init()
  insert (vnode: MountedComponentVNode) {
    const { context, componentInstance } = vnode
    if (!componentInstance._isMounted) {
      componentInstance._isMounted = true
      callHook(componentInstance, 'mounted')
    }
    if (vnode.data.keepAlive) {
      if (context._isMounted) {
        queueActivatedComponent(componentInstance)
      } else {
        activateChildComponent(componentInstance, true /* direct */)
      }
    }
  // ...
}
```

在这个钩子里面，调用了activateChildComponent函数递归地去执行所有子组件的activated钩子函数：

```js
// src/core/instance/lifecycle.js
export function activateChildComponent (vm: Component, direct?: boolean) {
  if (direct) {
    vm._directInactive = false
    if (isInInactiveTree(vm)) {
      return
    }
  } else if (vm._directInactive) {
    return
  }
  if (vm._inactive || vm._inactive === null) {
    vm._inactive = false
    for (let i = 0; i < vm.$children.length; i++) {
      activateChildComponent(vm.$children[i])
    }
    callHook(vm, 'activated')
  }
}
```

相反地，deactivated钩子函数也是一样的原理，在组件实例（VNode）的destroy钩子函数中调用deactivateChildComponent函数。

## LRU缓存算法

LRU（Least recently used）算法根据数据的历史访问记录来进行淘汰数据，其核心思想是“如果数据最近被访问过，那么将来被访问的几率也更高”。

最常见的实现是使用一个链表保存缓存数据，详细算法实现如下：

1. 新数据插入到链表头部；
2. 每当缓存命中（即缓存数据被访问），则将数据移到链表头部；
3. 当链表满的时候，将链表尾部的数据丢弃。

当存在热点数据时，LRU的效率很好，但偶发性的、周期性的批量操作会导致LRU命中率急剧下降，缓存污染情况比较严重。复杂度比较简单，代价则是命中时需要遍历链表，找到命中的数据块索引，然后需要将数据移到头部。

参考链接：

- [彻底揭秘keep-alive原理](https://juejin.cn/post/6844903837770203144)
- [浅析Vue中keep-alive实现原理以及LRU缓存算法](https://segmentfault.com/a/1190000020515898)
