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

在网络资源中获得 CSS 代码以后，会把 CSS 交给 CSS 解析器处理生成CSSOM树。

## 构建渲染树

![3lnAe6](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/3lnAe6.png)

WebKits RenderObject 类是所有渲染器的基类，其定义如下：

```c
class RenderObject{
  virtual void layout();
  virtual void paint(PaintInfo);
  virtual void rect repaintRect();
  Node* node;  //the DOM node
  RenderStyle* style;  // the computed style
  RenderLayer* containgLayer; //the containing z-index layer
}
```

每一个渲染器都代表了一个矩形的区域，通常对应于相关节点的 CSS 框，这一点在 CSS2 规范中有所描述。它包含诸如宽度、高度和位置等几何信息。

下面这段 WebKit 代码描述了根据 display 属性的不同，针对同一个 DOM 节点应创建什么类型的渲染器。

```c
RenderObject* RenderObject::createObject(Node* node, RenderStyle* style)
{
    Document* doc = node->document();
    RenderArena* arena = doc->renderArena();
    ...
    RenderObject* o = 0;

    switch (style->display()) {
        case NONE:
            break;
        case INLINE:
            o = new (arena) RenderInline(node);
            break;
        case BLOCK:
            o = new (arena) RenderBlock(node);
            break;
        case INLINE_BLOCK:
            o = new (arena) RenderBlock(node);
            break;
        case LIST_ITEM:
            o = new (arena) RenderListItem(node);
            break;
       ...
    }

    return o;
}
```

元素类型也是考虑因素之一，例如表单控件和表格都对应特殊的框架。
在 WebKit 中，如果一个元素需要创建特殊的渲染器，就会替换 createRenderer 方法。渲染器所指向的样式对象中包含了一些和几何无关的信息。

渲染器是和 DOM 元素相对应的，但并非一一对应。非可视化的 DOM 元素不会插入渲染树中，例如“head”元素。如果元素的 display 属性值为“none”，那么也不会显示在渲染树中（但是 visibility 属性值为“hidden”的元素仍会显示）。
有一些 DOM 元素对应多个可视化对象。它们往往是具有复杂结构的元素，无法用单一的矩形来描述。例如，“select”元素有 3 个渲染器：一个用于显示区域，一个用于下拉列表框，还有一个用于按钮。如果由于宽度不够，文本无法在一行中显示而分为多行，那么新的行也会作为新的渲染器而添加。
另一个关于多渲染器的例子是格式无效的 HTML。根据 CSS 规范，inline 元素只能包含 block 元素或 inline 元素中的一种。如果出现了混合内容，则应创建匿名的 block 渲染器，以包裹 inline 元素。

有一些渲染对象对应于 DOM 节点，但在树中所在的位置与 DOM 节点不同。浮动定位和绝对定位的元素就是这样，它们处于正常的流程之外，放置在树中的其他地方，并映射到真正的框架，而放在原位的是占位框架。

![FGffC3](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/FGffC3.png)

## 布局

前面这些步骤完成之后，渲染进程就已经知道页面的具体文档结构以及每个节点拥有的样式信息了，可是这些信息还是不能最终确定页面的样子。举个例子，假如你现在想通过电话告诉你的朋友你身边的一幅画的内容：“画布上有一个红色的大圆圈和一个蓝色的正方形”，单凭这些信息你的朋友是很难知道这幅画具体是什么样子的，因为他不知道大圆圈和正方形具体在页面的什么位置，是正方形在圆圈前面呢还是圆圈在正方形的前面。

![16f8277bb9f6e5a9](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/16f8277bb9f6e5a9.jpg)

渲染网页也是同样的道理，只知道网站的文档流以及每个节点的样式是远远不足以渲染出页面内容的，还需要通过布局（layout）来计算出每个节点的几何信息（geometry）。

