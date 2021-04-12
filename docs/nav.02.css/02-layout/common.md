# 常用布局

## 水平居中

```html
<div class="parent">
    <div class="child"></div>
</div>
```

子元素为

- 行内元素：对父元素设置text-align:center;
- 定宽块状元素: 设置左右margin值为auto;
- 不定宽块状元素: 设置子元素为display:inline,然后在父元素上设置text-align:center;
- 通用方案: flex布局，对父元素设置display:flex;justify-content:center;

## 垂直居中

- 父元素一定，子元素为单行内联文本：设置父元素的height等于行高line-height
- 父元素一定，子元素为多行内联文本：设置父元素的display:table-cell或inline-block，再设置vertical-align:middle;
- 块状元素:设置子元素position:absolute 并设置top、bottom为0，父元素要设置定位为static以外的值，margin:auto;
- 通用方案: flex布局，给父元素设置{display:flex; align-items:center;}。

## 单列布局

![1M8AQ9](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/1M8AQ9.png)

常见的单列布局有两种：

- 一种是header、content、footer宽度都相同，其一般不会占满浏览器的最宽宽度，但当浏览器宽度缩小低于其最大宽度时，宽度会自适应。
- 一种是header、footer宽度为浏览器宽度，但content以及header和footer里的内容却不会占满浏览器宽度。

对于第一种，对header、content、footer统一设置width或max-width，并通过margin:auto实现居中。

对于第二种，header、footer的内容宽度为100%，但header、footer的内容区以及content统一设置width 或 max-width，并通过margin:auto实现居中。

## 多列布局

![7Zk3Zn](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/7Zk3Zn.png)

