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

# 2. 生命周期

<img src="./images/lifecycle.png" />

1. init 一些事件和声明周期
2. `beforCreate` 获取不到data props...
3. `initState` 初始化`props`、`data`、`methods`、`watch`、`computed` 等属性
4. `created` 就可以获取到data props...
5. 判断是否有el 是否有template
6. `beforeMount`
7. `vm._render()` 渲染 VNode, `vm._update()` 把 Vnode patch 到 真是DOM
8. `mounted`
9. `beforUpdate` 两个条件 mounted，watcher 里面有， 之后在watcher调用。
10. `updated`
11. `beforeDestroy` 先子后父 和 mounted一致
12. `destroyed` 

### 常见问题
- data 是函数，是因为对象是引用类型，导致都使用
- 所有的生命周期钩子自动绑定 this 上下文到实例中，所以不能使用箭头函数来定义一个生命周期方法 (例如 created: () => this.fetchTodos()),会导致this指向父级。
- 在使用vue-router时有时需要使用来缓存组件状态，这个时候created钩子就不会被重复调用了，如果我们的子组件需要在每次加载或切换状态的时候进行某些操作，可以使用activated钩子触发。
- 父子组件的钩子并不会等待请求返回，请求是异步的，VUE设计也不能因为请求没有响应而不执行后面的钩子。所以，我们必须通过v-if来控制子组件钩子的执行时机。

### 父子组件钩子过程
- 加载渲染过程
  ```JavaScript
  父beforeCreate->父created->父beforeMount->
  子beforeCreate->子created->子beforeMount->子mounted->
  父mounted
  ```
- 更新过程
  ```JavaScript
  父beforeUpdate->
  子beforeUpdate->子updated->
  父updated
  ```
- 销毁过程
  ```JavaScript
  父beforeDestroy->
  子beforeDestroy->子destroyed->
  父destroyed
  ```

# 3. vm.$set()
- Vue 初始化实例时对属性执行 getter/setter 转化, 所以新增属性无法触发
  ```Javascript
  var vm = new Vue({
    data:{
      a:1
    }
  })

  // `vm.a` 是响应式的

  vm.b = 2
  // `vm.b` 是非响应式的
  ```
- 数组无法触发
  ```Javascript
  var vm = new Vue({
    data: {
      items: ['a', 'b', 'c']
    }
  })
  vm.items[1] = 'x' // 不是响应性的
  vm.items.length = 2 // 不是响应性的
  ```
# 4. nextTick & Vue的数据为什么频繁变化但只会更新一次
> https://juejin.cn/post/6844903843197616136#heading-6

通俗的说：修改数据后，dom树没有立即更新，等dom树更新完成执行。

1. 只要观察到数据变化，Vue 将开启一个队列(`queenWatcher`)，并缓冲在同一事件循环中发生的所有数据改变。如果同一个 watcher 被多次触发，只会被推入到队列中一次,
2. 会执行`nextTick(flushScheduleQueue)`, 然后 `nextTick` 会把 `flushScheduleQueue` 推入自己内部的cb数组中,
3. 如果有 `$nextTick` 会把`$nextTick的回调`推入nextTick内部的cb数组中
   - Vue 在内部尝试对异步队列使用原生的 Promise.then 和 MessageChannel 方法，如果执行环境不支持，会采用 setTimeout(fn, 0) 代替。
4. nextTick里面的会把数组cb一个一个执行，
5. watch.run()
6. updateComponent()
7. dom 更新 -> Vue.nextTick 获取到改变后的 DOM

# 5. 模板解析
模版解析分为三个过程 `parse`、`optimize`、`generate`，最终生成render函数。
1. parse阶段：使用正在表达式将`template`进行字符串解析，得到`指令`、`class`、`style`等数据，生成抽象语法树 AST。
2. optimize阶段：寻找 `AST` 中的静态节点进行标记，为后面 VNode 的 patch 过程中对比做优化。被标记为 `static` 的节点在后面的 `diff` 算法中会被直接忽略，不做详细的比较。
3. generate阶段：根据 `AST` 结构拼接生成 `render` 函数的字符串。

# 6. 虚拟dom
1. `diff`对比`Virtual Dom`, 减少更新`真实dom`范围。批量进行patch。
2. `Virtual Dom`挂载信息较少，效率更高。
3. 具备跨平台的优势

- flags 当前VNode 类型
- ChildrenFlags 子内是否有VNode, VNode 类型
# 6. diff 算法


# 7. vue3 理解 proxy defineProperty
1. Object.defineProperty 需要深度遍历监听
2. Object.defineProperty 无法监听数组
3. proxy 兼容性差 ie11
