### 背景
最近公司要做一个app内功能的快捷入口，类似支付宝里面的乘车码添加到桌面。目前只要做 ios端。

调研了一下支付宝是怎么做到的， 其实是利用了 safari 的 pwa功能，将编码好的网页内容和图标保存到桌面。点击桌面快捷方式打开网页执行JS，跳转到App对应的功能。
[pwa](https://lavas.baidu.com/pwa/discovery/search-optimization/)

### 开搞

Safari可以直接打开一串包含页面内容编码的URL。而且用base64位的码，会解决二次打开的无效的bug。

因为要打包出来一个base64位的码，所以要内联到一个文件里面。所以打算webpack自己搞起来

##### 1.先把webpack架子搭起来

```
mkdir pwa && cd pwa
npm init -y
npm install webpack webpack-cli --save-dev
```

##### 2.写一个静态 html 页面

因为我这边想用 HtmlWebpackPlugin 这个插件来 转化，而且设置多语言

先从head 说起吧


```
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta content="yes" name="apple-touch-fullscreen"> // 全屏
  <meta content="yes" name="apple-mobile-web-app-capable"> // 自动打开app的功能
  <meta content="black" name="apple-mobile-web-app-status-bar-style"> // bar的颜色
  <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,minimal-ui"> // 视图
  <title>你的title</title>
  <link sizes="114x114" rel="apple-touch-icon-precomposed"
    href="你的图片url icon"> // 保存到桌面的图标
  <script> // 设置rem
    document.documentElement.style.fontSize = 100 * document.documentElement.clientWidth / 375 + "px"
  </script>
  <!-- 因为用注入js的方式 文件太大 -->
  <style>你的样式</style>
</head>
```

在来 body， htmlWebpackPlugin.options.lang 是用于设置多语言的


```
<body>
  <div id="B_container" class="backguide" style="display:none">
    <div class="tips">
      <% if (htmlWebpackPlugin.options.lang === 'zh-Hans') {%>
        你即将进入
      <% } else if (htmlWebpackPlugin.options.lang === 'en') {%>
        You are about to enter
      <% } %>
    </div>
    <button class="enter" onclick="jumpSchema()">立即进入</button>
  </div>
  <div id="app" style="display:none">
    <div class="title">
      <% if (htmlWebpackPlugin.options.lang === 'zh-Hans') {%>
        添加服务到桌面
      <% } else if (htmlWebpackPlugin.options.lang === 'en') {%>
        Add services to the desktop
      <% } %>
    </div>
  </div>
  <script>
    window.MTSchema = '你要跳转的app的链接';

    function jumpSchema() {
      window.location.href = window.MTSchema;
    }

    function getIOSversion() {
      if (/iP(hone|od|ad)/.test(navigator.platform)) {
        var e = navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);
        return [parseInt(e[1], 10), parseInt(e[2], 10), parseInt(e[3] || 0, 10)]
      }
    }
    if (window.navigator.standalone) {
        // 通过window.navigator.standalone检测Safari打开的Web应用程序是否全屏显示
      var v = getIOSversion();
      if (13 <= v[0]) {
        // 13以上的系统 二次进入不会自动跳转，显示进入页面 
        document.getElementById("B_container").style.display = "flex"
      } else {
        document.getElementById("app").style.display = "flex"
      }
      window.location.href = window.MTSchema;
    } else {
      document.getElementById("app").style.display = "flex"
    }
  </script>
</body>
```

##### 3.webpack 配置
    
由于 `url-loader转化html` 是在 `HtmlWebpackPlugin` 之前执行的，所以注入css script是无效的。
后打算自己写个脚本转化

```
const path = require("path");
const merge = require("webpack-merge");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const LANG = process.env.LANG;
const NODE_ENV = process.env.NODE_ENV;

let baseConfig = {
  entry: "./src/main.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist")
  },
  devServer: {
    contentBase: false,
    compress: true,
    hot: true,
    host: "0.0.0.0",
    port: 9000
  },
  module: {
    rules: [
      { // 因为转化成js文件太大 废弃 直接使用内联
        test: /\.scss$/,
        use: [
          "style-loader", // 将 JS 字符串生成为 style 节点
          "css-loader", // 将 CSS 转化成 CommonJS 模块
          "sass-loader" // 将 Sass 编译成 CSS，默认使用 Node Sass
        ]
      }
    ]
  },
  plugins: [
    // 这个是重点 我之前想用 url-loader 转化 html 但是发现 url-loader 是先执行了的， 后打算自己写个脚本转化
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "index.html",
      inject: false, // 不注入
      lang: LANG, // 语言
      minify: {
        collapseWhitespace: true //删除空格、换行
      },
      // 下面是本来想注入的代码 但是导致文件太大
      // inlineSource: '.(js|css)$' // 依赖 HtmlWebpackInlineSourcePlugin
    }),
    // new HtmlWebpackInlineSourcePlugin()
  ]
};
if (NODE_ENV === "development") {
  baseConfig = merge(baseConfig, {
    plugins: [new webpack.HotModuleReplacementPlugin()]
  });
}
module.exports = baseConfig;

```

##### 4.package.json
设置多语言，运行脚本

```
"scripts": {
    "build": "rm -rf ./dist && cross-env LANG=zh-Hans NODE_ENV=production webpack --env.lang=zh-Hans && node ./src/toBase64.js",
    "build:en": "rm -rf ./dist && cross-env LANG=en NODE_ENV=production webpack --env.lang=en && node ./src/toBase64.js",
    "dev": "cross-env LANG=en NODE_ENV=development  webpack-dev-server --hot"
}
```

##### 5.toBase64.js
转化为base64位

```
const fs = require('fs');
const path = require('path');
const mineType = require('mime-types');
 
let filePath = path.resolve('./dist/index.html');
 
let data = fs.readFileSync(filePath);
data = new Buffer(data).toString('base64');
 
let base64 = 'data:' + mineType.lookup(filePath) + ';base64,' + data;
 
fs.writeFileSync(path.resolve('./dist/index.html'), base64);
```

#### 总结

感觉确实很不完美， 当然这个还只是能实现的版本， 后续还要做优化。本人小菜鸟一个，有问题希望大家指出，一起成长。