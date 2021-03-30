# 项目中遇到的问题

## html-loader与url-loader图片引入出错

html标签中src的图片被成功打包，但是src的路径文件名指向一个.jpg的错误文件，文件内容如下：

![0Y5Kue](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/0Y5Kue.png)

初步原因分析：

html-loader和url-loader在最新版本中均默认开启esModule,具体应该涉及到html-loader和url-loader在引入图片的方式不同，不支持都进行esModule引入。

解决办法：

在html-loader和url-loader的options中esModule设置为false。

## postcss-loader配置postcss-preset-env报错

参考最新的postcss-loader的options写法即可：

![LAPpgo](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/LAPpgo.png)
