# git安装和配置

## 安装

```sh
 yum install git
```

## 配置

用户和邮箱：

```sh
#配置
git config --global user.name "xxx"
git config --global user.email xxxxx@xx.com
#查看
git config --list
```

代理：

```sh
#设置代理
git config --global https.proxy 'http://127.0.0.1:1087'
git config --global https.proxy 'https://127.0.0.1:1087'
git config --global http.proxy 'socks5://127.0.0.1:1080'
git config --global https.proxy 'socks5://127.0.0.1:1080'
#取消代理
git config --global --unset http.proxy
git config --global --unset https.proxy
```
