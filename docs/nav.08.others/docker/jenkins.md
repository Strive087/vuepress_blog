# 基于docker搭建jenkins

![AKsM7e](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/AKsM7e.png)

具体可以查阅[官网](https://www.jenkins.io/zh/doc/book/installing/#%E5%9C%A8macos%E5%92%8Clinux%E4%B8%8A)

```sh
docker run \
  -u root \
  -d \
  -p 8080:8080 \
  -v jenkins-data:/var/jenkins_home \
  jenkins/jenkins
```

修改为开机自启

```sh
docker container update --restart=always <containerId>
```
