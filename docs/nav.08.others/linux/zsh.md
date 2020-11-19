# oh-my-zsh安装

1.安装zsh

安装zsh，将zsh替换为默认shell,查看当前shell是否为zsh（可能需要重启生效）。

```sh
yum install zsh
chsh -s /bin/zsh
echo $SHELL
```

2.安装oh-my-zsh

安装oh-my-zsh。（有代理可以用代理）

```sh
#无代理
wget https://github.com/robbyrussell/oh-my-zsh/raw/master/tools/install.sh -O - | sh

#有代理
wget -e "https_proxy=http://127.0.0.1:1087" https://github.com/robbyrussell/oh-my-zsh/raw/master/tools/install.sh -O - | sh
```

实在不行可以手动安装

```sh
git clone git://github.com/robbyrussell/oh-my-zsh.git ~/.oh-my-zsh
cp ~/.oh-my-zsh/templates/zshrc.zsh-template ~/.zshrc
```

3.修改主题,重启终端

可查看可配置的主题，然后修改主题。

当前用户主目录下的一个.zshrc隐藏文件，并修改ZSH_THEME="agnoster"双引号中的主题名字。

```sh
ls ~/.oh-my-zsh/themes
vim ~/.zshrc
```
