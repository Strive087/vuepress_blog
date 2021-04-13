# 客户端存储

客户端存储主要有以下几种，localStorage，sessionStorage和cookie，WebSql和IndexDB主要用在前端有大容量存储需求的页面上，例如，在线编辑浏览器或者网页邮箱。他们都可以将数据存储在浏览器，应该根据不同的场景进行使用。

## Cookie

Cookie主要是由服务器生成，且前端也可以设置，保存在客户端本地的一个文件，通过response响应头的set-Cookie字段进行设置，且Cookie的内容自动在请求的时候被传递给服务器。如下：

```markdown
[HTTP/1.1 200 OK]
Server:[bfe/1.0.8.18]
Etag:["58860415-98b"]
Cache-Control:[private, no-cache, no-store, proxy-revalidate, no-transform]
Connection:[Keep-Alive]
Set-Cookie:[BDORZ=27315; max-age=86400; domain=.baidu.com; path=/]
Pragma:[no-cache]
Last-Modified:[Mon, 23 Jan 2017 13:24:37 GMT]
Content-Length:[2443]
Date:[Mon, 09 Apr 2018 09:59:06 GMT]
Content-Type:[text/html]
```

Cookie包含的信息：

它可以记录你的用户ID、密码、浏览过的网页、停留的时间等信息。当你再次来到该网站时，网站通过读取Cookies，得知你的相关信息，就可以做出相应的动作，如在页面显示欢迎你的标语，或者让你不用输入ID、密码就直接登录等等。一个网站只能读取它自己放置的信息，不能读取其他网站的Cookie文件。因此，Cookie文件还保存了host属性，即网站的域名或ip。

这些属性以键值对的方式进行保存，为了安全，它的内容大多进行了加密处理。Cookie文件的命名格式是：用户名@网站地址[数字].txt

### 浏览器携带Cookie条件

Set-Cookie响应头字段（Response header）是服务器发送到浏览器或者其他客户端的一些信息，一般用于登陆成功的情况下返回给客户端的凭证信息，然后下次请求时会带上这个cookie，这样服务器端就能知道是来自哪个用户的请求了。

Cookie请求头字段是客户端发送请求到服务器端时发送的信息（满足一定条件下浏览器自动完成，无需前端代码辅助）。

![xH9rhO](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/xH9rhO.png)

请看上面标红的三个属性，拿一个Http POST请求来说  <http://aaa.www.com/xxxxx/list>

如果满足下面几个条件：

1. 浏览器端某个Cookie的domain字段等于aaa.www.com或者www.com

2. 都是http或者https，或者不同的情况下Secure属性为false

3. 要发送请求的路径，即上面的xxxxx跟浏览器端Cookie的path属性必须一致，或者是浏览器端Cookie的path的子目录，比如浏览器端Cookie的path为/test，那么xxxxxxx必须为/test或者/test/xxxx等子目录才可以

上面3个条件必须同时满足，否则该Post请求就不能自动带上浏览器端已存在的Cookie

我们常用的$.ajax和axios都是基于原生xhr封装，他们在非跨域发送请求的时候，都会默认携带cookie。而fetch则要注意credentials属性，该属性可选值为：

- omit: 从不发送cookies.
- same-origin: 只有当URL与响应脚本同源才发送 cookies、 HTTP Basic authentication 等验证信息.(浏览器默认值,在旧版本浏览器，例如safari 11依旧是omit，safari 12已更改)
- include: 不论是不是跨域的请求,总是发送请求资源域在本地的 cookies、 HTTP Basic authentication 等验证信息.

ajax和fetch在跨域请求时，需要分别配置`withCredentials=true`和`credential：include`，才可携带cookie。

### Cookie优缺点

Cookie的优点：

- 给用户更人性化的使用体验，如记住“密码功能”、老用户登录欢迎语
- 弥补了HTTP无连接特性
- 站点统计访问人数的一个依据

Cookie的缺点：

