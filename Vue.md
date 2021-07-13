# 1. mvvm 的理解 mvc区别
- mvvm 
  - view
  - ViewModel 中间件 劫持和渲染
  - model
- mvc
  - View 传送指令到 Controller
  - Controller 完成业务逻辑后，要求 Model 改变状态
  - Model 将新的数据发送到 View，用户得到反馈

> [自己写的mvvm实战](https://github.com/rzp1/mvvm)
- vue mvvm 具体实现
  - observer
    - set 利用defineProperty监听所有key的值的变化, 调用dep所有watcher函数(notify)
    - get ，数据改变的时候调用
  - compile
    - 渲染核心, 每个地方用到data里面的数据都会`new watcher`
    - watcher函数 `Dep.target = this` 会把自身赋值到`Dep.target`, 之后调用自身`get`
  - watcher
    - get dep里面push一个watcher监听函数`Dep.target`
    - update 为了`observer`-`notify` 里面调用所有的update
