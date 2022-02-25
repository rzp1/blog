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
    - set 利用defineProperty监听所有key的值的变化, 调用`当前key-dep`所有watcher函数(notify)
    - get ，数据改变的时候调用
  - compile
    - 渲染核心, 每个地方用到data里面的数据都会`new watcher`
    - watcher函数 `Dep.target = this` 会把自身赋值到`Dep.target`, 之后调用自身watcher`get`
  - watcher
    - observer-get dep里面push一个watcher监听函数`Dep.target`
    - update 为了`observer`-`notify` 里面调用所有的update

- 源码
  - 依赖收集 (`wather和dep是互相引用关系`wather里面有deps, dep里面有wathers)
    1. 渲染 new Watcher阶段
      ```Javascript
        updateComponent = () => {
          vm._update(vm._render(), hydrating)
        }
        new Watcher(vm, updateComponent, noop, {
          before () {
            if (vm._isMounted) {
              callHook(vm, 'beforeUpdate')
            }
          }
        }, true /* isRenderWatcher */)
      ```
    2. `Watcher` 里面`construct` 会调用 `get` 方法
    3. pushTarget(this:watcher) -> Dep.target = _target
    4. `value = this.getter.call(vm, vm)` // 也就是如下代码，局部更新，为了调用`监听的get`
      ```Javascript
        vm._update(vm._render(), hydrating)
      ```
    5. `getter` 上都持有一个 `dep`
      ```Javascript
        if (Dep.target) {
          dep.depend()
        }
      ```
    6. `Dep.target.addDep(this:dep)`, target目前是watcher，去watcher那看看
    7. `dep.addSub(this:watcher)`,watcher入栈
    8. cleanupDeps 如果newDeps里面没有, 则没用了，清除dep里面当前watcher，然后把 newDepIds 和 depIds 交换，newDeps 和 deps 交换，并把 newDepIds 和 newDeps 清空。
  - 派发更新
    - Dep.notify(), 调用所有的watcher.update()
    - queueWatcher
      - 去重复
    - nextTick(flushScheduleQueue) 在`nextTick`执行时执行所有的watcher。`waiting`通过这个保证只调用一次。(异步更新视图, 解决多操作)
      - flushScheduleQueue（队列长度发生变化会重新跑当前函数
        - 队列排序-从小到大，创建就是父<子, 则更新也要先父后子
        - 遍历后 执行 `watcher.run()`
      - nextTick
        - Vue 在内部尝试对异步队列使用原生的 setImmediate 和 MessageChannel 方法，如果执行环境不支持，会采用 setTimeout(fn, 0) 代替。以便能在下次tick执行。
        - callbacks 存储很多，一起执行。
    - `watcher.run()`
    - updateComponent
      - 也会调用`getter`获取值去和旧值对比。所以也会调用(render函数)

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

nextTick，在下一次任务执行或者在本次微任务执行，为了解决数据多次改变，而频繁更新视图。统一处理。

# 5. 模板解析
模版解析分为三个过程 `parse`、`optimize`、`generate`，最终生成render函数。
1. parse阶段：使用正在表达式将`template`进行字符串解析，得到`指令`、`class`、`style`等数据，生成抽象语法树 AST。
2. optimize阶段：寻找 `AST` 中的静态节点进行标记，为后面 VNode 的 patch 过程中对比做优化。被标记为 `static` 的节点在后面的 `diff` 算法中会被直接忽略，不做详细的比较。
3. generate阶段：根据 `AST` 结构拼接生成 `render` 函数的字符串。

# 6. 虚拟dom
1. `diff`对比`Virtual Dom`, 减少更新`真实dom`范围。批量进行patch。
2. `Virtual Dom`挂载信息较少，效率更高。
3. 具备跨平台的优势

