# code split

代码分割可以利用浏览器并行加载，更快地提高网页渲染性能。

首先我们要知道webpack配置中entry的数量就代表了会产生至少几个chunk。

其次就是我们可以通过以下配置来将node_modules中的代码单独打包出来，以及会提取每个入口文件中公共文件单独打包(对文件大小有要求，文件太小不会提取)。具体看[官网](https://webpack.docschina.org/plugins/split-chunks-plugin/)

```js
optimization:{
  splitChunks:{
    chunks:'all',
  }
}
```

最后，如果希望对单入口文件中依赖的文件单独打包一个chunk，需要使用import()方法来加载。

```js
import(/* webpackChunkName: 'test' */ './test')
  .then(({ sub }) => {
    console.log(sub(2, 1));
  })
  .catch((e) => console.log(e));
```
