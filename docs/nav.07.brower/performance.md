# 性能优化

## 加载性能

### 优化内容效率

避免不必要的下载、通过各种压缩技术优化每个资源的传送编码以及尽可能利用缓存来避免多余的下载。

### JavaScript 启动优化

### 网络加载

- 仅发送用户所需的代码
  - 使用代码拆分将 JavaScript 分解成关键部分和非关键部分。 webpack 等模块捆绑程序支持代码拆分。
  - 延迟加载非关键代码。
- 源码压缩
  - 使用 UglifyJS 来压缩 ES5 代码。
  - 使用 babel-minify 或 uglify-es 来压缩 ES2015+。
- 压缩
  - 至少使用 gzip 来压缩基于文本的资源。
  - 考虑使用 Brotli ~q11。 Brotli 在压缩比率方面优于 gzip， 已帮助 CertSimple 节省 17% 的压缩 JS 字节大小，并且帮助 LinkedIn 节省 4% 的加载时间。
- 移除未使用的代码。
  - 识别可以使用 DevTools 代码覆盖来移除或延迟加载代码的机会。
  - 使用 babel-preset-env 和 browserlist，避免转译现代浏览器中已有的功能。 高级开发者可能会发现仔细分析其 webpack 软件包有助于找到裁减非必要依赖项的机会。
  - 要删除代码，请查看 tree-shaking、Closure Compiler 的高级优化和库裁剪插件（例如 lodash-babel-plugin）或者 webpack 的 ContextReplacementPlugin（适用于 Moment.js 等库）。
- 缓存代码以最大限度减少网络往返次数。
  - 使用 HTTP 缓存来确保浏览器缓存有效响应。 确定脚本的最佳生命周期 (max-age)，并提供验证令牌 (ETag) 以避免传输未更改的字节。
  - Service Worker 缓存可使您的应用网络更有弹性，并允许您对 V8 的代码缓存等功能进行 Eager 访问。
  - 使用长期缓存以避免重新提取尚未更改的资源。 如果您使用 Webpack，请参阅文件名哈希。

#### 解析/编译

下载 JavaScript 之后，JS 引擎解析/编译此代码的时间成为 JavaScript 最大的成本之一。

花费很长时间来解析/编译代码会严重推迟用户与网站交互的时间。 发送的 JavaScript 越多，在网站可进行交互之前就要花费越长的时间来解析和编译。

:::tip
就字节而言，浏览器处理 JavaScript 的成本高于 相同大小的图像或网页字体 - Tom Dale
:::

![ArXzvi](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/ArXzvi.png)

JavaScript 与图像字节的成本大不相同。 在解码和光栅化图像的过程中，通常不会阻止主线程或界面交互。 但是，JS 可能会因为解析、编译和执行成本而延迟交互。谈及解析和编译的速度较慢时，需要考虑环境；不同的设备，性能差异较大，解析和编译速度大相径庭。

:::tip
网络能力与设备能力并不总是相称。 拥有高速光纤连接的用户 不一定使用最好的 CPU 来 解析和评估发送到其所用设备上的 JavaScript。 反过来也是如此，网络连接速度慢，但是 CPU 速度很快。 - Kristofer Baxter，LinkedIn
:::

从页面中移除非关键 JavaScript 可以减少传输时间、CPU 密集型解析和编译以及潜在的内存开销。 这也有助于加快页面的交互速度。

#### 执行时间

并不是只有解析和编译会产生成本。 执行 JavaScript（在解析/编译后运行代码）是必须在主线程中执行的其中一项操作。 较长的执行时间也可能会推迟用户与您网站交互的时间。

![xqDGXC](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/xqDGXC.png)

为解决此问题，可以将 JavaScript 分成小型代码段，以避免锁定主线程。 了解您能否减少执行期间完成的工作量。

#### 其他成本

- 内存。 页面可能会因为 GC（垃圾回收）而出现卡顿或频繁暂停现象。 当浏览器收回内存时，就会暂停执行 JS，因此频繁收集垃圾的浏览器会导致暂停执行的频率超出我们的容忍程度。 请避免内存泄漏和频繁的 GC 暂停，以消除页面卡顿。
- 在运行时，长时间运行的 JavaScript 可能会阻塞主线程，从而导致页面无响应。 将工作分为较小的块（使用 requestAnimationFrame() 或 requestIdleCallback() 排程）可以最大限度减少无响应问题。

#### PRPL

PRPL（推送、渲染、预先缓存、延迟加载）是一种通过激进代码拆分和缓存来优化交互性的模式:

![EiL3SS](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/EiL3SS.png)

#### 渐进式引导

许多网站以交互性为代价来优化内容可见性。 为在确实有大型 JavaScript 软件包时快速进行首次绘制，开发者有时会利用服务器端渲染；然后将其“升级”，以便最终提取 JavaScript 时附加事件处理程序。

请慎重思考，因为这种方法自身也会产生成本。 您 (1) 通常会发送大型 HTML 响应，这可能会推动交互性，(2) 也可能会让用户处于“恐怖谷”，即在 JavaScript 完成处理之前，半数体验实际上都没有交互性。

