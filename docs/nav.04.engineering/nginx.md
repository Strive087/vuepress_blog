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
