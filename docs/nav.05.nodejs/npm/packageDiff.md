# devDependencies和dependencies的区别

通常我们安装模块时,使用

```bash
npm i <package_name> --save
```

这时的模块将被放在 dependencies 下,而我们使用

```bash
npm i <package_name> --save --dev
```

这时的模块将被放在 devDependencies 下

他们的区别在于作为一个项目时,我们初始化 npm i 下载模块的时候,devDependencies 和 dependencies 下的所有依赖模块将被下载到本地的 node_modules,而在这个项目发布 npm 包时,别人 npm i <package_name>你的这个项目时,只会把 dependencies 下的所有依赖模块下载
