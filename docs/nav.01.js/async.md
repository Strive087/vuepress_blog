# 循序渐进走进异步世界

作为一个前端程序员，平时敲代码的你肯定离不开异步。你也许知道更加高阶异步函数诸如：Promise、async等等，但是了解他们的由来吗，你有了解在js的世界里，异步是怎么发展过来的吗？

如果你觉着自己还未了解，希望这篇笔记能够帮助到你。

## 竞态条件

竞态条件我的理解就是通常是多个函数并发交互，不确定其执行顺序，造成最后结果无法预期。举例说明：

```js
var res = [];

function response(data){
  res.push(data)
}

ajax('http://url1',response);
ajax('http://url2',response);
```

从上面的代码来看，我们无法预期最终的res的格式，取决于服务端的响应速度来影响函数的执行顺序。

对于竞态条件，我们必须协调交互顺序，初级方法(通过判断来决定顺序)：

```js
var res = [];

function response(data){
  if(data.url === 'http://url1'){
    res[0] = data;
  }else if(data.url === 'http://url2'){
    res[1] = data
  }
  
}

ajax('http://url1',response);
ajax('http://url2',response);
```

### 竞态

竞态实在竞态条件之下，需要做到首个触发，举例：

```js
var a;

function foo(){
  a = 1
}

function bar(){
  a = 2
}

ajax('http://url1',foo);
ajax('http://url2',foo);
```

上面的代码我们无法确定a的最终结果，最后触发回调会覆盖之前a的值。

对于这种情况我们可以采用门闩的方式：

```js
var a;

function foo(){
  if(!a){
    a = 1
  }
}

function bar(){
  if(!a){
    a = 2
  }
}

ajax('http://url1',foo);
ajax('http://url2',foo);
```

## 并发协作

并发协作指的是可以将一个需要大量运算的程序分割成过个步骤完成，避免造成阻塞。

例如，现在有大量的数据data需要处理，我们可以这样做：

```js
var res = [];

function response(data){
  var chunk = data.splice(0,1000);
  res = res.concat(
    chunk.map(val=>val*2)
  )
  if(data.length > 0){
    setTimeout(()=>{response(data)},0)
  }
}

ajax('http://url1',response);
ajax('http://url2',response);
```

这里虽然并发协作处理了，但是最后结果的还是不可确定，因为执行顺序不确定，所以需要确定最终结果还需要采用类似前文所列举的方式。

## 任务

在ES6中新增一种概念建立在事件循环之上，叫做任务队列。这个概念带来最大影响的就是下文的Promise。

这个任务队列是挂在事件循环队列的每个tick之后的一个队，也就是我们理解的微任务的队列。

## 回调

上文我们我们介绍了所有事件（调用异步函数）的单线程事件循环队列。上文所列举的例子在函数内部，语句的以可预测的顺序执行（编译器以上的层级），而在函数顺序的层级，事件（异步函数的调用）运行顺序可以有多种可能。这些函数都是作为回调使用的。

### 回调的缺点

1. 我们的思维方式是一步一步来的，但是从同步转换到异步的之后，我们的工具（回调）却不是按照一步一步的方式来表达的。

2. 回调地狱，举个例子：

    ```js
      A(function(){
        C();
        D(function(){
          F();
        })
        E();
      })
      B();
    ```

    看这上面的代码，你可能很快说出执行顺序的A、B、C、D、E、F，但是我可没说A或者D一定是异步的，所以如果这是真是代码应该看起来很费劲吧。

