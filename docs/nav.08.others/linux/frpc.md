# 服务器内网穿透

我这里用的是SAKURA FRP（免费），具体安装配置主要看[官网](https://www.natfrp.com/),我这主要是给我自己做个配置手册，方便使用。

我是在linux系统上使用的。

1.创建隧道

具体看官网

2.安装

frpc@.service内填入以下内容：

```markdown
[Unit]
Description=SakuraFrp Service
After=network.target

[Service]
Type=idle
User=nobody
Restart=on-failure
RestartSec=60s
ExecStart=/usr/local/bin/frpc -f %i

[Install]
WantedBy=multi-user.target
```

```sh
cd /usr/local/bin
curl -Lo frpc https://getfrp.sh/d/frpc_linux_amd64
chmod 755 frpc
vi /lib/systemd/system/frpc@.service
systemctl daemon-reload
```

3.启动隧道

Unit 名称 是 frpc@<启动参数>，例如 frpc@wdnmdtoken666666:12345,不理解看官网。

```sh
systemctl <start|stop> <Unit名称>
systemctl status <Unit名称>
#查看当前运行的所有服务
systemctl list-units --type=service
systemctl <enable|disable> <Unit名称>
```

4.查看开机自启项

```sh
systemctl list-unit-files | grep enable
```
