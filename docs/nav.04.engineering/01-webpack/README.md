# Webpack概述

## 简述

本质上，webpack 是一个现代 JavaScript 应用程序的静态模块打包器( module bundler )。当 webpack 处理应用程序时，它会递归地构建一个依赖关系图( dependency graph )，其中包含应用程序需要的每个模块，然后将所有这些模块打包成一个或多个 bundle。配合 loader 的使用 webpack 可以将 CSS 、IMG 等文件当做一个个模块进行打包输出。

![weppack](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/%E6%88%AA%E5%B1%8F2020-11-11%20%E4%B8%8B%E5%8D%887.15.59.png)

## 核心概念

从 webpack v4.0.0 开始，可以不用引入一个配置文件。然而，webpack 仍然还是高度可配置。在编写配置文件之前我们需要先理解以下几个概念：

### Entry 入口

入口起点(entry point)指示 webpack 应该使用哪个模块，来作为构建其内部依赖图的开始。进入入口起点后，webpack 会找出有哪些模块和库是入口起点（直接和间接）依赖的。
entry 类型有三种：字符串、数组、对象。

- String ："./src/entry" 入口模块的文件路径，可以是相对路径
- Array : ["./src/entry1", "./src/entry2"] 入口模块的文件路径，可以是相对路径。与字符串类型不同的是数组可将多个文件打包为一个文件
- Object ： { a: './src/entry-a', b: ['./src/entry-b1', './app/entry-b2']} 配置多个入口，每个入口有一个 Chunk

### Output 输出结果

output 属性告诉 webpack 在哪里输出它所创建的 bundles，以及如何命名这些文件，默认值为 ./dist。output 是一个 object，里面包含一系列配置项。

- filename 用于输出文件的文件名。
- path 目标输出目录的绝对路径，必须是绝对路径。
- publicPath path的公共路径

### Module 模块

对比 Node.js 模块，webpack 模块能够以各种方式表达它们的依赖关系，几个例子如下：

- ES2015 import 语句
- CommonJS require() 语句
- AMD define 和 require 语句
- css/sass/less 文件中的 @import 语句。
- 样式(url(...))或 HTML 文件(\<img src=...\>)中的图片链接(image url)。

module 配置如何处理模块。webpack 通过 loader 可以支持各种语言和预处理器编写模块。loader 描述了 webpack 如何处理 非 JavaScript(non-JavaScript) _模块_，并且在 bundle 中引入这些依赖。

### Loader 模块转换器

loader 让 webpack 能够去处理那些非 JavaScript 文件（webpack 自身只理解 JavaScript ）。

- 配置文件
配置里的 module.rules 数组配置了一组规则，告诉 Webpack 在遇到哪些文件时使用哪些 Loader 去加载和转换。

```js
//例子
module: {
  rules: [
    {
      test: /\.css$/,
      use: [
        { loader: 'style-loader' },
        {
          loader: 'css-loader',
          options: {
            modules: true
          }
        }
      ]
    }
  ]
}
```

- 内联
可以在 import 语句或任何等效于 "import" 的方式中指定 loader。使用 ! 将资源中的 loader 分开。分开的每个部分都相对于当前目录解析。

```js
import Styles from 'style-loader!css-loader?modules!./styles.css';
```

通过前置所有规则及使用 !，可以对应覆盖到配置中的任意 loader。

选项可以传递查询参数，例如 ?key=value&foo=bar，或者一个 JSON 对象，例如 ?\\\\\ \{"key":"value","foo":"bar"}。

### Chunk 代码块

Chunk，代码块，即打包后输出的文件。

Webpack 会为每个 Chunk 取一个名称，可以根据 Chunk 的名称来区分输出的文件名

一个入口文件，默认 chunkname 为 main。
除了内置变量 name，与 chunk 相关的变量还有：

- id: Chunk 的唯一标识，从0开始
- name: Chunk 的名称
- hash: Chunk 的唯一标识的 Hash 值
- chunkhash: Chunk 内容的 Hash 值

### Plugin 插件

插件是 webpack 的支柱功能。webpack 自身也是构建于，你在 webpack 配置中用到的相同的插件系统之上。插件目的在于解决 loader 无法实现的其他事。

Plugin 的配置很简单，plugins 配置项接受一个数组，数组里每一项都是一个要使用的 Plugin 的实例，Plugin 需要的参数通过构造函数传入。

当然使用 Plugin 的难点在于掌握 Plugin 本身提供的配置项，而不是如何在 Webpack 中接入 Plugin。

## webpack配置文件Demo

```js
const { argv } = require('yargs');
const path = require('path');
const merge = require('webpack-merge').default;
const mode = argv.mode;
const envConfig = require(`./build/webpack.${mode}.js`);
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const afterHtmlPlugin = require('./build/afterHtmlPlugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

console.log('当前打包环境', mode);

const files = glob.sync('./src/web/views/**/*.entry.js');

const entrys = {};

const htmlPlugins = [];

files.forEach((url) => {
  if (/([a-zA-Z]+-[a-zA-Z]+)\.entry\.js$/.test(url)) {
    const entryKey = RegExp.$1;
    const [pagesName, actionName] = entryKey.split('-');
    entrys[entryKey] = `./src/web/views/${pagesName}/${entryKey}.entry.js`;

    htmlPlugins.push(
      new HtmlWebpackPlugin({
        filename: `../views/${pagesName}/page/${actionName}.html`,
        template: `./src/web/views/${pagesName}/page/${actionName}.html`,
        chunks: ['runtime', entryKey],
        inject: false,
      })
    );
  }
});

const baseConfig = {
  mode,
  entry: entrys,
  output: {
    path: path.join(__dirname, './dist/web/assets'),
    filename: '[name].[hash:5].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader'],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [
    ...htmlPlugins,
    new MiniCssExtractPlugin(),
    new afterHtmlPlugin(),
    new CleanWebpackPlugin(),
  ],
};

module.exports = merge(baseConfig, envConfig);
```

## 参考链接

- [深入浅出 Webpack](https://webpack.wuhaolin.cn/)
- [webpack 中文网](https://www.webpackjs.com/guides/)