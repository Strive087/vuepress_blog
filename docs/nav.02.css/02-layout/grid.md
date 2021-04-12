# Grid布局

grid 布局是W3C提出的一个二维布局系统，通过 display: grid 来设置使用，对于以前一些复杂的布局能够得到更简单的解决。

![DtPDZ5](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/DtPDZ5.png)

Grid 布局与 Flex 布局有一定的相似性，都可以指定容器内部多个项目的位置。但是，它们也存在重大区别。

Flex 布局是轴线布局，只能指定"项目"针对轴线的位置，可以看作是一维布局。Grid 布局则是将容器划分成"行"和"列"，产生单元格，然后指定"项目所在"的单元格，可以看作是二维布局。Grid 布局远比 Flex 布局强大。

## 基本概念

### 容器和项目

采用网格布局的区域，称为"容器"（container）。容器内部采用网格定位的子元素，称为"项目"（item）。

注意：项目只能是容器的顶层子元素，不包含项目的子元素。

### 行和列

![v9ue3P](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/v9ue3P.png)

### 单元格

行和列的交叉区域，称为"单元格"（cell）。

### 网格线

划分网格的线，称为"网格线"（grid line）。水平网格线划分出行，垂直网格线划分出列。

![6Biqpb](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/6Biqpb.png)

## 容器属性

### display

- grid：指定一个容器采用网格布局。
- inline-grid：指定是一个行内元素，该元素内部采用网格布局。

注意，设为网格布局以后，容器子元素（项目）的float、display: inline-block、display: table-cell、vertical-align和column-*等设置都将失效。

### grid-template-columns和grid-template-rows

容器指定了网格布局以后，接着就要划分行和列。grid-template-columns属性定义每一列的列宽，grid-template-rows属性定义每一行的行高。

```css
.container {
  display: grid;
  grid-template-columns: 100px 100px 100px;
  grid-template-rows: 100px 100px 100px;
}
```

上面代码指定了一个三行三列的网格，列宽和行高都是100px。除了使用绝对单位，也可以使用百分比。

#### repea

有时候重复写值麻烦可以使用`repeat()`：

```css
.container {
  display: grid;
  grid-template-columns: repeat(2, 100px 20px 80px);
  grid-template-rows: repeat(3, 33.33%);
}
```

#### auto-fill

有时，单元格的大小是固定的，但是容器的大小不确定。如果希望每一行（或每一列）容纳尽可能多的单元格，这时可以使用`auto-fill`关键字表示自动填充。

```css
.container {
  display: grid;
  grid-template-columns: repeat(auto-fill, 100px);
}
```

#### fr 关键字

为了方便表示比例关系，网格布局提供了fr关键字（fraction 的缩写，意为"片段"）。如果两列的宽度分别为1fr和2fr，就表示后者是前者的两倍。fr可以与绝对长度的单位结合使用，这时会非常方便。

```css
.container {
  display: grid;
  grid-template-columns: 150px 1fr 2fr;
}
```

上面代码表示，第一列的宽度为150像素，第二列的宽度是第三列的一半。

![0cK55U](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/0cK55U.png)

#### minmax()

minmax()函数产生一个长度范围，表示长度就在这个范围之中。它接受两个参数，分别为最小值和最大值。

```css
grid-template-columns: 1fr 1fr minmax(100px, 1fr);
```

上面代码中，minmax(100px, 1fr)表示列宽不小于100px，不大于1fr。

#### auto 关键字

auto关键字表示由浏览器自己决定长度。

```css
grid-template-columns: 100px auto 100px;
```

上面代码中，第二列的宽度，基本上等于该列单元格的最大宽度，除非单元格内容设置了min-width，且这个值大于最大宽度。

#### 网格线的名称

grid-template-columns属性和grid-template-rows属性里面，还可以使用方括号，指定每一根网格线的名字，方便以后的引用。

```css
.container {
  display: grid;
  grid-template-columns: [c1] 100px [c2] 100px [c3] auto [c4];
  grid-template-rows: [r1] 100px [r2] 100px [r3] auto [r4];
}
```

上面代码指定网格布局为3行 x 3列，因此有4根垂直网格线和4根水平网格线。方括号里面依次是这八根线的名字。

网格布局允许同一根线有多个名字，比如[fifth-line row-5]。

### row-gap、column-gap和gap 

row-gap属性设置行与行的间隔（行间距），column-gap属性设置列与列的间隔（列间距）。

gap属性是column-gap和row-gap的合并简写形式。如果grid-gap省略了第二个值，浏览器认为第二个值等于第一个值。

```css
.container {
  gap: 20px 20px;
}
```

### grid-template-areas

网格布局允许指定"区域"（area），一个区域由单个或多个单元格组成。grid-template-areas属性用于定义区域。

```css
.container {
  display: grid;
  grid-template-columns: 100px 100px 100px;
  grid-template-rows: 100px 100px 100px;
  grid-template-areas: 'a b c'
                       'd e f'
                       'g h i';
}
```

上面代码先划分出9个单元格，然后将其定名为a到i的九个区域，分别对应这九个单元格。