或许渐进式引导是更好的方法。 发送具有最低限度功能的页面（仅由当前路由所需的 HTML/JS/CSS 组成）。 当有更多资源到达时，应用可以进行延迟加载，并解锁更多功能。

![Glua02](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/Glua02.png)

加载与视图中显示的内容成比例的代码是诀窍所在。 PRPL 和渐进式引导模式可以帮助您实现这一点。

传输大小对于低端网络极为关键。 在 CPU 处理能力有限的设备上，解析时间十分重要。 应该尽量降低这两个指标。

## 渲染性能

### 单个帧的渲染流程 —— 像素管道

目前，大多数设备的刷新率都是 60 FPS，如果浏览器在交互的过程中能够时刻保持在 60FPS 左右，用户就不会感到卡顿，否则，就会影响用户的体验。

下图为浏览器运行的单个帧的渲染流水线，称为像素管道，如果其中的一个或多个环节执行时间过长就会导致卡顿。像素管道是作为开发者能够掌握的对帧性能有影响的部分，其他部分由浏览器掌握，我们无法控制。我们的目标就是就是尽快完成这些环节，以达到 60 FPS 的目标。

![9LnDCu](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/9LnDCu.jpg)

- JavaScript。通常来说，阻塞的发起都是来自于 JS ，这不是说不用 JS，而是要正确的使用 JS 。首先，JS 线程的运行本身就是阻塞 UI 线程的（暂不考虑 Web Worker）。从纯粹的数学角度而言，每帧的预算约为 16.7 毫秒（1000 毫秒 / 60 帧 = 16.66 毫秒/帧）。但因为浏览器需要花费时间将新帧绘制到屏幕上，只有 ~10 毫秒来执行 JS 代码，过长时间的同步执行 JS 代码肯定会导致超过 10ms 这个阈值，其次，频繁执行一些代码也会过长的占用每帧渲染的时间。此外，用 JS 去获取一些样式还会导致强制同步布局（后面会有介绍）。
- 样式计算（Style）。此过程是根据匹配选择器（例如 .headline 或 .nav > .nav__item）计算出哪些元素应用哪些 CSS 规则的过程，这个过程不仅包括计算层叠样式表中的权重来确定样式，也包括内联的样式，来计算每个元素的最终样式。
- 布局（Layout）。在知道对一个元素应用哪些规则之后，浏览器即可开始计算该元素要占据的空间大小及其在屏幕的位置。网页的布局模式意味着一个元素可能影响其他元素，一般来说如果修改了某个元素的大小或者位置，则需要检查其他所有元素并重排（re-flow）整个页面。
- 绘制（Paint）。绘制是填充像素的过程。它涉及绘出文本、颜色、图像、边框和阴影，基本上包括元素的每个可视部分。绘制一般是在多个表面（通常称为层）上完成的，绘制包括两个步骤： 1) 创建绘图调用的列表， 2) 填充像素，后者也被称作栅格化。
- 合成（Composite）。由于页面的各部分可能被绘制到多个层上，因此它们需要按正确顺序绘制到屏幕上，才能正确地渲染页面。尤其对于与另一元素重叠的元素来说，这点特别重要，因为一个错误可能使一个元素错误地出现在另一个元素的上层。

### 采用更好的 CSS 方法进行优化

上节渲染管道的每个环节都有可能引起卡顿，所以要尽可能减少通过的管道步骤。修改不同的样式属性会有以下几种不同的帧流程：

![xnFvGJ](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/xnFvGJ.png)

我们可以看到 JS，Style 和 Composite 是不可避免的，因为需要 JS 来引发样式的改变，Style 来计算更改后最终的样式，Composite 来合成各个层最终进行显示。Layout 和 Paint 这两个步骤不一定会被触发，所以在优化的过程中，如果是需要频繁触发的改变，我们应该尽可能避免 Layout 和 Paint。

#### 尽量使用 transform 和 opacity 属性更改来实现动画

性能最佳的像素管道版本会避免 Layout 和 Paint：

![uQlY1V](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/uQlY1V.jpg)

为了实现此目标，需要坚持更改可以由合成器单独处理的属性。常用的两个属性符合条件：transform 和 opacity。

除了 transform 和 opacity，只会触发 composite 的 CSS 属性还有：pointer-events（是否响应鼠标事件）、perspective （透视效果）、perspective-origin（perspective 的灭点）、cursor（指针样式）、orphans（设置当元素内部发生分页时必须在页面底部保留的最少行数（用于打印或打印预览））、widows（设置当元素内部发生分页时必须在页面顶部保留的最少行数（用于打印或打印预览））。

#### 减小选择器匹配的难度

#### 提升元素到新的层

#### 使用 flexbox 而不是较早的布局模型

### 尽量避免 Layout

#### 强制同步重排 - FSL (forced synchronous layout)

#### FLIP策略

### 高性能 JavaScript

#### 昂贵的 DOM 操作

### 事件委托

### 避免微优化

### Web Worker

### 内存管理

参考链接：

[加载性能](https://developers.google.com/web/fundamentals/performance/get-started)
[渲染性能](https://developers.google.com/web/fundamentals/performance/rendering)
[前端性能优化之浏览器渲染优化](https://github.com/fi3ework/blog/issues/9)

