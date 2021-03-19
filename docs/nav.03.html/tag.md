# h5常用标签

## html文档标签

1. <!DOCTYPE>: 定义文档类型.
2. \<html>: 定义HTML文档.
3. \<head>: 定义文档的头部.(头部内包含)

    1. `<meta>`: 定义元素可提供有关页面的元信息，比如针对搜索引擎和更新频度的描述和关键词.
    2. `<base>`:定义页面上的所有链接规定默认地址或默认目标.

        ```html
        <head>
        <base href="http://www.w3chtml.com/html5/" target="_blank" />
        </head>
        
        <body>
        <!-- 以base设定的默认地址为基准 -->
        <a href="index.html">w3c html5</a>
        </body>
        ```

    3. `<title>`: 定义文档的标题.
    4. `<link>`: 定义文档与外部资源的关系.
    5. `<style>`:定义 HTML 文档样式信息.

4. \<body>: 定义文档的主体.(脚本在非必须情况时在主体内容最后)

    1. `<script>`: 定义客户端脚本，比如 JavaScript.
    2. `<noscript>`:定义在脚本未被执行时的替代内容.（文本）

## 布局标签

1. \<div>:定义块级元素.
2. \<span>:定义行內元素.
3. \<header>:定义区段或页面的页眉.(头部)
4. \<footer>:定义区段或页面的页脚.(足部)
5. \<section>:定义文档中的区段.比如章节、页眉、页脚或文档中的其他部分.
6. \<article>:定义文章.
7. \<aside>:定义页面内容之外的内容.\<aside> 的内容可用作文章的侧栏。
8. \<details>:定义元素的细节.
9. \<summary>:定义 \<details> 元素可见的标题.

    ```html
    <details>
    <summary>HTML 5</summary>
    This document teaches you everything you have to learn about HTML 5.
    </details>
    ```

10. \<dialog>:定义对话框或窗口.
11. \<nav>:定义导航.

    ```html
    <nav>
    <a href="/html5/tag/">Home</a>
    <a href="html5/tag/meter.html">Previous</a>
    <a href="html5/tag/noscript.html">Next</a>
    </nav>
    ```

12. \<hgroup>:定义标题组

    ```html
    <!-- 使用 <hgroup> 标签对网页或区段（section）的标题进行组合 -->
    <hgroup>
      <h1>Welcome to my WWF</h1>
      <h2>For a living planet</h2>
    </hgroup>
    ```

## 表格标签

1. \<table>:定义表格.
2. \<thead>:定义页眉.
3. \<tbody>:定义主体.
4. \<tfoot>:定义页脚.
5. \<caption>:定义标题.
6. \<th>:定义表头.
7. \<tr>:定义一行.
8. \<td>:定义单元格.

## 表单标签

1. \<form>:定义表单.(表单包含在form标签中)
2. \<input>:定义输入域.
3. \<textarea>:定义文本域.(多行)
4. \<label>:定义一个控制的标签.(input 元素的标注)
5. \<fieldset>:定义域.
6. \<legend>:定义域的标题.

    ```html
    <form>
      <fieldset>
        <legend>Personalia:</legend>
        Name: <input type="text" /><br />
        Email: <input type="text" /><br />
        Date of birth: <input type="text" />
      </fieldset>
    </form>
    ```

7. \<select>:定义一个选择列表.
8. \<optgroup>:定义选择组.
9. \<option>:定义下拉 列表的选项.
10. \<button>:定义按钮.(定义围绕表单中元素的边框.)
11. \<legend>:定义 fieldset 元素的标题.
12. \<keygen>:定义表单的密钥对生成器字段.当提交表单时，私钥存储在本地，公钥发送到服务器。

    ```html
    <form action="demo_keygen.asp" method="get">
    Username: <input type="text" name="usr_name" />
    Encryption: <keygen name="security" />
    <input type="submit" />
    </form>
    ```

13. \<output>:定义不同类型的输出，比如脚本的输出.

## 列表标签

