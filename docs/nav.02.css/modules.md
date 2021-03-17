# Css Modules

Css Modules 不是将 CSS 改造成编程语言，而是功能很单纯，只加入了局部作用域和模块依赖，这恰恰是网页组件最急需的功能。

## 局部作用域

CSS的规则都是全局的，任何一个组件的样式规则，都对整个页面有效。

产生局部作用域的唯一方法，就是使用一个独一无二(一般是哈希字符串)的class的名字，不会与其他选择器重名。这就是 CSS Modules 的做法。

CSS Modules 提供各种插件，支持不同的构建工具。这里使用的是 Webpack 的css-loader插件，因为它对 CSS Modules 的支持最好，而且很容易使用。

```js
// webpack.config.js
module.exports = {
  entry: __dirname + '/index.js',
  output: {
    publicPath: '/',
    filename: './bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'stage-0', 'react']
        }
      },
      {
        test: /\.css$/,
        loader: "style-loader!css-loader?modules"
      },
    ]
  }
};
```

上面代码中，关键的一行是style-loader!css-loader?modules，它在css-loader后面加了一个查询参数modules，表示打开 CSS Modules 功能。

## 全局作用域

CSS Modules 允许使用:global(.className)的语法，声明一个全局规则。凡是这样声明的class，都不会被编译成哈希字符串。

CSS Modules 还提供一种显式的局部作用域语法:local(.className)，等同于.className。

## 定制哈希类名

css-loader默认的哈希算法是[hash:base64]，这会将.title编译成._3zyde4l1yATCOkgn-DBWEL这样的字符串。

webpack.config.js里面可以定制哈希字符串的格式。

```js
module: {
  loaders: [
    // ...
    {
      test: /\.css$/,
      loader: "style-loader!css-loader?modules&localIdentName=[path][name]---[local]---[hash:base64:5]"
    },
  ]
}
```

## Class的组合

在 CSS Modules 中，一个选择器可以继承另一个选择器的规则，这称为"组合"（"composition"）。

在App.css中，让.title继承.className 。

```css

.className {
  background-color: blue;
}

.title {
  composes: className;
  color: red;
}
```

```js
import React from 'react';
import style from './App.css';

export default () => {
  return (
    <h1 className={style.title}>
      Hello World
    </h1>
  );
};
```

运行之后，App.css编译成下面的代码。

```css
._2DHwuiHWMnKTOYG45T0x34 {
  color: red;
}

._10B-buq6_BEOTOl9urIjf8 {
  background-color: blue;
}
```

相应地， h1的class也会编译成\<h1 class="_2DHwuiHWMnKTOYG45T0x34_10B-buq6_BEOTOl9urIjf8">。

## 输入其他模块

选择器也可以继承其他CSS文件里面的规则。

```css
.title {
  composes: className from './another.css';
  color: red;
}
```

## 输入变量

CSS Modules 支持使用变量，不过需要安装 PostCSS 和 postcss-modules-values。

把postcss-loader加入webpack.config.js。

```js
var values = require('postcss-modules-values');

module.exports = {
  entry: __dirname + '/index.js',
  output: {
    publicPath: '/',
    filename: './bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'stage-0', 'react']
        }
      },
      {
        test: /\.css$/,
        loader: "style-loader!css-loader?modules!postcss-loader"
      },
    ]
  },
  postcss: [
    values
  ]
};
```

接着，在colors.css里面定义变量。

```css
@value blue: #0c77f8;
@value red: #ff0000;
@value green: #aaf200;
```

App.css可以引用这些变量。

```css
@value colors: "./colors.css";
@value blue, red, green from colors;

.title {
  color: red;
  background-color: blue;
}
```
