# path

path 模块提供了一些实用工具，用于处理文件和目录的路径。

## path.join([...paths])

- ...paths \<string\> 路径片段的序列。
- 返回: \<string\>

path.join() 方法会将所有给定的 path 片段连接到一起（使用平台特定的分隔符作为定界符），然后规范化生成的路径。

长度为零的 path 片段会被忽略。 如果连接后的路径字符串为长度为零的字符串，则返回 '.'，表示当前工作目录。

## path.relative(from, to)

- from \<string\>
- to \<string\>
- 返回: \<string\>

path.relative() 方法根据当前工作目录返回 from 到 to 的相对路径。 如果 from 和 to 各自解析到相同的路径（分别调用 path.resolve() 之后），则返回零长度的字符串。

如果将零长度的字符串传入 from 或 to，则使用当前工作目录代替该零长度的字符串。

```js
path.relative('/data/orandea/test/aaa', '/data/orandea/impl/bbb');
// 返回: '../../impl/bbb'
```

## path.resolve([...paths])

- ...paths \<string\> 路径片段的序列。
- 返回: \<string\>

path.resolve() 方法会将路径或路径片段的序列解析为绝对路径。

## path.dirname(path)

- path \<string\>
- 返回: \<string\>

path.dirname() 方法会返回 path 的目录名，类似于 Unix 的 dirname 命令。

## path.extname(path)

- path \<string\>
- 返回: \<string\>

path.extname() 方法会返回 path 的扩展名，即 path 的最后一部分中从最后一次出现 .（句点）字符直到字符串结束。 如果在 path 的最后一部分中没有 .，或者如果 path 的基本名称（参见 path.basename()）除了第一个字符以外没有 .，则返回空字符串。
