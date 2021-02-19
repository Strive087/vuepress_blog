# 回溯法原理

正则表达式匹配字符串的这种方式，有个学名，叫回溯法。

回溯法也称试探法，它的基本思想是：从问题的某一种状态（初始状态）出发，搜索从这种状态出发所能达到的所有“状态”，当一条路走到“尽头”的时候（不能再前进），再后退一步或若干步，从另一种可能“状态”出发，继续搜索，直到所有的“路径”（状态）都试探过。这种不断“前进”、不断“回溯”寻找解的方法，就称作“回溯法”。

本质上就是深度优先搜索算法。其中退到之前的某一步这一过程，我们称为“回溯”。从上面的描述过程中，可以看出，路走不通时，就会发生“回溯”。即，尝试匹配失败时，接下来的一步通常就是回溯。

例如：

![12da8829af2cb1d67ea78631d58be6ce](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/12da8829af2cb1d67ea78631d58be6ce.jpg)

目标字符串是"abbbc"，匹配过程是：

![dddfffaf633dd14c4eefba488f64400f](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/dddfffaf633dd14c4eefba488f64400f.jpg)

## 常见的回溯形式

### 贪婪量词

比如b{1,3}，因为其是贪婪的，尝试可能的顺序是从多往少的方向去尝试。首先会尝试"bbb"，然后再看整个正则是否能匹配。不能匹配时，吐出一个"b"，即在"bb"的基础上，再继续尝试。如果还不行，再吐出一个，再试。如果还不行呢？只能说明匹配失败了。

如果当多个贪婪量词挨着存在，前面的肯定先匹配，测试如下：

```js
var string = "12345";
var regex = /(\d{1,3})(\d{1,3})/;
console.log( string.match(regex) );
// => ["12345", "123", "45", index: 0, input: "12345"]
```

其中，前面的\d{1,3}匹配的是"123"，后面的\d{1,3}匹配的是"45"。

### 惰性量词

惰性量词就是在贪婪量词后面加个问号。表示尽可能少的匹配，比如：

```js
var string = "12345";
var regex = /(\d{1,3}?)(\d{1,3})/;
console.log( string.match(regex) );
// => ["1234", "1", "234", index: 0, input: "12345"]
```

其中\d{1,3}?只匹配到一个字符"1"，而后面的\d{1,3}匹配了"234"。

虽然惰性量词不贪，但也会有回溯的现象。比如正则是：

![0e29c26dd50349760d05935c5e93f07b](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/0e29c26dd50349760d05935c5e93f07b.jpg)

目标字符串是"12345"，匹配过程是：

![a2af73fc275cddf7c9c5fb5a786861c0](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/a2af73fc275cddf7c9c5fb5a786861c0.jpg)

### 分支结构

我们知道分支也是惰性的，比如/can|candy/，去匹配字符串"candy"，得到的结果是"can"，因为分支会一个一个尝试，如果前面的满足了，后面就不会再试验了。

分支结构，可能前面的子模式会形成了局部匹配，如果接下来表达式整体不匹配时，仍会继续尝试剩下的分支。这种尝试也可以看成一种回溯。

比如正则：

![4aedaeda72a6d291b9a8685cc0170347](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/4aedaeda72a6d291b9a8685cc0170347.jpg)

目标字符串是"candy"，匹配过程：

![d69d02dfe0712ee3d22d5bb1afcda0a2](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/d69d02dfe0712ee3d22d5bb1afcda0a2.jpg)
