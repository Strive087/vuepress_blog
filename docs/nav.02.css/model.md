# CSS2 可视化模型

## 画布

根据 CSS2 规范，“画布”这一术语是指“用来呈现格式化结构的空间”，也就是供浏览器绘制内容的区域。画布的空间尺寸大小是无限的，但是浏览器会根据视口的尺寸选择一个初始宽度。

根据 [w3c](https://www.w3.org/TR/CSS2/zindex.html)，画布如果包含在其他画布内，就是透明的；否则会由浏览器指定一种颜色。

## CSS 框模型（盒子模型）

[CSS 框模型](https://www.w3.org/TR/CSS2/box.html)描述的是针对文档树中的元素而生成，并根据可视化格式模型进行布局的矩形框。
每个框都有一个内容区域（例如文本、图片等），还有可选的周围补白、边框和边距区域。

![M4LSiY](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/M4LSiY.jpg)

每一个节点都会生成 0..n 个这样的框。
所有元素都有一个“display”属性，决定了它们所对应生成的框类型。示例:

```markdown
block  - generates a block box.
inline - generates one or more inline boxes.
none - no box is generated.
```

默认值是 inline，但是浏览器样式表设置了其他默认值。例如，“div”元素的 display 属性默认值是 block。
您可以在这里找到默认样式表示例：[www.w3.org/TR/CSS2/sample.html](https://www.w3.org/TR/CSS2/sample.html)

## 定位方案

有三种定位方案：

1. 普通：根据对象在文档中的位置进行定位，也就是说对象在呈现树中的位置和它在 DOM 树中的位置相似，并根据其框类型和尺寸进行布局。
2. 浮动：对象先按照普通流进行布局，然后尽可能地向左或向右移动。
3. 绝对：对象在呈现树中的位置和它在 DOM 树中的位置不同。

定位方案是由“position”属性和“float”属性设置的。

- 如果值是 static 和 relative，就是普通流
- 如果值是 absolute 和 fixed，就是绝对定位

static 定位无需定义位置，而是使用默认定位。对于其他方案，网页作者需要指定位置：top、bottom、left、right。

### 定位

#### 相对定位

先按照普通方式定位，然后根据所需偏移量进行移动。

![63MyIs](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/63MyIs.png)

#### 浮动

浮动框会移动到行的左边或右边。有趣的特征在于，其他框会浮动在它的周围。下面这段 HTML 代码：

```html
<p>
  <img style="float:right" src="images/image.gif" width="100" height="100">
  Lorem ipsum dolor sit amet, consectetuer...
</p>
```

效果如下：

![ql38UP](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/ql38UP.png)

#### 绝对定位和固定定位

这种布局是准确定义的，与普通流无关。元素不参与普通流。尺寸是相对于容器而言的。在固定定位中，容器就是可视区域。

![Hu8iBA](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/Hu8iBA.png)

请注意，即使在文档滚动时，固定框也不会移动。

## 框类型

框的布局方式是由以下因素决定的：

- 框类型
- 框尺寸
= 定位方案
- 外部信息，例如图片大小和屏幕大小

block 框：形成一个 block，在浏览器窗口中拥有其自己的矩形区域。

![dk7ePh](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/dk7ePh.png)

inline 框：没有自己的 block，但是位于容器 block 内。

![DGf4co](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/DGf4co.png)

block 采用的是一个接一个的垂直格式，而 inline 采用的是水平格式。

![hgRrAA](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/hgRrAA.png)

inline 框放置在行中或“行框”中。这些行至少和最高的框一样高，还可以更高，当框根据“底线”对齐时，这意味着元素的底部需要根据其他框中非底部的位置对齐。如果容器的宽度不够，inline 元素就会分为多行放置。在段落中经常发生这种情况。

![2HelVc](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/2HelVc.png)

