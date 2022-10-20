## Flex 布局

- [Flex 布局教程：语法篇 - 阮一峰的网络日志 (ruanyifeng.com)](https://www.ruanyifeng.com/blog/2015/07/flex-grammar.html)
- [Flex 布局教程：实例篇 - 阮一峰的网络日志 (ruanyifeng.com)](https://www.ruanyifeng.com/blog/2015/07/flex-examples.html)
- [布局青蛙 Flexbox Froggy - A game for learning CSS flexbox](https://flexboxfroggy.com/)

### 概念

> 传统的布局方案——盒装模型
>
> 依赖 `display` 、 `position` 、 `float ` 等属性，复杂。
>
> 新的方案——Flex 布局，可以简便、完整、响应式地实现各种页面布局。

Flex 容器的所有子元素自动成为容器成员。

容器默认的两条轴：

- 水平的主轴（main axis）
- 垂直的交叉轴（cross axis）

**设置在容器上的属性**

> - `flex-direction` 主轴的方向（项目的排列方向），默认继承上一层容器
> - `flex-wrap` 一条轴线排不下应该如何换行
> - `flex-flow` 前两个属性的缩写 `column wrap`
> - `justify-content` 项目在主轴上的对齐方式
> - `align-items` 交叉轴上如何对齐
> - `align-content` 多根轴线的对齐方式，只有一根则该属性不起作用

**设置在 item 的属性**

> - `order` 排列顺序 🟢 `-1`
> - `flex-grow` 放大比例，都为1则等分剩余空间
> - `flex-shrink` 空间不足时候的缩小比例
> - `flex-basis` 项目占据的主轴空间（main size），默认就是 `auto` 即项目的本来大小，根据这个属性计算主轴是否有多余空间
> - `flex` 前三个属性的缩写 默认 `0 1 auto` 
> - `align-self` 允许单个项目与其他项目不一样的对齐方式，可以覆盖 `align-items` 。

### 应用

1. 单个项目

垂直居中对齐（中心）

```css
.box {
    display: flex;
    justify-content: center;
    align-items: center;
}
```

2. 两个项目

![img](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/202208232244067.png)

```css
.box {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
```

> 🟠主轴是横向的时候，`align-items` 控制交叉轴上下移动。
>
> 主轴是纵向的时候，`align-items` 控制交叉轴左右移动。

3. 网格布局

在容器里面平均分配空间，需要设置项目的自动缩放。

```css
.Grid {
  display: flex;
}

.Grid-cell {
  flex: 1;
}
```

4. 圣杯布局

![image-20220823225226833](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/202208232252157.png)

```css
.HolyGrail {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
}

header,
footer {
  flex: 1;
}

.HolyGrail-body {
  display: flex;
  flex: 1;
}

.HolyGrail-content {
  flex: 1;
}

.HolyGrail-nav, .HolyGrail-ads {
  /* 两个边栏的宽度设为12em */
  flex: 0 0 12em;
}

.HolyGrail-nav {
  /* 导航放到最左边 */
  order: -1;
}
```

5. 输入框布局，后面加按钮
6. 悬挂式布局，文字旁边加图像

![image-20220823225730691](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/202208232257110.png)

```markup
<div class="Media">
  <img class="Media-figure" src="" alt="">
  <p class="Media-body">...</p>
</div>
```

```css
.Media {
  display: flex;
  align-items: flex-start;
}

.Media-figure {
  margin-right: 1em;
}

.Media-body {
  flex: 1;
}
```

7. **固定底栏**

关键就是主体内容的 `flex: 1`

```markup
<body class="Site">
  <header>...</header>
  <main class="Site-content">...</main>
  <footer>...</footer>
</body>
```

```css
.Site {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
}

.Site-content {
  flex: 1;
}
```

---

![image-20220823230338899](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/202208232303238.png)

`flex-direction` 反转之后，`justify-content` 的首尾也颠倒了。（如果换行也会从新的行首开始排）

![image-20220823230710869](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/202208232307157.png)

![image-20220823231000343](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/202208232310677.png)

`align-self` 设置单个的属性。

![image-20220823231238712](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/202208232312155.png)

`flex-direction` 改为纵向主轴之后，换行默认是从左到右。

![image-20220823233333536](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/202208232333813.png)

**每一步对应的步骤**

> 多行的情况下：
>
> 当主轴变为纵向之后，`justify-content` 影响的是单行的上下位置，`align-content` 影响的是多行之间的左右位置。
>
> 默认主轴是横向，`justify-content` 影响的是单行的左右位置，`align-content` 影响的是多行之间的上下位置。



### 开发经验

🟠如果想要组件垂直、居中、自动填充 `flex: 1` 上一级必须设置 `display: flex`  等属性。

![image-20220825101143395](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/202208251011458.png)

```css
#content {
  /* 作为上一层容器的item */
  background-color: aquamarine;
  /* flex: 1; */
  /* 居中 */
  align-self: center;
  min-width: 75%;
  /* 最小高度 */
  min-height: 960px;

  /* 自身也成为flex容器 */
  display: flex;
  justify-content: center;
}

#plist {
  background-color: bisque;
  width: 50%;
}
```



## (旧)图片填充 div 

[object-fit - CSS（层叠样式表） | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Web/CSS/object-fit)

![image-20220826185551207](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/202208261855236.png)

`cover` 是等比例放大。

```css
img {
  object-fit: cover;
  width: 100%;
  height: 100%;
}
```



## 图片填充并居中

关键点在于 `img` 外层的 `<p>` 的宽度要占满容器

🟢对图片宽度和高度做了限制

```css
img {
  object-fit: cover;

  display: block;
  margin-left: auto;
  margin-right: auto;

  max-width: 100%;
  max-height: 500px;
}

p {
  width: 100%;
}
```



## 隐藏超出的文字

[text-overflow - CSS（层叠样式表） | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Web/CSS/text-overflow)

```css
.description {
  /* 隐藏溢出文字 */
  text-overflow: ellipsis;
  overflow: hidden;
}
```



## flex 填充

文字较少的情况下会出现宽度无法填满父级容器的情况。

1. 设置父级容器为 flex 布局，`display: flex`
2. 设置文字所在块为 `flex: auto` ，可以做到自动填充的效果。



## 渲染的 Markdown 换行

找到解析后的没有换行的元素。注意是全局设置（没有用 `scoped`），否则样式没有作用。

```vue
<style>
ul {
  width: 100%;
}
</style>
```



## CSS 自定义属性

[Using CSS custom properties (variables) - CSS: Cascading Style Sheets | MDN (mozilla.org)](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)

```css
:root {
  --main-bg-color: brown;
}

.one {
  color: white;
  background-color: var(--main-bg-color);
  margin: 10px;
  width: 50px;
  height: 50px;
  display: inline-block;
}
```



## 转换空格

[vuejs template (codepen.io)](https://codepen.io/GuillaumeMeral/pen/NWWNWMr)

```css
#app {
  white-space: pre-wrap
}
```





## TODO

position: absolute
