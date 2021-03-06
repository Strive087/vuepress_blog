# 中间件

在NodeJS中，中间件主要是指封装所有Http请求细节处理的方法。一次Http请求通常包含很多工作，如记录日志、ip过滤、查询字符串、请求体解析、Cookie处理、权限验证、参数验证、异常处理等，但对于Web应用而言，并不希望接触到这么多细节性的处理，因此引入中间件来简化和隔离这些基础设施与业务逻辑之间的细节，让开发者能够关注在业务的开发上，以达到提升开发效率的目的。

中间件的行为比较类似Java中过滤器的工作原理，就是在进入具体的业务处理之前，先让过滤器处理。

## 中间件机制核心实现

中间件是从Http请求发起到响应结束过程中的处理方法，通常需要对请求和响应进行处理，因此一个基本的中间件的形式如下：

```js
const middleware = (req, res, next) => {
  // TODO
  next()
}
```

以下通过两种中间件机制的实现来理解中间件是如何工作的。

### 实现一

![163ee26dacf74002](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/163ee26dacf74002.jpg)

```js
const middleware1 = (req, res, next) => {
  console.log('middleware1 start')
  next()
}

const middleware2 = (req, res, next) => {
  new Promise(resolve => {
    setTimeout(() => {
        console.log('middleware2 start')
        resolve()
    }, 1000)
  }).then(() => {
    next();
  })
}

const middleware3 = (req, res, next) => {
  console.log('middleware3 start')
  next()
}

// 中间件数组
const middlewares = [middleware1, middleware2, middleware3]
function run (req, res) {
  const next = () => {
    // 获取中间件数组中第一个中间件
    const middleware = middlewares.shift()
    if (middleware) {
      middleware(req, res, next)
    }
  }
  next()
}
run() // 模拟一次请求发起

// middleware1 start
// middleware2 start
// middleware3 start
```

通过递归的形式，将后续中间件的执行方法传递给当前中间件，在当前中间件执行结束，通过调用next()方法执行后续中间件的调用。如果中间件中有异步操作，需要在异步操作的流程结束后再调用next()方法，否则中间件不能按顺序执行，如实现一中的middleware2所示。

### 实现二

![zqtv2B](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/zqtv2B.png)

```js
function run () {
  const next = () => {
    const middleware = middlewares.shift()
    if (middleware) {
      // 将middleware(req, res, next)包装为Promise对象
      return Promise.resolve(middleware(req, res, next))
    }else{
      return Promise.resolve();
    }
  }
  next()
}

const middleware1 = async (req, res, next) => {
  console.log('midlleware1 start');
  await new Promise(resolve => {
    setTimeout(() => {
      console.log('middleware1 running');
      resolve()
    },1000)
  })
  await next().then(() => {
    console.log('middleware1 finished');
  })
}

const middleware2 = async (req, res, next) => {
  console.log('midlleware2 start');
  await new Promise(resolve => {
    setTimeout(() => {
      console.log('middleware2 running');
      resolve()
    },1000)
  })
  await next().then(() => {
    console.log('middleware2 finished');
  })
}

const middleware3 = async (req, res, next) => {
  console.log('midlleware3 start');
  await new Promise(resolve => {
    setTimeout(() => {
      console.log('middleware3 running');
      resolve()
    },1000)
  })
  await next().then(() => {
    console.log('middleware3 finished');
  })
}

const middlewares = [middleware1,middleware2,middleware3];

run();
```

在实现一情况下，无法在next()为异步操作时再将当前中间件的其他代码作为回调执行。因此可以将next()方法的后续操作封装成一个Promise对象，中间件内部就可以使用next.then()形式完成业务处理结束后的回调。

在express框架中，中间件的实现方式为实现一，并且全局中间件和内置路由中间件中根据请求路径定义的中间件共同作用，不过无法在业务处理结束后再调用当前中间件中的代码。koa2框架中中间件的实现方式为实现二，将next()方法返回值封装成一个Promise，便于后续中间件的异步流程控制，实现了koa2框架提出的洋葱圈模型，即每一层中间件相当于一个球面，当贯穿整个模型时，实际上每一个球面会穿透两次。
