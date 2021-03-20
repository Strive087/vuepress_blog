# SVG

![WHZAhF](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/WHZAhF.png)

## 简介

SVG 已经被糟糕的浏览器支持（尤其是 IE）惩罚了好多年。

现在我们可以安全地使用 SVG 图像，除非您有很多用户使用 IE8 以及更低版本，或者使用较旧的 Android 设备。这种情况下，依然存在着备选方案。

![162c33041cf1b6b3](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/162c33041cf1b6b3.jpg)

SVG 成功的一部分是由于我们必须支持各种不同分辨率和尺寸的屏幕显示。SVG 能完美解决这个问题。

SVG 是一种 vector 图像文件格式。这使得它们与其他图像格式（如 PNG、GIF 或 JPG）有很大的不同，后者是光栅图像文件格式。

## 特点

由于 SVG 图像是**矢量图像**，可以**无限缩放**，而且在图像质量下降方面没有任何问题。

因为 SVG 图像是使用**XML标记**构建的，浏览器通过绘制每个点和线来打印它们，而不是用预定义的像素填充某些空间。这确保 SVG 图像可以适应不同的屏幕大小和分辨率。

由于是在 XML 中定义的，SVG 图像比 JPG 或 PNG 图像更灵活，而且我们可以使用 CSS 和 JavaScript 与它们进行交互。SVG 图像设置可以包含 CSS 和 JavaScript。

SVG 可以渲染比其他格式小得多的矢量风格图像，主要用于标识和插图。另一个巨大的用例是图标。曾经是图标字体域，比如 FontAwesome，现在的设计师更喜欢使用 SVG 图像，因为它更小，并且允许使用多色图标。

SVG 在动画方面很简单，这是一个非常酷的话题。

SVG 提供了一些图像编辑效果，比如屏蔽和剪裁、应用过滤器等等。

SVG 只是文本，因此可以使用 GZip 对其进行有效压缩。

## 标签

### \<svg>

\<svg>的width属性和height属性，指定了 SVG 图像在 HTML 元素中所占据的宽度和高度。

如果只想展示 SVG 图像的一部分，就要指定viewBox属性。

```html
<svg width="100" height="100" viewBox="50 50 50 50">
  <circle id="mycircle" cx="50" cy="50" r="50" />
</svg>
```

viewBox属性的值有四个数字，分别是左上角的横坐标和纵坐标、视口的宽度和高度。

如果不指定width属性和height属性，只指定viewBox属性，则相当于只给定 SVG 图像的长宽比。这时，SVG 图像的默认大小将等于所在的 HTML 元素的大小。

### \<circle>

\<circle>标签的cx、cy、r属性分别为横坐标、纵坐标和半径，单位为像素。坐标都是相对于\<svg>画布的左上角原点。

SVG 的 CSS 属性与网页元素有所不同。

- fill：填充色
- stroke：描边色
- stroke-width：边框宽度

### \<line>

\<line>标签用来绘制直线。

```html
<svg width="300" height="180">
  <line x1="0" y1="0" x2="200" y2="0" style="stroke:rgb(0,0,0);stroke-width:5" />
</svg>
```

上面代码中，\<line>标签的x1属性和y1属性，表示线段起点的横坐标和纵坐标；x2属性和y2属性，表示线段终点的横坐标和纵坐标；style属性表示线段的样式。

### \<polyline>

\<polyline>标签用于绘制一根折线。

```html
<svg width="300" height="180">
  <polyline points="3,3 30,28 3,53" fill="none" stroke="black" />
</svg>
```

\<polyline>的points属性指定了每个端点的坐标，横坐标与纵坐标之间与逗号分隔，点与点之间用空格分隔。

### \<path>

\<path>标签用于制路径。

```html
<svg height="300" width="300">
  <path d="M 100 100 L 200 200 H 10 V 40 H 70"
        fill="#59fa81" stroke="#d85b49" stroke-width="3" />
</svg>
```

\<path>的d属性表示绘制顺序，它的值是一个长字符串，每个字母表示一个绘制动作，后面跟着坐标。

