# jenkins+github持续集成配置

## 1.安装并下载插件

Jenkins的安装可以参考这篇[笔记](/nav.08.others/docker/jenkins.md)

![ZBTj1c](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/ZBTj1c.png)

安装之后用浏览器打开，设置完用户和选择安装默认推荐的插件后我们可以看到如下界面。

![tJnM56](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/tJnM56.png)

到系统管理=>插件管理，下载插件NodeJS Plugin 和 Publish Over SSH。

## 2.配置github仓库控制权限

在github页面，进入用户设置=>Developer settings=>Personal access tokens，如下勾选后点击确定保存，记住token后面会用。

![q48c5N](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/q48c5N.png)

回到jenkins，进入系统管理=>系统配置=>github服务器，添加凭证，设置如下，secret就是刚刚上一步得到的token。

![zfSZ12](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/zfSZ12.png)
![ga4cnK](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/ga4cnK.png)

回到github页面，选择你要触发jenkins构建的仓库，进入仓库设置=>Webhooks，添加Webhooks。

![kKHLnQ](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/kKHLnQ.png)

## 3.ssh远程发布配置

在jenkins，进入系统管理=>系统配置=>Publish over SSH，配置SSH Server，在Passphrase填写远程主机连接密码，Hostname填写ip地址，Username填写用户名，填写后点击Test Configuration测试是否成功连接。

![DQp9mO](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/DQp9mO.png)

## 4.新建任务

进入jenkins点击新建任务

- 构建一个自由风格的软件项目

![x6KLQP](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/x6KLQP.png)

- 配置任务
  - 源码管理，添加凭证，使用GitHub的账号密码，其他选项如下填写
![CgWPUM](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/CgWPUM.png)
![dVJ1K3](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/dVJ1K3.png)
  - 构建触发器，选择GitHub hook trigger for GITScm polling
![nPRumJ](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/nPRumJ.png)
  - 绑定，如下选择
![WN8qEC](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/WN8qEC.png)
  - 构建，选择执行shell，在命令里可填写你要执行的构建命令
![38lJ3p](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/38lJ3p.png)
  - 构建后操作，这里我们想要发送到远程主机进行部署，具体填写如下
![vnWtww](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/vnWtww.png)

### 至此我们便完成了jenkins+github持续集成的配置
