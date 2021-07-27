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

Loader 如果没有使用`css-loader`而加载css, 不会创建`css module`也不会产生`依赖关系`

# 5. Compiler 和 Compilation
- Compiler
  - 对象，包含了webpack环境的所有配置信息. 包换options loader, plugins.
webpack 启动的时候实例化，它在全局是唯一的。可以把他理解为webpack的实例
- Compliation
  - 包含了当前的模块资源`compilation.chunks.modules`，编译生产资源 `compilation.chunks.files`
  - webpack 在开发模式下运行的时候，每当检测到一个文件变化，就会创建一次新的Compliation


# 6. runtime, manifest

# 7. loader 常用loader 
- file-loader: 把文件输出到一个文件夹中，在代码中通过相对 URL 去引用输出的文件 (处理图片和字体)
- url-loader: 与 file-loader 类似，区别是用户可以设置一个阈值，大于阈值会交给 file-loader 处理，小于阈值时返回文件 base64 形式编码 (处理图片和字体)
- source-map-loadervv: 加载额外的 Source Map 文件，以方便断点调试
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

# 16. webpack 热更新

# 17. webpack dll

# 18. webpack tree-shaking

# 19. webpack scope hosting

# 20. weback 构建速度(如何优化性能)

# 21. Babel

# 22. 如何写babel插件