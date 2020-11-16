# 配置文件

## 使用配置文件

1. 将插件的名字增加到配置文件中 (根目录下创建 .babelrc 或者 package.json 的 babel 里面，格式相同)
2. 使用 npm install babel-plugin-xxx 进行安装

## preset

一套语法规范的插件的合集，因为一套语法规范可能包含数十种转译插件，使用了preset合集我们就不必一个个插件安装。
preset分为以下几种：

- 目前官方推荐的preset，有下面四个：
  - @babel/preset-env：所有项目都会用到的
  - @babel/preset-flow：flow需要的
  - @babel/preset-react：react框架需要的
  - @babel/preset-typescript：typescript需要的

- stage-x，这里面包含的都是当年最新规范的草案，每年更新。（从babel7开始已经不推荐使用）这里面还细分为：
  - Stage 0 - 稻草人: 只是一个想法，经过 TC39 成员提出即可。
  - Stage 1 - 提案: 初步尝试。
  - Stage 2 - 初稿: 完成初步规范。
  - Stage 3 - 候选: 完成规范和浏览器初步实现。
  - Stage 4 - 完成: 将被添加到下一年度发布。（也就是下一年的env，所以没有单独Stage 4）

## preset-env

@babel/preset-env可以根据我们对browserslist的配置的目标环境，智能地做必要的转换。例如你的目标环境是浏览器并且该浏览器支持es2015，那么 es2015 这个 preset 就不需要了。

除了browserslist，@babel/preset-env，还依赖了另外两个库来完成它的实现：compat-table 和 electron-to-chromium。后面两个帮助preset-env，知道ES6的特性，在不同的平台、不同的运行环境中，都是从哪个版本开始原生支持的。

