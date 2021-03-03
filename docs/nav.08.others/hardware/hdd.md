# 机械硬盘

![32fa828ba61ea8d3c3793017940a304e251f584d](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/32fa828ba61ea8d3c3793017940a304e251f584d.jpg)

机械硬盘（HDD）主要结构有马达、磁盘、磁头臂和磁头等组成，目前市面上的机械硬盘主要有5400转/分钟、5900转/分钟和7200转/分钟（相同磁盘类型，转速越快读写速度也就越快）。

## 机械硬盘读写原理

![HIKUkB](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/HIKUkB.png)

机械硬盘内部的磁盘片上会被分为多个扇区和多个磁道。如图所示，例如要读写第五磁道第七扇区的数据，那么磁头臂将会让磁头移动到第五磁道的位置，接着马达将驱动磁盘片旋转，磁头会悬浮在磁盘上几纳米来进行读写数据。

![VSmCVy](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/VSmCVy.png)

磁盘面上会有很多小格，小格内有小磁粒，磁盘上的读取磁头可以读取磁粒的极性（转为电信号就是1或0），这样便可以读取数据，而写磁头可以改变磁粒的极性，这样便可以写入和改写数据。

## 机械磁盘类型

### LMR水平式记录磁盘

极性向左为0，相反为1。

![TpH39i](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/TpH39i.png)

### PMR垂直式记录磁盘

#### CMR传统磁盘

后来工艺水平升级，可以将读写磁头做的更小，于是磁粒的之间的密度也可以增大，可以让磁粒竖立，极性向下为0，相反为1。

![1w4cAB](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/1w4cAB.png)

这里可以看到单盘的磁粒的数量更多了，所以单盘的容量也就有了很大的提升。

![OJ7qar](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/OJ7qar.png)

#### SMR瓦楞式堆叠磁盘

![Co8yGs](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/Co8yGs.png)

瓦楞式堆叠磁盘，通过将磁道想瓦片一样进行堆叠，于是扩大的单盘的容量。但是这样的却损失的磁盘的读取性能。因为如果需要修改数据，需要加倍地去读写。例如需要修改第二磁道的数据，那么为了不影响第三磁道的数据这时需要将第三磁道数据复制一份，然后修改第二磁道，然后在重写第三磁道。但是修改第三又会影响第四，于是以此类推。就是因为如此造成了性能的损失。

![2021-03-0315.58.01](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/2021-03-03%2015.58.01.gif)

也是因为需要备份复制的数据，所以这种市面上这种硬盘的缓存都高达256MB，比CMR的硬盘缓存要大。
