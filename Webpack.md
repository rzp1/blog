# 1.webpack 构建流程

1. 初始参数: shell webpack.conf.js
2. 开始编译: 初始化一个Compiler对象,加载所有的配置,开始编译.
3. 确定入口: 更具entry配置, 找出所有的入口
4. 编译模块: 从入口文件开始, 调用所有的loader, 递归找依赖。
5. 完成编译: 每个模块被编译后的最终内容, 以及他们的依赖图。
6. 输出资源: 根据得到的依赖关系, 组成一个个包含多个module的chunk
7. 输出完成: 根据配置, 确定要输出的文件名和文件路径.


# 2. webpack 和 rollup 区别
1. rollup: 一般用来打包js库之类。
   1. Tree Shaking: 剔除无用代码, webpack也支持
   2. Scope Hoisting: 所有模块构建在一个函数内, 执行效率更高
   3. 可以一次输出多种格式:IIFE, AMD, CJS, UMD, ESM
   4. 文档精简
2. webpack
   1. 支持很多loader, plugin，加载各种文件, 对项目构建友好.

# 3. Module, Dependency, Graph Chunk, Bundle

- `Module` 根据文件的关联关系 生成的 module 模块
- `Chunk` 是webpack打包过程中Modules的集合, 是`打包过程中`的概念
- `Graph Chunk` 是在chunk中表明module的关联关系的
  - 因为关联关系可以任意引用 所以是 graph 形式
- `Bundle` 是我们最终生成的一个或者多个打包好的文件

# 4. Loader 和 Plugin
- Loader
  - 模块转换器，将非js模块转化为webpack能识别的模块。
  - 本质上， webpack loader 将所有类型的文件，转换为应用程序的 ***依赖图*** 可以直接引用的模块
- Plugin
  - 基于`Tapable`, 扩展插件，webpack运行的各个阶段，都会广播出对应的事件，插件去监听对应的事件。

Loader 如果没有使用`css-loader`而加载css, css 有内容会报错, 无内容 不会创建`css module`也不会产生`依赖关系`

# 5. Compiler 和 Compilation
- Compiler
  - 对象，包含了webpack环境的所有配置信息. 包换options loader, plugins.
webpack 启动的时候实例化，它在全局是唯一的。可以把他理解为webpack的实例
- Compliation
  - 包含了当前的模块资源`compilation.chunks.modules`，编译生产资源 `compilation.chunks.files`
  - webpack 在开发模式下运行的时候，每当检测到一个文件变化，就会创建一次新的Compliation


# 6. runtime, manifest(webpack-manifest-plugin), 
1. runtime
   1. 在浏览器运行时，连接模块所需的加载和解析逻辑. 包括同步加载，延迟加载;
      1. 比如: 都挂载`self.webpackChunkwebpack_name` 上面, 需要runtime函数去给他队列执行.
   2. 利用`runtimeChunk: single`, 可以把这部分单独 `bundle`;
2. manifest(webpack-manifest-plugin)
   1. {'ChunkName': 'BundleName'}
   2. 有的时候`index.html`是后端渲染此处生成一份清单,用来生成一份资源清单，为后端渲染服务

# 7. loader 常用loader 
- file-loader: 把文件输出到一个文件夹中，在代码中通过相对 URL 去引用输出的文件 (处理图片和字体)
- url-loader: 与 file-loader 类似，区别是用户可以设置一个阈值，大于阈值会交给 file-loader 处理，小于阈值时返回文件 base64 形式编码 (处理图片和字体)
- source-map-loader: 加载额外的 Source Map 文件，以方便断点调试
- svg-inline-loader
- image-loader: 加载并压缩
- json-loader
- yml-loader
- babel-loader
- ts-loader
- awesome-typescript-loader
- less-loader
- sass-loader
- css-loader
- style-loader: 注入js中
- postcss-loader: 扩展 CSS 语法，使用下一代 CSS，可以配合 autoprefixer 插件自动补齐 CSS3 前缀
- eslint-loader
- tslint-loader
- mocha-loader
- coverjs-loader
- vue-loader
- i18n-loader

# 8. 实现loader的思路

