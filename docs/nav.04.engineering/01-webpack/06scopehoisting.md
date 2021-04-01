# Scope Hoisting

Scope Hoisting 是 webpack3 的新功能，直译为 "作用域提升"，它可以让 webpack 打包出来的代码文件更小，运行更快。

Scope Hoisting 的实现原理其实很简单：分析出模块之间的依赖关系，尽可能将打散的模块合并到一个函数中，前提是不能造成代码冗余。 因此只有那些被引用了一次的模块才能被合并。

由于 Scope Hoisting 需要分析出模块之间的依赖关系，因此源码必须采用 ES6 模块化语句，不然它将无法生效。因为 ES6 模块化语法是静态的（导入导出语句中的路径必须是静态的字符串，而且不能放入其它代码块中），这让 Webpack 可以简单的分析出哪些 export 的被 import 过了。 如果你采用 ES5 中的模块化，例如 module.export={...}、require(x+y)、if(x){require('./util')}，Webpack 无法分析出哪些代码可以剔除。
