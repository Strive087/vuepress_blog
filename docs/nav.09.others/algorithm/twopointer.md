# 双指针

双指针主要分为两类，一类是快慢指针，另一类是左右指针。

## 快慢指针

### 判定链表是否包含环

一个指针走两步，一个指针走一步，如果有环，两个指针会相遇。

### 寻找链表的中点

一个指针走两步，一个指针走一步，快的指针到最后了，慢的指针指向中点。

### 寻找链表倒数的第k个元素

先让一个指针走k步，然后两个指针速率相同往前走，前面的指针到最后了，后面的指针刚好在倒数第k个位置。

## 左右指针

### 二分查找

首先保证线性存储是有序的，然后每次对比中间的那个数。

```js
function binarySearch(arr,target){
  let left = 0;
  let right = arr.length - 1;
  while(arr[left] != null && arr[right] != null){
    const mid = (left + right) / 2;
    if(arr[mid] === target){
      return mid;
    }else if(arr[mid] < target){
      left = mid + 1;
    }else{
      right = mid - 1;
    }
  }
}
```

### 两数之和
