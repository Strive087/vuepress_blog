# 从url到页面

浏览器中tab外面发生的一切都是由浏览器进程（browser process）控制的。浏览器进程有很多负责不同工作的线程（worker thread），其中包括绘制浏览器顶部按钮和导航栏输入框等组件的UI线程（UI thread）、管理网络请求的网络线程（network thread）、以及控制文件读写的存储线程（storage thread）等。当你在导航栏里面输入一个URL的时候，其实就是UI线程在处理你的输入。

![16f44af167bfb2a5](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/16f44af167bfb2a5.jpg)

## 一次简单的导航

### 处理输入

判断导航栏中输入的是url还是需要搜索的内容。

![16f44af7260673b2](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/16f44af7260673b2.jpg)

## 发送请求

当用户按下回车键的时候，UI线程会叫网络线程（network thread）初始化一个网络请求来获取站点的内容。这时候tab上会展示一个提示资源正在加载中的旋转圈圈，而且网络线程会进行一系列诸如[DNS寻址](../nav.07.network/dns.md)以及为[请求建立TLS连接](../nav.07.network/02.https.md)的操作。

![16f44afaff744f38](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/16f44afaff744f38.jpg)

这时如果网络线程收到服务器的HTTP 301重定向响应，它就会告知UI线程进行重定向然后它会再次发起一个新的网络请求。

## 读取响应

网络线程在收到HTTP响应的主体（payload）流（stream）时，在必要的情况下它会先检查一下流的前几个字节以确定响应主体的具体媒体类型（MIME Type）。响应主体的媒体类型一般可以通过HTTP头部的Content-Type来确定，不过Content-Type有时候会缺失或者是错误的，这种情况下浏览器就要进行MIME类型嗅探来确定响应类型了。MIME类型嗅探并不是一件容易的事情，你可以从Chrome的源代码的注释来了解不同浏览器是如何根据不同的Content-Type来判断出主体具体是属于哪个媒体类型的。

![16f44affa91bf57a](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/16f44affa91bf57a.jpg)

如果响应的主体是一个HTML文件，浏览器会将获取的响应数据交给渲染进程（renderer process）来进行下一步的工作。如果拿到的响应数据是一个压缩文件（zip file）或者其他类型的文件，响应数据就会交给下载管理器（download manager）来处理。

![16f44b0219259e4e](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/16f44b0219259e4e.jpg)

网络线程在把内容交给渲染进程之前还会对内容做SafeBrowsing检查。如果请求的域名或者响应的内容和某个已知的病毒网站相匹配，网络线程会给用户展示一个警告的页面。除此之外，网络线程还会做CORB（Cross Origin Read Blocking）检查来确定那些敏感的跨站数据不会被发送至渲染进程。

## 渲染进程

在网络线程做完所有的检查后并且能够确定浏览器应该导航到该请求的站点，它就会告诉UI线程所有的数据都已经被准备好了。UI线程在收到网络线程的确认后会为这个网站寻找一个渲染进程（renderer process）来渲染界面。

![16f44b053fdb2466](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/16f44b053fdb2466.jpg)

由于网络请求可能需要长达几百毫秒的时间才能完成，为了缩短导航需要的时间，浏览器会在之前的一些步骤里面做一些优化。例如在第二步中当UI线程发送URL链接给网络线程后，它其实已经知晓它们要被导航到哪个站点了，所以在网络线程干活的时候，UI线程会主动地为这个网络请求启动一个渲染线程。如果一切顺利的话（没有重定向之类的东西出现），网络线程准备好数据后页面的渲染进程已经就准备好了，这就节省了新建渲染进程的时间。不过如果发生诸如网站被重定向到不同站点的情况，刚刚那个渲染进程就不能被使用了，它会被摒弃，一个新的渲染进程会被启动。

## 提交导航

到这一步的时候，数据和渲染进程都已经准备好了，浏览器进程（browser process）会通过IPC告诉渲染进程去提交本次导航（commit navigation）。除此之外浏览器进程还会将刚刚接收到的响应数据流传递给对应的渲染进程让它继续接收到来的HTML数据。一旦浏览器进程收到渲染线程的回复说导航已经被提交了（commit），导航这个过程就结束了，文档的加载阶段（document loading phase）会正式开始。

到了这个时候，导航栏会被更新，安全指示符（security indicator）和站点设置UI（site settings UI）会展示新页面相关的站点信息。当前tab的会话历史（session history）也会被更新，这样当你点击浏览器的前进和后退按钮也可以导航到刚刚导航完的页面。为了方便你在关闭了tab或窗口（window）的时候还可以恢复当前tab和会话（session）内容，当前的会话历史会被保存在磁盘上面。

![16f44b07c80f54ae](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/16f44b07c80f54ae.jpg)

## 初始加载完成

当导航提交完成后，渲染进程开始着手加载资源以及渲染页面。一旦渲染进程“完成”（finished）渲染，它会通过IPC告知浏览器进程（注意这发生在页面上所有帧（frames）的onload事件都已经被触发了而且对应的处理函数已经执行完成了的时候），然后UI线程就会停止导航栏上旋转的圈圈。
我这里用到“完成”这个词，因为后面客户端的JavaScript还是可以继续加载资源和改变视图内容的。

![16f44b0a84b8df56](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/16f44b0a84b8df56.jpg)

想要了解渲染进程具体细节，请移步到[页面渲染详解](./render.md)
