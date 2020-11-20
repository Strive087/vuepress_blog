# nodejs安装

这里我们使用nvm工具来安装管理nodejs版本。

1.安装nvm

这里我加了代理，你们有代理的话根据端口号自行修改。

```sh
wget -e "https_proxy=http://127.0.0.1:1087" -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.0/install.sh | bash
```

然后在~/.bash_profile, ~/.zshrc, ~/.profile, 或者 ~/.bashrc 文件中填入下面内容，接着输入nvm，如果显示没有，然就退出终端再进去。

```txt
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
```

2.安装nodejs

我是安装最新的长期稳定版本，你们可以按自己喜好安装。

```sh
nvm install --lts
```

这样就安装完了，如果想切换版本可以使用 nvm use 命令。
