# diff算法

其实页面的重新渲染完全可以使用新生成的Dom去整个替换掉旧的Dom，然而这么做比较低效，所以就借助接下来将介绍的diff比较算法来完成。

diff算法做的事情是比较VNode和oldVNode，再以VNode为标准的情况下在oldVNode上做小的改动，完成VNode对应的Dom渲染。

回到之前_update方法的实现，这个时候就会走到else的逻辑了：

```js
Vue.prototype._update = function(vnode) {
  const vm = this
  const prevVnode = vm._vnode
  
  vm._vnode = vnode  // 缓存为之前vnode
  
  if(!prevVnode) {  // 首次渲染
    vm.$el = vm.__patch__(vm.$el, vnode)
  } else {  // 重新渲染
    vm.$el = vm.__patch__(prevVnode, vnode)
  }
}
```

既然是在现有的VNode上修修补补来达到重新渲染的目的，所以无非是做三件事情：

- 创建新增节点
- 删除废弃节点
- 更新已有节点

## 创建新增节点

新增节点两种情况下会遇到：

1. VNode中有的节点而oldVNode没有

    VNode中有的节点而oldVNode中没有，最明显的场景就是首次渲染了，这个时候是没有oldVNode的，所以将整个VNode渲染为真实Dom插入到根节点之内即可，这一详细过程之前章节有详细说明。

2. VNode和oldVNode完全不同

    当VNode和oldVNode不是同一个节点时，直接会将VNode创建为真实Dom，插入到旧节点的后面，这个时候旧节点就变成了废弃节点，移除以完成替换过程。

判断两个节点是否为同一个节点，内部是这样定义的：

```js
function sameVnode (a, b) {  // 是否是相同的VNode节点
  return (
    a.key === b.key && (  // 如平时v-for内写的key
      (
        a.tag === b.tag &&   // tag相同
        a.isComment === b.isComment &&  // 注释节点
        isDef(a.data) === isDef(b.data) &&  // 都有data属性
        sameInputType(a, b)  // 相同的input类型
      ) || (
        isTrue(a.isAsyncPlaceholder) &&  // 是异步占位符节点
        a.asyncFactory === b.asyncFactory &&  // 异步工厂方法
        isUndef(b.asyncFactory.error)
      )
    )
  )
}
```

## 删除废弃节点

上面创建新增节点的第二种情况以略有提及，比较vnode和oldVnode，如果根节点不相同就将Vnode整颗渲染为真实Dom，插入到旧节点的后面，最后删除掉已经废弃的旧节点即可：

![ZarQTS](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/ZarQTS.gif)

```js
if (isDef(parentElm)) {  // 在它们的父节点内删除旧节点
  removeVnodes(parentElm, [oldVnode], 0, 0)
}

-------------------------------------------------------------

function removeVnodes (parentElm, vnodes, startIdx, endIdx) {
  for (; startIdx <= endIdx; ++startIdx) {
    const ch = vnodes[startIdx]
    if (isDef(ch)) {
      removeNode(ch.elm)
    }
  }
}  // 移除从startIdx到endIdx之间的内容

------------------------------------------------------------

function removeNode(el) {  // 单个节点移除
  const parent = nodeOps.parentNode(el)
  if(isDef(parent)) {
    nodeOps.removeChild(parent, el)
  }
}
```

## 更新已有节点

这个才是diff算法的重点，当两个节点是相同的节点时，这个时候就需要找出它们的不同之处，比较它们主要是使用patchVnode方法，这个方法里面主要也是处理几种分支情况：

### 静态节点

如果都是静态节点就跳过这次比较

### vnode没有文本节点

1. 都有children且不相同
    使用updateChildren方法更详细的比对它们的children，如果说更新已有节点是patch的核心，那这里的更新children就是核心中的核心，这个之后使用流程图的方式仔仔细细说明
2. 只有vnode有children
    那这里的oldVnode要么是一个空标签或者是文本节点，如果是文本节点就清空文本节点，然后将vnode的children创建为真实Dom后插入到空标签内。
3. 只有oldVnode有children
    因为是以vnode为标准的，所以vnode没有的东西，oldVnode内就是废弃节点，需要删除掉。
4. 只有oldVnode有文本
    只要是oldVnode有而vnode没有的，清空或移除即可。

### vnode节点有文本属性

还是那句话，以vnode为标准，所以vnode有文本节点的话，无论oldVnode是什么类型节点，直接设置为vnode内的文本即可。

至此，整个diff比对的大致过程就算是说明完毕了，我们还是以一张流程图来理清思路：

![CqIGf2](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/CqIGf2.gif)

## 重点：更新已有节点的子节点

示例：

```vue
<template>
  <ul>
    <li v-for='item in list' :key='item.id'>{{item.name}}</li>
  </ul>
</template>

<script>
export default {
  data() {
    return {
      list: [{
        id: 'a1',name: 'A'}, {
        id: 'b2',name: 'B'}, {
        id: 'c3',name: 'C'}, {
        id: 'd4',name: 'D'}
      ]
    }
  },
  mounted() {
    setTimeout(() => {
      this.list.sort(() => Math.random() - .5)
        .unshift({id: 'e5', name: 'E'})
    }, 1000)
  }
}
</script>
```

上述代码中首先渲染一个列表，然后将其随机打乱顺序后并添加一项到列表最前面，这个时候就会触发该组件更新子节点的逻辑，之前也会有一些其他的逻辑，这里只用关注更新子节点相关，来看下它怎么更新Dom的：

