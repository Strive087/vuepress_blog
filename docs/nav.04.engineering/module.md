# 模块化

模块化这个话题在 ES6 之前是不存在的，因此这也被诟病为早期 JavaScript 开发全局污染和依赖管理混乱问题的源头。模块化是指把一个复杂的系统分解到多个模块以方便编码。目前JavaScript 模块化方案有 CommonJS、AMD、CMD、UMD 和 ES Module。

## CommonJS

CommonJS 的一个模块就是一个脚本文件，通过执行该文件来加载模块。CommonJS 规范规定，每个模块内部，module 变量代表当前模块。这个变量是一个对象，它的 exports 属性（即 module.exports）是对外的接口。加载某个模块，其实是加载该模块的 module.exports 属性。

核心思想就是通过 require 方法来**同步**地加载依赖的其他模块，通过 module.exports 导出需要暴露的接口。

```js
var myModule = require('module');
myModule.sayHello();var myModule = require('module');
myModule.sayHello();

// module.js
module.exports.sayHello = function() {
    console.log('Hello ');
};

// 如果这样写
module.exports = sayHello;

// 调用则需要改为
var sayHello = require('module');
sayHello();
```

require 命令第一次加载该脚本时就会执行整个脚本，然后在内存中生成一个对象（模块可以多次加载，但是在第一次加载时才会运行，结果被缓存），这个结果长成这样：

```json
{
  id: '...',
  exports: { ... },
  loaded: true,
  ...
}
```

Node.js 的模块机制实现就是参照了 CommonJS 的标准。但是 Node.js 额外做了一件事，即为每个模块提供了一个 exports 变量，以指向 module.exports，这相当于在每个模块最开始，写有这么一行代码：

```js
var exports = module.exports;
```

CommonJS 模块的特点：

- 所有代码都运行在模块作用域，不会污染全局作用域。
- 独立性是模块的重要特点就，模块内部最好不与程序的其他部分直接交互。
- 模块可以多次加载，但是只会在第一次加载时运行一次，然后运行结果就被缓存了，以后再加载，就直接读取缓存结果。要想让模块再次运行，必须清除缓存。
- 模块加载的顺序，按照其在代码中出现的顺序。

CommonJS 的缺点在于这样的代码无法直接运行在浏览器环境下，必须通过工具转换成标准的 ES5。

:::tip
CommonJS 还可以细分为 CommonJS1 和 CommonJS2，区别在于 CommonJS1 只能通过 exports.XX = XX 的方式导出，CommonJS2 在 CommonJS1 的基础上加入了 module.exports = XX 的导出方式。 CommonJS 通常指 CommonJS2。
:::

## AMD

CommonJS 规范很好，但是不适用于浏览器环境，于是有了 AMD 和 CMD 两种方案。AMD 全称 Asynchronous Module Definition，即异步模块定义。它采用异步方式加载模块，模块的加载不影响它后面语句的运行。所有依赖这个模块的语句，都定义在一个回调函数中，等到加载完成之后，这个回调函数才会运行。最具代表性的实现是 requirejs。

```js
define(id?, dependencies?, factory);
```

AMD 的模块引入由 define 方法来定义，在 define API 中：

- id：模块名称，或者模块加载器请求的指定脚本的名字；
- dependencies：是个定义中模块所依赖模块的数组，默认为 [“require”, “exports”, “module”]，举个例子比较好理解，当我们创建一个名为 “alpha” 的模块，使用了require，exports，和名为 “beta” 的模块，需要如下书写（示例1）；
- factory：为模块初始化要执行的函数或对象。如果为函数，它应该只被执行一次。如果是对象，此对象应该为模块的输出值；

```js
// 定义一个模块
define("alpha", ["require", "exports", "beta"], function (require, exports, beta) {
  exports.verb = function() {
    return beta.verb();
    // 或者
    return require("beta").verb();
  }
});
```

如果模块定义不存在依赖，那么可以直接定义对象：

```js
define({
  add: function(x, y){
    return x + y;
  }
});
```

而使用时我们依旧通过 require 关键字，它包含两个参数，第一个数组为要加载的模块，第二个参数为回调函数：

```js
require(['math'], function (math) {
  math.add(2, 3);
});
```

AMD 的优点在于：

- 可在不转换代码的情况下直接在浏览器中运行；
- 可异步加载依赖；
- 可并行加载多个依赖；
- 代码可运行在浏览器环境和 Node.js 环境下。

AMD 的缺点在于JavaScript 运行环境没有原生支持 AMD，需要先导入实现了 AMD 的库后才能正常使用。

## CMD

CMD 全称为 Common Module Definition，是 Sea.js 所推广的一个模块化方案的输出。在 CMD define 的入参中，虽然也支持包含 id, deps 以及 factory 三个参数的形式，但推荐的是接受 factory 一个入参，然后在入参执行时，填入三个参数 require、exports 和 module：

```js
define(function(require, exports, module) {
  var a = require('./a');
  a.doSomething();
  var b = require('./b'); 
  b.doSomething();
  ...
})
```

