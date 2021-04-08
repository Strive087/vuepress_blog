# ssh免密登录

1.生成公钥和私钥

```sh
ssh-keygen
```

2.将公钥的内容放入authorized_keys

```sh
touch authorized_keys
cat id_rsa.pub >> authorized_keys
```

3.将authorized_keys文件发送达到要连接的主机的用户的.ssh目录下

```sh
scp authorized_keys XXX@XXX.XXX.XXX.XXX:~/.ssh
```

4.配置目录及文件权限

- .ssh目录权限一般为755或者700。
- rsa_id.pub 及 authorized_keys 权限一般为644
- rsa_id 权限必须为600

```sh
chmod 755 .ssh
cd .ssh
chmod 644 rsa_id.pub authorized_keys
chmod 600 rsa_id
```

5.在本机配置想要连接的主机的别称（可选）

在本机的.ssh文件夹下创建config文件，内容如下:

```markdown
# 多主机配置
Host server.lwy （别名）
HostName XXX.XXX.XXX.XXX (ip地址)
Port 22
Host server.zdl （别名）
HostName XXX.XXX.XXX.XXX (ip地址)
Port 22

Host server.*
User root (连接的主机的用户名)
IdentityFile ~/.ssh/id_rsa
Protocol 2
Compression yes
ServerAliveInterval 60
ServerAliveCountMax 20
LogLevel INFO

#单主机配置
Host centos (别名)
User strive087 (连接的主机的用户名)
HostName 192.168.2.8
IdentityFile ~/.ssh/id_rsa
Protocol 2
Compression yes
ServerAliveInterval 60
ServerAliveCountMax 20
LogLevel INFO
```

生成文件后修改下权限便可以使用主机别称连接，例如：

```sh
chmod 644 config
ssh centos
```
