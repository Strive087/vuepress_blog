# hash值

webpack中常用的hash有三种：

- hash：每次构建都会创建唯一的hash值，所以重新打包会生成不同的hash值。对于缓存来说每次都会失效。

- chunkhash：每次构建来自同一个chunk的文件，他们的hash值相同。对于缓存而言，也是每次都会失效。

- contenthash：根据文件的内容生成hash值，文件不变hash就保持不变。对于缓存而言就可以看做是Etag机制。
