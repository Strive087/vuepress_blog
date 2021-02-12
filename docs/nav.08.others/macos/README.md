# 修改默认截图格式

1.更换默认文件名

打开终端，输入如下命令

```sh
defaults write com.apple.screencapture name "screenshot"
killall SystemUIServer
```

2.修改时间格式

现在文件名已经修改了，但是时间格式还是中文的，我们现在需要进一步修改

![时间设置](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/screenshot.png)

或者我们可以直接取消时间,把0改为1就恢复了

```sh
defaults write com.apple.screencapture "include-date" 0
killall SystemUIServer
```

3.更改图片格式

截图默认格式为png，输入如下命令可以修改成你要的任意格式(jpg进行替换)

```sh
defaults write com.apple.screencapture type jpg
killall SystemUIServer
```

4.更改截图路径

默认保存在桌面，我这里让他保存在文件夹下

```sh
defaults write com.apple.screencapture location ~/Desktop/screenshot
killall SystemUIServer
```
