# centos系统备份与还原

1.备份系统

用root身份到根目录下，然后执行文件打包命令，因为linux系统所有东西都可以看做文件。

```sh
su
cd /
tar cvpzf centos7.8.tgz / --exclude=/proc --exclude=/lost+found --exclude=/mnt --exclude=/sys --exclude=centos7.8.tgz
```

上面排除了一些没用的文件已经打包文件本身，如果有u盘啥的，要把media也排除出去。

2.恢复系统

也就是把原来的打包文件覆盖回去。

```sh
tar xvpfz centos7.8.tgz -C /
```

如果系统没有上面排除的文件记得创建。

```sh
mkdir /proc
mkdir /lost+found
mkdir /mnt
mkdir /sys
```

记得设置权限：

- /proc 权限：文件所有者：root群组：root 所有者：读取 执行 群组：读取 执行 其它：读取 执行
- /lost+found 权限：文件所有者：root群组：root 所有者：读取 写入 执行 群组：读取 执行 其它：读取 执行
- /mnt 权限：文件所有者：root群组：root 所有者：读取 写入 执行 群组：读取 执行 其它：读取 执行
- /sys 权限：文件所有者：root群组：root 所有者：读取 写入 执行 群组：读取 执行 其它：读取 执行

最后restorecon命令用来恢复SELinux文件属性即恢复文件的安全上下文:

```sh
restorecon -Rv /
```

restorecon的作用看[这里](https://man.linuxde.net/restorecon)