我们通过查看preset-env的[package.json](https://github.com/babel/babel/blob/main/packages/babel-preset-env/package.json)文件就能知道它需要哪些插件：

```json
{
  "name": "@babel/preset-env",
  "version": "7.12.1",
  "description": "A Babel preset for each environment.",
  "author": "Henry Zhu <hi@henryzoo.com>",
  "homepage": "https://babeljs.io/",
  "license": "MIT",
  "publishConfig": {
    "access": "public"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/babel/babel.git",
    "directory": "packages/babel-preset-env"
  },
  "main": "lib/index.js",
  "dependencies": {
    "@babel/compat-data": "workspace:^7.12.1", //这里封装了compat-table 和 electron-to-chromium
    "@babel/helper-compilation-targets": "workspace:^7.12.1", //这里封装了browserslist
    "@babel/helper-module-imports": "workspace:^7.12.1",
    "@babel/helper-plugin-utils": "workspace:^7.10.4",
    "@babel/helper-validator-option": "workspace:^7.12.1",
    "@babel/plugin-proposal-async-generator-functions": "workspace:^7.12.1",
    "@babel/plugin-proposal-class-properties": "workspace:^7.12.1",
    "@babel/plugin-proposal-dynamic-import": "workspace:^7.12.1",
    "@babel/plugin-proposal-export-namespace-from": "workspace:^7.12.1",
    "@babel/plugin-proposal-json-strings": "workspace:^7.12.1",
    "@babel/plugin-proposal-logical-assignment-operators": "workspace:^7.12.1",
    "@babel/plugin-proposal-nullish-coalescing-operator": "workspace:^7.12.1",
    "@babel/plugin-proposal-numeric-separator": "workspace:^7.12.1",
    "@babel/plugin-proposal-object-rest-spread": "workspace:^7.12.1",
    "@babel/plugin-proposal-optional-catch-binding": "workspace:^7.12.1",
    "@babel/plugin-proposal-optional-chaining": "workspace:^7.12.1",
    "@babel/plugin-proposal-private-methods": "workspace:^7.12.1",
    "@babel/plugin-proposal-unicode-property-regex": "workspace:^7.12.1",
    "@babel/plugin-syntax-async-generators": "^7.8.0",
    "@babel/plugin-syntax-class-properties": "workspace:^7.12.1",
    "@babel/plugin-syntax-dynamic-import": "^7.8.0",
    "@babel/plugin-syntax-export-namespace-from": "^7.8.3",
    "@babel/plugin-syntax-json-strings": "^7.8.0",
    "@babel/plugin-syntax-logical-assignment-operators": "^7.10.4",
    "@babel/plugin-syntax-nullish-coalescing-operator": "^7.8.0",
    "@babel/plugin-syntax-numeric-separator": "^7.10.4",
    "@babel/plugin-syntax-object-rest-spread": "^7.8.0",
    "@babel/plugin-syntax-optional-catch-binding": "^7.8.0",
    "@babel/plugin-syntax-optional-chaining": "^7.8.0",
    "@babel/plugin-syntax-top-level-await": "workspace:^7.12.1",
    "@babel/plugin-transform-arrow-functions": "workspace:^7.12.1",
    "@babel/plugin-transform-async-to-generator": "workspace:^7.12.1",
    "@babel/plugin-transform-block-scoped-functions": "workspace:^7.12.1",
    "@babel/plugin-transform-block-scoping": "workspace:^7.12.1",
    "@babel/plugin-transform-classes": "workspace:^7.12.1",
    "@babel/plugin-transform-computed-properties": "workspace:^7.12.1",
    "@babel/plugin-transform-destructuring": "workspace:^7.12.1",
    "@babel/plugin-transform-dotall-regex": "workspace:^7.12.1",
    "@babel/plugin-transform-duplicate-keys": "workspace:^7.12.1",
    "@babel/plugin-transform-exponentiation-operator": "workspace:^7.12.1",
    "@babel/plugin-transform-for-of": "workspace:^7.12.1",
    "@babel/plugin-transform-function-name": "workspace:^7.12.1",
    "@babel/plugin-transform-literals": "workspace:^7.12.1",
    "@babel/plugin-transform-member-expression-literals": "workspace:^7.12.1",
    "@babel/plugin-transform-modules-amd": "workspace:^7.12.1",
    "@babel/plugin-transform-modules-commonjs": "workspace:^7.12.1",
    "@babel/plugin-transform-modules-systemjs": "workspace:^7.12.1",
    "@babel/plugin-transform-modules-umd": "workspace:^7.12.1",
    "@babel/plugin-transform-named-capturing-groups-regex": "workspace:^7.12.1",
    "@babel/plugin-transform-new-target": "workspace:^7.12.1",
    "@babel/plugin-transform-object-super": "workspace:^7.12.1",
    "@babel/plugin-transform-parameters": "workspace:^7.12.1",
    "@babel/plugin-transform-property-literals": "workspace:^7.12.1",
    "@babel/plugin-transform-regenerator": "workspace:^7.12.1",
    "@babel/plugin-transform-reserved-words": "workspace:^7.12.1",
    "@babel/plugin-transform-shorthand-properties": "workspace:^7.12.1",
    "@babel/plugin-transform-spread": "workspace:^7.12.1",
    "@babel/plugin-transform-sticky-regex": "workspace:^7.12.1",
    "@babel/plugin-transform-template-literals": "workspace:^7.12.1",
    "@babel/plugin-transform-typeof-symbol": "workspace:^7.12.1",
    "@babel/plugin-transform-unicode-escapes": "workspace:^7.12.1",
    "@babel/plugin-transform-unicode-regex": "workspace:^7.12.1",
    "@babel/preset-modules": "^0.1.3",
    "@babel/types": "workspace:^7.12.1",
    "core-js-compat": "^3.7.0",
    "semver": "^5.5.0"
  },
  "peerDependencies": {
    "@babel/core": "^7.0.0-0"
  },
  "devDependencies": {
    "@babel/core": "workspace:*",
    "@babel/helper-plugin-test-runner": "workspace:*",
    "@babel/plugin-syntax-dynamic-import": "^7.2.0"
  }
}
```

babel把还在处于proposal阶段的plugin都命名为了-proposal形式的plugin，非proposal的plugin都变为-transform形式的plugin。以上几个-proposal的plugin在我写文这个时间已经进展到stage-4了，它变为-trasform的plugin是早晚的事，所以preset-env才会包含它们。

由于proposal会不断地变化，非proposal要变成-transfom的插件，意味着preset-env也会跟着调整，所以保持preset-env的更新，在平常的项目中也是比较重要的一项工作。

因为这一点，所以preset-env不是万能的。 如果我们用到某一个新的ES特性，还是proposal阶段，而且preset-env不提供转码支持的话，就得自己单独配置plugins了。

## browserslist

官方推荐单独建立一个.browserlist文件来配置，但同时preset-env的options里面有一个target option，就可以用来单独为它配置browserslist。

使用browserlist的配置方式需阅读它们的[官方文档](https://github.com/browserslist/browserslist#query-composition)

## 插件和 preset 的配置项

每个插件和 preset 的配置项都不太一样，这里只介绍可能有且常用的配置项：

- target：用来配置目标运行环境。通过配置browserslist，可以借助.browserslistrc这个文件配置，也可以在preset-env里面独立配置，就是target这个配置项。
- modules：这个用于配置是否启用将ES6的模块转换其它规范的模块。在vue项目里，这个option被显式地配置为了false。
:::tip
modules ： “amd” | “umd” | “systemjs” | “commonjs” | “cjs” | “auto” | false, defaults to “auto”.
:::
- debug：是否开启转码调试，可以看到polyfill相关的处理结果等等。
- corejs：用来指定preset-env进行polyfill时，要使用的corejs版本。core-js是第三方写的不仅支持的浏览器环境，也能支持最新ES特性的库，该作者称其为standard library。 core-js现在有2个版本在被人使用：v2和v3。 所以preset-env的corejs这个option，可以支持配置2或者3。 但是从未来的角度来说，我认为不应该再关注core-js v2，它始终会被v3代替，慢慢地大家都会升级到v3上面来。因为preset-env默认不会对proposals进行polyfill，所以如果需要对proposals进行polyfill，可以把corejs.proposals设置为true。
- loose：启用松散式的代码转换，假如某个插件支持这个option，转换后的代码，会更加简单，代码量更少，但是不会严格遵循ES的规格，通常默认是false。
- spec：启用更加符合ES规格的代码转换，默认也是false，转换后的代码，会增加很多helper函数，代码量更大，但是代码质量更好。
- legacy：启用旧的实现来对代码做转换。（es6语法糖）
- useBuiltIns：由于@babel/polyfill在babel7.4开始，也不支持使用了。 所以现在要用preset-env，必须是得单独安装core-js@3（第三方的库），并且是安装到dependences。useBuiltIns，主要有两个value: entry和usage。 这两个值，不管是哪一个，都会把core-js的modules注入到转换后的代码里面，充当polyfill。

### useBuiltIns：entry

entry是根据targets配置的环境进行判断，对core-js的import替换。假如把配置文件target调整为ios12（ios: 12是非常新的环境了），那么最终core-js引入的文件将特别少。

### useBuiltIns：usage

usage相比entry，最大好处就是他会根据每个文件用到的了哪些新特性，然后根据设置的target判断需要引入的polyfill。如果targets的最低环境不支持某个es特性，则这个es特性的core-js的对应module会被注入。

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
