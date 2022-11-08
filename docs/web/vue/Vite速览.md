# Vite速览

> vue3 首选 vite

## 基础概念

[Vite当前可用于生产吗，对比webpack有什么不足吗? - 知乎 (zhihu.com)](https://www.zhihu.com/question/447025978/answer/2477191850)

|          |         |            |
| -------- | ------- | ---------- |
| 脚手架   | vue-cli | create-vue |
| 构建项目 | webpack | vite       |
| 打包代码 | webpack | rollup     |

- 脚手架：创建项目，选择性安装需要的插件，指定统一的风格，生成demo。
- 构建项目：建立项目的运行环境，需要手动安装插件。
- 打包代码：代码写好之后，为了更好的使用，需要打包处理一下。

> 🟢Vite是一种新型前端构建工具，能够显著提升前端开发体验。
>
> 使用Rollup打包代码。

## 搭建Vite项目

```powershell
# 需要按照提示选择选项
npm create vite@latest

# 直接指定项目名称和模板
# npm 7+, extra double-dash is needed:
npm create vite@latest my-vue-app -- --template vue

# cd my-vue-app
# npm install
# npm run dev
```

**查看生成的目录**

`index.html` 在项目最外层，作为Vite项目的入口文件。

```html
<body>
    <div id="app"></div>
    <!-- vite会解析此script标签并指向JavaScript源码 -->
    <script type="module" src="/src/main.js"></script>
</body>
```

## 工具 & 依赖

VSCode 插件：

- Volar (for Vue3 + Vue2) / ~~Vetur (for Vue2)~~， `.vue` 文件代码高亮和语法提示。（格式化功能用不上）
- Prettier 代码格式化， `.vue` 文件也支持
- Eslint，js 语法智能提示、规范。（需要关闭格式化功能）

🟢Prettier 和 Eslint 配置请看 [ESLint and Prettier with Vite and Vue.js 3 - Vue School Blog](https://vueschool.io/articles/vuejs-tutorials/eslint-and-prettier-with-vite-and-vue-js-3/)

> 简略步骤：
>
> 1. npm 安装 Prettier、Eslint，在根目录创建配置文件
> 2. npm 安装 `eslint-config-prettier`，关闭 Eslint 代码 formatting，配置文件。
> 3. 安装 VSCode 插件会自动读取配置文件
> 4. `vite-plugin-eslint` 库可以将错误显示在浏览器中

❤️**使用步骤**

补充：[Vite 安装 Tailwindcss](https://tailwindcss.com/docs/guides/vite#vue)

```bash
npm init vite@latest
npm install --save-dev --save-exact prettier
echo {}> .prettierrc.json
npm install --save-dev eslint eslint-plugin-vue
echo > .eslintrc.cjs

# eslint和prettier共存时使用后者来格式化代码
npm install eslint-config-prettier --save-dev

# 将错误显示在页面
npm install vite-plugin-eslint --save-dev
```

```js
//.eslintrc.cjs
module.exports = {
    env: {
        node: true,
    },
    extends: [
        'eslint:recommended',
        "plugin:vue/vue3-recommended",
        "prettier"
    ],
    rules: {
        // override/add rules settings here, such as:
        // 'vue/no-unused-vars': 'error'
    }
}
```

【只需设置一次全局】VSCode 的配置：

```json
// Code/User/settings.json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
}

// Code/User/settings.json
"[vue]": {
  "editor.defaultFormatter": "esbenp.prettier-vscode"
},
"[javascript]": {
  "editor.defaultFormatter": "esbenp.prettier-vscode"
},
```

**使用命令行**

```powershell
# cd my-vue-app
npx vite --help
npx vite # start dev server
npx vite build
```

## 功能

**静态资源处理**

导入一个静态资源会返回解析后的 URL：

```js
import imgUrl from './img.png'
document.getElementById('hero-img').src = imgUrl
```

**JSON**

JSON 可以被直接导入 —— 同样支持具名导入：

```js
// 导入整个对象
import json from './example.json'
// 对一个根字段使用具名导入
import { field } from './example.json'
```

**补充**

关于后缀

```js
// js
import BlogStore from "@/store/BlogStore";
// vue
import NotFoundPage from "./404Page.vue";
```

导出写法

[export - JavaScript | MDN (mozilla.org)](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/export#examples)

```js
// 只能有一个 default export
export default class {
    
}
import anyName from 'xxx.js'

// named export
export let a = 3;
function b() {}
const c = 4;
export {b, c}

// 导入导出可以使用as指定别名
import {a, b, c} from 'xxx.js'
```

## 使用插件

1. 将插件添加到项目的 `devDependencies`
2. 在 `vite.config.js` 配置文件中的 `plugins` 数组中引入插件

例子：为传统浏览器提供支持

```powershell
npm add -D @vitejs/plugin-legacy
```

```js
// vite.config.js
import legacy from '@vitejs/plugin-legacy'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    legacy({
      targets: ['defaults', 'not IE 11']
    })
  ]
})
```

## 静态资源处理

1. 服务时引入一个静态资源会返回解析后的公共路径

2. 未被包含在内部列表或 `assetsInclude` 中的资源，可以使用 `?url` 后缀显式导入为一个 URL。

   ```js
   import workletURL from 'extra-scalloped-border/worklet.js?url'
   CSS.paintWorklet.addModule(workletURL)
   ```

3. 资源可以使用 `?raw` 后缀声明作为字符串引入。

   ```js
   import shaderString from './shader.glsl?raw'
   ```

`public` 目录可以存储：

- 不会被源码引用的资源
- 必须保持原有文件名的资源

该目录中的资源在开发时能直接通过 `/` 根路径访问到，并且打包时会被完整复制到目标目录的根目录下。

## 对于路径使用@简写

`/src/views/xxx`  和相对路径 `../views/xxx` 可以映射为 `@/views/xxx`

```js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// No longer support commonJS import, use ES6 import. https://juejin.cn/post/7142338375402881060
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    // @ -> /src
    // https://vueschool.io/articles/vuejs-tutorials/import-aliases-in-vite/
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [vue()],
});

```
