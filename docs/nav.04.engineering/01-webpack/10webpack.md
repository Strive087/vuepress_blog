# webpack 构建原理

![X1bJe9](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/X1bJe9.jpg)

## 实现简单的webpack

实现步骤：

1. 根据配置文件entry，获取入口文件。
2. 使用@babel/parser，将入口文件进行解析，生成抽象语法树ast。
3. 使用@babel/traverse，遍历ast中引入的节点，将引入的节点的路径信息存放到依赖deps中。
4. 使用@babel/core，将ast编译成js环境可用的代码，然后将路径、代码和依赖存放到一个依赖关系数组modules中。
5. 提取依赖中的路径信息，循环以上步骤，最终得到一个依赖数组modules。
6. 对依赖数组进行reduce操作，形成以一个依赖关系表graphs。
7. 对依赖关系表graphs中的代码进行提取、合并，生成最终的打包文件。