CMD factory 的入参 API：

- require: 用来访问其他模块提供的 API.
- exports: 用来向外提供模块的 API.除了给 exports 对象增加成员，还可以使用 return 直接向外提供 API.
- module: 存储模块的元信息。module.id当前模块的唯一标识。 require(module.id) 必然返回此模块的 exports 。

通过执行该构造方法，可以得到模块向外提供的接口。在与 AMD 比较上存在两个主要的不同点：

1. 对于依赖的模块，AMD 是提前执行，CMD 是延迟执行。不过 RequireJS 从 2.0 开始，也改成可以延迟执行（根据写法不同，处理方式不同）。CMD 推崇 as lazy as possible.
2. CMD 推崇依赖就近，AMD 推崇依赖前置。

## UMD

UMD，全称 Universal Module Definition，即通用模块规范。既然 CommonJs 和 AMD 风格一样流行，那么需要一个可以统一浏览器端以及非浏览器端的模块化方案的规范。

jQuery 模块如何用 UMD 定义的代码：

```js
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS
        module.exports = function( root, jQuery ) {
            if ( jQuery === undefined ) {
                // require('jQuery') returns a factory that requires window to
                // build a jQuery instance, we normalize how we use modules
                // that require this pattern but the window provided is a noop
                // if it's defined (how jquery works)
                if ( typeof window !== 'undefined' ) {
                    jQuery = require('jquery');
                }
                else {
                    jQuery = require('jquery')(root);
                }
            }
            factory(jQuery);
            return jQuery;
        };
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    $.fn.jqueryPlugin = function () { return true; };
}));
```

UMD的实现很简单：

- 先判断是否支持 AMD（define 是否存在），存在则使用 AMD 方式加载模块；
- 再判断是否支持 Node.js 模块格式（exports 是否存在），存在则使用 Node.js 模块格式；
- 前两个都不存在，则将模块公开到全局（window 或 global）；

## ES Module

当然，以上说的种种都是社区提供的方案，历史上，JavaScript 一直没有模块系统，直到 ES6 在语言标准的层面上，实现了它。其设计思想是尽量的**静态化**，使得编译时就能确定模块的依赖关系，以及输入和输出的变量。

CommonJS 和 AMD 模块是运行时加载，**ES6 模块是编译时输出接口**。比如，CommonJS 模块就是对象，输入时必须查找对象属性。**而 ES Modules 不是对象，而是通过 export 命令显式指定输出的代码**。CommonJS 模块输出的是一个值的拷贝，**ES6 模块输出的是值的引用**。CommonJS 模块的require()是同步加载模块，**ES6 模块的import命令是异步加载，有一个独立的模块依赖的解析阶段**。

ES Modules 的模块化能力由 export 和 import 组成，export 命令用于规定模块的对外接口，import 命令用于输入其他模块提供的功能。我们可以这样定义一个模块：

```js
// 第一种方式
export var firstName = 'Michael';
export var lastName = 'Jackson';
export var year = 1958;

// 第二种方式
var firstName = 'Michael';
var lastName = 'Jackson';
var year = 1958;

export { firstName, lastName, year };
```

引入:

```js
import { firstName, lastName, year } from 'module';
import { firstName as newName } from 'module';
import * as moduleA from 'module';
```

除以上两种命令外，还有一个 export default 命令用于指定模块的默认输出（一个模块只能有一个默认输出）。如果使用了 export default 语法，在 import 时则可以任意命名。由于 export default 命令的本质是将后面的值，赋给 default 变量，所以也可以直接将一个值写在 export default 之后。当然，引用方式也存在多种：

```js
import { default as foo } from 'module';
import foo from 'module';
```

ES2020提案 引入import()函数，支持动态加载模块。它是运行时执行，也就是说，什么时候运行到这一句，就会加载指定的模块。另外，import()函数与所加载的模块没有静态连接关系，这点也是与import语句不相同。import()类似于 Node 的require方法，区别主要是前者是异步加载，后者是同步加载。

import()加载模块成功以后，这个模块会作为一个对象，当作then方法的参数。因此，可以使用对象解构赋值的语法，获取输出接口。

```js
import('./myModule.js')
.then(({export1, export2}) => {
  // ...·
});
```

浏览器加载 ES6 模块，也使用``<script>``标签，但是要加入type="module"属性。浏览器对于带有type="module"的``<script>``，都是异步加载，不会造成堵塞浏览器，即等到整个页面渲染完，再执行模块脚本，等同于打开了``<script>``标签的defer属性。如果网页有多个``<script type="module">``，它们会按照在页面出现的顺序依次执行。

``<script>``标签的async属性也可以打开，这时只要加载完成，渲染引擎就会中断渲染立即执行。执行完成后，再恢复渲染。一旦使用了async属性，``<script type="module">``就不会按照在页面出现的顺序执行，而是只要该模块加载完成，就执行该模块。

对于外部的模块脚本，有几点需要注意。

