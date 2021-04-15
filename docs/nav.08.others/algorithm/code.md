# 手写代码

## js并发请求

```js
function createRequest({pool = 2}){
  let queueLength = 0;
  let waitingQueue = [];
  return function request(url){
      if(queueLength < pool && url){
          queueLength++;
          fetch(url).then(()=>{
              queueLength--;
              request(waitingQueue.shift());
          })
      }else{
          waitingQueue.push(url);
      }
  }
}
const request = createRequest({ pool: 4 });
Array(10)
.fill(1)
.forEach(() => request("https://mock.yonyoucloud.com/mock/17479/czzp-demo/getMenus"))
```

## 随机生成一段Json

```js
//最大层级level，最大子数目maxChildren，数值任意
function generateJson(level = 1,maxChildren = 1){
  if(level < 1){
    return Math.round(Math.random()*10);
  }
  let json = {};
  let randomChildrenNum = Math.round(Math.random()*maxChildren) || 1;
  let randomChildrenlevel = Math.round(Math.random()*randomChildrenNum) || 1;
  for(let j = 1; j <= randomChildrenNum - randomChildrenlevel; j++){
    json['val'+j] = Math.round(Math.random()*10);
  }
  for(let k = 1; k <= randomChildrenlevel; k++){
    json['val'+k] = generateJson(--level,maxChildren);
  }
  return json;
}
console.log(JSON.stringify(generateJson(3,4),null,2));
```

## 深度不定的树形数据，给一个节点，输出从根节点到当前节点的路径

```js
function getNodePath(root, node) {
  let path = "",pathArr = [];
  if (root) {
    _getNodePath(root)
    console.log(pathArr);
  }
  function _getNodePath(root) {
    const str = "->" + root.value;
    path += str;
    if (root.value == node.value && contrast(node, root)) {
      pathArr.push(path.slice(2));
    }
    if (root.left) _getNodePath(root.left);
    if (root.right) _getNodePath(root.right);
    path = path.substr(0, path.length - str.length);
  }
  function contrast(node, currentNode) {
    if (node == null && currentNode == null) {
      return true;
    }
    if (node && currentNode && node.value == currentNode.value) {
      return (
        contrast(node.left, currentNode.left) &&
        contrast(node.right, currentNode.right)
      );
    } else {
      return false;
    }
  }
}

var root = JSON.parse(
  `{
    "value": 0,
    "right": {
      "value": 1,
      "left": {
        "value": 2,
        "left": {
          "value": 3,
          "right": {
            "value": 4,
            "left": {
              "value": 5,
              "left": {
                "value": 6,
                "left": {
                  "value": 8,
                  "left": {
                    "value": 11
                  },
                  "right": {
                    "value": 12
                  }
                },
                "right": {
                  "value": 9
                }
              },
              "right": {
                "value": 7,
                "right": {
                  "value": 10
                }
              }
            }
          }
        }
      }
    }
  }`
);
var node = JSON.parse(`{
  "value": 6,
  "left": {
    "value": 8,
    "left": {
      "value": 11
    },
    "right": {
      "value": 12
    }
  },
  "right": {
    "value": 9
  }
}`);

getNodePath(root, node);
```

## 手写Promise.all() polyfill

```js
function _PromiseAll(arr) {
  const result = Array(arr.length);
  let doneNum = 0;
  return new Promise(function (resolve) {
    arr.forEach((p,i) => {
      p.then((res) => {
        result[i] = res;
      }).catch((err) => {
        result[i] = err;
      }).finally(() => {
        if(++doneNum == result.length){
          resolve(result);
        }
      });
    });
  })
}

var p1 = new Promise(function (resolve){
  setTimeout(()=>{
    resolve('p1')
  },1000);
})
var p2 = new Promise(function (resolve){
  setTimeout(()=>{
    resolve('p2')
  },2000);
})
var p3 = new Promise(function (resolve){
  setTimeout(()=>{
    resolve('p3')
  },3000);
})

var p4 = _PromiseAll([p1,p2,p3]);
p4.then(res=>console.log(res));

```

## 手写Promise.race() polyfill

```js
function _PromiseRace(arr){
  return new Promise((resolve,reject) => {
    arr.forEach(p=>{
      p.then(val => resolve('fulfilled:'+val),err => reject('reject:'+err));
    })
  })
}

var p1 = new Promise(function (resolve,reject) {
  setTimeout(()=>{
    reject('p1')
  },1000);
})
var p2 = new Promise(function (resolve){
  setTimeout(()=>{
    resolve('p2')
  },2000);
})
var p3 = new Promise(function (resolve){
  setTimeout(()=>{
    resolve('p3')
  },3000);
})

var p4 = _PromiseRace([p1,p2,p3]);
p4.then(res=>console.log(res));
```

## 手写Promise polyfill