如果某些区域不需要利用，则使用"点"（.）表示。

### grid-auto-flow

划分网格以后，容器的子元素会按照顺序，自动放置在每一个网格。默认的放置顺序是"先行后列"，即先填满第一行，再开始放入第二行，即下图数字的顺序。这个顺序由grid-auto-flow属性决定，默认值是row。

取值如下：

- row：先行后列
- column：先列后行
- row dense：先行后列并尽可能紧凑
- column dense：先列后行并尽可能紧凑

### justify-items、align-items和place-items

justify-items属性设置单元格内容的水平位置（左中右），align-items属性设置单元格内容的垂直位置（上中下）。

![8YIJec](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/8YIJec.png)

这两个属性的写法完全相同，都可以取下面这些值。

- start：对齐单元格的起始边缘。
- end：对齐单元格的结束边缘。
- center：单元格内部居中。
- stretch：拉伸，占满单元格的整个宽度（默认值）。

place-items属性是align-items属性和justify-items属性的合并简写形式。

### justify-content、align-content和place-content

justify-content属性是整个内容区域在容器里面的水平位置（左中右），align-content属性是整个内容区域的垂直位置（上中下）。

![VL8gxP](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/VL8gxP.png)

取值如下：

- start：对齐容器的起始边框。
- end：对齐容器的结束边框。
- center：容器内部居中。
- stretch：项目大小没有指定时，拉伸占据整个网格容器。
- space-around：每个项目两侧的间隔相等。所以，项目之间的间隔比项目与容器边框的间隔大一倍。
- space-between：项目与项目的间隔相等，项目与容器边框之间没有间隔。
- space-evenly：项目与项目的间隔相等，项目与容器边框之间也是同样长度的间隔。

place-content属性是align-content属性和justify-content属性的合并简写形式。

### grid-auto-columns和grid-auto-rows

有时候，一些项目的指定位置，在现有网格的外部。比如网格只有3列，但是某一个项目指定在第5行。这时，浏览器会自动生成多余的网格，以便放置项目。

grid-auto-columns属性和grid-auto-rows属性用来设置，浏览器自动创建的多余网格的列宽和行高。它们的写法与grid-template-columns和grid-template-rows完全相同。如果不指定这两个属性，浏览器完全根据单元格内容的大小，决定新增网格的列宽和行高。

```css
.container {
  display: grid;
  grid-template-columns: 100px 100px 100px;
  grid-template-rows: 100px 100px 100px;
  grid-auto-rows: 50px; 
}
```

![fR4ejg](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/fR4ejg.png)

### grid-template和grid

grid-template属性是grid-template-columns、grid-template-rows和grid-template-areas这三个属性的合并简写形式。

grid属性是grid-template-rows、grid-template-columns、grid-template-areas、 grid-auto-rows、grid-auto-columns、grid-auto-flow这六个属性的合并简写形式。

## 项目属性

### grid-column-start、grid-column-end、grid-row-start和grid-row-end

项目的位置是可以指定的，具体方法就是指定项目的四个边框，分别定位在哪根网格线

- grid-column-start属性：左边框所在的垂直网格线
- grid-column-end属性：右边框所在的垂直网格线
- grid-row-start属性：上边框所在的水平网格线
- grid-row-end属性：下边框所在的水平网格线

```css
.item-1 {
  grid-column-start: 2;
  grid-column-end: 4;
}
```

上面代码指定，1号项目的左边框是第二根垂直网格线，右边框是第四根垂直网格线。

![bdYURE](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/bdYURE.png)

除了1号项目以外，其他项目都没有指定位置，由浏览器自动布局，这时它们的位置由容器的grid-auto-flow属性决定，这个属性的默认值是row，因此会"先行后列"进行排列。

除了指定为第几个网格线，还可以指定为网格线的名字。

这四个属性的值还可以使用span关键字，表示"跨越"，即左右边框（上下边框）之间跨越多少个网格。

```css
.item-1 {
  grid-column-start: span 2;
}
```

上面代码表示，1号项目的左边框距离右边框跨越2个网格。

![7D85YX](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/7D85YX.png)

### grid-column和grid-row

grid-column属性是grid-column-start和grid-column-end的合并简写形式，grid-row属性是grid-row-start属性和grid-row-end的合并简写形式。

```css
.item-1 {
  grid-column: 1 / 3;
  grid-row: 1 / 2;
}
/* 等同于 */
.item-1 {
  grid-column-start: 1;
  grid-column-end: 3;
  grid-row-start: 1;
  grid-row-end: 2;
}
```

![6oANgf](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/6oANgf.png)

### grid-area

grid-area属性指定项目放在哪一个区域。

### justify-self、align-self和place-self

justify-self属性设置单元格内容的水平位置（左中右），跟justify-items属性的用法完全一致，但只作用于单个项目。

align-self属性设置单元格内容的垂直位置（上中下），跟align-items属性的用法完全一致，也是只作用于单个项目。

place-self属性是align-self属性和justify-self属性的合并简写形式。

参考链接：

- [CSS Grid 网格布局教程](https://www.ruanyifeng.com/blog/2019/03/grid-layout-tutorial.html)