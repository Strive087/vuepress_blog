# Vue-JSX

记录下常用的 jsx 语法要点。

- 在需要使用变量、函数的时候需要用{}包裹。

```js
//v-if
render() {
  return (
    <div class='wrapper'>
      {
        this.hello && (
          <div class='content'>hello</div>
        )
      }
    </div>
  )
}
//v-for
render() {
  return (
    <div class='wrapper'>
      <ul>
        {
          this.items.map(item => (
            <li>{ item.name }</li>
          ))
        }
      </ul>
    </div>
  )
}
```
