1. 盒模型
2. link和@import的区别
3. BFC
4. Css选择器的优先级
5. 层叠上下文
6. Flex - 九宫格布局
7. Flex - Flex-shrink flex-basis
8. Flex - grid
9. 1px问题
10. Rem方案和vw方案优缺点 
11. 重绘（repaint） 重排/回流(reflow)


## 1.盒模型
页面渲染时，dom 元素所采用的 布局模型，可用 box-sizing 来设置。
1. content-box (W3C 标准盒模型) || 元素所占的宽度 = margin(l+r) + padding(l+r) + border(l+r) + width
2. border-box (IE 盒模型) || 元素所占的宽度 = margin(l+r) + width
3. padding-box
4. margin-box (浏览器未实现)

## 2.link和@import的区别
1. `@import`只在IE 5以上才能识别，而`link`是XHTML标签，无兼容问题。
2. `link`可以使用 js 动态引入，`@import`不行
3. 当解析到`link`时，页面会同步加载所引的 css，而`@import`所引用的 css 会等到页面加载完才被加载
4. `link`方式的样式权重高于`@import`的权重。
5. `lin`k功能较多，可以定义 RSS，定义 Rel 等作用，而`@import`能用于加载 css

## 3.BFC
块级格式化上下文，是一个独立的渲染区域，让处于 BFC 内部的元素与外部的元素相互隔离，使内外元素的定位不会相互影响

触发条件
1. 根元素 html
2. position: absolute/fixed
3. display: inline-block / table
4. float 元素
5. ovevflow !== visible

应用
1. 阻止margin重叠
2. 可以包含浮动元素 —— 清除内部浮动(清除浮动的原理是两个div都位于同一个 BFC 区域之中)
3. 自适应两栏布局
4. 可以阻止元素被浮动元素覆盖

## 4.Css选择器的优先级
- !important > 行内样式 > #id > .class > tag > * > 继承 > 默认
- 选择器 从右往左 解析(更快)