```js
function updateChildren(parentElm, oldCh, newCh) {
  let oldStartIdx = 0  // 旧第一个下标
  let oldStartVnode = oldCh[0]  // 旧第一个节点
  let oldEndIdx = oldCh.length - 1  // 旧最后下标
  let oldEndVnode = oldCh[oldEndIdx]  // 旧最后节点
  
  let newStartIdx = 0  // 新第一个下标
  let newStartVnode = newCh[0]  // 新第一个节点
  let newEndIdx = newCh.length - 1  // 新最后下标
  let newEndVnode = newCh[newEndIdx]  // 新最后节点
  
  let oldKeyToIdx  // 旧节点key和下标的对象集合
  let idxInOld  // 新节点key在旧节点key集合里的下标
  let vnodeToMove  // idxInOld对应的旧节点
  let refElm  // 参考节点
  
  checkDuplicateKeys(newCh) // 检测newVnode的key是否有重复
  
  while(oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {  // 开始遍历children
  
    if (isUndef(oldStartVnode)) {  // 跳过因位移留下的undefined
      oldStartVnode = oldCh[++oldStartIdx]
    } else if (isUndef(oldEndVnode)) {  // 跳过因位移留下的undefine
      oldEndVnode = oldCh[--oldEndIdx]  
    } 
    
    else if(sameVnode(oldStartVnode, newStartVnode)) {  // 比对新第一和旧第一节点
      patchVnode(oldStartVnode, newStartVnode)  // 递归调用                        
      oldStartVnode = oldCh[++oldStartIdx]  // 旧第一节点和下表重新标记后移        
      newStartVnode = newCh[++newStartIdx]  // 新第一节点和下表重新标记后移        
    }
    
    else if (sameVnode(oldEndVnode, newEndVnode)) {  // 比对旧最后和新最后节点     
      patchVnode(oldEndVnode, newEndVnode)  // 递归调用                            
      oldEndVnode = oldCh[--oldEndIdx]  // 旧最后节点和下表重新标记前移            
      newEndVnode = newCh[--newEndIdx]  // 新最后节点和下表重新标记前移            
    }
    
    else if (sameVnode(oldStartVnode, newEndVnode)) { // 比对旧第一和新最后节点
      patchVnode(oldStartVnode, newEndVnode)  // 递归调用
      nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm))  
      // 将旧第一节点右移到最后，视图立刻呈现
      oldStartVnode = oldCh[++oldStartIdx]  // 旧开始节点被处理，旧开始节点为第二个
      newEndVnode = newCh[--newEndIdx]  // 新最后节点被处理，新最后节点为倒数第二个
    }
    
    else if (sameVnode(oldEndVnode, newStartVnode)) { // 比对旧最后和新第一节点
      patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue)  // 递归调用
      nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm)
      // 将旧最后节点左移到最前面，视图立刻呈现
      oldEndVnode = oldCh[--oldEndIdx]  // 旧最后节点被处理，旧最后节点为倒数第二个
      newStartVnode = newCh[++newStartIdx]  // 新第一节点被处理，新第一节点为第二个
    }
    
    else {  // 不包括以上四种快捷比对方式
      if (isUndef(oldKeyToIdx)) {
        oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx) 
        // 获取旧开始到结束节点的key和下表集合
      }
      
      idxInOld = isDef(newStartVnode.key)  // 获取新节点key在旧节点key集合里的下标
          ? oldKeyToIdx[newStartVnode.key]
          : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx)
      
      if (isUndef(idxInOld)) { // 找不到对应的下标，表示新节点是新增的，需要创建新dom
        createElm(
          newStartVnode, 
          insertedVnodeQueue, 
          parentElm, 
          oldStartVnode.elm, 
          false, 
          newCh, 
          newStartIdx
        )
      }
      
      else {  // 能找到对应的下标，表示是已有的节点，移动位置即可
        vnodeToMove = oldCh[idxInOld]  // 获取对应已有的旧节点
        patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue)
        oldCh[idxInOld] = undefined
        nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm)
      }
      
      newStartVnode = newCh[++newStartIdx]  // 新开始下标和节点更新为第二个节点
      
    }
  }
  
  ...
  
}
```

函数内首先会定义一堆let定义的变量，这些变量是随着while循环体而改变当前值的，循环的退出条件为只要新旧节点列表有一个处理完就退出，看着循环体代码挺复杂，其实它只是做了三件事，明白了哪三件事再看循环体，会发现其实并不复杂：

1. 跳过undefined
    为什么会有undefined，之后的流程图会说明清楚。这里只要记住，如果旧开始节点为undefined，就后移一位；如果旧结束节点为undefined，就前移一位。
2. 快捷查找
    首先会尝试四种快速查找的方式，如果不匹配，再做进一步处理：
    1. 新开始和旧开始节点比对
        如果匹配，表示它们位置都是对的，Dom不用改，就将新旧节点开始的下标往后移一位即可。
    2. 旧结束和新结束节点比对
        如果匹配，也表示它们位置是对的，Dom不用改，就将新旧节点结束的下标前移一位即可。
    3. 旧开始和新结束节点比对
        如果匹配，位置不对需要更新Dom视图，将旧开始节点对应的真实Dom插入到最后一位，旧开始节点下标后移一位，新结束节点下标前移一位。
    4. 旧结束和新开始节点比对
        如果匹配，位置不对需要更新Dom视图，将旧结束节点对应的真实Dom插入到旧开始节点对应真实Dom的前面，旧结束节点下标前移一位，新开始节点下标后移一位。
3. key值查找
    1. 如果和已有key值匹配
        那就说明是已有的节点，只是位置不对，那就移动节点位置即可。
    2. 如果和已有key值不匹配
        再已有的key值集合内找不到，那就说明是新的节点，那就创建一个对应的真实Dom节点，插入到旧开始节点对应的真实Dom前面即可。
