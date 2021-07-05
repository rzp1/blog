## 打造属于自己的脚手架

### 一. 所需要的 npm 包

1. commander - 解析 命令行参数
2. chalk - 命令行颜色
3. download-git-repo - 下载 git 包
4. handlebars - 一个简单高效的语义化模版引擎
5. inquirer - 获取到命令行问题 答案，根据答案 筛选内容
6. metalsmith - 相当于gulp 可以用一些插件 对文件进行处理 （用handlebars插件
7. ora - loading

### 二. 具体流程

1. inquirer 回答问题 
2. download-git-repo 下载模版
3. Metalsmith 使用工程
4. handlebars 模版文件 处理
5. 安装依赖

### 三。 代码具体实现

npm install rzp-cli -g

模版 https://github.com/rzp1/rzp-cli-template


脚手架 代码 https://github.com/rzp1/rzp-cli