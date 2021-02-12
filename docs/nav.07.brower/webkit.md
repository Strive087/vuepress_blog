# WebKit 架构及模块

WebKit支持不同浏览器，一部分代码共享，另外一部分不同，不同部分称为 WebKit 的移植（Ports），如下图中虚线框表示不同浏览器中实现普遍不同。

![16ab434ee10f823e](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/16ab434ee10f823e.jpg)

- 最底层是操作系统，WebKit 可以在不同的操作系统上工作
- 操作系统之上的就是 WebKit 依赖的第三方库，这些库是 WebKit 运行的基础
- 再往上一层就是 WebKit 项目了，图中又将其分为两层

  - WebCore 部分包含了目前被各个浏览器所使用的共享部分，是加工渲染网页的基础。包括 HTML（解释器）、CSS（解释器）、SVG、DOM、渲染树（ReaderObject 树、ReaderLayer 树等）、 Inspector（Web Inspector 开发者工具、调试网页）
  - JavaScriptCore 引擎是 WebKit 中的默认 JavaScript 引擎，WebKit 中对 JavaScript 引擎的调用是独立引擎的。例如 Chromium 中替换为 V8 引擎
  - WebKit Ports 指的是 WebKit 中的非共享部分，包括硬件加速架构、网络栈、视频解码、图片解码等

- WebCore 和 WebKit Ports 之上的层主要提供嵌入式编程接口，提供给浏览器调用。接口层的定义也与移植密切相关，而不是 WebKit 有一个统一接口。
