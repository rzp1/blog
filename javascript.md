# 1.原型/构造函数/实例
https://www.cnblogs.com/wangfupeng1988/p/3977924.html
https://github.com/xd-tayde/blog/blob/master/interview-1.md

- 原型(prototype): 一个简单的对象用于实现对象的继承，可以理解为对象的爹，显式原型 prototype 隐式子 **proto**
- 构造函数(constructor): 可以通过 new 来新建一个 对象实例的函数, 构造函数可以通过 prototype 指向原型
- 实例(instance): 通过构造函数和 new 创建出来的对象，便是实例。 实例通过**proto**指向原型，通过 constructor 指向构造函数。

```JavaScript
实例.__proto__ === 原型

原型.constructor === 构造函数

构造函数.prototype === 原型

// 这条线其实是是基于原型进行获取的，可以理解成一条基于原型的映射线
// 例如:
// const o = new Object()
// o.constructor === Object   --> true
// o.__proto__ = null;
// o.constructor === Object   --> false
// 注意: 其实实例上并不是真正有 constructor 这个指针，它其实是从原型链上获取的
//      instance.hasOwnProperty('constructor') === false
实例.constructor === 构造函数

```

图片理解
<img src="./images/168e9d9b940c4c6f.png">

# 2.原型链

原型链是由原型对象组成，每个对象都有 **proto** 属性，指向了创建该对象的构造函数的原型，**proto** 将对象连接起来组成了原型链。是一个用来实现继承和共享属性的有限的对象链。

- 属性查找机制: 当查找对象的属性时，如果实例对象自身不存在该属性，则沿着原型链往上一级查找，找到时则输出，不存在时，则继续沿着原型链往上一级查找，直至最顶级的原型对象 Object.prototype，如还是没找到，则输出 undefined；
- 属性修改机制: 只会修改实例对象本身的属性，如果不存在，则进行添加该属性，如果需要修改原型的属性时，则可以用: b.prototype.x = 2；但是这样会造成所有继承于该对象的实例的属性发生改变。

# 3.instanceof

instanceof 运算符用于测试构造函数的 prototype 属性是否出现在对象原型链中的任何位置

```
instance.[__proto__...] === constructor.prototype
```

https://segmentfault.com/a/1190000018874474

# 4.new 运算符的执行过程

```JavaScript
new People('12') = {
  var obj = {} 或者 var obj = new Object() // 创建一个空对象;
  obj.__proto__ = People.prototype // 将该隐式原型原型指向构造函数显式原型，建立对象和原型直接的对应关系。
  People.call(obj, "12") // 将构造函数中this指向创建的obj对象，并传入参数"12"
  return obj // 返回obj对象，person指向创建的obj对象(对象类型赋值为按引用传递，obj与person指向同一个对象)
}
```

# 5.执行上下文

执行上下文可以简单理解为一个对象的进栈道、出栈的过程

- 包含 3 个部分
  - 变量对象, 变量、函数表达式——变量声明，默认赋值为 undefined；`变量提升`
  - this——赋值；
  - 作用域链(词法作用域)
- 代码段分为 3 种类型
  - 全局代码
  - 函数体
  - eval 代码
- 代码执行过程:
  - 创建 全局上下文 (global EC)
  - 全局执行上下文 (caller) 逐行 自上而下 执行。遇到函数时，函数执行上下文 (callee) 被 push 到执行栈顶层
  - 函数执行上下文被激活，成为 active EC, 开始执行函数中的代码，caller 被挂起
  - 函数执行完后，callee 被 pop 移除出执行栈，控制权交还全局上下文 (caller)，继续执行

## 变量对象

变量对象，是执行上下文中的一部分，可以抽象为一种 数据作用域，其实也可以理解为就是一个简单的对象，它存储着该执行上下文中的所有 变量和函数声明

## 作用域

执行上下文中还包含作用域链。理解作用域之前，先介绍下作用域。作用域其实可理解为该上下文中声明的 变量和声明的作用范围。

- `创建这个函数的那个作用域中取值——是“创建”，而不是“调用”，切记切记`。
- 声明提前: 一个声明在函数体内都是可见的, 函数优先于变量
- 非匿名自执行函数，函数变量为`只读`状态，无法修改
  ```JavaScript
    let foo = function(){console.log(1)}
    (function foo(){
      foo = 10 // 由于foo 在函数中 `只读` 状态，赋值无效
      console.log(foo)
    }())
    // 结果打印: f foo(){foo=10;console.log(foo)}
  ```

