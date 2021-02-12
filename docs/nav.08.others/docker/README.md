# 容器镜像备份

## 备份镜像

先查看自己已创建的容器，然后根据容器ID备份容器生成快照，然后查看镜像

```sh
docker ps
docker commit -p <containerId> <backup-name>
docker images
```

## 保存备份

- 登录dockerhub账号，然后上传推送备份镜像。

```sh
docker login -u <username>
docker tag <imagesID> <name>/<backup-name>:<tag>
docker push <name>/<backup-name>
```

- 保存在本地

```sh
docker save -o ~/<backup-name>.tar <backup-name>
```

## 恢复容器

- 从dockerhub拉取

```sh
docker pull <name>/<backup-name>:<tag>
```

- 本地加载

```sh
docker load -i ~/<backup-name>.tar
```

然后就可以正常运行镜像。

## 删除tag

```sh
docker rmi <name>/<backup-name>:<tag>
```
