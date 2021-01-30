# 页面渲染详解

渲染进程负责标签（tab）内发生的所有事情。在渲染进程里面，主线程（main thread）处理了绝大多数你发送给用户的代码。如果你使用了web worker或者service worker，相关的代码将会由工作线程（worker thread）处理。合成（compositor）以及光栅（raster）线程运行在渲染进程里面用来高效流畅地渲染出页面内容。

渲染进程的主要任务是将HTML，CSS，以及JavaScript转变为我们可以进行交互的网页内容。

![16f8276f79e1f1d9](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/16f8276f79e1f1d9.jpg)

渲染进程里面有：一个主线程（main thread），几个工作线程（worker threads），一个合成线程（compositor thread）以及一个光栅线程（raster thread）

如下图所示，图中虚线是与底层第三方库交互。
当访问一个页面的时候，会利用网络去请求获取内容，如果命中缓存了，则会在存储上直接获取；
如果内容是个HTML格式，首先会找到html解释器进行解析生成DOM树，解析到style的时候会找到css解释器工作得到CSSOM，解析到script会停止解析并开始解析执行js脚本；
DOM树和CSSOM树会构建成一个render树，render树上的节点不和DOM树一一对应，只有显示节点才会存在render树上；
render树已经知道怎么绘制了，进入布局和绘图，绘制完成后将调用绘制接口，从而显示在屏幕上。

![bVbq18B](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/bVbq18B.jpg)

![1628f1a4744e0375](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/1628f1a4744e0375.jpg)

## 构建DOM树

渲染进程在导航结束的时候会收到来自浏览器进程提交导航（commit navigation）的消息，在这之后渲染进程就会开始接收HTML数据，同时主线程也会开始解析接收到的文本数据（text string）并把它转化为一个DOM（Document Object Model）对象

DOM对象既是浏览器对当前页面的内部表示，也是Web开发人员通过JavaScript与网页进行交互的数据结构以及API。

### 子资源加载

除了HTML文件，网站通常还会使用到一些诸如图片，CSS样式以及JavaScript脚本等子资源。这些文件会从缓存或者网络上获取。主线程会按照在构建DOM树时遇到各个资源的循序一个接着一个地发起网络请求，可是为了提升效率，浏览器会同时运行“预加载扫描”（preload scanner）程序。如果在HTML文档里面存在诸如<img>或者<link>这样的标签，预加载扫描程序会在HTML解析器生成的token里面找到对应要获取的资源，并把这些要获取的资源告诉浏览器进程里面的网络线程。

![16f8277407b95db6](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/16f8277407b95db6.jpg)

### 节点解析过程

![bVbq2ec](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/bVbq2ec.jpg)

字节流经过解码后是字符流，然后通过词法分析器会被解释成词语（Tokens），之后经过语法分析器构建成节点，最后这些节点组成一棵DOM树。

具体步骤如下：

1. 词法分析

    在进行词法分析前，解释器首先要检查网页内容实用的编码格式，找到合适的解码器，将字节流转换成特定格式的字符串，然后交给词法分析器进行分析。

    每次词法分析器都会根据上次设置的内部状态和上次处理后的字符串来生成一个新的词语。内部使用了超过70种状态。（ps：生成的词语还会进过XssAutitor验证词语是否安全合法，非合法的词语不能通过）

    ![bVbq2fd](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/bVbq2fd.jpg)

    例子：

    ```html
    <div>
      <img src="/a" />
    </div>
    ```

    1. 接收到"<"进入TagOpen状态
    2. 接收"d"，根据当前状态是TagOpen判断进入TagName状态，之后接收"i"/"v"
    3. 接收">"进入TagEnd状态，此时得到了div的开始标签(StartTag)
    4. 接收"<"进入TagOpen，接收"img"后接收到空格得到了img开始标签
    5. 进入attribute一系列(笔者自己命名的，不知道叫啥)状态，得到了src属性吗和"/a"属性值
    6. 同样方式获得div结束标签

2. 词语到节点

    得到词语（Tokens）后，就可以开始形成DOM节点了。

    注意：这里说的节点不单单指HTMLElement节点，还包括TextNode/Attribute等等一系列节点，它们都继承自Node类。
    词语类型只有6种，DOCTYPE/StartTag/EndTag/Comment/Character/EndOfFile

3. 组成DOM树

    因为节点都可以看成有开始和结束标记，所以用栈的结构来辅助构建DOM树再合适不过了。
    再拿上述的html代码做例子。

    ```html
    <div>
      <img src="/a" />
      <span>webkit dom</span>
    </div>
    ```

    1. 接收到div开始标签，将div推入栈，并且在DOM树上添加div节点，栈顶的节点表示了当前的父节点；
    2. 接收img开始标签，将img推入栈，根据栈中前一个节点，img是div的子节点，在DOM树上：在div节点下添加img节点
    3. 接收src属性，非独立节点，直接添加到img节点下；
    4. 接收img结束标签，将栈中img开始标签退栈；
    5. 接收span开始标签，将span推入栈，根据栈中前一个节点，span是div的子节点，在DOM树上：在div节点下添加span节点；
    6. 接收文本节点webkit，推入栈，在DOM树上，在span节点下添加“webkit”文本节点；
    7. 接收文本节点dom，根据之前栈顶节点依旧是文本节点，直接将该文本节点合并到前面的文本节点“webkit dom”；
    8. 接收span结束标签，一直执行退栈操作直到将span开始标签也离开了；
    9. 接收div结束标签，退栈；
    10. 接收endOfFile，DOM树构建结束；

    该栈是HTMLElementStack，该栈的主要作用就是帮助DOM树维护当前的父节点是哪一个（栈顶这个），并且合并可以合并的词语。

