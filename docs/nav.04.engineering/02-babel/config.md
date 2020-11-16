# 配置文件

## 使用配置文件

1. 将插件的名字增加到配置文件中 (根目录下创建 .babelrc 或者 package.json 的 babel 里面，格式相同)
2. 使用 npm install babel-plugin-xxx 进行安装

## preset

一套语法规范的插件的合集，因为一套语法规范可能包含数十种转译插件，使用了preset合集我们就不必一个个插件安装。
preset分为以下几种：

- 官方内容，目前包括 env, react, flow, minify 等。

- stage-x，这里面包含的都是当年最新规范的草案，每年更新。这里面还细分为：
  - Stage 0 - 稻草人: 只是一个想法，经过 TC39 成员提出即可。
  - Stage 1 - 提案: 初步尝试。
  - Stage 2 - 初稿: 完成初步规范。
  - Stage 3 - 候选: 完成规范和浏览器初步实现。
  - Stage 4 - 完成: 将被添加到下一年度发布。（也就是下一年的env，所以没有单独Stage 4）

## env

@babel/preset-env可以根据你目标环境的需要智能的做必要的转换。例如你的目标环境是浏览器并且该浏览器支持es2015，那么 es2015 这个 preset 就不需要了。

如果不写任何配置项，env 等价于 latest，也等价于 es2015 + es2016 + es2017 三个相加(不包含 stage-x 中的插件)。env 包含的插件列表维护在[这里](https://github.com/babel/babel-preset-env/blob/master/data/plugin-features.js)

## 执行顺序

- Plugin 会运行在 Preset 之前。
- Plugin 会从前到后顺序执行。
- Preset 的顺序则 刚好相反(从后向前)。

preset 的逆向顺序主要是为了保证向后兼容。我们编排 preset 的时候，其实只要按照规范的时间顺序列出即可。

## 插件和 preset 的配置项

- target：用来配置目标运行环境。通过配置browserslist，可以借助.browserslistrc这个文件配置，也可以在preset-env里面独立配置，就是target这个配置项。
- modules：这个用于配置是否启用将ES6的模块转换其它规范的模块。在vue项目里，这个option被显式地配置为了false。
:::tip
modules ： “amd” | “umd” | “systemjs” | “commonjs” | “cjs” | “auto” | false, defaults to “auto”.
:::
- debug：是否开启转码调试，可以看到polyfill相关的处理结果等等。
- corejs：用来指定preset-env进行polyfill时，要使用的corejs版本。core-js是第三方写的不仅支持的浏览器环境，也能支持最新ES特性的库，该作者称其为standard library。 core-js现在有2个版本在被人使用：v2和v3。 所以preset-env的corejs这个option，可以支持配置2或者3。 但是从未来的角度来说，我认为不应该再关注core-js v2，它始终会被v3代替，慢慢地大家都会升级到v3上面来。

```json
"presets": [
    // 带了配置项，自己变成数组
    [
        // 第一个元素依然是名字
        "env",
        // 第二个元素是对象，列出配置项
        {
          "module": false
        }
    ],

    // 不带配置项，直接列出名字
    "stage-2"
]
```