AST树
- flags 当前VNode 类型
- ChildrenFlags 子内是否有VNode, VNode 类型
# 6. diff 算法
> [渲染解析,diff解析](http://hcysun.me/vue-design/zh/renderer-patch.html#%E6%9B%B4%E6%96%B0-vnodedata)
> 
> [key用index引发的问题](https://juejin.cn/post/6844904163772629005)

### patch 相关介绍

1. oldFlags !== newFlags => replace
2. ELEMENT
   1. oldTag !== newTag => replace
   2. el = new = old, 先赋值新的，循环旧的在新上没有移除。
3. patch patchChildren mount 

4. 有状态组件的更新
   1. 主动更新 自身改变 - 重新挂载
   2. 被动更新 父组件的props改变 - 重新赋值$props 更新 || 直接替换

### 过程
1. 只有当新旧子节点的类型都是多个子节点时，核心`Diff`算法才派得上用场
2. 根绝 `key` 同层级移动, 新旧双层循环, 找到相同的 进行`patch`并且找到`lastIndex`, 如果小于`LastIndex`,则移动`realDom`, 把当前dom 移到 `上一个nextChildren` 的后面。 
   ```Javascript
    // refNode 是为了下面调用 insertBefore 函数准备的
    const refNode = nextChildren[i - 1].el.nextSibling
    // 调用 insertBefore 函数移动 DOM
    container.insertBefore(prevVNode.el, refNode)
   ```
3. 新增元素 通过内层循环的find属性
4. 移除元素 另开循环

### 优化
1. tree diff - 不跨层级对比
2. component diff - 
   - 同一类型的两个组件，按原策略（层级比较）继续比较Virtual DOM树即可。
   - 同一类型的两个组件，默认props改变，会重新计算，不论是否使用到，用户 可以通过 `shouldComponentUpdate()` = ture(进行深度diff, 重新render) false(不进行深度diff).
   - 不同类型的组件, 直接替换。(不同类型很难存在相同的结构)
3. element diff - 根据key做移动

- 在创建 VNode 时就确定其类型，以及在 mount/patch 的过程中采用位运算来判断一个 VNode 的类型
- Vue 2.x `双端比较` 相比React的Diff算法，同样情况下可以减少移动节点次数，减少不必要的性能损耗，更加的优雅
- Vue的patch是即时的，并不是打包所有修改最后一起操作DOM（React则是将更新放入队列后集中处理）(由于现代浏览器有优化, 所以并无太大差别)

### vu3 diff 优化
1. “去掉”相同的前置/后置节点
2. 如果中间遇到完全不相同 但是`j<prevEnd`&`j<nextEnd`, 增生成一个素组存新在旧的位置没有则为-1（优化，keyIndex所以表去存)
3. 求出最长递增子序列, 之后倒着循环，与keyIndex的value一致则不动，否则移动到最后元素的前面
# 7. vue3 理解 proxy defineProperty
1. Object.defineProperty 需要深度遍历监听
2. Object.defineProperty 无法监听数组
3. proxy 兼容性差 ie11

# 8. 组件通讯的六种方式

1. props / $emit
2. $children / $parent
3. provide / inject
4. eventbus
5. Vuex
6. $attrs / $listen
   1. $attrs 没有声明props情况下 this.$attrs 是获取所有，也可以通过 v-bind="$attrs" 传入内部组件，通常配合 inheritAttrs 选项一起使用。
   2. $listen 和$attrs一样用
   3. 主要解决跨层级通讯问题
7. ref -> 单边通讯

# 9.前端路由实现 两种方案
- mode
  - hash
    - #, window.location.hash, 监听读取
  - history
    - nginx 配置 `try_files $uri $uri/ /index.html;`
    - 标识所有都指向index.html
    - 运用H5的 `pushState()` 和`replaceState()`
- 跳转
  - this.$router.push()
  - <router-link to=""></router-link>
- 占位
  - <router-view></router-view>

# 10. 路由权限 实现
异步路由
1. routeBefore
2. addRoutes

# 11. vuex 理解 如何实现
- actions 异步，更大自由度(更好的devtools)
- mutations 同步任务
# 12. computed/ watch 区别 实现
1. computed 是根据一些计算，计算出来的值，这些值变了，会重新计算。
   1. initState 函数中，创建computed监听器
   2. computed watcher 会持有一个 dep 实例
   3. 如果有render 会触发getter, 会让`渲染watcher`订阅`computed watcher`（`computed watcher`如果改变会触发`渲染watcher`)
   4. 调用this.get(), 会让他的子集调用
   5. 当前target `computed watcher`, 会push到子集dep上面（依赖过程)
   6. this.dep.notify(),通知watcher
2. watch 是监听一个变量，这个变量改变的时候，做一堆操作。
   1. user watcher
   2. deep watcher -> traverse
      1. 它实际上就是对一个对象做深层递归遍历，因为遍历过程中就是对一个子对象的访问，会触发它们的 getter 过程，这样就可以收集到依赖，也就是订阅它们变化的 watcher
   3. sync watcher -> 会立即更新

# 13. keep-alive 实现原理

- keep-alive组件接受三个属性参数：include、exclude、max
  - include: 包含的组件
  - exclude: 不包含的组件
  - max: 最大缓存数量
- activated, deactivated
- keep-alive实例会缓存对应组件的VNode,如果命中缓存，直接从缓存对象返回对应VNode

# 14. vue 路由动态加载, 组件动态加载.
- 利用splitChunk 分包, 利用prefetch 实现动态加载.
```JS
// Prefetch 告诉浏览器这个资源将来可能需要，但是什么时间加载这个资源是由浏览器来决定的。
<link href=/public/batman/js/chunk-7027b1c2.3a2ff1e9.js rel=prefetch>
// preload 是一个声明式 fetch，可以强制浏览器在不阻塞 document 的 onload 事件的情况下请求资源。
<link href=/public/batman/js/chunk-7027b1c2.3a2ff1e9.js rel=preload>
```

- 使用
```JS
ComponentOpenAi: () => import('@/components/component-open-ai')
```

