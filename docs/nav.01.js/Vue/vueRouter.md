# VueRouter

## 基本使用

Vue Router配置：

```js
// 0. 如果使用模块化机制编程，导入Vue和VueRouter，要调用 Vue.use(VueRouter)

// 1. 定义 (路由) 组件。
// 可以从其他文件 import 进来
const Foo = { template: '<div>foo</div>' }
const Bar = { template: '<div>bar</div>' }

// 2. 定义路由
// 每个路由应该映射一个组件。 其中"component" 可以是
// 通过 Vue.extend() 创建的组件构造器，
// 或者，只是一个组件配置对象。
// 我们晚点再讨论嵌套路由。
const routes = [
  { path: '/foo', component: Foo },
  { path: '/bar', component: Bar }
]

// 3. 创建 router 实例，然后传 `routes` 配置
// 你还可以传别的配置参数, 不过先这么简单着吧。
const router = new VueRouter({
  routes // (缩写) 相当于 routes: routes
})

// 4. 创建和挂载根实例。
// 记得要通过 router 配置参数注入路由，
// 从而让整个应用都有路由功能
const app = new Vue({
  router
}).$mount('#app')
```

### 静态式导航

静态式导航就是使用html的方式，利用Vue Router提供的组件来导航：

```html
<div id="app">
  <h1>Hello App!</h1>
  <p>
    <!-- 使用 router-link 组件来导航. -->
    <!-- 通过传入 `to` 属性指定链接. -->
    <!-- <router-link> 默认会被渲染成一个 `<a>` 标签 -->
    <router-link to="/foo">Go to Foo</router-link>
    <router-link to="/bar">Go to Bar</router-link>
  </p>
  <!-- 路由出口 -->
  <!-- 路由匹配到的组件将渲染在这里 -->
  <router-view></router-view>
</div>
```

### 编程式导航

编程式导航也就是使用$router实例提供的方法，来操作history。api有outer.push、 router.replace 和 router.go等等。

## $router和$route

`$router`指向的是new VueRouter生成的实例，也就是放入new Vue配置项中的那个对象。可以用来控制路由的行为，如前进后退、替换路由等等。

`$route`指向的是路由对象，表示当前激活的路由的状态信息，包含了当前 URL 解析得到的信息，还有 URL 匹配到的路由记录 (route records)。

二者存在于在每个vue实例中。可以查看vue-router源码：

```js
Object.defineProperty(Vue.prototype, '$router', {
  get () { return this._routerRoot._router }
})

Object.defineProperty(Vue.prototype, '$route', {
  get () { return this._routerRoot._route }
})

Vue.component('RouterView', View)
Vue.component('RouterLink', Link)
```

## 动态路由

把某种模式匹配到的所有路由，全都映射到同个组件。

```js
const User = {
  template: '<div>User</div>'
}

const router = new VueRouter({
  routes: [
    // 动态路径参数 以冒号开头
    { path: '/user/:id', component: User }
  ]
})
```

现在呢，像 /user/foo 和 /user/bar 都将映射到相同的路由。

一个“路径参数”使用冒号 : 标记。当匹配到一个路由时，参数值会被设置到 this.$route.params，可以在每个组件内使用。

![HwxABh](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/HwxABh.png)

如果想匹配任意路径，我们可以使用通配符 (*)。当使用一个通配符时，$route.params 内会自动添加一个名为 pathMatch 参数。它包含了 URL 通过通配符被匹配的部分：

```js
// 给出一个路由 { path: '/user-*' }
this.$router.push('/user-admin')
this.$route.params.pathMatch // 'admin'
// 给出一个路由 { path: '*' }
this.$router.push('/non-existing')
this.$route.params.pathMatch // '/non-existing'
```

### 响应路由参数的变化

例如从 /user/foo 导航到 /user/bar，原来的组件实例会被复用。因为两个路由都渲染同个组件，比起销毁再创建，复用则显得更加高效。不过，这也意味着组件的生命周期钩子不会再被调用。

