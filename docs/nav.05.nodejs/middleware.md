# node中间件

中间件 在 Node.js 中被广泛使用，它泛指一种特定的设计模式、一系列的处理单元、过滤器和处理程序，以函数的形式存在，连接在一起，形成一个异步队列，来完成对任何数据的预处理和后处理。

## 常规中间件模式

中间件模式中，最基础的组成部分就是 中间件管理器，我们可以用它来组织和执行中间件的函数，如图所示：

![163ee26dacf74002](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/163ee26dacf74002.jpg)

举一个来自于 《Node.js 设计模式 第二版》 的一个为消息传递库实现 中间件管理器 的例子：

```js
class ZmqMiddlewareManager {
    constructor(socket) {
        this.socket = socket;
        // 两个列表分别保存两类中间件函数：接受到的信息和发送的信息。
        this.inboundMiddleware = [];
        this.outboundMiddleware = [];
        socket.on('message', message => {
            this.executeMiddleware(this.inboundMiddleware, {
                data: message
            });
        });
    }
    
    send(data) {
        const message = { data };
        
        this.excuteMiddleware(this.outboundMiddleware, message, () => {
            this.socket.send(message.data);
        });
    }
    
    use(middleware) {
        if(middleware.inbound) {
            this.inboundMiddleware.push(middleware.inbound);
        }
        if(middleware.outbound) {
            this.outboundMiddleware.push(middleware.outbound);
        }
    }
    
    exucuteMiddleware(middleware, arg, finish) {
        function iterator(index) {
            if(index === middleware.length) {
                return finish && finish();
            }
            middleware[index].call(this, arg, err => {
                if(err) {
                    return console.log('There was an error: ' + err.message);
                }
                iterator.call(this, ++index);
            });
        }
        iterator.call(this, 0);
    }
}
```

接下来只需要创建中间件，分别在inbound和outbound中写入中间件函数，然后执行完毕调用next()就好了。比如：

```js
const zmqm = new ZmqMiddlewareManager();

zmqm.use({
    inbound: function(message, next) {
        console.log('input message: ', message.data);
        next();
    },
    outbound: function(message, next) {
        console.log('output message: ', message.data);
        next();
    }
});
```

## Kow2中的中间件

![163ee26db296c93e](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/163ee26db296c93e.jpg)

## 参考链接

- [Node.js 中间件模式](https://juejin.cn/post/6844903619209199624)