1. \<ul>:定义无序列表.
2. \<ol>:定义有序列表.
3. \<li>:定义列表项.
4. \<dl>:定义自定义列表.
5. \<dt>:定义自定义列表项.
6. \<dd>:定义自定义的描述.

## 图像&链接标签

1. \<img>:定义图像.注意加上alt属性
2. \<a>:定义超链接.
3. \<map>:定义图像映射。图像映射指的是带有可点击区域的图像。
4. \<area>:定义图像地图内部的区域.

    ```html
    <map name="planetmap">
    <area shape ="rect" coords ="0,0,110,260" href ="sun.htm" alt="Sun" />
    <area shape ="circle" coords ="129,161,10" href ="mercur.htm" alt="Mercury" />
    <area shape ="circle" coords ="180,139,14" href ="venus.htm" alt="Venus" />
    </map>
    ```

5. \<figure>:标签规定独立的流内容（图像、图表、照片、代码等等）.figure 元素的内容应该与主内容相关，但如果被删除，则不应对文档流产生影响。
6. \<figcaption>:定义 \<figure> 元素的标题.

    ```html
    <figure>
      <figcaption>黄浦江上的的卢浦大桥</figcaption>
      <img src="shanghai_lupu_bridge.jpg" width="350" height="234" />
    </figure>
    ```

## 音频\视频

1. \<audio>:定义声音内容.
2. \<source>:定义媒介源.浏览器应该选择它所支持的文件.

    ```html
    <audio controls>
      <source src="horse.ogg" type="audio/ogg">
      <source src="horse.mp3" type="audio/mpeg">
    Your browser does not support the audio element.
    </audio> 
    ```

3. \<video>:定义视频.
4. \<track>:定义用在媒体播放器中的文本轨道.播放带有字幕的视频.

    ```html
    <video width="320" height="240" controls="controls">
      <source src="forrest_gump.mp4" type="video/mp4" />
      <source src="forrest_gump.ogg" type="video/ogg" />
      <track kind="subtitles" src="subs_chi.srt" srclang="zh" label="Chinese">
      <track kind="subtitles" src="subs_eng.srt" srclang="en" label="English">
    </video>
    ```

## 框架标签

1. \<ifarme>:内联框架

## 格式标签

### 文章标签

1. \<h1>-\<h6>:定义 HTML 标题.
2. \<p>:定义段落.
3. \<br>:定义换行.
4. \<hr>:定义水平线.
5. \<bdo>:定义文字方向.

    ```html
    <bdo dir="rtl">Here is some text</bdo>
    ```

6. \<pre>:定义预格式文本.常见应用就是用来表示计算机的源代码。
7. \<abbr>:定义缩写.

    ```html
    The <abbr title="People's Republic of China">PRC</abbr> was founded in 1949.
    ```

8. \<address>:定义文档作者或拥有者的联系信息.
9. \<ins>:定义被插入文本.
10. \<del>:定义被删除文本.
11. \<time>:定义日期/时间.

### 短语元素标签

1. \<em>:定义强调文本.
2. \<strong>:定义语气更为强烈的强调文本.
3. \<dfn>:定义定义项目.
4. \<code>:定义计算机代码文本.
5. \<samp>:定义计算机代码样本.
6. \<kbd>:定义键盘文本.
7. \<var>:定义文本的变量部分.
8. \<sup>:定义上标文本.
9. \<sub>:定义下标文本.
10. \<cite>:定义引用.
11. \<blockguote>:定义长的引用.
12. \<q>:定义短的引用.

### 字体样式标签

1. \<i>:显示斜体文本效果.
2. \<b>:呈现粗体文本效果.
3. \<big>:呈现大号字体效果.
4. \<small>:呈现小号字体效果.
5. \<mark>:定义有记号的文本.

## 其它

1. \<canvas>:定义图形容器，必须使用脚本来绘制图形。
2. \<meter>:定义预定义范围内的度量.

    ```html
    <meter value="3" min="0" max="10">十分之三</meter>
    <meter value="0.6">60%</meter> 
    ```

3. \<progress>:定义任何类型的任务的进度.

    ```html
    <progress value="22" max="100"></progress> 
    ```
