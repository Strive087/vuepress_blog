# 自定义属性

HTML规范也允许我们自定义一些属性。（最新规范中，推荐以data-开头）

设置自定义属性：

```html
<h1 data-name="zdl">name</h1>
```

## get attribute

获取自定义属性:

```js
//使用H5自定义属性对象Dataset来获取
var myDiv = document.getElementsByTagName("h1")[0];
var theValue = myDiv.dataset;    //DOMStringMap对象

document.getElementsByTagName("h1")[0].dataset.name
document.getElementsByTagName("h1")[0].dataset["name"]

//使用getAttribute函数可以获取任意属性，可以不需要data-开头
document.getElementsByTagName("h1")[0].getAttribute("data-share")
```

## delete atrribute

```js
delete myDiv.dataset.name
```

## add attribute

```js
myDiv.dataset.sex = 'man'
```

## 兼容性处理

如果不支持dataset，有必要做一下兼容性处理

```js
if(myDiv.dataset){
myDiv.dataset.sad = "false";
var thevalue = myDiv.dataset.sad;
}else{
myDiv.setAttribute("data-attribute","sad");
var theValue = myDiv.getAttribute("data-attribute"); // 获取自定义属性
}
```
