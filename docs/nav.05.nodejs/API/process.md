# process

## process.env

process.env 属性会返回包含用户环境的对象。

## process.platform

process.platform 属性返回字符串，标识 Node.js 进程运行其上的操作系统平台。

## process.argv

process.argv 属性会返回一个数组，其中包含当 Node.js 进程被启动时传入的命令行参数。 第一个元素是 process.execPath。 如果需要访问 argv[0] 的原始值，则参见 process.argv0。 第二个元素是正被执行的 JavaScript 文件的路径。 其余的元素是任何额外的命令行参数。

例如，假设 process-args.js 的脚本如下：

```js
// 打印 process.argv。
process.argv.forEach((val, index) => {
  console.log(`${index}: ${val}`);
});
```

启动 Node.js 进程：

```sh
node process-args.js 参数1 参数2 参数3
```

输出如下：

```markdown
0: /usr/local/bin/node
1: /Users/mjr/work/node/process-args.js
2: 参数1
3: 参数2
4: 参数3
```

## process.nextTick(callback[, ...args])

- callback <Function>
- ...args <any> 当调用 callback 时传入的其他参数。

process.nextTick() 方法将 callback 添加到下一个时间点的队列。 在 JavaScript 堆栈上的当前操作运行完成之后以及允许事件循环继续之前，此队列会被完全耗尽。 如果要递归地调用 process.nextTick()，则可以创建无限的循环