3. 信任问题，也就是你回调函数的执行取决于第三方，这时候你就是把程序的控制权交给了对方，这称之为控制反转。信任问题造成的影响有以下几点：

    - 第三方发生错误的时候无法处理，可采用分离回调或”error-first“方式解决：

        ```js
        //分离回调
        function success(data){
          ...
        }
        function failure(err){
          ...
        }
        ajax('http://url1',success,failure);
        //error-first
        function response(err,data){
          if(err){
            ...
          }else{
            ...
          }
        }
        ajax('http://url1',response);
        ```

    - 无法确定第三方是否调用回调，或者超时调用，针对这种情况可以设置一个定时器来解决这个问题：

        ```js
        function response(err,data){
          if(err){
            ...
          }else{
            ...
          }
        }
        function timeoutify(fn,delay){
          var time = setTimeout(function(){
            time = null;
            fn(new Error('timeout'))
          },delay);
          return function(){
            if(time){
              clearTimeout(time);
              fn.apply(this,arguments);
            }
          }
        }
        ajax('http://url1',timeoutify(response));
        ```

    - 无法确定该回调是同步执行还是异步执行，所以我们在代码规范要规定永远异步调用回调，我们可以通过一个验证异步调用的函数来实现永远异步调用回调：

        ```js
        function response(data){
          console.log(a)
        }
        function asyncify(fn){
          var origin_fn = fn,
          intv = setTimeout(function(){
            intv = null;
            //如果不是异步也需要让其异步执行
            if(fn) fn();
          },0)
          fn = null;
          return function () {
            //如果intv存在说明，该回调不是异步
            if(intv){
              //将函数还原到fn，并绑定上this和参数
              fn = origin_fn.bind.call(
                origin_fn,this,arguments
              )
            }else{
              origin_fn.apply(this,arguments);
            }
          }
        }
        var a = 0;
        //不过ajax这个函数是否是异步调用，response始终都会是异步调用
        ajax('http://url1',asyncify(response));
        a++;
        ```

    - 第三方未能传递所需要的环境和参数

从上面列举的诸多问题，总结为缺乏顺序性和可信任性。我们虽然解决了一部分问题，但是未免还是过于繁琐，而且是低效的，代码显得十分膨胀。所以随着ES6的推行，内建API-Promise终于可以解决以上问题。

## Promise

上文说了通过回调来表达程序异步和管理并发的两个主要缺陷：缺乏顺序性和可信任性。这两个缺陷首先要解决的肯定是信任问题，要解决信任问题就得解决控制反转的问题。也就是说需要将控制权从第三方反转回来，我们只是让第三方给我们提供了解其任务何时结束的能力，然后由我们自己的代码来决定下一步做什么。就是基于这样的概念，所以有了现在的Promise。

现在回顾一下只用回调编码的信任问题，例如把一个回调传入工具ajax(...)时可能出现以下问题：

1. 调用回调过早、过晚或不被调用
2. 调用回调次数过多或过少
3. 未能传递环境所需的环境和参数
4. 吞掉可能出现的错误或异常

Promise的特性就是专门来解决以上这些问题。

### 调用过早

这个问题主要就是但是一个函数有时候同步而有时候却又异步，这就造成了竞态条件。

而使用Promise就不用担心了，因为即使是同步的函数在Promise内部也无法被同步观察到，因为你总是要调用then方法，而then方法总是被异步调用。举个例子：

```js
var index = 0 ;
function response(data){
  console.log(index);
}
//这里不知道ajax是否是异步函数，所以response函数可能输出0或1
ajax('http://url1',response);
//这里不论ajax是否是异步函数，response函数只会异步执行，输出1
var p = new Promise(resolve=>{
  ajax('http://url1',resolve);
}).then(val=>{
  response(val);
})
index++;

```

### 调用过晚

根据Promise的运作方式，Promise创建对象调用resolve和reject时，这个Promise的then函数注册的观察回调就会被自动调度。所以可以保证，这些被调度的回调在下一个异步事件点上一定会被触发。

### 回调未调用

首先根据Promise的运作方式，只要Promise决议了，那么完成回调和拒绝回调，它铁定会调用其中一个，这是毋庸置疑的。
其次就是如果Promise一直处于决议中呢？那么我们也有工具函数，举例如下：

```js
function timeoutPromise(delay){
  return new Promise((resolve, reject)=>{
      setTimeout(function(){
        reject('timeout')
      },delay)
  })
}

Promise.race([foo(),timeoutPromise(1000)])
.then(()=>{
  //foo完成
},(err)=>{
  //foo拒绝或者未及时调用
})
```

### 调用次数过多或过少

### 未能传递参数或环境值

### 吞掉错误或异常