- 代码是在模块作用域之中运行，而不是在全局作用域运行。模块内部的顶层变量，外部不可见。
- 模块脚本自动采用严格模式，不管有没有声明use strict。
- 模块之中，可以使用import命令加载其他模块（.js后缀不可省略，需要提供绝对 URL 或相对 URL），也可以使用export命令输出对外接口。且 import 命令具有提升效果，会提升到整个模块的头部，首先执行。
- 模块之中，顶层的this关键字返回undefined，而不是指向window。也就是说，在模块顶层使用this关键字，是无意义的。
- 同一个模块如果加载多次，将只执行一次。

## 循环加载

循环加载（circular dependency）指的是，a脚本的执行依赖b脚本，而b脚本的执行又依赖a脚本。

### CommonJS实现

CommonJS的做法是，一旦出现某个模块被"循环加载"，就只输出已经执行的部分，还未执行的部分不会输出。

官方文档里面的例子。脚本文件a.js代码如下：

```js
exports.done = false;
var b = require('./b.js');
console.log('在 a.js 之中，b.done = %j', b.done);
exports.done = true;
console.log('a.js 执行完毕');
```

上面代码之中，a.js脚本先输出一个done变量，然后加载另一个脚本文件b.js。注意，此时a.js代码就停在这里，等待b.js执行完毕，再往下执行。再看b.js的代码:

```js
exports.done = false;
var a = require('./a.js');
console.log('在 b.js 之中，a.done = %j', a.done);
exports.done = true;
console.log('b.js 执行完毕');
```

上面代码之中，b.js执行到第二行，就会去加载a.js，这时，就发生了"循环加载"。系统会去a.js模块对应对象的exports属性取值，可是因为a.js还没有执行完，从exports属性只能取回已经执行的部分，而不是最后的值。a.js已经执行的部分，只有一行：``exports.done = false``。

因此，对于b.js来说，它从a.js只输入一个变量done，值为false。然后，b.js接着往下执行，等到全部执行完毕，再把执行权交还给a.js。于是，a.js接着往下执行，直到执行完毕。我们写一个脚本main.js，验证这个过程。

```js
var a = require('./a.js');
var b = require('./b.js');
console.log('在 main.js 之中, a.done=%j, b.done=%j', a.done, b.done);

// 输出如下：
// 在 b.js 之中，a.done = false
// b.js 执行完毕
// 在 a.js 之中，b.done = true
// a.js 执行完毕
// 在 main.js 之中, a.done=true, b.done=true
```

上面的代码证明了两件事。一是，在b.js之中，a.js没有执行完毕，只执行了第一行。二是，main.js执行到第二行时，不会再次执行b.js，而是输出缓存的b.js的执行结果：``exports.done = true``。

### ES Module实现

ES6模块的运行机制与CommonJS不一样，它遇到模块加载命令import时，不会去执行模块，而是只生成一个引用。等到真的需要用到时，再到模块里面去取值。

因此，ES6模块是动态引用，不存在缓存值的问题，而且模块里面的变量，绑定其所在的模块。请看下面的例子。这导致ES6处理"循环加载"与CommonJS有本质的不同。ES6根本不会关心是否发生了"循环加载"，只是生成一个指向被加载模块的引用，需要开发者自己保证，真正取值的时候能够取到值。

请看下面的例子：

```js
// a.js
import {bar} from './b.js';
export function foo() {
  bar();  
  console.log('执行完毕');
}
foo();

// b.js
import {foo} from './a.js';
export function bar() {  
  if (Math.random() > 0.5) {
    foo();
  }
}
```

按照CommonJS规范，上面的代码是没法执行的。a先加载b，然后b又加载a，这时a还没有任何执行结果，所以输出结果为null，即对于b.js来说，变量foo的值等于null，后面的foo()就会报错。

但是，ES6可以执行上面的代码。a.js之所以能够执行，原因就在于ES6加载的变量，都是动态引用其所在的模块。只要引用是存在的，代码就能执行。

## Webpack打包输出

在webpack，我们只要设置output.library.type这个属性值，就可以输出对应模块的文件。

output.library.type的属性值主要有以下几种：

类型默认包括 'var'、'module'、'assign'、'assign-properties'、'this'、'window'、'self'、'global'、'commonjs'、'commonjs2'、'commonjs-module'、'amd'、'amd-require'、'umd'、'umd2'、'jsonp' 以及 'system'，除此之外也可以通过插件添加

## Rollup打包输出

rollup只需要需改output.format属性即可

String 生成包的格式。 下列之一:

- amd – 异步模块定义，用于像RequireJS这样的模块加载器
- cjs – CommonJS，适用于 Node 和 Browserify/Webpack
- esm – 将软件包保存为 ES 模块文件，在现代浏览器中可以通过 \<script type=module> 标签引入
- iife – 一个自动执行的功能，适合作为\<script>标签。（如果要为应用程序创建一个捆绑包，您可能想要使用它，因为它会使文件大小变小。）
- umd – 通用模块定义，以amd，cjs 和 iife 为一体
- system - SystemJS 加载器格式
