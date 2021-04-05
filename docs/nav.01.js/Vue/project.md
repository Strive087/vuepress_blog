# webpack手动搭建vue项目

记录一下搭建类vue-cli创建vue项目的过程。

首先是基于webpack搭建，那么我们需要先安装webpack。

```sh
mkdir vue-project
cd vue-project
npm init -y
npm i -D webpack webpack-cli
```

安装完webpack之后，我们需要手动创建类vue-cli创建的项目结构,需要创建src、src/assets和public文件夹。

接着我们需要创建webpack的配置文件`webpack.config.js`，然后我们需要根据所要创建项目的需求安装相对应的loader和plugin：

```sh
# babel相关配置，用于转译和添加polyfill
npm i -D @babel/core @babel/preset-env babel-loader
npm i -S core-js
# css相关配置
npm i -D vue-style-loader style-loader css-loader
# 图片等相关配置，这里需要注意webpack5推荐使用asset
npm i -D url-loader file-loader
# 开发模式服务器
npm i -D webpack-dev-server
# html页面配置
npm i -D html-webpack-plugin
# vue相关配置，用于vue单文件解析等
npm i -D vue-template-compiler vue-loader
npm i -S vue
```

接着我们将`webpack.config.js`如下配置:

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");

const config = {
  entry: "./src/main.js", // 定义入口文件
  output: {
    path: path.resolve(__dirname + "/dist"), // 打包生成文件地址，必须是绝对路径
    filename: "[name].build.js" // 生成的文件名
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader"
      },
      {
        test: /\.css$/,
        oneOf: [
          // 这里匹配 `<style module>`
          {
            resourceQuery: /module/,
            use: [
              "vue-style-loader",
              {
                loader: "css-loader",
                options: {
                  modules: true,
                  localIdentName: "[local]_[hash:base64:5]"
                }
              }
            ]
          },
          // 这里匹配普通的 `<style>` 或 `<style scoped>`
          {
            use: ["vue-style-loader", "css-loader"]
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        loader: "url-loader",
        options: {
          limit: 8 * 1024
        }
      },
      {
        // *.js
        test: /\.js$/,
        exclude: /node_modules/, // 不编译node_modules下的文件
        loader: "babel-loader"
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      favicon: "./public/favicon.ico",
      title: "webpack手动搭建vue"
    }),
    new VueLoaderPlugin()
  ],
  // 解析路径
  resolve: {
    // 设置src别名
    alias: {
      "@": path.resolve(__dirname, "src")
    },
    extensions: [".js", ".vue"]
  },
  devServer: {
    contentBase: "./dist",
    compress: true,
    port: 3000,
    hot: true,
    open: true
  }
};

module.exports = config;
```

`babel.config.js` 如下配置：

```js
module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        useBuiltIns: "usage",
        corejs: 3
      }
    ]
  ]
};
```

最后，我们在`public`目录下创建`index.html`，`src`目录下创建`main.js`和`App.vue`。主要就是在`index.html`需要预先创建一个id为app的div，然后在`main.js`中去引入`App.vue`，最后将vue实例挂载到app上。

那么我们就成功搭建了一个简易的vue项目。

## vue-style-loader 和 style-loader

vue-style-loader 跟 style-loader 基本用法跟功能是一样的，他们都是往dom中添加一个style标签。但是 vue-style-loader 支持 vue 中的 ssr（服务端渲染），所以如果需要支持服务端渲染的 vue 项目，就需要用到 vue-style-loader了。而 style-loader 的功能比较强大，它支持多种方式插入dom的方式，所以一般的vue项目，我们用style-loader效果会更好。

参考[这篇文章](https://www.jianshu.com/p/d7b8e9b5a310)
