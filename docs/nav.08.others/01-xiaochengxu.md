# 小程序

## 对比普通网页

- 普通网页

  html、css、js => js和渲染引擎直接生成（单线程）

- 小程序

  wxml、wxss、js =>html、css、js（双线程，js单独一个线程）

  视图层与逻辑层通过jsBridge通信，jsBridge使用注册监听模式。

![小程序架构](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/xiaochengxu.png)

小程序有多个页面page、但只有一个实例，所有页面的js都放在同一个逻辑层（线程）执行，但每一个页面都会新开一个渲染层（线程）。

多个渲染线程和一个逻辑线程通信：

- n\*page => n\*ifarme
- n\*js => ifarme （所有页面的逻辑js都加载在逻辑层）

## 逻辑层与渲染层

逻辑层基础库：

1. page App实例

2. 与native通信

3. ...

渲染层基础库（WAWebview）：

1. 页面元素事件绑定

2. 与native通信

3. 组件相关

## wcc、wcsc

wcc：wxml编译器（wechat wxml Compiler）

wxml => wxml.js => $gwx renderer => render (动态数据)=> vnode（渲染层和逻辑层各维护一套vnode，因为线程之间数据交换代价大） => Dom

wcsc：wxss编译器（wechat wxss Compiler）

wxml => wxml.js => 根据分辨率动态计算rpx => px => style

## 执行流程

1.渲染层

加载基础库 => 加载wxml.js $gwx 渲染器的生成器 => eval执行wxml.js 生成css放入head => history.pushState => 自定义事件generateFuncReady（等待触发）=> 基础库中监听，并执行 WeixinJSBridge => 通知native 准备好了 native通知逻辑层

2.逻辑层

加载基础库 => 引入对应page app页面 => 初始化配置

## taro

render => wxml
css => wxss
js => 打包
