# 概述

## 什么是Babel

简来说Babel就是JavaScript转化成更加通用的es5语法。

## Babel使用方法

1. 使用单体文件 (standalone script)
2. 命令行 (cli)
3. 构建工具的插件 (webpack 的 babel-loader, rollup 的 rollup-plugin-babel)。
其中后面两种比较常见。第二种多见于 package.json 中的 scripts 段落中的某条命令；第三种就直接集成到构建工具中。

这三种方式只有入口不同而已，调用的 babel 内核，处理方式都是一样的，所以我们先不纠结入口的问题。

## Babel运行方式和插件

Babel 总共分为三个阶段：解析=>转换=>生成。

babel 本身不具有任何转化功能，它把转化的功能都分解到一个个 plugin 里面。因此当我们不配置任何插件时，经过 babel 的代码和输入是相同的。

插件总共分为三种：

- syntax 语法类
- transform 转换类
- proposal 也是转换类，指代那些对ES Proposal进行转换的plugin。

语法类插件用来解析语法生成AST抽象语法树，然后通过转换类插件生成配置语法的AST，然后生成配置语法的代码。

![babel](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/167019b7916707b1.jpg)

syntax类plugin用于ES新语法的转换，其实也是使用的时候必须的，但是当使用某一个transform类或proposal类的插件时，如果需要做某个语法转换，则相应的syntax类插件，会自动启用，所以在使用babel的时候，syntax类plugin，不需要单独配置。

## 执行顺序

- Plugin 会运行在 Preset 之前。
- Plugin 会从前到后顺序执行。
- Preset 的顺序则 刚好相反(从后向前)。

preset 的逆向顺序主要是为了保证向后兼容。我们编排 preset 的时候，其实只要按照规范的时间顺序列出即可。

## 最新Babel的相关npm包

从babel7.0开始，babel一系列的包都以@babel开头，这个跟babel没关系，是npm包的一种形式。

@符号开始的包，代表的是一类有scope限定的npm包。scope通常的含义代表的就是一个公司或者一个机构、甚至个人，它的作用就是将同一个主体的相关包都集中在一个范围内来组织和管理，这个范围就是scope。这类有scope的包，最大的好处就是只有scope的主体公司、机构和个人，才能往这个scope里面添加新的包，别人都不行；也就是说以@开头的npm包，一定是官方自己推出或者官方认可推出的包，比较有权威性质。

普通的包，安装在node_modules/packagename这个文件夹下，而scope包，则安装在node_modules/@myorg/mypackage这个文件夹下，相比之下，scope包多了一层@myorg的文件夹。

## 参考链接

- [一口（很长的）气了解 babel](https://zhuanlan.zhihu.com/p/43249121)
- [babel插件入门-AST](https://juejin.im/post/6844903583549243406)