# 9. plugin 常用 plugin 
- define-plugin: 配置全局常量
- ignore-plugin: 忽略部分文件
- html-webpack-plugin: 简化 HTML 文件创建 
- web-webpack-plugin: 可方便地为单页应用输出 HTML，比 html-webpack-plugin 好用
- terser-webpack-plugin: 压缩 v5自带
- uglifyjs-webpack-plugin: 不支持es6的压缩, 在node_modules 默认不转化就会产生问题.
- webpack-parallel-uglify-plugin: 多进程压缩
- mini-css-extract-plugin: 分离样式文件，CSS 提取为独立文件，支持按需加载 (替代extract-text-webpack-plugin)
- serviceworker-webpack-plugin: 离线缓存
- webpack-bundle-analyzer： 分析
- copy-webpack-plugin: 复制
  
# 10. 实现plugin的思路

# 11. source map
> https://webpack.docschina.org/configuration/devtool/#special-cases
- source map 是将编译、打包、压缩后的代码映射回源代码的过程。打包压缩后的代码不具备良好的可读性，想要调试源码就需要 soucre map。
- map文件只要不打开开发者工具，浏览器是不会加载的。

线上环境一般有三种处理方案：
- `hidden-source-map`：借助第三方错误监控平台 Sentry 使用, 仅用于错误报告
- `nosources-source-map`：只会显示具体行数以及查看源代码的错误栈。安全性比 sourcemap 高
- `sourcemap`：通过 nginx 设置将 .map 文件只对白名单开放(公司内网)

注意：避免在生产中使用 inline- 和 eval-，因为它们会增加 bundle 体积大小，并降低整体性能。
# 12. hash 规则
- Hash: 和整个项目的构建相关，只要项目文件有修改，整个项目构建的 hash 值就会更改
- Chunkhash：和 Webpack 打包的 chunk 有关，不同的 entry 会生出不同的 chunkhash
- Contenthash：根据文件内容来定义 hash，文件内容不变，则 contenthash 不变

# 13. loader执行顺序及原理
```js
{
  test: /\.less$/,
  use: [
    'style-loader',
    'css-loader',
    'less-loader'
  ]
}
```
从右到左, 柯里化，函数式编程

# 14. 代码分割
- 单个bundle: 代码量大, 页面空白期长，用户体验不好。
- 源码: 请求过多，性能不好，服务器压力大，

所以: SplitChunksPlugin
1. 单个chunk不能过大
2. 找出 `common` `vender` 公用代码
3. 分离 runtime, 充分利用浏览器缓存.

利用 `webpack-bundle-analyzer` 分析
# 15. webpack 提高配置效率
- `webpack-merge`: 提取公共配置，减少重复配置代码
- `speed-measure-webpack-plugin`: 简称 SMP，分析出 Webpack 打包过程中 Loader 和 Plugin 的耗时，有助于找到构建过程中的性能瓶颈。
- `HotModuleReplacementPlugin`: 热更新

# 16. webpack HMR(Hot Module Replacement)
> https://zhuanlan.zhihu.com/p/30669007

1. `webpack` watch 文件变化, 进行打包 生成如下, 放到内存中
   - 新的Hash值：a61bdd6e82294ed06fa3
   - 新的json文件： a93fd735d02d98633356.hot-update.json
   - 新的js文件：index.a93fd735d02d98633356.hot-update.js
2. `webpack-dev-server`  监听`hash` 通过socket 把hash发送给`webpack-dev-serve/client`, 在创建的时候就注入了代码`socket`代码
3. `webpack-dev-server/client` 存起来 `hash` 通知 客户端 `webpack` 模块 `webpack/hot/dev-server`
4. `webpack/hot/dev-server` 通过`hash`和之前配置的参数判断是否更新
5. `HotModuleReplacement.runtime`, 让`JsonpMainTemplate.runtime` 用上次`hash`发送ajax, jsonp请求, 获取更新模块。
6. `HotModulePlugin`通过这个插件进行更新。


# 17. webpack dll
> https://zhuanlan.zhihu.com/p/68136798
> https://www.zhuxingmin.com/2020/10/19/webpack%E5%AE%9E%E6%88%98%E2%80%94%E2%80%94%E6%89%93%E5%8C%85%E4%BC%98%E5%8C%96%E3%80%90%E4%B8%AD%E3%80%91/
> 
通过`SplitChunksPlugin`, 可以把公用代码提取到`vender`或者`common`, 但是当公用代码。但是发现当项目复杂度加大之后，打包速度会开始变慢。原因是每次打包webpack都要分析哪些是公用库，然后把他打包到vendor.js里.

