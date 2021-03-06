# UDP协议

UDP（User Datagram Protocol：用户数据报协议），相对于TCP来说，是一个非常简单的协议。

![1460000023501348](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/1460000023501348.jpg)

数据报：指的就是应用层所传输过来的一个完整的数据，UDP不会对这个完整的数据进行处理，不会进行拆分，也不会进行合并了再传输

从数据报的定义可以看出，UDP协议的数据长度，主要由应用层传输的数据长度所决定的，应用层传的数据越长，UDP数据报文就越长

## UDP头部

![1460000023501349](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/1460000023501349.jpg)

- 端口号：端口号在之前的文章中有提到，它标记的是使用网络的进程（源端口号就是原机器正在使用- 网络的进程，目的端口号就是目的机器正在使用网络的进程）
- 16位UDP长度：指的就是UDP数据报的长度（该长度包括UDP数据）
- 16位UDP校验和：检测UDP的用户数据报在传输中是否出错
- UDP数据：实际要发的数据

## UDP的特点

1.UDP是一个无连接的协议

  比如A和B进行电话通信，在通信之前，需要先拿出电话，然后拨号，这个是建立连接的过程。当电话拨通之后，说明连接已经建立起来了，此时就可以进行通信了。当通信之后，就将电话挂断，这个相当于结束连接。这个过程就是有连接的过程。而UDP是无连接的，也就是说，他在通信之前，不需要先建立连接，只要在想发数据的时候，直接就将数据发送出去了

2.UDP不能保证可靠的交付数据

  首先UDP是无连接的协议，在发送数据的时候想发就发，无法保证数据在网络中是否有丢失，即使有丢失，它也不会感知到,其次从前边的UDP头部也可以看出来，它的头部非常简单，并没有提供任何的机制来保证数据可以可靠的传给对方

3.UDP是面向报文传输的

  UDP对应用层传输的数据并不会进行任何的处理，直接塞进UDP协议的数据中

4.UDP没有拥塞控制

  如果把网络看做是一条公路，如果车辆特别多，就会导致拥塞。UDP并不会感知网络是否拥塞，不管是否拥塞，它都会尽量的把数据给发送出去

5.UDP的首部开销非常小

  从上边的UDP首部图可以看出来，总共也就8个字节