- M 表示移动，它接受一组 x，y 坐标
- L 表示直线将绘制到它接受一组 x，y
- H 是一条水平线，它只接受 x 坐标
- V 是一条垂直线，它只接受 y 坐标
- Z 表示关闭路径，并将其放回起始位置
- A 表示 Arch，它自己需要一个完整的教程
- Q 是一条二次 Bezier 曲线，同样，它自己也需要一个完整的教程

### \<text>

\<text>标签用于绘制文本。

```html
<svg width="300" height="180">
  <text x="50" y="25">Hello World</text>
</svg>
```

\<text>的x属性和y属性，表示文本区块基线（baseline）起点的横坐标和纵坐标。文字的样式可以用class或style属性指定。

### \<g>

使用 g 元素，您可以对多个元素进行分组：

```html
<svg width="200" height="200">
  <rect x="0" y="0" width="100" height="100" fill="#529fca" />
  <g id="my-group">
    <rect x="0" y="100" width="100" height="100" fill="#59fa81" />
    <rect x="100" y="0" width="100" height="100" fill="#59fa81" />
  </g>
</svg>
```

### \<defs>

\<defs>标签用于自定义形状，它内部的代码不会显示，仅供引用。

```html
<svg width="300" height="100">
  <defs>
    <g id="myCircle">
      <text x="25" y="20">圆形</text>
      <circle cx="50" cy="50" r="20"/>
    </g>
  </defs>

  <use href="#myCircle" x="0" y="0" />
  <use href="#myCircle" x="100" y="0" fill="blue" />
  <use href="#myCircle" x="200" y="0" fill="white" stroke="blue" />
</svg>
```

### \<symbol>

symbol元素用来定义一个图形模板对象，它可以用一个\<use>元素实例化。symbol元素对图形的作用是在同一文档中多次使用，添加结构和语义。

```html
<svg>
<!-- symbol definition  NEVER draw -->
<symbol id="sym01" viewBox="0 0 150 110">
  <circle cx="50" cy="50" r="40" stroke-width="8" stroke="red" fill="red"/>
  <circle cx="90" cy="60" r="40" stroke-width="8" stroke="green" fill="white"/>
</symbol>

<!-- actual drawing by "use" element -->
<use xlink:href="#sym01"
     x="0" y="0" width="100" height="50"/>
<use xlink:href="#sym01"
     x="0" y="50" width="75" height="38"/>
<use xlink:href="#sym01"
     x="0" y="100" width="50" height="25"/>
</svg>
```

### \<use>

\<use>标签用于复制一个形状。

```html
<svg viewBox="0 0 30 10" xmlns="http://www.w3.org/2000/svg">
  <circle id="myCircle" cx="5" cy="5" r="4"/>

  <use href="#myCircle" x="10" y="0" fill="blue" />
  <use href="#myCircle" x="20" y="0" fill="white" stroke="blue" />
</svg>
```

\<use>的href属性指定所要复制的节点，x属性和y属性是\<use>左上角的坐标。另外，还可以指定width和height坐标。

## js操作

1. 如果 SVG 代码直接写在 HTML 网页之中，它就成为网页 DOM 的一部分，可以直接用 DOM 操作。

2. 使用\<object>、\<iframe>、\<embed>标签插入 SVG 文件，可以获取 SVG DOM。

3. 由于 SVG 文件就是一段 XML 文本，因此可以通过读取 XML 代码的方式，读取 SVG 源码。使用XMLSerializer实例的serializeToString()方法，获取 SVG 元素的代码。

4. 将SVG 图像转为 Canvas 图像。

    - 首先，需要新建一个Image对象，将 SVG 图像指定到该Image对象的src属性。
    - 然后，当图像加载完成后，再将它绘制到\<canvas>元素。

    ```js
    var img = new Image();
    var svg = new Blob([svgString], {type: "image/svg+xml;charset=utf-8"});

    var DOMURL = self.URL || self.webkitURL || self;
    var url = DOMURL.createObjectURL(svg);

    img.src = url;

    img.onload = function () {
      var canvas = document.getElementById('canvas');
      var ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
    };
    ```
