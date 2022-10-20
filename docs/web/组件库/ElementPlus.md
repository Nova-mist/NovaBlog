# Element Plus

https://element-plus.gitee.io/zh-CN/component/button.html



## 导航

- 侧栏导航
  - 一级类目
  - 二级类目
- 顶部导航



## 安装

**🟢项目中使用**

```powershell
npm install element-plus --save
```

安装之后就可以在 Vite 项目中使用。

---

也可以直接在浏览器 HTML 标签中直接引入，然后使用全局变量 `ElementPlus` 。



## 使用

### 完整引入

```js
// main.js
import { createApp } from 'vue'
import App from './App.vue'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App)

app.use(ElementPlus)
app.mount('#app')
```

### 按需导入

**🟢自动导入**

1. 安装插件

```powershell
npm install -D unplugin-vue-components unplugin-auto-import
```

2. 配置 Vite

```js
// vite.config.js
import { defineConfig } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  // ...
  plugins: [
    // ...
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
})
```

---

🎉可以查看的 vite 项目模板：
[element-plus/element-plus-vite-starter: 🌰 A starter kit for Element Plus with Vite (github.com)](https://github.com/element-plus/element-plus-vite-starter)



## 组件

https://element-plus.gitee.io/zh-CN/component/button.html

### Button

```html
<el-button type="primary">Primary</el-button>
<el-button type="danger" round>Danger</el-button>
<el-button type="warning" :icon="Star" circle />

<el-button type="primary">
    Upload<el-icon class="el-icon--right"><Upload /></el-icon>
</el-button>
```



### Container

[Container 布局容器 | Element Plus (gitee.io)](https://element-plus.gitee.io/zh-CN/component/container.html#常见页面布局)

`<el-container>` 外层容器， 当子元素中包含 `<el-header>` 或 `<el-footer>` 时，全部子元素会垂直上下排列， 否则会水平左右排列。**需要多层嵌套来实现布局**

`<el-header>` 顶栏容器

`<el-aside>` 侧边栏容器

`<el-main>` 主要区域容器

`<el-footer>` 底栏容器



### Icon

- 安装

```powershell
npm install @element-plus/icons-vue
```

---

浏览器直接引入

```html
<script src="//cdn.jsdelivr.net/npm/@element-plus/icons-vue"></script>
```

- 导入图标并进行全局注册

```js
// main.js

// 如果您正在使用CDN引入，请删除下面一行。
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
```

🎉或者使用插件自动导入



### Layout

组件默认使用 Flex 布局，不需要手动设置。

通过基础的 **24 分栏**，迅速简便地创建布局。

```vue
<template>
	<el-row :gutter>
    	<el-col :span><div class="grid-content"/><el-col>
    </el-row>
</template>

<style>
.el-row {
  margin-bottom: 20px;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
</style>
```



### Scrollbar

```vue
<template>
  <el-button @click="add">Add Item</el-button>
  <el-button @click="onDelete">Delete Item</el-button>
  <el-scrollbar max-height="400px">
    <p v-for="item in count" :key="item" class="scrollbar-demo-item">
      {{ item }}
    </p>
  </el-scrollbar>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const count = ref(3)

const add = () => {
  count.value++
}
const onDelete = () => {
  if (count.value > 0) {
    count.value--
  }
}
</script>

<style scoped>
.scrollbar-demo-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  margin: 10px;
  text-align: center;
  border-radius: 4px;
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}
</style>
```

通过 `height` 属性设置滚动条高度，若不设置则根据父容器高度自适应。

设置 `max-height` 当元素高度超过最大高度，才会显示滚动条。



### Image

`<el-image :src="src">`

- 懒加载，搭配 `scroll-container` 来设置滚动容器。

- 通过 `previewSrcList` 开启预览大图功能。



### DatePicker

```vue
<template>
	<el-date-picker
		v-model="value1"
		type="date"
		placeholder="Pick a day"
		:size="size"
	/>
</template>

<script>
import { ref } from 'vue'
const value1 = ref('')
const value2 = ref('')
</script>
```



### Input Number

```vue
<template>
  <el-input-number v-model="num" :min="1" :max="10" @change="handleChange" />
</template>

<script>
import { ref } from 'vue'

const num = ref(1)
const handleChange = (value: number) => {
  console.log(value)
}
</script>
```



### Input

`<el-input v-model>`

```vue
<template>
  <el-input v-model="inp" placeholder="Please input" />
</template>

<script>
import { ref } from 'vue'
const inp = ref('')
export default {
  setup() {
    return {
      inp
    }
  }
}
</script>
```



### Timeline

时间线组件挺好用，可以用来做博客归档。

配合时间戳排序。

```js
// 按时间戳排序
function sortedPostList() {
  // 空数据
  if (postList.value.length == 0) {
    return null;
  }
  let res = postList.value.sort(function (a, b) {
    // Turn your strings into dates, and then subtract them
    // to get a value that is either negative, positive, or zero.
    return new Date(b.createAt) - new Date(a.createAt);
  });
  
  return res;
}

// 解析日期字符串
function TimestampToDate(Timestamp) {
  let date1 = new Date(Timestamp),
    y = date1.getFullYear(),
    m = date1.getMonth() + 1,
    d = date1.getDate();
  return (
    y +
    "-" +
    (m < 10 ? "0" + m : m) +
    "-" +
    (d < 10 ? "0" + d : d) +
    " " +
    date1.toTimeString().substr(0, 8)
  );
}
```



### Menu

[Menu | Element Plus (gitee.io)](https://element-plus.gitee.io/en-US/component/menu.html)