## 样式计算

拥有了DOM树我们还不足以知道页面的外貌，因为我们通常会为页面的元素设置一些样式。主线程会解析页面的CSS从而确定每个DOM节点的计算样式（computed style）。计算样式是主线程根据CSS样式选择器（CSS selectors）计算出的每个DOM元素应该具备的具体样式，你可以打开devtools来查看每个DOM节点对应的计算样式。

![16f8277848986cee](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/16f8277848986cee.jpg)

即使你的页面没有设置任何自定义的样式，每个DOM节点还是会有一个计算样式属性，这是因为每个浏览器都有自己的默认样式表。因为这个样式表的存在，页面上的h1标签一定会比h2标签大，而且不同的标签会有不同的magin和padding。

### CSS解析详解

WebKit 使用 Flex 和 Bison 解析器生成器，通过 CSS 语法文件自动创建解析器。最后WebKit将创建好的结果直接设置到StyleSheetContents对象中。

![bVbq2kH](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/bVbq2kH.jpg)

- 规则匹配

  当WebKit需要为HTML元素创建RenderObject类（后面会讲到）的时候（当样式规则建立完成后且DOM树已经有内容的时候），首先会先去获取样式信息，得到RenderStyle对象——包含了匹配完的结果样式信息。
  根据元素的标签名/属性检查规则，从规则查找匹配的规则，Webkit把这些规则保存在匹配结果中。
  最后Webkit对这些规则进行排序，整合，将样式属性值返回。

- 脚本设置CSS

  CSSOM在DOM中的一些节点接口加入了获取和操作css属性的JavaScript接口，因而JavaScript可以动态操作css样式。
  CSSOM定义了样式表的接口CSSStyleSheet，document.styleshheets可以查看当前网页包含的所有css样式表
  W3C定义了另外一个规范，CSSOM View，增加一些新的属性到Window，Document，Element，MounseEvent等接口，这些CSS的属性能让JavaScript获取视图信息

![1628f1a494d9db07](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/1628f1a494d9db07.jpg)

在网络资源中获得 CSS 代码以后，会把 CSS 交给 CSS 解析器处理，同时会计算布局。 DOM 树会构建成一个 RenderObject 树，它和 DOM 树节点是一一对应，然后再和 解析后的CSS 合并分析，生成 RenderLayer 树， 这个树就是最终用于渲染的树，然后绘制上下文。

![1628f1a4b6e5e8ad](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/1628f1a4b6e5e8ad.jpg)

## 布局

前面这些步骤完成之后，渲染进程就已经知道页面的具体文档结构以及每个节点拥有的样式信息了，可是这些信息还是不能最终确定页面的样子。举个例子，假如你现在想通过电话告诉你的朋友你身边的一幅画的内容：“画布上有一个红色的大圆圈和一个蓝色的正方形”，单凭这些信息你的朋友是很难知道这幅画具体是什么样子的，因为他不知道大圆圈和正方形具体在页面的什么位置，是正方形在圆圈前面呢还是圆圈在正方形的前面。

![16f8277bb9f6e5a9](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/16f8277bb9f6e5a9.jpg)

渲染网页也是同样的道理，只知道网站的文档流以及每个节点的样式是远远不足以渲染出页面内容的，还需要通过布局（layout）来计算出每个节点的几何信息（geometry）。

布局的具体过程是：主线程会遍历刚刚构建的DOM树，根据DOM节点的计算样式计算出一个布局树（layout tree）。布局树上每个节点会有它在页面上的x，y坐标以及盒子大小（bounding box sizes）的具体信息。布局树长得和先前构建的DOM树差不多，不同的是这颗树只有那些可见的（visible）节点信息。举个例子，如果一个节点被设置为了display:none，这个节点就是不可见的就不会出现在布局树上面。同样的，如果一个伪元素（pseudo class）节点有诸如p::before{content:"Hi!"}这样的内容，它会出现在布局上，而不存在于DOM树上。

![16f82781af838802](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/16f82781af838802.jpg)

## 绘画

知道了DOM节点以及它的样式和布局其实还是不足以渲染出页面来的。为什么呢？举个例子，假如你现在想对着一幅画画一幅一样的画，你已经知道了画布上每个元素的大小，形状以及位置，你还是得思考一下每个元素的绘画顺序，因为画布上的元素是会互相遮挡的（z-index）。

![16f82788a2f56941](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/16f82788a2f56941.jpg)

举个例子，如果页面上的某些元素设置了z-index属性，绘制元素的顺序就会影响到页面的正确性。

![16f8278fde6ed7c7](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/16f8278fde6ed7c7.jpg)

在绘画这个步骤中，主线程会遍历之前得到的布局树（layout tree）来生成一系列的绘画记录（paint records）。绘画记录是对绘画过程的注释，例如“首先画背景，然后是文本，最后画矩形”。如果你曾经在canvas画布上有使用过JavaScript绘制元素，你可能会觉着这个过程不是很陌生。

![16f8279450d97474](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/16f8279450d97474.jpg)
