# 免费开源录屏软件OBS简单教程

因为自己未曾使用过录屏软件，一时间找不到合适的录屏软件（大多数需要开通vip），导致最后帮不上女朋友的忙，于是自己花了会功夫研究了下[OBS](https://obsproject.com/)（官网地址）。

具体安装包可以在官网下载，有windows、mac和linux三个版本可供选择。觉得下载速度慢可以选择我这里的提供的windows和mac版本：

- [windows](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/software/OBS-Studio-26.1.1-Full-Installer-x64.exe)
- [mac](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/software/obs-mac-26.1.2.dmg)

我自己使用的mac版本，所以以下教程以macos为例。

1. 初次打开软件如下图所示（有些许差别无大碍）。
![4AwED7](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/4AwED7.png)
2. 这时候假设我们需要录制整个屏幕的内容，那么我们需要在来源这里添加一个显示器采集这个选项。
![XZhSYc](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/XZhSYc.png)
3. 然后选择新建，名称无所谓任取，点击确定之后，将显示如下图所示。这里显示器选择是针对多个显示屏，你可以选择你要录制的显示屏，如果就单个显示屏就不用管了。然后这里的裁剪可以自己试一下，一试就懂了。
![4cRD7j](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/4cRD7j.png)
4. 然后就是录制音频的部分，打开设置，找打音频这一栏，如果要录制自己的声音，就在麦克风这里选择一个，如果是想要录制声音就在桌面音频选择一个。这里特别说下，macos有个坑，就是在桌面音频这里没有任何选项只有一个已禁用，解决办法就是安装Soundflower这个软件，这个软件能够模拟音频的输出。[Soundflower下载](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/software/Soundflower-2-0b2.dmg)
![e53hA9](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/e53hA9.png)
5. 接着就是可以设置输出的视频格式，在设置-输出那一栏里。这里就自己找，我就不截图了。
6. 最后就是录制视频，点击开始录制就行了。

最后要说下来源，我们也可以选择窗口采集，这样对于只有一个屏幕的人就不用担心其他应用的覆盖问题。反正这个软件功能挺强大的，甚至还有推流的功能。（之前我也不知道推流是啥，google了下应该就是类似于转播，把一个直播录制下来然后在推送到其他视频直播平台）