## 作用域链

我们知道，我们可以在执行上下文中访问到父级甚至全局的变量，这便是作用域链的功劳。作用域链可以理解为一组对象列表，包含 父级和自身的变量对象，因此我们便能通过作用域链访问到父级里声明的变量或者函数。

由两部分组成

- 父级的 scope
- AO: 自身的变量

自上而下的作用域链

# 6.闭包

闭包属于一种特殊的作用域，称为 `静态作用域`。它的定义可以理解为: `父函数被销毁` 的情况下，返回出的`子函数`的[[scope]]中仍然保留着父级的单变量对象和作用域链，因此可以继续访问到父级的变量对象，这样的函数称为闭包。

- 函数作为返回值
  ```JavaScript
    function makeFunc() {
      var name = "Mozilla";
      function displayName() {
          alert(name);
      }
      return displayName;
    }
    var myFunc = makeFunc(); // 执行完成这里按理说要销毁makeFunc作用域的，但是返回的displayName引用了 makeFunc作用域 所以不能删除，导致一直占用内存
    myFunc();
  ```
- 函数作为参数传递
  ```JavaScript
    var max = 10
    var fn = function(x){
      console.log(x + max) // 25 变量取自声明，切记切记
    }
    (function(f){
      var max = 100;
      f(15)
    }(fn))
  ```

解决:

- 变量可以通过 函数参数的形式 传入，避免使用默认的[[scope]]向上查找
- 使用 setTimeout 包裹，通过第三个参数传入
- 使用 块级作用域，让变量成为自己上下文的属性，避免共享

# 7.this/call/apply/bind

由于 JS 的设计原理: 在函数中，可以引用运行环境中的变量。因此就需要一个机制来让我们可以在函数体内部获取当前的运行环境，这便是`this`。

因此要明白 this 指向，其实就是要搞清楚 函数的运行环境，说人话就是，谁调用了函数。例如:

- 如果函数作为构造函数用，那么其中的 `this` 就代表它即将 `new` 出来的对象

```JavaScript
  function Person(){
    this.name = 'rzp';
    console.log(this); // {name:'rzp'}
  }
  var rzp = new Person();
  console.log(rzp.name) // rzp
```

- 上述 如果仅调用，不 `new` 的话, 指向 `window`
  ```JavaScript
    function Person(){
      this.name = 'rzp';
      console.log(this); // Window
    }
    Person()
  ```
- `obj.fn()`，便是 `obj` 调用了函数，既函数中的 `this === obj`
- 特殊情况注意下, 内部声明不是挂载到对象上
  ```JavaScript
    var obj = {
      x: 10,
      fn: function(){
        function f(){
          console.log(this) // window
        }
        f()
      }
    }
    obj.fn()
  ```

因此提供了三种方式可以手动修改 this 的指向:

- call: fn.call(target, 1, 2) // arguments 一个一个列出来 `立即调用`
- apply: fn.apply(target, [1, 2]) // arguments 以一个数组方式实现 `立即调用`
- bind: fn.bind(target)(1,2) // arguments 一个一个列出来 `绑定函数可稍后执行`

# 8.代码的复用

- 函数封装
- 继承
- 复制 extend
- 混入 mixin
- 借用 apply/call

# 9.继承

在 JS 中，继承通常指的便是 原型链继承，也就是通过指定原型，并可以通过原型链继承原型上的属性或者方法。

- 最优化: 圣杯模式

```JavaScript
  var inherit = (function(Target,Origin){
    var F = function(){};
    return function(Target,p){
      F.prototype = Origin.prototype;
      Target.prototype = new F();
      Target.prototype.constructor = Target;  // constuctor归位
      Target.uber = Origin.prototype; // 信息储备，想知道继承自谁，先记录下来
    }
  })();
```

# [10.防抖节流](./javascript/10.防抖节流.md)

# [11.Promise](./javascript/11.Promise.md)

# 12.对象的拷贝

