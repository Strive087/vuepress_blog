# nginx

## nginx常用功能

### http代理，反向代理

![FJvFOf](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/FJvFOf.png)

反向代理作用：

隐藏服务器信息 -> 保证内网的安全，通常将反向代理作为公网访问地址，web服务器是内网，即通过nginx配置外网访问web服务器内网

配置：

```markdown
server {
    listen       80;
    server_name  www.zhengqing520.com;# 服务器地址或绑定域名

    location / { # 访问80端口后的所有路径都转发到 proxy_pass 配置的ip中
        root   /usr/share/nginx/html;
        index  index.html index.htm;
           proxy_pass http://zhengqingya.gitee.io; # 配置反向代理的ip地址和端口号 【注：url地址需加上http:// 或 https://】
    }
}
```

## 部署403报错

403 forbidden (13: Permission denied)，这个问题太鸡儿坑了！！！我目前遇到的具体三种：

1. 也就是第一次遇到的，自然是看了报错，发现是权限问题，然后修改了目录的权限
2. 就是启动用户已和nginx工作用户不同，可以用一下命令查下是否相同，不同的话修改下nginx.conf的user。

    ```sh
    ps aux | grep "nginx: worker process" | awk  '{print $1}'
    ```

3. 这也是最坑的一个，是什么SELinux未关闭，作为不是特别懂linux的肯定也跟我一样懵逼。反正就是查看SELinux是否关闭，显示为enable就是没关闭，需要关闭。

    ```sh
    ## 查看
    /usr/sbin/sestatus -v
    ## 临时关闭
    setenforce  0
    ## 永久关闭
    vim /etc/selinux/config
    
    #SELINUX=enforcing

    SELINUX=disabled
    ```

    [SELinux是什么](https://zhuanlan.zhihu.com/p/30483108)
