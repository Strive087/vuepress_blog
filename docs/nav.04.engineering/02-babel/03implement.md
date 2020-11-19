# 实现原理

## 运行原理

Babel 的三个主要处理步骤分别是：

解析（parse），转换（transform），生成（generate）。

![babel](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/167019b7916707b1.jpg)

### 解析

使用 babylon 解析器对输入的源代码字符串进行解析并生成初始 AST（File.prototype.parse）

利用 babel-traverse 这个独立的包对 AST 进行遍历，并解析出整个树的 path，通过挂载的 metadataVisitor 读取对应的元信息，这一步叫 set AST 过程。

### 转换

遍历AST树并应用各transformers生成变化换后的AST树，babel 中最核心的是babel-core，它对外暴露babel.transform的借口，可用来对AST树的转换，生成转换后的AST树。

```js
let result = babel.transform(code, {
    plugins: [
        arrayPlugin
    ]
})

```

### 生成

生成则是利用 babel-generator 将 AST 树输出为转码后的代码字符串。

## AST解析

## 参考链接

- [babel官网](https://babeljs.io/docs/en/babel-preset-env)
- [babel插件入门](https://juejin.im/post/6844903583549243406)
- [babel原理及插件开发](https://juejin.im/post/6844903603983892487)
