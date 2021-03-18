# Vue架构

![WO5VXO](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/WO5VXO.png)

## MVVM

![75n34i](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/75n34i.png)

MVVM 由 Model,View,ViewModel 三部分构成，Model 层代表数据模型，也可以在Model中定义数据修改和操作的业务逻辑；View 代表UI 组件，它负责将数据模型转化成UI 展现出来，ViewModel 是一个同步View 和 Model的对象。

ViewModel 通过双向数据绑定把 View 层和 Model 层连接了起来，而View 和 Model 之间的同步工作完全是自动的，无需人为干涉，因此开发者只需关注业务逻辑，不需要手动操作DOM, 不需要关注数据状态的同步问题，复杂的数据状态维护完全由 MVVM 来统一管理。