```js
function _Promise(fn) {
  this.state = "pending";
  this.val = null;
  this.fulfilledQueue = [];
  this.rejectedQueue = [];
  if (typeof fn !== "function") {
    throw new Error("param must be a function");
  }
  const resolve = (val) => {
    if (this.state === "pending") {
      const run = () => {
        if (val instanceof _Promise) {
          //这里将产生一个Promise，但这个promise只是为了得出当前promise的状态和值，并无其他用处
          val.then(resolve, reject);
        } else {
          this.state = "fulfilled";
          this.val = val;
        }
        while (this.fulfilledQueue.length) {
          const cb = this.fulfilledQueue.shift();
          //这里需要注意，这里的val要根据回调执行时的val，不可绑定this通过this.val取值
          cb(val);
        }
      };
      setTimeout(() => run());
    }
  };
  const reject = (val) => {
    if (this.state === "pending") {
      const run = () => {
        this.state = "rejected";
        this.val = val;
        while (this.rejectedQueue.length) {
          const cb = this.rejectedQueue.shift();
          cb(val);
        }
      };
      setTimeout(() => run());
    }
  };
  try {
    fn.call(this, resolve, reject);
  } catch (err) {
    reject(err);
  }
}

_Promise.prototype.then = function (onFulfilled, onRejected) {
  onFulfilled = typeof onFulfilled !== "function" ? val => val : onFulfilled;
  onRejected = typeof onRejected !== "function" ? val => {throw val} : onRejected;
  return new _Promise((resolve, reject) => {
    const fulfilled = function(val){
      try {
        res = onFulfilled(val);
        if (res instanceof _Promise) {
          res.then(resolve, reject);
        } else {
          resolve(res);
        }
      } catch (err) {
        reject(err);
      }
    };
    const rejected = function(val){
      try {
        res = onRejected(val);
        if (res instanceof _Promise) {
          res.then(resolve, reject);
        } else {
          resolve(res);
        }
      } catch (err) {
        reject(err);
      }
    };
    if (this.state === "pending") {
      //这里需要注意，这里的val要根据回调执行时的val，不可绑定this通过this.val取值
      this.fulfilledQueue.push(fulfilled);
      this.rejectedQueue.push(rejected);
    } else if (this.state === "fulfilled") {
      fulfilled(this.val);
    } else {
      rejected(this.val);
    }
  });
};

_Promise.prototype.catch = function (onRejected) {
  return this.then(undefined, onRejected);
};

_Promise.prototype.finally = function (fn) {
  return this.then(
    (val) => {
      fn();
      return val;
    },
    (val) => {
      fn();
      throw val;
    }
  );
};

let promise1 = new _Promise((resolve, reject) => {
  console.log('first')
    reject("p1");
   
});

let promise2 = new _Promise((resolve, reject) => {
  setTimeout(() => {
    //参数为promise
    resolve(promise1);
  }, 1000);
});

const p = new _Promise((resolve, reject) => {
  resolve("p1 resolve");
})
  .then((val) => {
    console.log(val);
    throw new Error("p2 reject");
  })
  .catch((val) => {
    console.log(val);
    throw "errrr";
  })
  .finally(() => {
    console.log('ASDFASDF');
  })
  .then((val) => {
    console.log(val);
  })
  .catch((err) => {
    console.log(err);
  });
console.log(111);
```

## 手写Promise.resolve()

```js
_Promise.resolve = function ( val ) {
  return new _Promise(resolve => resolve(val));
};
```

## 手写Promise.reject()

```js
_Promise.reject = function (val) {
  return new _Promise((resolve ,reject) => reject(val))
}
```

## 手写实现迭代器

```js
function createIterator(items) {
  var i = 0;
  return {
    next: function () {
      var done = i >= items.length;
      var value = !done ? items[i++] : undefined;
      return {
        done: done,
        value: value
      };
    },
    [Symbol.iterator]: function () {
      return this;
    }
  };
}

Object.prototype[Symbol.iterator] = function* () {
  for (const key in this) {
      if (this.hasOwnProperty(key)) {
          yield [key, this[key]]
      }
  }
}

// 应用
const iterator = createIterator([1, 2, 3]);
const obj = {
  a: 1,
  b: 2,
  c: 3,
  d: 4
};
for (let a of iterator) {
  console.log(a);
}
for (let a of obj) {
  console.log(a);
}
```

## 手写Generator自动执行器

```js
function run(gen, ...args) {
  var it = gen.apply(this, args);
  return Promise.resolve().then(function handleNext(value) {
    let next = it.next(value);

    return (function handleResult(next) {
      if (next.done) {
        return next.value;
      } else {
        return Promise.resolve(next.value).then(
          handleNext,
          function handleError(err) {
            return Promise.resolve(it.throw(err)).then(handleResult);
          }
        );
      }
    })(next);
  });
}

function* foo() {
  try {
    let result1 = yield bar();
    let result2 = yield zhu();
    console.log(result1 + result2);
    return result1 + result2;
  } catch (e) {
    console.log("catch err");
  }
}

function bar() {
  return Promise.resolve("resolve");
}

function zhu() {
  return Promise.reject("reject");
}

run(foo);
```

## 手写Symbol polyfill

```js
function _Symbol(){

}
```

## 手写bind()

