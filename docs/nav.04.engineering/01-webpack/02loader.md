# Loader

webpack 可以使用 loader 来预处理文件。这允许你打包除 JavaScript 之外的任何静态资源。你可以使用 Node.js 来很简单地编写自己的 loader。

## loader 特性

loader 支持链式传递。能够对资源使用流水线(pipeline)。一组链式的 loader 将按照相反的顺序执行。loader 链中的第一个 loader 返回值给下一个 loader。在最后一个 loader，返回 webpack 所预期的 JavaScript。

- loader 可以是同步的，也可以是异步的。
- loader 运行在 Node.js 中，并且能够执行任何可能的操作。
- loader 接收查询参数。用于对 loader 传递配置。
- loader 也能够使用 options 对象进行配置。
- 除了使用 package.json 常见的 main 属性，还可以将普通的 npm 模块导出为 loader，做法是在 package.json 里定义一个 loader 字段。
- 插件(plugin)可以为 loader 带来更多特性。
- loader 能够产生额外的任意文件。

## 编写 loader

待编写...

## 常用 loader

这里分享一些日常开发中使用的 Loader

### style-loader、css-loader、[ sass-loader | less-loader ]

sass-loader | less-loader：可以将 scss、less 文件处理为 css 文件，css-loader 将 css 文件寻找依赖将其模块化，style-loader 将创建一个 style 标签将 css 文件嵌入到 html 中。

```js
module: {
  rules: [
    {
      test: /\.scss$/,
      use: [
        { loader: "style-loader" },
        { loader: "css-loader", options: { sourceMap: true, modules: true } },
        { loader: "sass-loader", options: { sourceMap: true } }
      ],
      include: [
        path.resolve(__dirname, "app/src"),
        path.resolve(__dirname, "app/test")
      ],
      /**
       *排除需要loader处理的文件或文件夹，webpack中所有的loader都含有include和exclude这两个属性
       *node_modules中的第三方模块往往已经被处理过了，排除了可以优化打包时间
       **/
      exclude: /node_modules/
    }
  ];
}
```

### postcss-loader

为了使用postcss-loader，你需要安装 postcss-loader 和 postcss。添加 postcss-loader 的相关配置到你的 webpack 的配置文件或者使用PostCSS 本身的 配置文件

```js
module: {
  rules: [
    {
      test: /\.css$/i,
      use: [
        'style-loader',
        'css-loader',
        {
          loader: 'postcss-loader',
          options: {
            postcssOptions: {
              //webpack下的配置
              plugins: [
                [
                  'postcss-preset-env',
                  {
                    // 其他选项
                  },
                ],
              ],
            },
          },
        },
      ],
    },
  ],
},

//postcss.config.js文件下进行配置
module.exports = {
  plugins: [
    [
      'postcss-preset-env',
      {
        // 其他选项
      },
    ],
  ],
};
```

### file-loader、url-loader

- file-loader 可以将图片等文件当做模块打包输出。
- url-loader 与 file-loader 类似，但是 url-loader 可以设置限制值，如果文件小于这个值时将返回一个 [DataURL](https://zhuanlan.zhihu.com/p/135405455) base64 字符串，反之则会默认使用 file-loader，并会将 options 配置对象传递给 file-loader。（这里虽然代码没配置 file-loader，但是还是需要安装）

```js
//file-loader
module: {
  rules: [
    {
      test: /\.(png|jpg|gif)$/,
      use: {
        loader: "file-loader",
        options: {
          name: "[name].[ext]?[hash]", //[name]继承文件名，[ext]继承文件后缀
          outputPath: "images/" //打包输出的路径
        }
      }
    }
  ];
}

//url-loader
module: {
  rules: [
    {
      test: /\.(png|jpg|gif)$/,
      use: {
        loader: "url-loader",
        options: {
          limit: "2048", //这里是以字节(B)为单位
          fallback: "responsive-loader" //配置不满足条件时，使用的loader，默认是file-loader
        }
      }
    }
  ];
}
```

### babel-loader

允许你使用 Babel 和 webpack 转译 JavaScript 文件。使用babel-loader需要安装babel-loader、@babel/core 和 @babel/preset-env 。

### ts-loader

### imports-loader、exports-loader

## 手写loader

在手写loader之前，我们需要了解loader的一些概念。我们可以看webpack的[官网](https://webpack.docschina.org/api/loaders/)



## 参考链接

- [官方文档](https://webpack.docschina.org/loaders/)
- [深入浅出 Webpack](https://webpack.wuhaolin.cn/%E9%99%84%E5%BD%95/%E5%B8%B8%E7%94%A8Loaders.html)
- [webpack 常用 loader 和 plugin](https://www.jianshu.com/p/6397d692f61f)
