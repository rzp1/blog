# 1. 生命周期

> https://juejin.cn/post/6844903922453200904#heading-3
> <img src="./images/16cbc24e71728047.png" />

1. 挂载阶段:
   1. constructor: 声明state, 或者给函数bind.(this)
   2. getDerivedStateFromProps: `static getDerivedStateFromProps(nextProps, prevState)`, 获取新props, 和旧的state
   3. render: render函数是纯函数，只返回需要渲染的东西，不应该包含其它的业务逻辑,可以返回原生的DOM、React组件、Fragment、Portals、字符串和数字、Boolean和null等内容
   4. componentDidMount: 组件装载后渲染,获取到DOM节点并操作,订阅一些事件，但是要记得在componentWillUnmount() 钩子里面清除，和`vue setInterval`一个道理
2. 更新阶段:
   1. getDerivedStateFromProps:和挂载一样
   2. shouldComponentUpdate: `shouldComponentUpdate(nextProps, nextState)`, 更新之前，给你新的props和state, 返回值可以限制组件是否render。
   3. render
   4. getSnapshotBeforeUpdate: getSnapshotBeforeUpdate(prevProps, prevState), 书面上一样，获取更新前的快照，render后，这个函数有一个返回值，会作为第三个参数传给`componentDidUpdate`。 主要和`componentDidUpdate`配合使用,  before the DOM is updated
   5. componentDidUpdate: `componentDidUpdate(prevProps, prevState, snapshot)` 组件更新完成。the DOM is updated
3. 卸载阶段:
   1. componentWillUnmount: 当组件销毁前调用。清除一些定时器，取消网络请求，清理无效的DOM元素等垃圾清理工作。

# 2. React中的合成事件是什么？
1. 减少了内存的消耗(有一个自己的池子)
2. React 通过将事件 normalize 以让他们在不同浏览器中拥有一致的属性。
3. 如果需要更底层的事件 `nativeEvent`
4. 事件都委托到 `document` 上

# 3. setState到底是异步还是同步?
1. `setState`只在`合成事件`和`钩子函数`中是“异步”的，在`原生事件`和`setTimeout` 中都是同步的。
2. `isBatchingUpdates`， 每次setState都会判断
   1. true 表明`现在正处于批量更新过程或更新组件过程中`, 排队
   2. false 立即执行
3. 为了更好的实现批量更新。不然每更改一次就要re-render。消耗太大。

- 批量操作，和`vue.nextTick`类似，缓存区

# 4. React组件通信如何实现?
1. 父->子: props ref
2. 子->父: props 回调
3. 兄弟组件通信: 找共同父亲
4. 跨级通讯: context
5. eventBus
6. redux...

# 5. React如何进行组件/逻辑复用?
> https://juejin.cn/post/6844903922453200904#heading-9


- Hoc
- render props
- react hooks
- Mixin(废弃)

- `HOC` vs `mixins` 的优势
  1. `HOC`从外部传入props, `mixins`修改state
  2. `HOC`树结构，`mixins`平级关系，多个mixins修改，维护复杂。
- `HOC` 劣势
  1. Wrapper Hell: HOC可能出现多层包裹组件的情况,多层抽象同样增加了复杂度和理解成本
  2. 不可见性: 不知道外层做了什么。
- `Render Props` 劣势
  1. 使用繁琐
  2. 嵌套过深
- `React Hooks`优点
  1. 简洁: React Hooks解决了HOC和Render Props的嵌套问题,更加简洁
  2. 解耦: React Hooks可以更方便地把 UI 和状态分离,做到更彻底的解耦
  3. 组合: Hooks 中可以引用另外的 Hooks形成新的Hooks,组合变化万千
  4. 函数友好: React Hooks为函数组件而生,从而解决了类组件的几大问题
     1. this 指向容易错误
     2. 分割在不同声明周期中的逻辑使得代码难以理解和维护
     3. 代码复用成本高（高阶组件容易使代码量剧增）
- `React Hooks` 缺点
  1. 在闭包场景可能会引用到旧的state、props值
  2. 额外的学习成本
  3. `React.memo`:`React.memo(Component, [areEqual(prevProps, nextProps)]);` 会记忆，如果返回true就使用memo. 不更新。
     1. 和`shouldComponentUpdate` 拿不到(state change)