复用组件时，想对路由参数的变化作出响应的话，你可以简单地 watch (监测变化) $route 对象或者使用 beforeRouteUpdate 导航守卫。

## 路由参数传递

1. 使用`/user/:id`,然后用this.$route.params.id获取
2. 使用`{path: '/user',query:{id:123}}`，然后用this.$route.query.id获取
3. 使用`/user/:id`和`props: true`,route.params 将会被设置为组件属性,然后就可以在组件中引入props使用
4. 使用`props: {demo: '123'}`,props 是一个对象，它会被按原样设置为组件属性。
5. 你可以创建一个函数返回 props。这样你便可以将参数转换成另一种类型，将静态值与基于路由的值结合等等。

```js
const router = new VueRouter({
  routes: [
    {
      path: '/search',
      component: SearchUser,
      props: route => ({ query: route.query.q })
    }
  ]
})
```

## 导航守卫

不得不说导航守卫这个名字取得很唬人，搞得我也刚开始因为这个名字，老是会联想不到他的作用。**其实说白了，导航守卫就是vue-router提供了提供了一系列的钩子，这些钩子会在路由跳转的过程中按顺序触发。**

以下这些钩子，都需要传入一个回调函数，回调函数接受三个参数（**除了全局后置钩子没有next参数**），to\from\next,to和from就是route，next就是一个函数， 一定要调用该函数来进行下一步，类似于nodejs里的中间件。

next函数可以接受参数，有以下几种情况：

- next()：不接受任何参数，直接下到下一步。
- next(false)：中断当前的导航。不跳转了。
- next('/') 或者 next({ path: '/' })：跳转到一个不同的地址。
- next(error)：如果传入 next 的参数是一个 Error 实例，则导航会被终止且该错误会被传递给 router.onError() 注册过的回调。
- next(vm => {})：传入一个回调函数，会在导航确认后执行。**这个回调函数仅限于组件内的守卫beforeRouteEnter可以使用，其他守卫不可使用。**

### 所有钩子

- 全局前置守卫：router.beforeEach，当一个导航触发时，全局前置守卫按照创建顺序调用。守卫是异步解析执行。
- 全局解析守卫：router.beforeResolve，在导航被确认之前，同时在所有组件内守卫和异步路由组件被解析之后，解析守卫就被调用。
- 全局后置钩子：router.afterEach，这些钩子不会接受 next 函数也不会改变导航本身。
- 路由独享的守卫：beforeEnter，在路由配置上直接定义。
- 组件内的守卫：你可以在路由组件内直接定义

  - beforeRouteEnter：在渲染该组件的对应路由被 confirm 前调用不能获取组件实例 `this`因为当守卫执行前，组件实例还没被创建。不过，你可以通过传一个回调给 next来访问组件实例。在导航被确认的时候执行回调，并且把组件实例作为回调方法的参数。**注意 beforeRouteEnter 是支持给 next 传递回调的唯一守卫。**

  - beforeRouteUpdate：在当前路由改变，但是该组件被复用时调用。 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。

  - beforeRouteLeave：导航离开该组件的对应路由时调用。这个离开守卫通常用来禁止用户在还未保存修改前突然离开。该导航可以通过 next(false) 来取消

### 完整的导航解析流程

1. 导航被触发。
2. 在失活的组件里调用 beforeRouteLeave 守卫。
3. 调用全局的 beforeEach 守卫。
4. 在重用的组件里调用 beforeRouteUpdate 守卫 (2.2+)。
5. 在路由配置里调用 beforeEnter。
6. 解析异步路由组件。
7. 在被激活的组件里调用 beforeRouteEnter。
8. 调用全局的 beforeResolve 守卫 (2.5+)。
9. 导航被确认。
10. 调用全局的 afterEach 钩子。
11. 触发 DOM 更新。
12. 调用 beforeRouteEnter 守卫中传给 next 的回调函数，创建好的组件实例会作为回调函数的参数传入。

