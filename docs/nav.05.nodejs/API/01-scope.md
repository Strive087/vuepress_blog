# CommonJS模块作用域

## __dirname

- \<string\>

当前模块的目录名。 相当于 __filename 的 path.dirname()。

## __filename

- \<string\>

当前模块的文件名。 这是当前的模块文件的绝对路径（符号链接会被解析）。

对于主程序，这不一定与命令行中使用的文件名相同

从 /Users/mjr 运行 node example.js：

```js
console.log(__filename);
// 打印: /Users/mjr/example.js
console.log(__dirname);
// 打印: /Users/mjr
```

## exports

- \<Object\>

这是一个对于 module.exports 的更简短的引用形式。

## module

- \<Object\>

对当前模块的引用, 查看关于 module 对象的章节。 module.exports 用于指定一个模块所导出的内容，即可以通过 require() 访问的内容。

## require(id)

- id \<string\> 模块的名称或路径。
- 返回: \<any\> 导入的模块内容。

用于引入模块、 JSON、或本地文件。 可以从 node_modules 引入模块。 可以使用相对路径（例如 ./、 ./foo、 ./bar/baz、 ../foo）引入本地模块或 JSON 文件，路径会根据 __dirname 定义的目录名或当前工作目录进行处理。
