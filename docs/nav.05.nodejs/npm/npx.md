# npm 和 npx

- NPM ： 管理 Node 包的工具
- NPX ： 执行 Node 包的工具

npm5.2+支持 NPX

NPM 本身实际上不能运行任何包，如果你想去执行某个包，必须在 package.json 文件中去定义。

当通过 NPM 安装 Node 包，NPM 会在 node_modules 下的.bin 里创建一个软连接。

本地安装链接会放到./node_modules/.bin 目录

全局安装会连接到全局的文件，linux/macos 在/usr/local/bin 里，windows 则在/AppData/npm

## npm

安装到特定项目下的 Node 包，执行:

```sh
npm install some-package
```

现在如果像下面这样去执行 some-package 会失败的。只有全局安装的包才可以只用包名去执行。

```sh
some-package
```

为了解决这个问题，必须像下面这样，将本地包的相对项目的路径填写全。

```sh
./node_modules/.bin/some-package
```

当然如果你非要通过命令去执行的话，也不是不可以的。通过编辑 package.json 文件，将以下脚本添加到 script 属性下:

```json
{
  "name": "whatever",
  "version": "1.0.0",
  "scripts": {
    "some-package": "some-package"
  }
}
```

然后通过npm run some-package调用。

## npx

npx会检查命令``<some-package>``是否出现在$PATH,或本地项目中，然后去执行。

所以，对于上面的例子，如果想通过在本地执行，可以通过npx some-package执行。

```sh
npx some-package
```

npx另一个重要的优势是，可以执行未安装的包的命令，例如：

```sh
npx create-react-app my-app
```

上面的例子将会创建一个名为my-app的React的工程，创建的位置就在输入命令的当前文件夹，并且保证永远使用最新的构建工具，而不用担心升级的问题。而如果不用npx的话，你需要首先通过npm安装create-react-app包才可以create-react-app my-app，并且一旦create-react-app升级了你都需要执行create-react-app的升级。

作者：猫先生的一天
链接：<https://www.jianshu.com/p/1265fd73fc81>
来源：简书
