# 手动切换npm源

## 切换为淘宝镜像

```bash
npm install cnpm 
```

1.临时使用

  ```bash
  npm --registry https://registry.npm.taobao.org install express
  ```

2.持久使用

  ```bash
  npm config set registry https://registry.npm.taobao.org
  ```

3.通过 cnpm

  ```bash
  npm install -g cnpm --registry=https://registry.npm.taobao.org
  ```
  
## 切换官方镜像

```bash
npm config set registry https://registry.npmjs.org/
```

## 查看当前 npm 源地址

```bash
npm config get registry
```

## nrm切换npm源

```bash
#通过 nrm 设置 npm 源
npm install -g nrm
nrm ls
nrm use <registry>
```

## npm设置代理

- npm 代理:

```bash
npm config set proxy http://127.0.0.1:1087
npm config set https-proxy http://127.0.0.1:1087
npm config set proxy socks5://127.0.0.1:1080
npm config set https-proxy socks5://127.0.0.1:1080
```

- 取消代理:

```bash
npm config delete proxy
npm config delete https-proxy
```