我们可以通过`DllPlugin` 和`DllRefrencePlugin`结合的方式, 把一些基本不会改变的代码 单独打包.
1. dll程序 `DllPlugin` 打包出公用代码`dll.js`, 并且生成`manifest.json`文件给主程序使用
2. 主程序  `DllRefrencePlugin` 主程序 读取`manifest.json` 来知道 跳过哪些依赖
3. 主程序  通过`AddAssetHtmlPlugin`, 把`dll.js`也打入主程序

### HashedModuleIdsPlugin
- 原因: `manifest.json` 生成的 `id` 是单一递增
- 解决: dll程序 `HashedModuleIdsPlugin`
# 18. webpack tree-shaking
> https://diverse.space/2018/05/better-tree-shaking-with-scope-analysis
- 原理: 代码中会有一些代码被`import`, 但是`functiong`未被使用, tree-shaking, 会把他们标记出来.
- 注意
  - 使用`terser-webpack-plugin`压缩, 剔除`死代码`.
  - `tree shaking` 只对`ES6 Module`生效
  - 确保babel没有打包成es6->common.js, 因为
    ```json
      {
        loader: 'babel-loader',
        options: {
            presets: [
                // 在这里加上modules: false
                [@babel/preset-env, { modules: false }]
            ]
        }
      }
    ```
  - package.json->sideEffects， 配置, 告诉webpack, 哪些是有副作用的代码, 需要被打包, 不能根除
  - `/*#__PURE__*/` 不能确定他是否是个`pure`函数通过这个标识, 告诉tree-shaking, 他是pure函数,可以剔除。
    - 例如`react hoc`很复杂, 如果一个匿名函数被包在一个函数调用中，那么其实这个插件是无法分析的.

# 19. webpack scope hosting
> https://segmentfault.com/a/1190000018220850
作用域提升, 

1. 在A文件导出一个字符串，在B文件中引入之后，通过console.log打印出来。
2. 通过webpack打包构建之后，会发现将这两个文件构建成了两个函数，一个函数内是我们输出的字符串，一个函数内是console.log语句。
问题：两个函数也就是两个作用域；不仅代码增加了，可读性还不太友好。
3. 使用scope hosting进行配置处理之后，会讲本身的两个函数作用域合成一个，减少了代码量，也便于阅读代码。
# 20. weback 构建速度(如何优化性能)
> 官方文档也很赞

- 使用高版本的 `Webpack` 和 `Node.js`
- `缩小打包作用域`: 
  - loader: `exclude` 和 `include`
  - noParse: 对完全不需要解析的库进行忽略 (不去解析但仍会打包到 bundle 中，注意被忽略掉的文件里不应该包含 import、require、define 等模块化语句)
  - IgnorePlugin: 完全忽略的模块
  - 合理使用alias
  - resolve.modules 指明第三方模块的绝对路径 (减少不必要的查找)
  - resolve.mainFields 只采用 main 字段作为入口文件描述字段 (减少搜索步骤，需要考虑到所有运行时依赖的第三方模块的入口文件描述字段)
  - resolve.extensions 尽可能减少后缀尝试的可能性
- `多线程压缩代码`
  - `terser-webpack-plugin` 开启 `parallel` 参数
  - 通过 mini-css-extract-plugin 提取 Chunk 中的 CSS 代码到单独文件，通过 css-loader 的 minimize 选项开启 cssnano 压缩 CSS。
- `充分利用缓存提升二次构建速度`:
  - babel-loader 开启缓存
  - terser-webpack-plugin 开启缓存
  - 使用 cache-loader 或者 hard-source-webpack-plugin
- `提取页面公共资源`
  - 使用 `html-webpack-externals-plugin`，将基础包通过 CDN 引入，不打入 bundle 中
  - `SplitChunksPlugin`
- `DLL`
- `Tree shaking`
- `scope hosting`

# 21. Babel

# 22. 如何写babel插件