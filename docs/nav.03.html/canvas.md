# Canvas

![lOAbwU](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/lOAbwU.png)

Canvas是 HTML5 提供的一种新标签，是一个矩形区域的画布，可以用 JavaScript 在上面绘画。控制其每一个像素。canvas 标签使用 JavaScript 在网页上绘制图像，本身不具备绘图功能。canvas 拥有多种绘制路径、矩形、圆形、字符以及添加图像的方法。

## 领域

1. 游戏：canvas 在基于 Web 的图像显示方面比 Flash 更加立体、更加精巧，canvas 游戏在流畅度和跨平台方面更牛。
2. 可视化数据.数据图表话，比如:百度的 echart
3. banner 广告：Flash 曾经辉煌的时代，智能手机还未曾出现。现在以及未来的智能机时代，HTML5 技术能够在 banner 广告上发挥巨大作用，用 Canvas 实现动态的广告效果再合适不过。
4. 其他可嵌入网站的内容(多用于活动页面、特效)：类似图表、音频、视频，还有许多元素能够更好地与 Web 融合，并且不需要任何插件。
5. 完整的 canvas 移动化应用
...

## 画布功能

### 栅格

![oaQXgl](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/oaQXgl.png)

在我们开始画图之前，我们需要了解一下画布栅格（canvas grid）以及坐标空间。上一页中的HTML模板中有个宽150px, 高150px的canvas元素。如右图所示，canvas元素默认被网格所覆盖。通常来说网格中的一个单元相当于canvas元素中的一像素。栅格的起点为左上角（坐标为（0,0））。所有元素的位置都相对于原点定位。所以图中蓝色方形左上角的坐标为距离左边（X轴）x像素，距离上边（Y轴）y像素（坐标为（x,y））。在课程的最后我们会平移原点到不同的坐标上，旋转网格以及缩放。现在我们还是使用原来的设置。

### 绘制

创建canvas元素时至少要设置width和height属性。出现在开始和结束标签中的内容是后备数据，会在浏览器不支持canvas的时候显示

```html
<canvas id="draw" width="200" height="200">no support</canvas>
```

要在画布上绘制图像，首先要获取绘图上下文，getContext()方法获取上下文引用。对于平面图像，需要传入参数"2d",表示获取2D上下文对象。

```js
let draw = document.getElementById('draw');
if(draw.getContext){
  let context = draw.getContext('2d');
}
```

#### 矩形

不同于 SVG，\<canvas> 只支持两种形式的图形绘制：矩形和路径（由一系列点连成的线段）。所有其他类型的图形都是通过一条或者多条路径组合而成的。不过，我们拥有众多路径生成的方法让复杂图形的绘制成为了可能。

首先，我们回到矩形的绘制中。canvas提供了三种方法绘制矩形：

- fillRect(x, y, width, height)：绘制一个填充的矩形
- strokeRect(x, y, width, height)：绘制一个矩形的边框
- clearRect(x, y, width, height)：清除指定矩形区域，让清除部分完全透明

#### 路径

图形的基本元素是路径。路径是通过不同颜色和宽度的线段或曲线相连形成的不同形状的点的集合。一个路径，甚至一个子路径，都是闭合的。使用路径绘制图形需要一些额外的步骤。

1. 首先，你需要创建路径起始点。
2. 然后你使用画图命令去画出路径。
3. 之后你把路径封闭。
4. 一旦路径生成，你就能通过描边或填充路径区域来渲染图形。

以下是所要用到的函数：

- beginPath()：新建一条路径，生成之后，图形绘制命令被指向到路径上生成路径。
- closePath()：闭合路径之后图形绘制命令又重新指向到上下文中。
- stroke()：通过线条来绘制图形轮廓。
- fill()：通过填充路径的内容区域生成实心的图形。

生成路径的第一步叫做beginPath()。本质上，路径是由很多子路径构成，这些子路径都是在一个列表中，所有的子路径（线、弧形、等等）构成图形。而每次这个方法调用之后，列表清空重置，然后我们就可以重新绘制新的图形。

第二步就是调用函数指定绘制路径，本文稍后我们就能看到了。

第三，就是闭合路径closePath(),不是必需的。这个方法会通过绘制一条从当前点到开始点的直线来闭合图形。如果图形是已经闭合了的，即当前点为开始点，该函数什么也不做。

例如，绘制三角形的代码如下：

```js
function draw() {
  var canvas = document.getElementById('canvas');
  if (canvas.getContext) {
    var ctx = canvas.getContext('2d');

    ctx.beginPath();
    ctx.moveTo(75, 50);
    ctx.lineTo(100, 75);
    ctx.lineTo(100, 25);
    ctx.fill();
  }
}
```