- 浅拷贝: 以赋值的形式拷贝引用对象，仍指向同一个地址，修改时原对象也会受到影响
    - =
    - Object.assign
    - 展开运算符(...)
- 深拷贝: 完全拷贝一个新对象，修改时原对象不再受到任何影响
    - JSON.parse(JSON.stringify(obj)): 性能最快，但是遇到函数,undefined,symbol报错
    - 递归逐一赋值


# 13.模块化

模块化开发在现代开发中已是必不可少的一部分，它大大提高了项目的可维护、可拓展和可协作性。通常，我们 在浏览器中使用 ES6 的模块化支持，在 Node 中使用 commonjs 的模块化支持。

- 分类:
    - es6: import / export
    - commonjs: require / module.exports / exports
    - amd: require / defined
- require与import的区别
    - require支持 动态导入，import不支持，正在提案 (babel 下可支持)
    - require是 同步 导入，import属于 异步 导入
    - require是 值拷贝，导出值变化不会影响导入值；import指向 内存地址，导入值会随导出值而变化


# [14.Event Loop](./javascript/14.EventLoop.md)

# 15.类型转换
- -、*、/、% ：一律转换成数值后计算
- +：
    - 数字 + 字符串 = 字符串， 运算顺序是从左到右
    - 数字 + 对象， 优先调用对象的valueOf -> toString
    - 数字 + boolean/null -> 数字
    - 数字 + undefined -> NaN
- [1].toString() === '1'
- {}.toString() === '[object object]'
- NaN !== NaN 、+undefined 为 NaN

# 16.类型判断

判断 Target 的类型，单单用 typeof 并无法完全满足，这其实并不是 bug，本质原因是 JS 的万物皆对象的理论。因此要真正完美判断时，我们需要区分对待:

- 基本类型(null): 使用 String(null)
- 基本类型(string / number / boolean / undefined) + function: 直接使用 typeof 即可
- 其余引用类型(Array / Date / RegExp Error): 调用 toString 后根据[object XXX]进行判断

Object.prototype.toString.call(obj)
```JavaScript
let class2type = {}
'Array Date RegExp Object Error'.split(' ').forEach(e => class2type[ '[object ' + e + ']' ] = e.toLowerCase())

function type(obj) {
    if (obj == null) return String(obj)
    return typeof obj === 'object' ? class2type[ Object.prototype.toString.call(obj) ] || 'object' : typeof obj
}
```

# 17.ES6,ES7.md

由于 Babel 的强大和普及，现在 ES6/ES7 基本上已经是现代化开发的必备了。通过新的语法糖，能让代码整体更为简洁和易读。

- 声明
  - let/const: 块级作用域，不存在变量提升，暂时性死区，不允许重复声明
  - const: 声明常量，无法修改
- 解构赋值
- class/extend: 类声明与继承
- Set/Map: 新的数据解构
  - Set: ES6提供了新的数据结构Set。它类似于数组，但是成员的值都是唯一的，没有重复的值。
  - WeakSet: 
    - 首先，WeakSet的成员只能是对象，而不能是其他类型的值。
    - 其次，WeakSet中的对象都是弱引用，即垃圾回收机制不考虑WeakSet对该对象的引用
  - Map: 它类似于对象，也是键值对的集合，但是“键”的范围不限于字符串，各种类型的值（包括对象）都可以当作键。
  - WeakMap: WeakMap结构与Map结构基本类似，唯一的区别是它只接受对象作为键名（null除外），不接受其他类型的值作为键名，而且键名所指向的对象，不计入垃圾回收机制。
- 异步解决方案
  - Promise 的使用与实现
  - generator:
    - yield: 暂停代码
    - next(): 继续执行代码
    ```Javascript
     function* helloWorld() {
        yield 'hello';
        yield 'world';
        return 'ending';
      }
      const generator = helloWorld();
      generator.next()  // { value: 'hello', done: false }
      generator.next()  // { value: 'world', done: false }
      generator.next()  // { value: 'ending', done: true }
      generator.next()  // { value: undefined, done: true }
    ```
  - await / async: 是 generator 的语法糖， babel 中是基于 promise 实现。

    ```Javascript
      async function getUserByAsync(){
          let user = await fetchUser();
          return user;
      }

      const user = await getUserByAsync()
      console.log(user)
    ```