布局的具体过程是：主线程会遍历刚刚构建的DOM树，根据DOM节点的计算样式计算出一个布局树（layout tree）。布局树上每个节点会有它在页面上的x，y坐标以及盒子大小（bounding box sizes）的具体信息。布局树长得和先前构建的DOM树差不多，不同的是这颗树只有那些可见的（visible）节点信息。举个例子，如果一个节点被设置为了display:none，这个节点就是不可见的就不会出现在布局树上面。同样的，如果一个伪元素（pseudo class）节点有诸如p::before{content:"Hi!"}这样的内容，它会出现在布局上，而不存在于DOM树上。

![16f82781af838802](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/16f82781af838802.jpg)

HTML 采用基于流的布局模型，这意味着大多数情况下只要一次遍历就能计算出几何信息。处于流中靠后位置元素通常不会影响靠前位置元素的几何特征，因此布局可以按从左至右、从上至下的顺序遍历文档。但是也有例外情况，比如 HTML 表格的计算就需要不止一次的遍历。

坐标系是相对于根框架而建立的，使用的是上坐标和左坐标。

布局是一个递归的过程。它从根渲染器（对应于 HTML 文档的 \<html> 元素）开始，然后递归遍历部分或所有的框架层次结构，为每一个需要计算的渲染器计算几何信息。

根渲染器的位置左边是 0,0，其尺寸为视口（也就是浏览器窗口的可见区域）。

所有的渲染器都有一个“layout”或者“reflow”方法，每一个渲染器都会调用其需要进行布局的子代的 layout 方法。

## 绘画

知道了DOM节点以及它的样式和布局其实还是不足以渲染出页面来的。为什么呢？举个例子，假如你现在想对着一幅画画一幅一样的画，你已经知道了画布上每个元素的大小，形状以及位置，你还是得思考一下每个元素的绘画顺序，因为画布上的元素是会互相遮挡的（z-index）。

![16f82788a2f56941](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/16f82788a2f56941.jpg)

举个例子，如果页面上的某些元素设置了z-index属性，绘制元素的顺序就会影响到页面的正确性。

![16f8278fde6ed7c7](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/16f8278fde6ed7c7.jpg)

在绘画这个步骤中，主线程会遍历之前得到的布局树（layout tree）来生成一系列的绘画记录（paint records）。绘画记录是对绘画过程的注释，例如“首先画背景，然后是文本，最后画矩形”。如果你曾经在canvas画布上有使用过JavaScript绘制元素，你可能会觉着这个过程不是很陌生。最后通过光栅化将所有值转换为屏幕上的绝对像素。

![16f8279450d97474](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/16f8279450d97474.jpg)

## 预解析

WebKit 和 Firefox 都进行了这项优化。在执行脚本时，其他线程会解析文档的其余部分，找出并加载需要通过网络加载的其他资源。通过这种方式，资源可以在并行连接上加载，从而提高总体速度。请注意，预解析器不会修改 DOM 树，而是将这项工作交由主解析器处理；预解析器只会解析外部资源（例如外部脚本、样式表和图片）的引用。

## 阻塞

大家仔细看前面的图片会发现JavaScript的加载、解析与执行会阻塞DOM的构建，也就是说，在构建DOM时，HTML解析器若遇到了JavaScript，那么它会暂停构建DOM，将控制权移交给JavaScript引擎，等JavaScript引擎运行完毕，浏览器再从中断的地方恢复DOM构建。

原本DOM和CSSOM的构建是互不影响，井水不犯河水，但是一旦引入了JavaScript，CSSOM也开始阻塞DOM的构建，只有CSSOM构建完毕后，DOM再恢复DOM构建。因为脚本在文档解析阶段会请求样式信息，如果当时还没有加载和解析样式，脚本就会获得错误的回复，这样显然会产生很多问题，所以 Firefox 在样式表加载和解析的过程中，会禁止所有脚本。而对于 WebKit 而言，仅当脚本尝试访问的样式属性可能受尚未加载的样式表影响时，它才会禁止该脚本。

