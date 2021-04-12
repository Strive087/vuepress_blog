# Flex布局

2009年，W3C 提出了一种新的方案----Flex 布局，可以简便、完整、响应式地实现各种页面布局。目前，它已经得到了所有浏览器的支持，这意味着，现在就能很安全地使用这项功能。

![gAhih5](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/gAhih5.jpg)

Flex 是 Flexible Box 的缩写，意为"弹性布局"，用来为盒状模型提供最大的灵活性。

## 基本概念

采用 Flex 布局的元素，称为 Flex 容器（flex container），简称"容器"。它的所有子元素自动成为容器成员，称为 Flex 项目（flex item），简称"项目"。

![RM5xN2](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/RM5xN2.png)

## 容器的属性

### display

任何一个容器都可以指定为 Flex 布局，可取值：

- flex
- inline-flex

设为 Flex 布局以后，子元素的float、clear和vertical-align属性将失效。

### flex-direction

决定主轴的方向（即项目的排列方向），取值如下：

- row（默认值）：主轴为水平方向，起点在左端。
- row-reverse：主轴为水平方向，起点在右端。
- column：主轴为垂直方向，起点在上沿。
- column-reverse：主轴为垂直方向，起点在下沿。

![YuyqMv](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/YuyqMv.png)

### flex-wrap

flex-wrap属性定义，如果一条轴线排不下，如何换行，取值如下：

- nowrap：不换行
- wrap：换行，第一行在上方
- wrap-reverse：换行，第一行在下方

### flex-flow

flex-flow属性是flex-direction属性和flex-wrap属性的简写形式，默认值为row nowrap。

### justify-content

justify-content属性定义了项目在主轴上的对齐方式，取值如下：

- flex-start（默认值）：左对齐
- flex-end：右对齐
- center： 居中
- space-between：两端对齐，项目之间的间隔都相等。
- space-around：每个项目两侧的间隔相等。所以，项目之间的间隔比项目与边框的间隔大一倍。

![LE0AwZ](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/LE0AwZ.png)

### align-items

align-content属性定义了多根轴线的对齐方式。如果项目只有一根轴线，该属性不起作用，取值如下：

- flex-start：与交叉轴的起点对齐。
- flex-end：与交叉轴的终点对齐。
- center：与交叉轴的中点对齐。
- space-between：与交叉轴两端对齐，轴线之间的间隔平均分布。
- space-around：每根轴线两侧的间隔都相等。所以，轴线之间的间隔比轴线与边框的间隔大一倍。
- stretch（默认值）：轴线占满整个交叉轴。

![b3iamk](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/b3iamk.png)

## 项目的属性

### order

order属性定义项目的排列顺序。数值越小，排列越靠前，默认为0。

![ddedHu](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/ddedHu.png)

### flex-grow

flex-grow属性定义项目的放大比例，默认为0，即如果存在剩余空间，也不放大。

![6AD9O3](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/6AD9O3.png)

### flex-shrink

flex-shrink属性定义了项目的缩小比例，默认为1，即如果空间不足，该项目将缩小。

![J4r0DX](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/J4r0DX.jpg)

### flex-basis

flex-basis属性定义了在分配多余空间之前，项目占据的主轴空间（main size）。浏览器根据这个属性，计算主轴是否有多余空间。

它的默认值为auto，即项目的本来大小。它可以设为跟width或height属性一样的值（比如350px），则项目将占据固定空间。

### flex

flex属性是flex-grow, flex-shrink 和 flex-basis的简写，默认值为0 1 auto。后两个属性可选。

### align-self

align-self属性允许单个项目有与其他项目不一样的对齐方式，可覆盖align-items属性。默认值为auto，表示继承父元素的align-items属性，如果没有父元素，则等同于stretch。

![F1as15](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/F1as15.png)

该属性可能取6个值，除了auto，其他都与align-items属性完全一致。
