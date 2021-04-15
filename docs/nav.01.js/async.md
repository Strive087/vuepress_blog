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

竞态是在竞态条件之下，需要做到首个触发，举例：

```js
var a;

function foo(){
  a = 1
}

function bar(){
  a = 2
}

ajax('http://url1',foo);
ajax('http://url2',bar);
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

上文我们我们介绍了所有事件（调用异步函数）的单线程事件循环队列。上文所列举的例子在函数内部，语句以可预测的顺序执行（编译器以上的层级），而在函数顺序的层级，事件（异步函数的调用）运行顺序可以有多种可能。这些函数都是作为回调使用的。

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
            //如果intv存在说明该回调不是并不是被ajax异步执行而是同步执行
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
        //不管ajax这个函数是否是异步调用，response始终都会是异步调用
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

根据定义，回调被调用的次数应该是一次，过少的情况就是0次，也就是上文的未调用。那么就这剩下过多这一种情况。

以Promise的运行方式来说，Promise只能被决议一次。如果试图多次调用resolve或reject，那么Promise只会接受第一次决议，并默默地忽略任何后续的调用。

### 未能传递参数或环境值

Promise至多只能有一个决议值。

如果没有任何显式决议，那么这个值就是undefined。如果要传递多个值，那么需要将他们封装到单个值中传递。

对于环境而言，js中的函数总是保持其定义所在的作用域的闭包。

### 吞掉错误或异常

如果在Promise的创建过程中或在查看其决议结果过程中的任何时间点上出现了一个js异常错误，那么这个异常将会被捕获，并且会是这个Promise被拒绝。举例说明：

```js
var p = new Promise(resolve =>{
  //未定义将报错
  foo();
  //永远不会到达这里
  resolve(1);
})

