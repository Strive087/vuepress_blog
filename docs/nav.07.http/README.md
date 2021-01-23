# http协议

先了解一下OSI网络协议：

![fRvivX](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/fRvivX.jpg)

预备知识：[了解TCP/IP协议](https://www.cnblogs.com/rickiyang/p/13039228.html)，[MAC与IP之间的联系与区别](https://blog.csdn.net/yang_best/article/details/41643589)

http是基于TCP/IP协议的应用层协议。它不涉及数据包（packet）传输，主要规定了客户端和服务器之间的通信格式，默认使用80端口。

到目前为止http协议历经4版本，他们分别是：

- http/0.9
- http/1.0
- http/1.1
- http/2

另外http/3正正处于草案阶段。

## http/0.9

1991年发布的0.9版极其简单，只有一个请求方法GET。

- GET：GET请求会显示请求指定的资源。一般来说GET方法应该只用于数据的读取，而不应当用于会产生副作用的非幂等的操作中。GET会方法请求指定的页面信息，并返回响应主体，GET被认为是不安全的方法，因为GET方法会被网络蜘蛛等任意的访问。

请求报文：

```text
GET /index.html
```

客户端与服务器建立tcp连接后，客户端发送请求，而服务器只能响应html格式的字符串，不能响应其他类型的数据。而且当服务器响应完一次后，便会关闭tcp连接。

响应报文：

```text
<html>
  <body>Hello World</body>
</html>
```

## http/1.0

首先这个版本数据的传输不再局限于文字，包括图像、视频等任何格式的内容都可以发送。

其次在请求方法上新增了POST和HEAD：

- POST：POST请求会向指定资源提交数据，请求服务器进行处理，如：表单数据提交、文件上传等，请求数据会被包含在请求体中。POST方法是非幂等的方法，因为这个请求可能会创建新的资源或/和修改现有资源。

- HEAD：HEAD方法与GET方法一样，都是向服务器发出指定资源的请求。但是，服务器在响应HEAD请求时不会回传资源的内容部分，即：响应主体。这样，我们可以不传输全部内容的情况下，就可以获取服务器的响应头信息。HEAD方法常被用于客户端查看服务器的性能。

再次，HTTP请求和回应的格式也变了。除了数据部分，每次通信都必须包括头信息（HTTP header），用来描述一些元数据。

其他的新增功能还包括状态码（status code）、多字符集支持、多部分发送（multi-part type）、权限（authorization）、缓存（cache）、内容编码（content encoding）等。

但在建立连接方面还是和上一版本类似，每个TCP连接只能发送一次请求。由于建立连接成本较高，后面非标准定义了Connection: keep-alive这样的字段，需要请求和响应报头都含有时，该TCP连接将可以复用。

请求报文：

```text
GET / HTTP/1.0
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5)
Accept: */*
```

第一行是请求命令，必须在尾部添加协议版本（HTTP/1.0）。后面就是多行头信息，描述客户端的情况。

响应报文：

```text
HTTP/1.0 200 OK 
Content-Type: text/plain
Content-Length: 137582
Expires: Thu, 05 Dec 1997 16:00:00 GMT
Last-Modified: Wed, 5 August 1996 15:55:28 GMT
Server: Apache 0.84

<html>
  <body>Hello World</body>
</html>
```

回应的格式是"头信息 + 一个空行（\r\n） + 数据"。其中，第一行是"协议版本 + 状态码（status code） + 状态描述"。

### Content-Type 字段

关于字符的编码，1.0版规定，头信息必须是 ASCII 码，后面的数据可以是任何格式。因此，服务器回应的时候，必须告诉客户端，数据是什么格式，这就是Content-Type字段的作用。

- text/plain
- text/html
- text/css
- image/jpeg
- image/png
- image/svg+xml
- audio/mp4
- video/mp4
- application/javascript
- application/pdf
- application/zip
- application/atom+xml

这些数据类型总称为MIME type，每个值包括一级类型和二级类型，之间用斜杠分隔。

MIME type还可以在尾部使用分号，添加参数。

```text
Content-Type: text/plain; charset=utf-8
```

上面的类型表明，发送的是网页，而且编码是UTF-8。

客户端请求的时候，可以使用Accept字段声明自己可以接受哪些数据格式。

```text
Accept: */*
```

表示可以接受任何数据。

### Content-Encoding 字段

由于发送的数据可以是任何格式，因此可以把数据压缩后再发送。Content-Encoding字段说明数据的压缩方法。

```text
Content-Encoding: gzip
Content-Encoding: compress
Content-Encoding: deflate
```

客户端在请求时，用Accept-Encoding字段说明自己可以接受哪些压缩方法。

## http/1.1

这个版本是目前使用最为广泛的版本。该本新增以下几项内容：

### 持久连接

1.1 版的最大变化，就是引入了持久连接（persistent connection），即TCP连接默认不关闭，可以被多个请求复用，不用主动声明Connection: keep-alive，http/1.1协议已经默认声明。

客户端和服务器发现对方一段时间没有活动，就可以主动关闭连接。不过，规范的做法是，客户端在最后一个请求时，发送Connection: close，明确要求服务器关闭TCP连接。

目前，对于同一个域名，大多数浏览器允许同时建立6个持久连接。

### 管道机制

1.1 版还引入了管道机制（pipelining），即在同一个TCP连接里面，客户端可以同时发送多个请求。这样就进一步改进了HTTP协议的效率。

举例来说，客户端需要请求两个资源。以前的做法是，在同一个TCP连接里面，先发送A请求，然后等待服务器做出回应，收到后再发出B请求。管道机制则是允许浏览器同时发出A请求和B请求，但是服务器还是按照顺序，先回应A请求，完成后再回应B请求。

### Content-Length字段

由于这个版本的TCP连接可以发送多个响应报文，所以需要有个机制能够在多个数据包中区分开每个报文，而Content-Length能够知道本次报文的长度。

在1.0版中，Content-Length字段不是必需的，因为浏览器发现服务器关闭了TCP连接，就表明收到的数据包已经全了。

### 分块传输编码

使用Content-Length字段的前提条件是，服务器发送回应之前，必须知道回应的数据长度。

对于一些很耗时的动态操作来说，这意味着，服务器要等到所有操作完成，才能发送数据，显然这样的效率不高。更好的处理方法是，产生一块数据，就发送一块，采用"流模式"（stream）取代"缓存模式"（buffer）。

因此，1.1版规定可以不使用Content-Length字段，而使用"分块传输编码"（chunked transfer encoding）。只要请求或回应的头信息有Transfer-Encoding字段，就表明回应将由数量未定的数据块组成。

```text
HTTP/1.1 200 OK
Content-Type: text/plain
Transfer-Encoding: chunked

25
This is the data in the first chunk

1C
and this is the second one

3
con

8
sequence

0
```

每个非空的数据块之前，会有一个16进制的数值，表示这个块的长度。最后是一个大小为0的块，就表示本次回应的数据发送完了。

### 新增方法

1.1版本新增以下方法：

- PUT：PUT请求会身向指定资源位置上传其最新内容，PUT方法是幂等的方法。通过该方法客户端可以将指定资源的最新数据传送给服务器取代指定的资源的内容。
- PATCH：PATCH请求与PUT请求类似，同样用于资源的更新。二者有以下两点不同：
  - 但PATCH一般用于资源的部分更新，而PUT一般用于资源的整体更新。
  - 当资源不存在时，PATCH会创建一个新的资源，而PUT只会对已在资源进行更新。
- TRACE：TRACE请求服务器回显其收到的请求信息，该方法主要用于HTTP请求的测试或诊断。
- CONNECT：CONNECT方法是HTTP/1.1协议预留的，能够将连接改为管道方式的代理服务器。通常用于SSL加密服务器的链接与非加密的HTTP代理服务器的通信。
- OPTIONS：OPTIONS请求与HEAD类似，一般也是用于客户端查看服务器的性能。 这个方法会请求服务器返回该资源所支持的所有HTTP请求方法，该方法会用'*'来代替资源名称，向服务器发送OPTIONS请求，可以测试服务器功能是否正常。JavaScript的XMLHttpRequest对象进行CORS跨域资源共享时，就是使用OPTIONS方法发送嗅探请求，以判断是否有对指定资源的访问权限。
- DELETE：DELETE请求用于请求服务器删除所请求URI（统一资源标识符，Uniform Resource Identifier）所标识的资源。DELETE请求后指定资源会被删除，DELETE方法也是幂等的。

### 新增字段

客户端请求的头信息新增了Host字段，用来指定服务器的域名。

## http/2

### 二进制协议

HTTP/1.1 版的头信息肯定是文本（ASCII编码），数据体可以是文本，也可以是二进制。HTTP/2 则是一个彻底的二进制协议，头信息和数据体都是二进制，并且统称为"帧"（frame）：头信息帧和数据帧。

### 多工

http/2可以在一个tcp连接中同时发送多个请求或响应，而且不用按照顺序一一对应，这样就避免了"队头堵塞"。

举例来说，在一个TCP连接里面，服务器同时收到了A请求和B请求，于是先回应A请求，结果发现处理过程非常耗时，于是就发送A请求已经处理好的部分， 接着回应B请求，完成后，再发送A请求剩下的部分。

这样双向的、实时的通信，就叫做多工（Multiplexing）。

### 数据流

因为 HTTP/2 的数据包是不按顺序发送的，同一个连接里面连续的数据包，可能属于不同的回应。因此，必须要对数据包做标记，指出它属于哪个回应。

HTTP/2 将每个请求或回应的所有数据包，称为一个数据流（stream）。每个数据流都有一个独一无二的编号。数据包发送的时候，都必须标记数据流ID，用来区分它属于哪个数据流。另外还规定，客户端发出的数据流，ID一律为奇数，服务器发出的，ID为偶数。

数据流发送到一半的时候，客户端和服务器都可以发送信号（RST_STREAM帧），取消这个数据流。1.1版取消数据流的唯一方法，就是关闭TCP连接。这就是说，HTTP/2 可以取消某一次请求，同时保证TCP连接还打开着，可以被其他请求使用。

客户端还可以指定数据流的优先级。优先级越高，服务器就会越早回应。

### 头信息压缩

因为报头的信息每次都要附带，而他们的重复率很高，为了减少资源浪费以及加快访问速度。HTTP/2 对这一点做了优化，引入了头信息压缩机制（header compression）。一方面，头信息使用gzip或compress压缩后再发送；另一方面，客户端和服务器同时维护一张头信息表，所有字段都会存入这个表，生成一个索引号，以后就不发送同样字段了，只发送索引号，这样就提高速度了。

### 服务器推送

HTTP/2 允许服务器未经请求，主动向客户端发送资源。
