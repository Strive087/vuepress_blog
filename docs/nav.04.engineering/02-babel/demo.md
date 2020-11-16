# Babel使用Demo

为了演示plugin的作用，我们可以选用几个有代表性的ES6特性，来应用相应的plugin：

- @babel/plugin-transform-classes 这个plugin可以转换ES6的class
- @babel/plugin-transform-arrow-functions 这个plugin可以转换ES6的箭头函数
- @babel/plugin-transform-computed-properties 这个plugin可以转换ES6的属性名表达式

```sh
npm i -D @babel/plugin-transform-classes
npm i -D @babel/plugin-transform-arrow-functions
npm i -D @babel/plugin-transform-computed-properties
```

配置.babelrc：

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

需要转换的js文件：

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