- 它无法解决多人共用一台电脑的问题，带来了不安全因素
- Cookie文件容易被误删除
- 一人使用多台电脑
- Cookies欺骗。修改host文件，可以非法访问目标站点的Cookie
- 容量有限制，不能超过4kb
- 在请求头上带着数据安全性差

## localStorage

localStorage主要是前端开发人员，在前端设置，一旦数据保存在本地后，就可以避免再向服务器请求数据，因此减少不必要的数据请求，减少数据在浏览器和服务器间不必要地来回传递。

可以长期存储数据，没有时间限制，一天，一年，两年甚至更长，数据都可以使用。
localStorage中一般浏览器支持的是5M大小，这个在不同的浏览器中localStorage会有所不同

优点：

- localStorage拓展了cookie的4k限制
- localStorage可以将第一次请求的5M大小数据直接存储到本地，相比于cookie可以节约带宽
- localStorage的使用也是遵循同源策略的，所以不同的网站直接是不能共用相同的localStorage

缺点：

- 需要手动删除，否则长期存在
- 浏览器大小不一，版本的支持也不一样
- localStorage只支持string类型的存储，JSON对象需要转换
- localStorage本质上是对字符串的读取，如果存储内容多的话会消耗内存空间，会导致页面变卡

## sessionStorage

sessionStorage主要是前端开发人员，在前端设置，sessionStorage（会话存储），只有在浏览器被关闭之前使用，创建另一个页面时同意可以使用，关闭浏览器之后数据就会消失

存储上限限制：不同的浏览器存储的上限也不一样，但大多数浏览器把上限限制在5MB以下

## IndexedDB

随着浏览器的功能不断增强，越来越多的网站开始考虑，将大量数据储存在客户端，这样可以减少从服务器获取数据，直接从本地获取数据。

现有的浏览器数据储存方案，都不适合储存大量数据：Cookie 的大小不超过4KB，且每次请求都会发送回服务器；LocalStorage 在 2.5MB 到 10MB 之间（各家浏览器不同），而且不提供搜索功能，不能建立自定义的索引。所以，需要一种新的解决方案，这就是 IndexedDB 诞生的背景。

通俗地说，IndexedDB 就是浏览器提供的本地数据库，它可以被网页脚本创建和操作。IndexedDB 允许储存大量数据，提供查找接口，还能建立索引。这些都是 LocalStorage 所不具备的。就数据库类型而言，IndexedDB 不属于关系型数据库（不支持 SQL 查询语句），更接近 NoSQL 数据库。

IndexedDB 具有以下特点。

1. 键值对储存。 IndexedDB 内部采用对象仓库（object store）存放数据。所有类型的数据都可以直接存入，包括 JavaScript 对象。对象仓库中，数据以"键值对"的形式保存，每一个数据记录都有对应的主键，主键是独一无二的，不能有重复，否则会抛出一个错误。

2. 异步。 IndexedDB 操作时不会锁死浏览器，用户依然可以进行其他操作，这与 LocalStorage 形成对比，后者的操作是同步的。异步设计是为了防止大量数据的读写，拖慢网页的表现。

3. 支持事务。 IndexedDB 支持事务（transaction），这意味着一系列操作步骤之中，只要有一步失败，整个事务就都取消，数据库回滚到事务发生之前的状态，不存在只改写一部分数据的情况。

4. 同源限制 IndexedDB 受到同源限制，每一个数据库对应创建它的域名。网页只能访问自身域名下的数据库，而不能访问跨域的数据库。

5. 储存空间大 IndexedDB 的储存空间比 LocalStorage 大得多，一般来说不少于 250MB，甚至没有上限。

6. 支持二进制储存。 IndexedDB 不仅可以储存字符串，还可以储存二进制数据（ArrayBuffer 对象和 Blob 对象）。

具体用法参考[这篇文章](http://www.ruanyifeng.com/blog/2018/07/indexeddb.html)

## Web Sql

Web SQL 是在浏览器上模拟数据库，可以使用JS来操作SQL完成对数据的读写。它使用 SQL 来操纵客户端数据库的 API，这些 API 是异步的，规范中使用的方言是SQLlite。数据库还是在服务端，不建议使用，已废弃
