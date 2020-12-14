# 执行上下文栈ECS

在ES5中的代码有三种类型：global、function和eval。

每一种代码的执行都需要依赖自身的上下文。当然global的上下文可能涵盖了很多的function和eval的实例。函数的每一次调用，都会进入函数执行中的上下文,并且来计算函数中变量等的值。eval函数的每一次执行，也会进入eval执行中的上下文，判断应该从何处获取变量的值。

一个callee可以用返回（return）或者抛出异常（exception）来结束自身的上下文。
所有的ECMAScript的程序执行都可以看做是一个执行上下文堆栈[execution context stack]。堆栈的顶部就是处于激活状态的上下文。

![tRzDyX](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/tRzDyX.png)

begin => 进入全局执行上下文环境（初始化对象和函数），执行上下文栈最底部 => 运行全局上下文（激活函数） => 进入函数的执行上下文环境（初始化对象和函数），压入堆栈 => 运行执行上下文 => 返回（return）或者抛出异常（exception）结束上下文 => 返回全局执行上文环境继续运行

栈中每一个执行上下文可以表示为一个对象。

![UsnADi](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/UsnADi.png)

## 执行上下文（EC）

![XjA6KI](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/XjA6KI.png)

执行上下文(Execution Context)含有：

- 变量对象(variable object)：

  变量对象(variable object) 是与执行上下文相关的数据作用域(scope of data) 。
  
  它是与上下文关联的特殊对象，用于存储被定义在上下文中的变量(variables)和函数声明(function declarations) 。

  变量对象（Variable Object）是一个抽象的概念，不同的上下文中，它表示使用不同的object。例如，在global全局上下文中，变量对象也是全局对象自身[global object]。（这就是我们可以通过全局对象的属性来指向全局变量）。在一个函数上下文中，变量对象被表示为活动对象(activation object)。

  当函数被调用者激活，这个特殊的活动对象(activation object) 就被创建了。它包含普通参数(formal parameters) 与特殊参数(arguments)对象(具有索引属性的参数映射表)。活动对象在函数上下文中作为变量对象使用。

- 作用域链(scope chain)

  作用域链是一个对象列表(list of objects) ，用以检索上下文代码中出现的标识符(identifiers) 。

  作用域链的原理和原型链很类似，如果这个变量在自己的作用域中没有，那么它会寻找父级的，直到最顶层。

  标示符[Identifiers]可以理解为变量名称、函数声明和普通参数。

- this指针(this value)

  this是和执行的上下文环境息息相关的一个特殊对象。因此，它也可以称为上下文对象[context object]（激活执行上下文的上下文）。

  this是执行上下文环境的一个属性，而不是某个变量对象的属性。

  这个特点很重要，因为和变量不同，this是没有一个类似搜寻变量的过程。当你在代码中使用了this,这个 this的值就直接从执行的上下文中获取了，而不会从作用域链中搜寻。this的值只取决中进入上下文时的情况。
