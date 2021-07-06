# 1. html语义化理解

HTML 语义化的核心是反对大篇幅的使用无语义化的 div + css + span，而鼓励使用 HTML 定义好的语义化标签

- header
- hgroup(h1~h6),
- footer
- nav
- article
- section
- aside


# 2. 常用的meta标签
meta 元素定义的元数据的类型包括以下几种：
- 如果设置了 name 属性，meta 元素提供的是文档级别（document-level）的元数据，应用于整个页面。
- 如果设置了 http-equiv 属性，meta 元素则是编译指令，提供的信息与类似命名的HTTP头部相同。
- 如果设置了 charset 属性，meta 元素是一个字符集声明，告诉文档使用哪种字符编码。
- 如果设置了 itemprop 属性，meta 元素提供用户定义的元数据。


- charset
  - 这个属性声明了文档的字符编码。如果使用了这个属性，其值必须是与ASCII大小写无关（ASCII case-insensitive）的"utf-8"。
- content
  - 此属性包含http-equiv 或name 属性的值，具体取决于所使用的值。
- http-equiv 属性定义了一个编译指示指令。这个属性叫做http-equiv(alent) 是因为所有允许的值都是特定HTTP头部的名称，如下：
  - content-security-policy
    - 它允许页面作者定义当前页的 内容策略。 内容策略主要指定允许的服务器源和脚本端点，这有助于防止跨站点脚本攻击。
  - content-type
    - 如果使用这个属性，其值必须是"text/html; charset=utf-8"。
  - x-dns-prefetch-control
    - 开启dns预解析,就可以让a标签在HTTPS环境下进行DNS预解析。
  - refresh
    - 每一秒刷新一次<meta http-equiv="refresh" content="1">
- name
  - application-name
  - author
  - description
  - generator
  - keywords

```Javascript

/*保留历史记录以及动画效果*/
<meta name="App-Config" content="fullscreen=yes,useHistoryState=yes,transition=yes">

/*是否启用 WebApp 全屏模式*/
<meta name="apple-mobile-web-app-capable" content="yes">

<!-- 设置状态栏的背景颜色,只有在 “apple-mobile-web-app-capable” content=”yes” 时生效 -->
<meta name="apple-mobile-web-app-status-bar-style" content="black">

/*添加到主屏后的标题*/
<meta name="apple-mobile-web-app-title" content="App Title">

/*在网页上方显示一个app banner，提供app store下载*/
<meta name="apple-itunes-app" content="app-id=APP_ID,affiliate-data=AFFILIATE_ID,app-argument=SOME_TEXT"

/*启用360浏览器的极速模式(webkit)*/
<meta name="renderer" content="webkit">

/*uc强制竖屏*/
<meta name="screen-orientation" content="portrait">

/*QQ强制竖屏*/
<meta name="x5-orientation" content="portrait">

/*UC强制全屏*/
<meta name="full-screen" content="yes">

/*QQ强制全屏*/
<meta name="x5-fullscreen" content="true">

/*UC应用模式*/
<meta name="browsermode" content="application">

/*QQ应用模式*/
<meta name="x5-page-mode" content="app">

/*禁止自动探测并格式化手机号码*/
<meta name="format-detection" content="telephone=no">

```
# 3. src和href的区别
- src: 会暂停其他资源的下载和处理，直至将该资源加载，编译，执行完毕
- href: 边下载边处理
# 4. srcset作用
根据不同的Dpr 设置不同的 srcset 图片
```HTML
  <img src="128px.jpg"
       srcset="128px.jpg 128w, 256px.jpg 256w, 512px.jpg 512w"
       sizes="(max-width: 360px) 340px, 128px">
```
# 5. script标签defer和async区别
- html 静态`<script>`引入
- js 动态插入`<script>`
- `<script defer>`: 异步加载，元素解析完成后执行
- `<script async>`: 异步加载，但执行时会阻塞元素渲染 