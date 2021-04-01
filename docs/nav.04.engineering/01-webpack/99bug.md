# 项目中遇到的问题

## html-loader与url-loader图片引入出错

html标签中src的图片被成功打包，但是src的路径文件名指向一个.jpg的错误文件，文件内容如下：

![0Y5Kue](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/0Y5Kue.png)

初步原因分析：

html-loader和url-loader在最新版本中均默认开启esModule,具体应该涉及到html-loader和url-loader在引入图片的方式不同，不支持都进行esModule引入。

解决办法：

在html-loader和url-loader的options中esModule设置为false。

## postcss-loader配置postcss-preset-env报错

参考最新的postcss-loader的options写法即可：

![LAPpgo](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/LAPpgo.png)

## file-loader 打包生成 data:text/javascript,__webpack_public_path__ = htmlWebpackPluginPublicPath

处理方法可以看[这里](https://github.com/jantimon/html-webpack-plugin/issues/1589)

这是个bug，现阶段只能先这样排除。

![zo9nF1](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/zo9nF1.png)

## eslint-loader的自动修复 与 babel-loader 冲突

eslint-loader的自动修复会在源代码中引入corejs的垫片。

处理方法：rules 的执行顺序是从右往左，从下往上的，先经过 eslint 校验判断代码是否符合规范，然后再通过 babel 来做转移。将eslint-loader率先执行然后才是babel，可以移动顺序或者加enforce:pre。

## MiniCssExtractPlugin 提取后css内部资源相对路径错误

MiniCssExtractPlugin.loader 的 publicPath 为 CSS 内的图片、文件等外部资源指定一个自定义的公共路径。 机制类似于 output.publicPath。

![AOPMN7](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/AOPMN7.png)

## webpack5 devServer无法自动刷新页面

从官网可以知道：

![mI1GKq](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/mI1GKq.png)

![83fZzV](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/83fZzV.png)

但是在package.json文件中定义了browserslist，target却不生效，目前找到的办法只能是手动设置target。

![6QQEhP](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/6QQEhP.png)

## babel 与 eslint 对实验性语法兼容问题

遇到问题是，eslint 无法解析import方法，因为 eslint 根据 browserslist 判断支持的语法，对于超越browserslist环境的语法，eslint无法解析。

解决方法：

安装@babel/eslint-parser，配置.eslintrc.js：

```js
const { resolve } = require('path');

module.exports = {
  parser: '@babel/eslint-parser',
  parserOptions: {
    sourceType: 'module',
    allowImportExportEverywhere: false,
    ecmaFeatures: {
      globalReturn: false,
    },
    babelOptions: { configFile: resolve(__dirname, 'babel.config.js') },
  },
};
```

这里说明下如果找不到babel的配置文件，需要配置babelOptions.configFile。
