# 生命周期总结

![1690b0a7158c1cbd](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/1690b0a7158c1cbd.jpg)

- beforeCreate ：初始化了部分参数，如果有相同的参数，做了参数合并，执行 beforeCreate ；
- created ：初始化了 Inject 、Provide 、 props 、methods 、data 、computed 和 watch，执行 created ；
- beforeMount ：检查是否存在 el 属性，存在的话进行渲染 dom 操作，执行 beforeMount ；
- mounted ：实例化 Watcher ，渲染 dom，执行 mounted ；
- beforeUpdate ：在渲染 dom 后，执行了 mounted 钩子后，在数据更新的时候，执行 - beforeUpdate ；
- updated ：检查当前的 watcher 列表中，是否存在当前要更新数据的 watcher ，如果存在就执行 updated ；
- beforeDestroy ：检查是否已经被卸载，如果已经被卸载，就直接 return 出去，否则执行 beforeDestroy ；
- destroyed ：把所有有关自己痕迹的地方，都给删除掉；
