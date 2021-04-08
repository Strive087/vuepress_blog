# 位置匹配

正则表达式是匹配模式，要么匹配字符，要么匹配位置。请记住这句话。

位置是相邻字符之间的位置。比如，下图中箭头所指的地方：

![95d0faf6b21f9414d24c8281b3046746](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/95d0faf6b21f9414d24c8281b3046746.jpg)

## 匹配位置

在ES5中，共有6个锚字符：

:::tip
^ $ \b \B (?=p) (?!p)
:::

### ^和$

^（脱字符）匹配开头，在多行匹配中匹配行开头。

$（美元符号）匹配结尾，在多行匹配中匹配行结尾。

比如我们把字符串的开头和结尾用"#"替换（位置可以替换成字符的！）：

```js
var result = "hello".replace(/^|$/g, '#');
console.log(result); 
// => "#hello#"
```

多行匹配模式时，二者是行的概念，这个需要我们的注意：

```js
var result = "I\nlove\njavascript".replace(/^|$/gm, '#');
console.log(result);
/*
#I#
#love#
#javascript#
*/
```

### \b和\B

\b是单词边界，具体就是\w和\W之间的位置，也包括\w和^之间的位置，也包括\w和$之间的位置。

比如一个文件名是"[JS] Lesson_01.mp4"中的\b，如下：

```js
var result = "[JS] Lesson_01.mp4".replace(/\b/g, '#');
console.log(result); 
// => "[#JS#] #Lesson_01#.#mp4#"
```

首先，我们知道，\w是字符组[0-9a-zA-Z_]的简写形式，即\w是字母数字或者下划线的中任何一个字符。而\W是排除字符组[^0-9a-zA-Z_]的简写形式，即\W是\w以外的任何一个字符。

此时我们可以看看"[#JS#] #Lesson_01#.#mp4#"中的每一个"#"，是怎么来的。

- 第一个"#"，两边是"\["与"J"，是\W和\w之间的位置。
- 第二个"#"，两边是"S"与"\]"，也就是\w和\W之间的位置。
- 第三个"#"，两边是空格与"L"，也就是\W和\w之间的位置。
- 第四个"#"，两边是"1"与"."，也就是\w和\W之间的位置。
- 第五个"#"，两边是"."与"m"，也就是\W和\w之间的位置。
- 第六个"#"，其对应的位置是结尾，但其前面的字符"4"是\w，即\w和$之间的位置。

知道了\b的概念后，那么\B也就相对好理解了。

\B就是\b的反面的意思，非单词边界。例如在字符串中所有位置中，扣掉\b，剩下的都是\B的。

具体说来就是\w与\w、\W与\W、^与\W，\W与$之间的位置。

比如上面的例子，把所有\B替换成"#"：

```js
var result = "[JS] Lesson_01.mp4".replace(/\B/g, '#');
console.log(result); 
// => "#[J#S]# L#e#s#s#o#n#_#0#1.m#p#4"
```

### (?=p)和(?!p)

(?=p)，其中p是一个子模式，即p前面的位置。

比如(?=l)，表示'l'字符前面的位置，例如：

```js
var result = "hello".replace(/(?=l)/g, '#');
console.log(result); 
// => "he#l#lo"
```

而(?!p)就是(?=p)的反面意思，比如：

```js
var result = "hello".replace(/(?!l)/g, '#');

console.log(result); 
// => "#h#ell#o#"
```

(?=p)，一般都理解成：要求接下来的字符与p匹配，但不能包括p的那些字符。

而在本人看来(?=p)就与^一样好理解，就是p前面的那个位置。

## 位置的特性

对于位置的理解，我们可以理解成空字符""。

比如"hello"字符串等价于如下的形式：

```markdown
"hello" == "" + "h" + "" + "e" + "" + "l" + "" + "l" + "o" + "";
```

也等价于：

```markdown
"hello" == "" + "" + "hello"
```

因此，把/^hello$/写成/^^hello?$/，是没有任何问题的：

```js
var result = /^^hello?$/.test("hello");
console.log(result); 
// => true
```

甚至可以写成更复杂的:

```js
var result = /(?=he)^^he(?=\w)llo$\b\b$/.test("hello");
console.log(result); 
// => true
```

也就是说字符之间的位置，可以写成多个。

把位置理解空字符，是对位置非常有效的理解方式。
