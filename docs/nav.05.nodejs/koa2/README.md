# 洋葱模型原理

Koa 是一个新的 web 框架，通过利用 async 函数，Koa 帮你丢弃回调函数，并有力地增强错误处理。 Koa 并没有捆绑任何中间件， 而是提供了一套优雅的方法，帮助您快速而愉快地编写服务端应用程序。

![89ybum](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/89ybum.png)

koa2框架的中间件机制实现得非常简洁和优雅，这里学习一下框架中组合多个中间件的核心代码。

```js
function compose (middleware) {
  if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!')
  for (const fn of middleware) {
    if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
  }
  return function (context, next) {
    let index = -1
    return dispatch(0)
    function dispatch (i) {
      // index会在next()方法调用后累加，防止next()方法重复调用
      if (i <= index) return Promise.reject(new Error('next() called multiple times'))
      index = i
      let fn = middleware[i]
      if (i === middleware.length) fn = next
      if (!fn) return Promise.resolve()
      try {
        // 核心代码
        // 包装next()方法返回值为Promise对象
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
      } catch (err) {
        // 遇到异常中断后续中间件的调用
        return Promise.reject(err)
      }
    }
  }
}
```

在后续NodeJS学习和应用中，建议使用koa2框架作为基础框架，这里列出了一些使用比较多的中间件。

- koa-router：路由中间件
- koa-bodyparser：http请求主体解析
- koa-static：代理静态文件
- koa-compress：gzip压缩
- koa-logger：日志记录
- koa-convert：转换koa1.x版本的中间件
- kcors：跨域中间件
