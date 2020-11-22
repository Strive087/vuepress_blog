# U盘等设备挂载

由于linux系统不能自动识别新设备，需要手动识别，手动挂载。

1、查看当前系统磁盘列表

```sh
fdisk -l
```

找出U盘等设备的设备Boot

2、执行挂载

执行命令挂载设备，这里可以在mnt下新建文件夹，区分不同设备。挂载完成后便可到mnt目录下访问。

```sh
mkdir /mnt/usb
mount <设备Boot> /mnt/usb
cd /mnt/usb
```

3、弹出设备

执行命令取消挂载即可

```sh
unmount /mnt/usb
```
