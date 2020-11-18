# 使用demo

先创建src和dist目录，然后在命令行输入 npm init -y 生成package.json文件，接着安装@babel/core和@babel/cli。

```sh
npm init -y
npm i -D @babel/core
npm i -D @babel/cli
```

## plugin使用demo

为了演示plugin的作用，我们可以选用几个有代表性的ES6特性，来应用相应的plugin：

- @babel/plugin-transform-classes 这个plugin可以转换ES6的class
- @babel/plugin-transform-arrow-functions 这个plugin可以转换ES6的箭头函数
- @babel/plugin-transform-computed-properties 这个plugin可以转换ES6的属性名表达式

```sh
npm i -D @babel/plugin-transform-classes
npm i -D @babel/plugin-transform-arrow-functions
npm i -D @babel/plugin-transform-computed-properties
```

在根目录创建并配置.babelrc：

```json
{
  "presets": [
    "@babel/plugin-transform-classes",
    "@babel/plugin-transform-arrow-functions",
    "@babel/plugin-transform-computed-properties"
  ],
  "plugins": []
}

```

然后在src目录下新建需要转换的js文件：

```js
// 箭头函数
let foo = () => {

};

// ES6 class
class List {
    constructor(pi = 1, ps = 10) {
        this.pi = 1;
        this.ps = 10;
    }

    loadData() {

    }

    static genId(){
        return ++this.id;
    }
}

let name = 'lyzg';

let obj = {
    baseName: name,
    [name + '_id']: 'baseName'
};
```

使用babel-cli工具在命令行输入 npx babel src --out-dir dist ，在dist目录下生成转换后的文件：

```js
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// 箭头函数
let foo = function () {}; // ES6 class


let List = /*#__PURE__*/function () {
  function List(pi = 1, ps = 10) {
    _classCallCheck(this, List);

    this.pi = 1;
    this.ps = 10;
  }

  _createClass(List, [{
    key: "loadData",
    value: function loadData() {}
  }], [{
    key: "genId",
    value: function genId() {
      return ++this.id;
    }
  }]);

  return List;
}();

let name = 'lyzg';

let obj = _defineProperty({
  baseName: name
}, name + '_id', 'baseName');
```

## 自定义preset demo

这个自定义的preset文件不仅可以包含plugin还可以引入其他preset。例如下面的配置：

```js
module.exports = () => ({
  presets: [
    require("@babel/preset-env"),
  ],
  plugins: [
    [require("@babel/plugin-proposal-class-properties"), { loose: true }],
    require("@babel/plugin-proposal-object-rest-spread"),
  ],
});
```

现在我们延续上一节 [plugin使用demo](./demo.md#plugin使用demo) ，我们在根目录新建 my-preset.js 文件,在新建之前安装下@babel/plugin-proposal-object-rest-spread包。

```js
module.exports = () => ({
  plugins: [
    ['@babel/plugin-transform-arrow-functions'],
    ['@babel/plugin-transform-classes', {spec: false}],
    ['@babel/plugin-transform-computed-properties'],
    ['@babel/plugin-proposal-object-rest-spread', {loose: true, useBuiltIns: true}]
  ]
});
```

将.babelrc文件改为：

```json
{
  "presets": ["./my-preset.js"],
  "plugins": []
}
```

然后命令行输入npx babel src --out-dir dist，可查看转码结果。

```js
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// 箭头函数
let foo = function () {}; // ES6 class


let List = /*#__PURE__*/function () {
  function List(pi = 1, ps = 10) {
    _classCallCheck(this, List);

    this.pi = 1;
    this.ps = 10;
  }

  _createClass(List, [{
    key: "loadData",
    value: function loadData() {}
  }], [{
    key: "genId",
    value: function genId() {
      return ++this.id;
    }
  }]);

  return List;
}();

let name = 'lyzg';

let obj = _defineProperty({
  baseName: name
}, name + '_id', 'baseName');
```