但要需要注意的是渲染是一个渐进的过程。为达到更好的用户体验，渲染引擎会力求尽快将内容显示在屏幕上。它不必等到整个 HTML 文档解析完毕之后，就会开始构建渲染树和设置布局。在不断接收和处理来自网络的其余内容的同时，渲染引擎会将部分内容解析并显示出来。

## 回流与重绘

回流必定会发生重绘，重绘不一定会引发回流。重绘和回流会在我们设置节点样式时频繁出现，同时也会很大程度上影响性能。回流所需的成本比重绘高的多，改变父节点里的子节点很可能会导致父节点的一系列回流。

- 重绘:当render tree中的一些元素需要更新属性，而这些属性只是影响元素的外观、风格，而不会影响布局的，比如background-color。
- 回流:当render tree中的一部分(或全部)因为元素的规模尺寸、布局、隐藏等改变而需要重新构建

### 减少回流与重绘

- 使用 transform 替代 top
- 使用 visibility 替换 display: none ，因为前者只会引起重绘，后者会引发回流（改变了布局）
- 不要把节点的属性值放在一个循环里当成循环里的变量。

  ```js
  for(let i = 0; i < 1000; i++) {
      // 获取 offsetTop 会导致回流，因为需要去获取正确的值
      console.log(document.querySelector('.test').style.offsetTop)
  }
  ```

- 不要使用 table 布局，可能很小的一个小改动会造成整个 table 的重新布局
- 动画实现的速度的选择，动画速度越快，回流次数越多，也可以选择使用 requestAnimationFrame
- CSS 选择符从右往左匹配查找，避免节点层级过多
- 将频繁重绘或者回流的节点设置为图层，图层能够阻止该节点的渲染行为影响别的节点。比如对于 video 标签来说，浏览器会自动将该节点变为图层。

## script标签defer与async

接下来我们对比下 defer 和 async 属性的区别：

![fCfNKt](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/fCfNKt.jpg)

其中蓝色线代表JavaScript加载；红色线代表JavaScript执行；绿色线代表 HTML 解析。

1. 普通script标签
    没有 defer 或 async，浏览器会立即加载并执行指定的脚本，也就是说不等待后续载入的文档元素，读到就加载并执行。

2. 含有async的script标签(异步下载)
    async 属性表示异步执行引入的 JavaScript，与 defer 的区别在于，如果已经加载好，就会开始执行——无论此刻是 HTML 解析阶段还是 DOMContentLoaded 触发之后。需要注意的是，这种方式加载的 JavaScript 依然会阻塞 load 事件。换句话说，async-script 可能在 DOMContentLoaded 触发之前或之后执行，但一定在 load 触发之前执行。

3. 含有defer的script标签(延迟执行)
    defer 属性表示延迟执行引入的 JavaScript，即这段 JavaScript 加载时 HTML 并未停止解析，这两个过程是并行的。整个 document 解析完毕且 defer-script 也加载完成之后（这两件事情的顺序无关），会执行所有由 defer-script 加载的 JavaScript 代码，然后触发 DOMContentLoaded 事件。

defer 与相比普通 script，有两点区别：

1. 载入 JavaScript 文件时不阻塞 HTML 的解析，执行阶段被放到 HTML 标签解析完成之后。

2. 在加载多个JS脚本的时候，async是无顺序的加载，而defer是有顺序的加载。

## 为什么操作 DOM 慢

因为 DOM 是属于渲染引擎中的东西，而 JS 又是 JS 引擎中的东西。当我们通过 JS 操作 DOM 的时候，其实这个操作涉及到了两个线程之间的通信，那么势必会带来一些性能上的损耗。操作 DOM 次数一多，也就等同于一直在进行线程之间的通信，并且操作 DOM 可能还会带来重绘回流的情况，所以也就导致了性能上的问题。

## 参考链接

- [聊聊浏览器的渲染机制](https://www.jianshu.com/p/c9049adff5ec)
- [浏览器的工作原理](https://www.html5rocks.com/zh/tutorials/internals/howbrowserswork/)
