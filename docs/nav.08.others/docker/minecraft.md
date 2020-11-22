# 基于docker搭建minecraft

1.安装docker，可看[官网文档](https://docs.docker.com/engine/install/centos/)（我的是centos）。

```sh
sudo yum install -y yum-utils

sudo yum-config-manager \
  --add-repo \
  https://download.docker.com/linux/centos/docker-ce.repo

sudo yum install docker-ce docker-ce-cli containerd.io

sudo systemctl start docker

sudo systemctl status docker

sudo systemctl enable docker
```

顺便提供下docker卸载，方便日后想不开

```sh
sudo yum remove docker-ce docker-ce-cli containerd.io
sudo rm -rf /var/lib/docker
```

2.防火墙开放端口，这里是centos，其他系统自己查阅

开放minecraft所需要的25565端口

```sh
firewall-cmd --zone=public --add-port=25565/tcp --permanent
firewall-cmd --complete-reload
```

提供一份配置手册

```sh
# 查看状态
[root@osboxes java]# systemctl status firewalld.service
# 不要忘记 --permanent
[root@osboxes java]# firewall-cmd --zone=public --add-port=8080/tcp --permanent
# OR 添加一个地址段
[root@osboxes java]# firewall-cmd --zone=public --add-port=5060-5061/udp --permanent
success
# 需要reload后才启用, 热加载
[root@osboxes java]# firewall-cmd --reload
# OR 冷加载
[root@osboxes java]# firewall-cmd --complete-reload
success
# 能看到新端口已经添加
[root@osboxes java]# firewall-cmd --zone=public --list-all
public (default, active)
  interfaces: eno16777984
  sources:
  services: dhcpv6-client mdns ssh
  ports: 8080/tcp
  masquerade: no
  forward-ports:
  icmp-blocks:
  rich rules:
# 删除一个端口
firewall-cmd --permanent --zone=public --remove-port=8080/tcp
firewall-cmd --permanent --zone=public --remove-port=8080/udp
```

3.安装jdk

官网下载[jdk8u212](https://www.oracle.com/java/technologies/javase/javase8u211-later-archive-downloads.html),我下的是rpm版本。

```sh
rpm -ivh jdk-8u212-linux-x64.rpm
```

4.下载minecraft服务端

先设置国内镜像,设置为以下内容：

```json
{
  "registry-mirrors": [
    "https://registry.docker-cn.com",
    "https://docker.mirrors.ustc.edu.cn",
    "https://hub-mirror.c.163.com"
  ]
}
```

```sh
sudo vim /etc/docker/daemon.json
sudo systemctl daemon-reload
sudo systemctl restart docker
```

下载并执行mc服务器

- VERSION=1.16.3：版本
- /root/data1.16.3:/data mc服务器目录
- FORGE_INSTALLER=forge-1.16.3-34.1.0-installer.jar：模组

```sh
docker run -d -it -p 25565:25565 -e EULA=TRUE -e VERSION=1.16.3 \
 -v /root/data1.16.3:/data -e TYPE=FORGE \
 -e FORGE_INSTALLER=forge-1.16.3-34.1.0-installer.jar \
 -e MEMORY=3G -e USE_AIKAR_FLAGS=true -e DIFFICULTY=normal \
 --name mc1.16.3backup itzg/minecraft-server
```

5.查看minecraft服务端日志

启动服务器可能没那么快，可查看日志来看进度

```sh
docker logs -f mc1.16.3
```

6.非正版用户

需要到mc服务器目录下，将server.properties文件中的online-mode改为false,然后服务。
