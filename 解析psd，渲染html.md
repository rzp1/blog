### 前言
最近在做一个h5 工厂的项目， 就是快速生产 h5，脱离程序员，让运营人员也能配置 h5页面。目前在做psd导入功能。

### psdjs

解析psd，目前就搜索到 node 和 php版本， 因为我是前端开发，用node上手比较快 所以选择用node来写，

废话不多说，先搭一个node npm环境。

```
npm init 
```
这个命令会生成package.json 文件

因为之后还要扩展接口，所以这个node服务用个框架比较好。

选择了koa 之前用过express 不过听说koa比较轻，而且功能都差不多，所以选择了koa

```
npm i --save koa
```

整体看下我安装的依赖
```
"koa": "^2.11.0",
"koa-cors": "^0.0.16",
"koa-router": "^8.0.8",
"koa2-multiparty": "^1.0.1",
"psd": "^3.2.0",
"request": "^2.88.2",
"request-promise": "^4.2.5"
```

先贴 index.js 代码


```
const Koa = require("koa");
const cors = require("koa-cors"); // 解决跨域问题
const router = require("koa-router")(); // 方便扩展 用了 koa-router
const multiparty = require("koa2-multiparty"); // 图片上传 因node获取不到file 所以用个第三方插件
const parsePsd = require("./parsePsd") // 主程
const app = new Koa();

app.use(cors());
app.use(router.routes()); /*启动路由*/
app.use(router.allowedMethods());


router.post("/psd", multiparty(), async (ctx) => {
  ctx.body = await parsePsd(ctx.req.files.file.path);
  return;
});

app.listen(3000, () => {
  console.log("[demo] server is starting at port 3000");
});
```

在贴 parsePsd 代码

```
const fs = require("fs");
const path = require("path");

const PSD = require("psd"); // 解析psd 插件
const request = require("request-promise"); // 发送http请求 插件

// 提取图片
function extractImage(node, index) {
  return new Promise(async (resolve, reject) => {
    await node.layer.image.saveAsPng(path.join(__dirname, 'images/output-'+index+'.png')); // 保存图片
    try {
      let res = await request.post({
        url: 'http://xxxxxxxx',
        headers: {
          'Authorization': 'Bearer ' + req.body.token
        },
        formData: {
          file: fs.createReadStream(path.join(__dirname, 'images/output-'+index+'.png')),
        }
      });
      resolve({
        name: node.name,
        width: node.width,
        height: node.height,
        left: node.left,
        right: node.right,
        top: node.top,
        bottom: node.bottom,
        type: "pic",
        imgSrc: res.url.url
      })
    } catch (error) {
      reject(error)
    }
  })
}

module.exports = function parsePsd(filePath) {
  return new Promise((resolve, reject) => {
    PSD.open(filePath).then(async psd => {
      let tree = await psd.tree().export(); // 获取全部节点
      let descendants = await psd.tree().descendants(); // 获取当前节点的所有后代
      let promiseAll = [];
      for (let i = 0; i < descendants.length; i++) { // 这里有个坑 用foreach await函数不会同步执行
        let node = descendants[i]; // 获取当前节点
        if (!node.hasChildren()) {
          promiseAll.push(extractImage(node, i))
        }
      }
      Promise.all(promiseAll).then((result) => { // 让上传 并发执行
        resolve({ code: 0, data: { layers: result, document: tree.document} });
      }).catch((error) => {
        reject(error)
      })
    });
  });
}

```

返回的数据 


 ![](https://user-gold-cdn.xitu.io/2020/3/5/170a8cc14bd0f25f?w=1002&h=708&f=png&s=109715)