```js
Function.prototype._bind = function(context,...outerargs) {
  context = context || window;
  //防止fn重复
  const fn = Symbol('fn');
  const that = this;
  return function(...innerargs) {
    const args = outerargs.concat(innerargs);
    context[fn] = that;
    context[fn](...args);
    delete context[fn]; 
  }
}
```

## 手写call()

```js
Function.prototype._call = function(context,...args){
  context = context || window;
  const fn = Symbol('fn');
  context[fn] = this;
  context[fn](...args);
  delete context[fn]; 
}
```

## 手写apply()

```js
Function.prototype._apply = function(context,args){
  context = context || window;
  const fn = Symbol('fn');
  context[fn] = this;
  context[fn](...args);
  delete context[fn]; 
}
```

## 手写instance of

```js
function instance(child,parent) {
  childproto = Object.getPrototypeOf(child)
  parentproto = parent.prototype;
  while(childproto){
    if(childproto == parentproto) return true
    childproto = Object.getPrototypeOf(childproto)
  }
  return false;
}
```

## 手写原生ajax

```js
function ajax(options) {
  let method = options.method,
    params = options.params,
    data = options.data,
    async = options.async === false?false:true,
    success = options.success,
    failure = options.failure,
    headers = options.headers;
  let url =
    options.url + (params
      ? "?" +
        Object.keys(params)
          .map((key) => key + "=" + params[key])
          .join("&")
      : "");
  let xhr;
  if (XMLHttpRequest) {
    xhr = new XMLHttpRequest();
  } else {
    xhr = new ActiveXObject("Microsoft.XML");
  }
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      success && success(xhr.responseText);
    }
  };

  xhr.onerror = function (e) {
    failure && failure(e);
  };

  xhr.open(method, url, async);
  

  if(headers) {
    //必须在open之后send之前
    Object.keys(Headers).forEach(key => xhr.setRequestHeader(key, headers[key]))
  }

  method === 'GET'?xhr.send():xhr.send(data);
}


ajax({
    url:'http://jsonplaceholder.typicode.com/users',
    method: 'GET',
    async: false,
    success: function(data){
        console.log(data);
    }
})
console.log('hh')
```

## 手写new操作符

```js
function _new(con,...args){
  const obj = {};
  //必须先要让obj.__proto__指向con.prototype，才可在调用con时使用this原型链上方法。
  Object.setPrototypeOf(obj,con.prototype);
  const result = con.apply(obj,args);
  return result instanceof Object ? result : obj;
} 
function Person(age){
  this.name = "John";
  this.age = age;
  this.say();
  return 1;
}
Person.prototype.say = function(){
  console.log('name:',this.name);
  console.log('age:',this.age);
}
console.log(_new(Person,18));
```

## 手写vuex

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

## 防抖函数

触发单位时间后再执行，在单位时间内又被触发，则重新计时

```js
function debounce(fn, delay, immediate) {
  let timer = null;
  return function (...args) {
    const context = this;
    clearTimeout(timer);
    //是否立即执行
    if (immediate) {
      timer = setTimeout(function () {
        timer = null;
      }, delay);
      if (!timer) {
        fn.apply(context, args);
      }
    } else {
      timer = setTimeout(function () {
        fn.apply(context, args);
      }, delay);
    }
  };
}
```

## 节流函数

单位时间内只能触发一次函数

```js
//Date实现
function throttleDate(fn, delay) {
  let pre = 0;
  return function (...args) {
    let now = +new Date();
    if (now - pre > delay) {
      fn.apply(this, args);
      pre = now;
    }
  };
}
//计时器实现
function throttleTimer(fn, delay) {
  let timer = null;
  return function (...args) {
    if (!timer) {
      const context = this;
      timer = setTimeout(function () {
        timer = null;
      }, delay);
      fn.apply(context, args);
    }
  };
}
```

## 数组字符串OR/And拼接

hiretual的一面，就这道题，当时居然想了40多分钟不知道做不出来，晚上自己回顾了下，真的觉得很简单，花了不到15分钟。总结来说就是感觉中午面试的时候感觉有面试官在就无法真的集中思绪或者是刷题太少了。加油吧。。

Example2:
input: [[["java", "maven", "spring"], "python"], ["machine learning", "deep learning"]]
output: (("java" OR "maven" OR "spring") AND "python") AND ("machine learning" OR "deep learning")

```js
var result = "";
function handleArr(arr) {
  arr.forEach(function (item, index) {
    if (Array.isArray(item)) {
      result += "(";
      handleArr(item);
      result += ")";
      if (index != arr.length - 1) {
        result += " And ";
      }
    } else {
      result += `"${item}"`;
      if (index != arr.length - 1) {
        if (Array.isArray(arr[index + 1])) {
          result += " And ";
        } else {
          result += " OR ";
        }
      }
    }
  });
}
handleArr([
  ["javascript", ["java", ["maven", "git"], "spring"], "python"],
  ["machine learning", "deep learning"],
  ["npm", "nvm"]
]);
console.log(result);
```