p.then(()=>{
  ...
},(err)=>{
  //在这将会被捕获,这里的js异常也将是异步的
  ...
})
```

### Promise本身信任问题

你肯定注意到Promise并没有完全摆脱回调。他们只是改变了传递回调的位置。我们并不是把回调传递给foo(...)，而是从foo(...)得到某个东西（外观看起来是一个真正的Promise），然后把回调传递给这个东西。

但是我们如何确定返回的东西移动是个可信任的Promise呢？这里原生ES6 Promise已经给了解决方案，那就是Promise.resolve(...)。

如果向Promise.resolve(...)传递一个非Promise、非thenable的立即值，就会得到一个用这个值填充的Promise。如果传递的是一个Promise就会返回该Promise。如果是一个非Promise的thenable值，前者就会试图展开这个值，展开过程会持续到提取出一个具体的非类Promise 的最终值。

至此，Promise将回调的控制反转反转了回来，控制权放在了一个可信任的系统(Promise)中，使得异步编码更加清晰和可靠。

## Generator

Promise解决了回调表达异步的可信任问题，现在就只剩下回调表达异步控制流程的问题，也就是基于回调的异步不符合大脑对任务步骤的规划方式。

而ES6生成器(generator)将让我们看到一种顺序、看似同步的异步流程控制表达风格。

总所周知，一个函数一旦开始执行，就会运行到结束为止，期间无法打断。而ES6引入了一个新的函数类型，他并不符合这种运行到结束的特性。这类新的函数被称为生成器。举个例子：

```js
var x = 1;
function *foo(){
  x++;
  yield;
  console.log('x:',x);
}
function bar() {
  x++;
}
//构造一个迭代器it来控制这个生成器
var it = foo();
//启动foo()
it.next();
x;//2
bar();
x;//3
it.next();//x:3
```

生成器函数是一个特殊的函数，具有前面展示的新的执行模式。但是，它仍然是一个函数，这意味着他仍然拥有一些基本特性。比如，他仍然可以接受参数，也能返回值。

那么现在我来告诉你生成器和异步编码及解决回调问题等有什么关系。

### 异步迭代生成器

先举个例子：

```js
function foo(x,y,cb) {
  ajax('http://url1?x='+x+'&y='+y,cb)
}
foo(1,2,function(err,data){
  if(err){
    ...
  }else{
    ...
  }
})
//如果要通过生成器来表达同样的任务回调流程控制，可以这样实现：
function *foo(x,y){
  ajax('http://url1?x='+x+'&y='+y,function(err,data){
    if(err){
      it.throw(err);
    }else{
      it.next(data);
    }
  })
}
function *main(){
  try{
    var res = yield foo(1,2);
    console.log(res);
  }catch(err){
    console.error(err)
  }
}
var it = main();
it.next();
```

我们重点关注下这段代码：

```js
var res = yield foo(1,2);
console.log(res);
```

一看看上去是不是像极了同步阻塞的代码。但是它多了个yield，就是因为他使得并不会阻塞整个程序，它只是暂停或阻塞了生成器本身的代码。我们在生成器内部有了看似完全同步的代码（除了yield关键字本身），但隐藏在背后的是，在foo(...)内的运行可以完全异步。

对于我们前面所说的无法以顺序同步的、符合我们大脑思考模式的方式表达异步这个问题，这是一个近乎完美的解决方案。

从本质上而言，我们把异步作为现实细节抽象了出去，使得我们可以以同步顺序的形式追踪流程控制。（这句话的理解很重要！！！）

## Generator+Promise

如果你理解了上文所说的内容，那么你一定想到了只要将生成器和Promise相结合，就能够解决之前异步回调代码所列举的各种问题。

那么如何让他们相结合呢？最自然的方法就是yield出一个Promise，然后通过Promise来控制生成器的迭代器,将生成器的迭代器的控制权反转回到Promise手里，而不是第三方的手中。举例说明下：

```js
function foo(x,y){
  return new Promise((resolve,reject)=>{
    ajax('http://url1?x='+x+'&y='+y,function(err,data){
      if(err){
        reject(err)
      }else{
        resolve(data)
      }
    })
  })
}
function *main(){
  try{
    var res = yield foo(1,2);
    console.log(res);
  }catch(err){
    console.log(err)
  }
}
var it = main();
//yield出一个Promise
var p = it.next().value;
//通过Promise来控制生成器的迭代器
p.then((data)=>{
  it.next(data)
},(err)=>{
  it.throw(err)
})
```

### 生成器自动执行器

现在我们已知*main(...)中只有一个需要支持Promise的步骤，我们可以实现Promise驱动的生成器，不管其内部有多少个步骤。这种方式可以实现重复迭代控制，每次会生成一个Promise，等其决议后再继续。还有，可以正确处理it.next()调用过程中生成器抛出的错误以及通过it.throw()把一个Promise拒绝泡入生成器中。

这里展示一个类似于实现以上内容的工具：

```js
function run(gen){
  var args = [].slice.call(arguments, 1);
  var it = gen.apply(this, args);
  return Promise.resolve().then(function handleNext(value){
    //获取yield出的值以及对yield传值
    var next = it.next(value);
    return (function handleResult(next){
      if(next.done){
        return next.value;
      }else{
        return Promise.resolve(next.value)
        .then(handleNext,function handleErr(err){
          //promise被拒绝的话就将其传递给生成器处理，然后Promise再处理
          return Promise.resolve(it.throw(err)).then(handleResult)
        })
      }
    })(next)
  })
}
run(main);
```

这种运行run(...)的方式，它会自动异步运行你传递给他的生成器，直到结束。

### 生成器中Promise并发

假如我们应用场景是要求多并发，例如我们需要三个请求，第三个请求的参数需要前两个请求的结果。那么这个时候我们可以这要做：

```js
function *main(){
  try{
    var p1 = foo(1,2);
    var p2 = foo(2,3);
    var res = yield Promise.all([p1,p2]);
    var res3 = yield foo(res[0],res[1]);
    console.log(res3)
  }catch(err){
    console.log(err)
  }
}
run(main);
```

## async/await

async/await 其实就是 Generator+Promise 的语法糖。如果将上文 Generator+Promise 的代码用 async/await 的方式来实现，就是以下的样子：

```js
function foo(x,y){
  return new Promise((resolve,reject)=>{
    ajax('http://url1?x='+x+'&y='+y,function(err,data){
      if(err){
        reject(err)
      }else{
        resolve(data)
      }
    })
  })
}
async function main(){
  try{
    var res = await foo(1,2);
    console.log(res);
  }catch(err){
    console.log(err)
  }
}
main();
```

怎么样，是不是瞬间清新了很多？一比较就会发现，async 函数就是将 Generator 函数的星号（*）替换成 async，将 yield 替换成 await。

async 函数比 Generator 函数的优势体现在以下几点：

1. 内置执行器。 Generator 函数的执行必须靠执行器，所以才有了 co 函数库（类似于前面的run辅助函数），而 async 函数自带执行器。也就是说，async 函数的执行，与普通函数一模一样，只要一行。

2. 更好的语义。 async 和 await，比起星号和 yield，语义更清楚了。async 表示函数里有异步操作，await 表示紧跟在后面的表达式需要等待结果。

3. 更广的适用性。 co 函数库约定，yield 命令后面只能是 Thunk 函数或 Promise 对象，而 async 函数的 await 命令后面，可以跟 Promise 对象和原始类型的值（数值、字符串和布尔值，但这时等同于同步操作）。
