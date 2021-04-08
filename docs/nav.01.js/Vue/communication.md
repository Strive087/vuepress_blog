# 组建通信总结

## 父子组件通信

### props / $emit

父组件通过props的方式向子组件传递数据，而通过$emit 子组件可以向父组件通信。

prop 只可以从上一级组件传递到下一级组件（父子组件），即所谓的单向数据流。而且 prop 只读，不可被修改，所有修改都会失效并警告。

$emit绑定一个自定义事件, 当这个语句被执行时, 就会将参数arg传递给父组件,父组件通过v-on监听并接收参数。

App.vue:

```vue
<template>
  <div>
    <h1>child1 Name : {{name}}</h1>
    <child1 :message="message" @onEmitName="onEmitName"></child1>
    <child2></child2>
  </div>
</template>

<script>
import child1 from "./components/Child1"
import child2 from "./components/Child2"
export default {
  name: "App",
  data: function() {
    return {
      message : 'parent',
      name : ''
    };
  },
  components: {
    child1,
    child2
  },
  methods:{
    onEmitName(name){
      this.name = name;
    }
  }
};
</script>
```

Child1.vue :

```vue
<template>
  <div>
    <h1>child1 get parentMessage: {{ message }}</h1>
    <input type="button" value="emitName" @click="onClick"/>
  </div>
</template>

<script>
export default {
  name: "child1",
  props: ["message"],
  methods:{
    onClick(){
      this.$emit("onEmitName", "zdl");
    }
  }
};
</script>
```

### $children / $parent

通过$parent和$children就可以访问组件的实例，拿到实例代表可以访问此组件的所有方法和data。

要注意边界情况，如在#app上拿$parent得到的是new Vue()的实例，在这实例上再拿$parent得到的是undefined，而在最底层的子组件拿$children是个空数组。也要注意得到$parent和$children的值不一样，$children 的值是数组，而$parent是个对象。

上面两种方式用于父子组件之间的通信， 而使用props进行父子组件通信更加普遍; 二者皆不能用于非父子组件之间的通信。

### ref / refs

ref：如果在普通的 DOM 元素上使用，引用指向的就是 DOM 元素；如果用在子组件上，引用就指向组件实例，可以通过实例直接调用组件的方法或访问数据， 我们看一个ref 来访问组件的例子:

子组件 A.vue:

```js
export default {
  data () {
    return {
      name: 'Vue.js'
    }
  },
  methods: {
    sayHello () {
      console.log('hello')
    }
  }
}
```

父组件 B.vue:

```vue
<template>
  <component-a ref="comA"></component-a>
</template>
<script>
  export default {
    mounted () {
      const comA = this.$refs.comA;
      console.log(comA.name);  // Vue.js
      comA.sayHello();  // hello
    }
  }
</script>
```

## 兄弟组件通信

### eventBus

eventBus 又称为事件总线，在vue中可以使用它来作为沟通桥梁的概念, 就像是所有组件共用相同的事件中心，可以向该中心注册发送事件或接收事件， 所以组件都可以通知其他组件。

vent-bus.js:

```js
import Vue from 'vue'
export const EventBus = new Vue()
```

兄弟组件1：

```vue
// addtionNum.vue 中发送事件

<template>
  <div>
    <button @click="additionHandle">+加法器</button>    
  </div>
</template>

<script>
import {EventBus} from './event-bus.js'
console.log(EventBus)
export default {
  data(){
    return{
      num:1
    }
  },

  methods:{
    additionHandle(){
      EventBus.$emit('addition', {
        num:this.num++
      })
    }
  }
}
</script>
```

兄弟组件2：

```vue
// showNum.vue 中接收事件

<template>
  <div>计算和: {{count}}</div>
</template>

<script>
import { EventBus } from './event-bus.js'
export default {
  data() {
    return {
      count: 0
    }
  },

  mounted() {
    EventBus.$on('addition', param => {
      this.count = this.count + param.num;
    })
  }
}
</script>
```

其实eventBus不限于兄弟组件，任何组件都可以。eventBus只推荐在小项目的情况下使用，大型项目推荐使用Vuex。

## 隔代组件通信

### provide/ inject

父组件中通过provide来提供变量, 然后再子组件中通过inject来注入变量。这里不论子组件嵌套有多深, 只要调用了inject 那么就可以注入provide中的数据，而不局限于只能从当前父组件的props属性中回去数据。

假设有三个组件: A.vue、B.vue、C.vue 其中 C是B的子组件，B是A的子组件。

A.vue:

```vue
<template>
  <div>
	<comB></comB>
  </div>
</template>

<script>
  import comB from '../components/test/comB.vue'
  export default {
    name: "A",
    provide: {
      for: "demo"
    },
    components:{
      comB
    }
  }
</script>
```

B.vue:

```vue
<template>
  <div>
    {{demo}}
    <comC></comC>
  </div>
</template>

<script>
  import comC from '../components/test/comC.vue'
  export default {
    name: "B",
    inject: ['for'],
    data() {
      return {
        demo: this.for
      }
    },
    components: {
      comC
    }
  }
</script>
```

C.vue

```vue
<template>
  <div>
    {{demo}}
    <comC></comC>
  </div>
</template>

<script>
  import comC from '../components/test/comC.vue'
  export default {
    name: "B",
    inject: ['for'],
    data() {
      return {
        demo: this.for
      }
    },
    components: {
      comC
    }
  }
</script>
```

### $attr / $listeners

`$attr`对应那些没有在子组件没有定义`props`的键值对。在子组件可以用`this.$attr`获取父组件传来的值。同时他也可以在自己内部的子组件上用`v-bind="$attr"`来传递给内部的子组件,效果如同props一样。

`$listeners`对应的就是父组件在子组件的事件监听函数。我们可以在子组件中`this.$listeners`获取函数直接调用，或者在自己内部的子组件上用`v-on="$listeners"`监听自己内部的子组件。

父组件 App.vue:

```vue
<template>
  <div>
    <h1>child1 Name : {{name}}</h1>
    <child1 :message="message" @onEmitName="onEmitName"></child1>
    <child2 :name="message" @onEmitName="onEmitName"></child2>
  </div>
</template>

<script>
import child1 from "./components/Child1"
import child2 from "./components/Child2"
export default {
  name: "App",
  data: function() {
    return {
      message : 'parent',
      name : ''
    };
  },
  components: {
    child1,
    child2
  },
  methods:{
    onEmitName(name){
      this.name = name;
    }
  }
};
</script>
```

App.vue的子组件 child2.vue：

```vue
<template>
  <div>
    <h1>child2: {{name}}</h1>
    <child3 v-on="$listeners" v-bind="$attrs"></child3>
  </div>
</template>

<script>
import child3 from "./Child3"
export default {
  name: 'child2',
  components:{
    child3
  },
  computed: {
    name(){
      return this.$attrs.name
    }
  },
  mounted() {
    console.log(this.$listeners.onEmitName);
    this.$listeners.onEmitName('hhh')
  }
}
</script>
```

child2.vue的子组件 child3.vue：

```vue
<template>
  <div>
    <h1>child3 : {{name}}</h1>
    <input type="button" value="child3" @click="onClick">
  </div>
</template>

<script>
export default {
name: 'child3',
props:['name'],
methods:{
    onClick(){
      this.$emit("onEmitName", "child3");
    }
  },
}
</script>
```
