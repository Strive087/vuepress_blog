# Vuex

这里不说vuex api，官网都有。主要记录下vuex的执行原理，自己手写实现一个简单的vuex。

![tpPa8K](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/tpPa8K.png)

这里主要介绍几个核心：

- state

  stata主要用来保存变量，他一个对象，包含了全部的应用层级状态。要想获取state，需要通过``this.$store.state``来访问。并且state不可直接修改，必须通过mutations来就修改。

- getters

  getters类似于组件中的computed，它主要是用于计算和缓存计算结果，getters中的函数可以接受两个参数，第一个是state，第二个getters本身用于调用其他getter。

  ```js
  getters: {
    // ...
    doneTodosCount: (state, getters) => {
      return getters.doneTodos.length
    }
  }
  ```

- mutations

  更改 Vuex 的 store 中的状态的唯一方法是提交 mutation。Vuex 中的 mutation 非常类似于事件：每个 mutation 都有一个字符串的 事件类型 (type) 和 一个 回调函数 (handler)。这个回调函数可以接受两个参数，第一个是 事件类型 (type) ，第二个就是commit传入的额外参数payload。mutations中的函数必须是同步执行的函数。

  ```js
  mutations: {
    increment (state, payload) {
      state.count += payload.amount
    }
  }
  store.commit('increment', {
    amount: 10
  })
  ```

- actions

  Action 类似于 mutation，不同在于：Action 提交的是 mutation，而不是直接变更状态，以及Action 可以包含任意异步操作。Action通过dispatch方法触发。actions内的函数可以接受两个参数，一个是与 store 实例具有相同方法和属性的 context 对象,第二个就是就是dispatch方法额外传入的参数。

```js
const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  },
  actions: {
    increment (context) {
      context.commit('increment')
    }
  }
})

store.dispatch('increment')
```

- modules

  modules其实就是将 store 分割成多个模块。每个模块拥有自己的 state、mutation、action、getter、甚至是嵌套子模块——从上至下进行同样方式的分割：

  ```js
  const moduleA = {
    state: () => ({ ... }),
    mutations: { ... },
    actions: { ... },
    getters: { ... }
  }

  const moduleB = {
    state: () => ({ ... }),
    mutations: { ... },
    actions: { ... }
  }

  const store = new Vuex.Store({
    modules: {
      a: moduleA,
      b: moduleB
    }
  })

  store.state.a // -> moduleA 的状态
  store.state.b // -> moduleB 的状态
  ```

## 手写简易vuex

在手写vuex之前还需要知道一个知识点，就是Vue插件如何让Vue.use()调用。

Vue.js 的插件应该暴露一个 install 方法。这个方法的第一个参数是 Vue 构造器，第二个参数是一个可选的选项对象

```js
MyPlugin.install = function (Vue, options) {
  // 1. 添加全局方法或 property
  Vue.myGlobalMethod = function () {
    // 逻辑...
  }

  // 2. 添加全局资源
  Vue.directive('my-directive', {
    bind (el, binding, vnode, oldVnode) {
      // 逻辑...
    }
    ...
  })

  // 3. 注入组件选项
  Vue.mixin({
    created: function () {
      // 逻辑...
    }
    ...
  })

  // 4. 添加实例方法
  Vue.prototype.$myMethod = function (methodOptions) {
    // 逻辑...
  }
}
```

知道了以上知识点，我们差不多就可以自己开发一个简易的vuex了。

简易vuex支持功能：

1. 响应式数据
2. 实现state单一对象管理全局状态
3. 实现getters
4. 实现mutations
5. 实现actions
6. 实现commit和dispatch方法

```js
let _Vue;

class Store {
  constructor(options) {
    this._mutations = options.mutations;
    this._actions = options.actions;
    this.getters = options.getters;
    const computed = this.getComputed(this.getters);
    this._vm = new _Vue({
      data: {
        _state: options.state
      },
      computed
    });
  }
  get state() {
    return this._vm._data._state;
  }
  set state(val) {
    throw new Error("can not set state:" + val);
  }
  getComputed(getters = {}) {
    const store = this;
    const computed = {};
    Object.keys(getters).forEach(key => {
      computed[key] = function() {
        return getters[key](store.state, getters);
      };
      // 返回的是computed
      Object.defineProperty(getters, key, {
        get: function() {
          return this._vm.computed[key];
        }
      });
    });
    return computed;
  }
  commit(type, payload) {
    if (this._mutations[type]) {
      this._mutations[type](this.state, payload);
    }
  }
  dispatch(type, payload) {
    if (this._actions[type]) {
      this._actions[type](this, payload);
    }
  }
}

const install = function(Vue) {
  _Vue = Vue;

  Vue.mixin({
    beforeCreate() {
      //让每个组件可以直接通过this.$store调用
      if (this.$options.store) {
        Vue.prototype.$store = this.$options.store;
      }
    }
  });
};

export default {
  install,
  Store
};
```