## 路由懒加载

很简单就只使用异步加载组件即可:

```js
const Foo = () => import('./Foo.vue')
```

如果需多个组件打包到一个chunk，或者自定义chunk名字可以这样（不过还是建议看webpack官网详细介绍，webpack5对这个支持有所更新）：

```js
const Foo = () => import(/* webpackChunkName: "group-foo" */ './Foo.vue')
const Bar = () => import(/* webpackChunkName: "group-foo" */ './Bar.vue')
const Baz = () => import(/* webpackChunkName: "group-foo" */ './Baz.vue')
```

## 前端路由原理及实现

实现前端路由，要解决两个问题：

1. 如何改变 URL 却不引起页面刷新？
2. 如何检测 URL 变化了？

针对上面两个问题，有两种办法可以实现，一种是hash，一种是history。

### hash

#### 原理

1. hash 是 URL 中 hash (#) 及后面的那部分，常用作锚点在页面内进行导航，改变 URL 中的 hash 部分不会引起页面刷新。
2. 通过 hashchange 事件监听 URL 的变化，改变 URL 的方式只有这几种：通过浏览器前进后退改变 URL、通过`<a>`标签改变 URL、通过window.location改变URL，这几种情况改变 URL 都会触发 hashchange 事件。

#### 实现

原生实现：

```html
<li><a href="#/home">home</a></li>
<li><a href="#/about">about</a></li>

<div id="routeView"></div>
```

```js
window.addEventListener('DOMContentLoaded', onLoad)
window.addEventListener('hashchange', onHashChange)
// 路由视图
var routerView = null
function onLoad () {
  routerView = document.querySelector('#routeView')
  onHashChange()
}
function onHashChange () {
  switch (location.hash) {
    case '#/home':
      routerView.innerHTML = 'Home'
      return
    case '#/about':
      routerView.innerHTML = 'About'
      return
    default:
      return
  }
}
```

vue实现：

```html
<div>
  <ul>
    <li><router-link to="/home">home</router-link></li>
    <li><router-link to="/about">about</router-link></li>
  </ul>
  <router-view></router-view>
</div>
```

```js
const routes = {
  '/home': {
    template: '<h2>Home</h2>'
  },
  '/about': {
    template: '<h2>About</h2>'
  }
}

const app = new Vue({
  el: '.vue.hash',
  components: {
    'router-view': RouterView,
    'router-link': RouterLink
  },
  beforeCreate () {
    this.$routes = routes
  }
})
```

router-link:

```vue
<template>
  <a @click.prevent="onClick" href=''><slot></slot></a>
</template>
<script>
export default {
  props: {
    to : String
  },
  methods: {
    onClick () {
      window.location.hash = '#' + this.to
    }
  }
}
</script>
```

router-view:

```vue
<template>
  <component :is="routerView"/>
</template>
<script>
import utils from '~/utils.js'
export default {
  data: function(){
    return {

    }
  },
  created () {
    this.boundHashChange = this.onHashChange.bind(this)
  },
  beforeMount () {
    window.addEventListener('hashchange', this.boundHashChange)
  },
  beforeDestroy() {
    window.removeEventListener('hashchange', this.boundHashChange)
  },
  methods: {
    onHashChange () {
      const path = utils.extractHashPath(window.location.href)
      this.routeView = this.$root.$routes[path] || null
      console.log('vue:hashchange:', path)
    }
  }
}
</script>
```

### history

#### 原理

1. history是html5才支持的。history 提供了 pushState 和 replaceState 两个方法，这两个方法改变 URL 的 path 部分不会引起页面刷新。
2. history 提供类似 hashchange 事件的 popstate 事件，但 popstate 事件有些不同：通过浏览器前进后退改变 URL 时会触发 popstate 事件，通过pushState/replaceState或`<a>`标签改变 URL 不会触发 popstate 事件。好在我们可以拦截 pushState/replaceState的调用和`<a>`标签的点击事件来检测 URL 变化，所以监听 URL 变化可以实现，只是没有 hashchange 那么方便。

#### 实现

原生实现：

```html
<ul>
  <li><a href='/home'>home</a></li>
  <li><a href='/about'>about</a></li>

  <div id="routeView"></div>
</ul>
```

```js
// 页面加载完不会触发 hashchange，这里主动触发一次 hashchange 事件
window.addEventListener('DOMContentLoaded', onLoad)
// 监听路由变化
window.addEventListener('popstate', onPopState)

// 路由视图
var routerView = null

function onLoad () {
  routerView = document.querySelector('#routeView')
  onPopState()

  // 拦截 <a> 标签点击事件默认行为， 点击时使用 pushState 修改 URL并更新手动 UI，从而实现点击链接更新 URL 和 UI 的效果。
  var linkList = document.querySelectorAll('a[href]')
  linkList.forEach(el => el.addEventListener('click', function (e) {
    e.preventDefault()
    history.pushState(null, '', el.getAttribute('href'))
    onPopState()
  }))
}

// 路由变化时，根据路由渲染对应 UI
function onPopState () {
  switch (location.pathname) {
    case '/home':
      routerView.innerHTML = 'Home'
      return
    case '/about':
      routerView.innerHTML = 'About'
      return
    default:
      return
  }
}
```

vue实现：

```html
<div>
  <ul>
    <li><router-link to="/home">home</router-link></li>
    <li><router-link to="/about">about</router-link></li>
  </ul>
  <router-view></router-view>
</div>
```

```vue
<template>
  <div>
    <ul>
      <li><router-link to="/home">home</router-link></li>
      <li><router-link to="/about">about</router-link></li>
    </ul>
    <router-view></router-view>
  </div>
</template>

<script>
import Vue from 'vue';
import RouterLink from "./components/RouterLink";
import RouterView from "./components/RouterView";
import Home from "./components/Home";
import About from "./components/About";
export default {
  name: "App",
  data: function() {
    return {
      routers: {
        "/home": Home,
        "/about": About
      },
      Bus : new Vue()
    };
  },
  components: {
    "router-link": RouterLink,
    "router-view": RouterView
  }
};
</script>
```

RouterView:

```vue
<template>
  <component :is="router" />
</template>

<script>
export default {
  name: "RouterView",
  data() {
    return {
      router: null
    };
  },
  created() {
    this.bindChangeHistoryState = this.changeHistoryState.bind(this);
  },
  beforeMount() {
    window.addEventListener("popstate", this.bindChangeHistoryState);
    this.$parent.Bus.$on("changeHistory", this.bindChangeHistoryState);
  },
  beforeDestroy() {
    window.removeEventListener("hashchange", this.boundHashChange);
    this.$parent.Bus.$off("changeHistory", this.bindChangeHistoryState);
  },
  methods: {
    changeHistoryState(e) {
      let path;
      if (e.type) {
        path = e.target.location.pathname;
      } else {
        path = e.path;
      }
      this.router = this.$parent.routers[path];
    }
  }
};
</script>
```

RouterLink:

```vue
<template>
  <div>
    <a @click.prevent="onClick"><slot></slot></a>
  </div>
</template>

<script>
export default {
  name:'RouterLink',
  props : {
    to : String
  },
  methods: {
    onClick(){
      window.history.pushState(null,null,this.to);
      this.$parent.Bus.$emit('changeHistory',{path: this.to})
    }
  }
}
</script>
```

参考链接：

- [Vue](https://cn.vuejs.org/)
- [Vue Router](https://router.vuejs.org/zh/)
- [前端路由原理解析和实现](https://juejin.cn/post/6844903842643968014)
