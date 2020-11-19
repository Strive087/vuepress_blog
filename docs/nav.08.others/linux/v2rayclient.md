# V2ray客户端安装配置

## 仅做笔记自用

1. 官网下载 v2ray-linux-64.zip 文件，[官网地址](https://github.com/v2fly/v2ray-core/releases)

2.将下载好的文件解压

```sh
unzip -n v2ray-linux-64.zip -d ./v2ray
```

3.将可执行文件、配置文件移动到对应位置

```sh
cd v2ray
cp v2ray /usr/local/bin/
cp v2ctl /usr/local/bin/
cp geoip.dat /usr/local/bin/
cp geosite.dat /usr/local/bin/
mkdir /usr/local/etc/v2ray/
cp config.json /usr/local/etc/v2ray/
```

4.生成v2ray服务

```sh
cp systemd/system/v2ray.service /usr/lib/systemd/system
mkdir /var/log/v2ray/
touch /var/log/v2ray/access.log
touch /var/log/v2ray/error.log
touch /var/run/v2ray.pid
systemctl start v2ray
systemctl status v2ray
```

5.开机自启服务

```sh
systemctl enable v2ray
```

6.config.json文件配置

这个文件在/usr/local/etc/v2ray/目录下，具体配值需要根据你v2ray服务器的节点等信息，具体看[官网](https://www.v2ray.com/)。
