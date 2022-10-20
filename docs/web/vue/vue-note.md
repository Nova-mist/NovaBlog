# Vue基础

## 单文件组件

### 语法定义

[SFC 语法定义 | Vue.js (vuejs.org)](https://cn.vuejs.org/api/sfc-spec.html)

`.vue` 单文件组件（SFC）

```vue
<template>
  <div class="example">{{ msg }}</div>
</template>

<script>
export default {
  data() {
    return {
      msg: 'Hello world!'
    }
  }
}
</script>

<style>
.example {
  color: red;
}
</style>
```

`<script>` 脚本代码块会作为 ES 模块执行。

`<script setup>` 脚本块会被预处理为组件的 `setup()` 函数，**每次组件实例被创建的时候都会执行**。

🟢推荐使用 `<script setup>` 语法糖，格式简单。

---

可以导入外部代码块。但不能使用 `src` attribute 引入 `<script setup>` ，因为其代码依赖单文件组件的上下文。

```vue
<template src="./template.html"></template>
<style src="./style.css"></style>
<script src="./script.js"></script>
```

### \<script setup>

[单文件组件  | Vue.js (vuejs.org)](https://cn.vuejs.org/api/sfc-script-setup.html#basic-syntax)

- 🟢顶层的绑定都能在模板中直接使用

  ```vue
  <script setup>
  // 变量
  const msg = 'Hello!'
  
  // 函数
  function log() {
    console.log(msg)
  }
  </script>
  
  <template>
    <button @click="log">{{ msg }}</button>
  </template>
  ```

- 使用响应式状态

- 可以直接引用一个组件作为变量使用 `<MyComponent>`

- 使用动态的 `:is` 绑定动态组件

---

搭配 `<script setup>` 使用

[Vue3 defineProps、defineEmits、defineExpose 的作用 - 掘金 (juejin.cn)](https://juejin.cn/post/7126852961245855775)

#### 使用子组件的属性和方法

```vue
// 子组件 PostBlock.vue
<template>
  <div class="post-content">
    <h1>{{ title }}</h1>
    <p>
      {{ description }}
    </p>
  </div>
</template>
<script setup>
const title = "标题测试";
const description = "描述测试";
defineExpose({
  title,
});
</script>
```

```vue
// 父组件 PostList.vue
<template>
  <div id="plist">
    <PostBlock ref="postblock" />
    <el-button @click="test">Test</el-button>
  </div>
</template>
<script setup>
import PostBlock from "@/components/PostBlock.vue";
import { ref } from "vue";

const postblock = ref(null);
    
// 直接写在这里属于beforeCreate生命周期
// create生命周期的内容获取不到会出错
// console.log(postblock.value.title);

function test() {
  // 输出子组件属性
  console.log(postblock.value.title);
}
</script>
```

## 响应式基础

[响应式基础 | Vue.js (vuejs.org)](https://cn.vuejs.org/guide/essentials/reactivity-fundamentals.html)

- 使用 [`reactive()`](https://cn.vuejs.org/api/reactivity-core.html#reactive) 函数创建一个响应式对象或数组
- 使用 `ref()` 定义响应式变量

### 组合式 API

方法一：在 `setup()` 函数中定义并返回。

```vue
<script setup>
import { reactive } from 'vue'

export default {
  setup() {
    const state = reactive({ count: 0 })

    function increment() {
      state.count++
    }

    // 不要忘记同时暴露 increment 函数
    return {
      state,
      increment
    }
  }
}
</script>
<template>
    <button @click="increment">
      {{ state.count }}
    </button>
</template>
```

方法二：优先使用 `<script setup>`

```vue
<script setup>
import { reactive } from 'vue'

const state = reactive({ count: 0 })

function increment() {
  state.count++
}
</script>

<template>
  <button @click="increment">
    {{ state.count }}
  </button>
</template>
```

### 推荐使用 refs()

🔴将响应式对象的属性赋值或解构至本地变量时，或是将该属性传入一个函数时，`reactive()` 响应式对象的属性会失去响应性。

```js
const state = reactive({ count: 0 })

// 下面的操作都导致失去了响应性，不会影响原始的state
let n = state.count
n++

let { count } = state
count++

callSomeFunction(state.count)
```

Vue 提供了一个 [`ref()`](https://cn.vuejs.org/api/reactivity-core.html#ref) 方法来允许我们创建可以使用任何值类型的响应式 **ref**，类似**引用机制**。

🟢`ref()` 将传入参数的值包装为一个带 `.value` 属性的 ref 对象。

```js
const count = ref(0)

console.log(count) // { value: 0 }
console.log(count.value) // 0

count.value++
console.log(count.value) // 1
```

🟢`ref()` 不会丢失响应性

```js
const objectRef = ref({ count: 0 })

// 这是响应式的替换
objectRef.value = { count: 1 }

const obj = {
  foo: ref(1),
  bar: ref(2)
}

// 该函数接收一个 ref
// 需要通过 .value 取值
// 但它会保持响应性
callSomeFunction(obj.foo)

// 仍然是响应式的
const { foo, bar } = obj
```

当 ref 在模板中作为**顶层属性**被访问时，它们会被自动“解包”，所以不需要使用 `.value`。

```vue
<script setup>
import { ref } from 'vue'

const count = ref(0)

function increment() {
  count.value++
}
</script>

<template>
  <button @click="increment">
    {{ count }} <!-- 无需 .value -->
  </button>
</template>
```

## 组合式 API

[组合式 API：setup() | Vue.js (vuejs.org)](https://cn.vuejs.org/api/composition-api-setup.html#basic-usage)

### setup()

在 `setup()` 函数中返回的对象会暴露给模板和组件实例。

#### 访问 Props

一个 `setup` 函数的 `props` 是响应式的，并且会在传入新的 props 时同步更新。

使用 `props` 对象的变量，并保持响应性：

- 通过 `props.xxx` 的形式

- 需要结构 `props` 对象或将某个 prop 传到一个外部函数并保持响应性，使用 [toRefs()](https://cn.vuejs.org/api/reactivity-utilities.html#torefs) 和 [toRef()](https://cn.vuejs.org/api/reactivity-utilities.html#toref) 这两个工具函数

  ```js
  import { toRefs, toRef } from 'vue'
  
  export default {
    setup(props) {
      // 将 `props` 转为一个其中全是 ref 的对象，然后解构
      const { title } = toRefs(props)
      // `title` 是一个追踪着 `props.title` 的 ref
      console.log(title.value)
  
      // 或者，将 `props` 的单个属性转为一个 ref
      const title = toRef(props, 'title')
    }
  }
  ```

#### 暴露公共属性

```js
export default {
  setup(props, { expose }) {
    // 让组件实例处于 “关闭状态”
    // 即不向父组件暴露任何东西
    expose()

    const publicCount = ref(0)
    const privateCount = ref(0)
    // 有选择地暴露局部状态
    expose({ count: publicCount })
  }
}
```

🟢在 `<script setup>` 中就使用 `defineExpose()` 方法。

### 响应式：核心

`ref()` 接受一个内部值，返回一个响应式的、可更改的 ref 对象，此对象只有一个指向其内部值的属性 `.value`。

```js
const count = ref(0)
console.log(count.value) // 0

count.value++
console.log(count.value) // 1
```

`computed()`

接受一个 getter 函数，返回一个只读的响应式 [ref](https://cn.vuejs.org/api/reactivity-core.html#ref) 对象。该 ref 通过 `.value` 暴露 getter 函数的返回值。它也可以接受一个带有 `get` 和 `set` 函数的对象来创建一个可写的 ref 对象。

**只读的计算属性 ref**

```js
const count = ref(1)
const plusOne = computed(() => count.value + 1)

console.log(plusOne.value) // 2

plusOne.value++ // 错误
```

**可写的计算属性 ref**

```js
const count = ref(1)
const plusOne = computed({
  get: () => count.value + 1,
  set: (val) => {
    count.value = val - 1
  }
})

plusOne.value = 1
console.log(count.value) // 0
```

### 响应式：工具

- `isRef()` 检查某个值是否为 ref

- `toRef()` 基于响应式对象上的一个属性，创建一个对应的 ref，**该 ref 与其源属性保持同步**。

  ```js
  const state = reactive({
    foo: 1,
    bar: 2
  })
  
  const fooRef = toRef(state, 'foo')
  
  // 更改该 ref 会更新源属性
  fooRef.value++
  console.log(state.foo) // 2
  
  // 更改源属性也会更新该 ref
  state.foo++
  console.log(fooRef.value) // 3
  ```

- `toRefs()` 将一个响应式对象转换为一个普通对象。每个单独的 ref 都是使用 `toRef()` 创建的。

🟠响应式的属性自动解构，所以不需要使用 `.value` ；创建的 ref 就需要使用 `.value` 来访问。

## 模板引用

### 访问模板引用

> `ref` 是一个特殊的 attribute，和 `v-for` 章节中提到的 `key` 类似。它允许我们在一个特定的 DOM 元素或子组件实例被挂载后，获得对它的直接引用。

通过组合式 API 获得模板引用

```vue
<script setup>
import { ref, onMounted } from 'vue'

// 声明一个 ref 来存放该元素的引用
// 必须和模板里的 ref 同名
const input = ref(null)

onMounted(() => {
  input.value.focus()
})
</script>

<template>
  <input ref="input" />
</template>
```

### 组件上的 ref

模板引用也可以被用在一个子组件上。这种情况下**引用中获得的值的是组件实例**.

```vue
<script setup>
import { ref, onMounted } from 'vue'
import Child from './Child.vue'

const child = ref(null)

onMounted(() => {
  // child.value 是 <Child /> 组件的实例
  console.log(child.value)
})
</script>

<template>
  <Child ref="child" />
</template>
```

🟠一个父组件无法访问到一个使用了 `<script setup>` 的子组件中的任何东西，除非子组件在其中通过 `defineExpose` 宏显式暴露：

```vue
<script setup>
import { ref } from 'vue'

const a = 1
const b = ref(2)

defineExpose({
  a,
  b
})
</script>
```

## 组件基础

### 使用组件

```vue
<script setup>
import ButtonCounter from './ButtonCounter.vue'
</script>

<template>
  <h1>Here is a child component!</h1>
  <ButtonCounter />
  <ButtonCounter />
</template>
```

通过 `<script setup>`，导入的组件都在模板中直接可用。

每个创建的组件都是一个实例，都维护着自己的实例。

### 传递 props

通过 `defineProps` 宏在组件上声明注册 props，声明的 props 会自动暴露给模板。

```vue
<!-- BlogPost.vue -->
<script setup>
defineProps(['title'])
    
// defineProps({ isEdit: { type: Boolean, default: false } });   
</script>

<template>
  <h4>{{ title }}</h4>
</template>
```

在父组件通过 `v-for` 渲染列表

```vue
<template>
    <BlogPost
      v-for="post in posts"
      :key="post.id"
      :title="post.title"
     />
</template>
<script setup>
    const posts = ref([
        { id: 1, title: 'My journey with Vue' },
        { id: 2, title: 'Blogging with Vue' },
        { id: 3, title: 'Why Vue is so fun' }
    ])
</script>
```

### 监听事件

[点击按钮放大字体的案例](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHJlZiB9IGZyb20gJ3Z1ZSdcbmltcG9ydCBCbG9nUG9zdCBmcm9tICcuL0Jsb2dQb3N0LnZ1ZSdcbiAgXG5jb25zdCBwb3N0cyA9IHJlZihbXG4gIHsgaWQ6IDEsIHRpdGxlOiAnTXkgam91cm5leSB3aXRoIFZ1ZScgfSxcbiAgeyBpZDogMiwgdGl0bGU6ICdCbG9nZ2luZyB3aXRoIFZ1ZScgfSxcbiAgeyBpZDogMywgdGl0bGU6ICdXaHkgVnVlIGlzIHNvIGZ1bicgfVxuXSlcblxuY29uc3QgcG9zdEZvbnRTaXplID0gcmVmKDEpXG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuXHQ8ZGl2IDpzdHlsZT1cInsgZm9udFNpemU6IHBvc3RGb250U2l6ZSArICdlbScgfVwiPlxuICAgIDxCbG9nUG9zdFxuICAgICAgdi1mb3I9XCJwb3N0IGluIHBvc3RzXCJcbiAgICAgIDprZXk9XCJwb3N0LmlkXCJcbiAgICAgIDp0aXRsZT1cInBvc3QudGl0bGVcIlxuICAgICAgQGVubGFyZ2UtdGV4dD1cInBvc3RGb250U2l6ZSArPSAwLjFcIlxuICAgID48L0Jsb2dQb3N0PlxuICA8L2Rpdj5cbjwvdGVtcGxhdGU+IiwiaW1wb3J0LW1hcC5qc29uIjoie1xuICBcImltcG9ydHNcIjoge1xuICAgIFwidnVlXCI6IFwiaHR0cHM6Ly9zZmMudnVlanMub3JnL3Z1ZS5ydW50aW1lLmVzbS1icm93c2VyLmpzXCJcbiAgfVxufSIsIkJsb2dQb3N0LnZ1ZSI6IjxzY3JpcHQgc2V0dXA+XG5kZWZpbmVQcm9wcyhbJ3RpdGxlJ10pXG5kZWZpbmVFbWl0cyhbJ2VubGFyZ2UtdGV4dCddKVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cbiAgPGRpdiBjbGFzcz1cImJsb2ctcG9zdFwiPlxuICAgIDxoND57eyB0aXRsZSB9fTwvaDQ+XG4gICAgPGJ1dHRvbiBAY2xpY2s9XCIkZW1pdCgnZW5sYXJnZS10ZXh0JylcIj5FbmxhcmdlIHRleHQ8L2J1dHRvbj5cbiAgPC9kaXY+XG48L3RlbXBsYXRlPiJ9)

通过 [`defineEmits`](https://cn.vuejs.org/api/sfc-script-setup.html#defineprops-defineemits) 宏来声明需要抛出的事件，父组件在使用子组件实例的时候就可以绑定这个事件。

```vue
<!-- BlogPost.vue -->
<script setup>
defineProps(['title'])
defineEmits(['enlarge-text'])
</script>
```

```vue
<!-- App.vue -->
<template>
<BlogPost
  ...
  @enlarge-text="postFontSize += 0.1"
 />
</template>
```

在子组件实例中可以通过 emit 来触发父组件中绑定的事件。

```vue
<!-- BlogPost.vue, 省略了 <script> -->
<template>
  <div class="blog-post">
    <h4>{{ title }}</h4>
    <button @click="$emit('enlarge-text')">Enlarge text</button>
  </div>
</template>
```

🟠在 `<script setup>` 中不能使用 `$emit` 只能使用 `emit()`

```vue
<script setup>
const emit = defineEmits(['enlarge-text'])

emit('enlarge-text')
</script>
```

## 大前端概念

**WebPack**

打包工具。

对静态资源进行构建和打包。

需要进行复杂的配置。

基于Node.js

**Vue CLI**

脚手架、开发服务器。

集成了许多插件，默认配置了webpack。

**Node.js**

JavaScript运行环境，进行后端开发。

类似于JVM。

**npm**

Node.js的包管理工具。

**Axios**

基于promise的HTTP库。

**Vite**

脚手架、基于浏览器原生 ES imports 的开发服务器。

ES Module: 就是在浏览器和Node.js中原生增加了模块化的支持。

[Vite 浅入浅出 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/400313956)

[Vite和Vue CLI的优劣 - 千年轮回 - 博客园 (cnblogs.com)](https://www.cnblogs.com/ajaemp/p/14431161.html)

**Babel**

JavaScript编译器。能将现代 ES6+ 语法和特性转换为向后兼容语法。

vue、react都能使用。

**ESLint**

代码规范检测工具，是一个node包。

**单独使用只会在编译时报错。**

搭配IDE或编辑器来使用，例如在vscode中就要安装eslint插件检测相应的配置文件，**在编译之前就发现错误**。

**Prettier**

代码自动格式化工具。

在编译时自动格式化。

**也可以单独安装vscode插件，在首选项中设置。也可以的搭配prettier的node包，识别相应的配置文件。**

[弄懂Prettier相关npm包和VSCode插件](https://blog.csdn.net/huzhenv5/article/details/108041421)

**Vetur**

专门用来高亮、格式化vue文件的vscode插件。

## 单页面项目准备

### 项目化

- 使用 vue-cli 脚手架
  加载依赖、编译很慢，Vue2 用

  ```bash
  npm install -g @vue/cli
  vue ui
  ```

- 【Vue3 推荐】使用 vite

  ```bash
  npm create vite@latest
  ```

[官方文档](https://v3.cn.vuejs.org/guide/introduction.html)

[freeCodeCamp 视频](https://www.youtube.com/watch?v=FXpIoQ_rT_c)

### 项目结构

区分页面与组件

- `views` 目录下的 `.vue` 文件是渲染的单页面
- `components` 目录下的 `.vue` 文件通常是复用的组件
- 页面是在 router 设置中引用，组件需要独立的 `.vue` 页面中引用。

### 代码风格

🟠【选项式写法】 `export default` 用来为 `vue` 页面绑定数据和 `vue` 组件。

[vue.js - Vue 'export default' vs 'new Vue' - Stack Overflow](https://stackoverflow.com/questions/48727863/vue-export-default-vs-new-vue)

```vue
<script>
    import Product from './components/Product.vue'
    
    export default {
        // 在<router-view>处传入的数据和方法
        props: ['inventory', 'addToCart'],
        components: {
            Productfc
        }
    }
</script>
```

【组合式写法】`setup()` 或者语法糖 `<script setup>`

[Understand the difference between setup() and < script setup > < script > in vue3 (programming.vip)](https://programming.vip/docs/understand-the-difference-between-setup-and-script-setup-script-in-vue3.html)

### 工具 & 依赖

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

#### 旧的参考

两个插件（工具）都有代码格式化的功能。eslint还会规范风格。

prettier 并不会根据 ESLint 的配置去格式化代码，会产生冲突。

[vscode 中 prettier 和 ESLint 冲突的一点探讨 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/142105418)

[Integrating Prettier, ESLint & VSCode | Enlear Academy](https://enlear.academy/integrating-prettier-and-eslint-with-vs-code-1d2f6fb53bc9)

---

需要注意的是，Prettier 和 eslint 都需要在包中安装 CLI 命令行版本，然后在VSCode 中安装插件（也安装了另外的 CLI）用来交互。实际上是安装了两次，写代码的时候是用 VSCode 的插件版本加载项目中的配置文件来使用。

[【建议收藏】全网最全的讲清eslint和prettier的npm包和vscode插件的文章 - 掘金 (juejin.cn)](https://juejin.cn/post/6990929456382607374)

最后在 VSCode 设置 `Format On Paste` 、`Format On Save` 自动格式化。

---

> 默认 .eslintrc.js 会被当做 ES Module，但其实是 CommonJS

需要在 `package.json` 中修改为 `"type": "commonjs",` 。

这样 `.js` 会被当成 CommonJS，`.mjs` 才是 ES modules。

### 配置资源路径的别名

[javascript - Vite: resolve.alias - how to resolve paths? - Stack Overflow](https://stackoverflow.com/questions/68217795/vite-resolve-alias-how-to-resolve-paths)

层数深的时候很管用

```powershell
npm install @rollup/plugin-alias --save-dev
```

然后修改 vite 项目的配置 `vite.config.js`

```js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import alias from "@rollup/plugin-alias";
import { resolve } from "path";

const projectRootDir = resolve(__dirname);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [alias(), vue()],
  resolve: {
    alias: {
      "@": resolve(projectRootDir, "src"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 8086,
    open: false,
    cors: true,
  },
  build: {
    outDir: "dist",
  },
});
```

## 基础文档笔记

### 介绍

[简介 | Vue.js (vuejs.org)](https://cn.vuejs.org/guide/introduction.html#what-is-vue)

Vue是一套用于构建用户界面的**渐进式框架**。

自底向上逐层应用。

**声明式渲染**，允许采用简洁的模板语法来声明式地将数据渲染进 DOM ，并且是**响应式的**。

**💥特性**

- 文本插值
- 绑定元素的 attribute `v-if` `v-bind` `v-model` 等
- 事件监听器可以调用方法
- 双向绑定
- 组件化

🟠API 风格：

- 选项式 / 组合式
- HTML / 单文件组件（.vue）

具体可以看这个例子 [Examples | Vue.js (vuejs.org)](https://cn.vuejs.org/examples/#hello-world)

### 安装

[快速上手 | Vue.js (vuejs.org)](https://cn.vuejs.org/guide/quick-start.html)

### 创建实例

🟠选项式API，并且不采用构建流程，只是引入了 `vue.js`

两种方法：

1. `createApp()` 使用引用的 `.vue`
2. `createApp()` 直接显示声明（代码特别少的情况）

`Vue.createApp()` 会返回一个组件实例 `app` ，`app.mount('#app')` 会返回根组件实例

```html
<div id="app">
  <button @click="count++">{{ count }}</button>
</div>
```

```js
import { createApp } from 'vue'

const app = createApp({
  data() {
    return {
      count: 0
    }
  }
})
// 此处可以使用链式写法注册全局组件

app.mount('#app')
```

`template` 选项默认是 `innerHTML`

---

**特性**

1. 组件实例的所有 property，无论如何定义，都可以在组件的模板 template 中访问。

data，methods，props，computed，inject 和 setup

2. 使用生命周期钩子执行特定方法

create，mounted，updated 和 unmounted

### 模板语法

[模板语法 | Vue.js (vuejs.org)](https://cn.vuejs.org/guide/essentials/template-syntax.html#directives)

- 文本插值 `{{}}`

  双大括号会将数据解释为普通文本，而非 HTML 代码。
  `v-once` 指定只会执行一次插值，数据改变插值内容不会更新。

- 原始 HTML
  使用 `v-html` 指令插入 HTML 代码
  🟠**绝不要**将用户提供的内容作为插值，XSS攻击。

- Attribute 绑定
  属性不能使用 `{{}}` 绑定，需要使用 `v-bind:xx` 指令，简写为 `:xx`

```html
<span>Message: {{ msg }}</span>
<div v-bind:id="dynamicId"></div>
<div :class="dynamicClass"></div>
```

绑定可以使用 js 表达式，可以用来拼接 `id` 或 `class` 属性。

---

指令是带有 `v-` 前缀的特殊 attribute。Vue 提供了许多[内置指令](https://cn.vuejs.org/api/built-in-directives.html)，包括上面我们所介绍的 `v-bind` 和 `v-html`。

💥**缩写**

**v-bind 缩写**

```html
<!-- 完整语法 -->
<a v-bind:href="url"> ... </a>

<!-- 缩写 -->
<a :href="url"> ... </a>

<!-- 动态参数的缩写 -->
<a :[key]="url"> ... </a>
```

**v-on 缩写**

```html
<!-- 完整语法 -->
<a v-on:click="doSomething"> ... </a>

<!-- 缩写 -->
<a @click="doSomething"> ... </a>

<!-- 动态参数的缩写 -->
<a @[event]="doSomething"> ... </a>
```

### 响应式基础

[响应式基础 | Vue.js (vuejs.org)](https://cn.vuejs.org/guide/essentials/reactivity-fundamentals.html)

**【选项式】**

选用选项式 API 时，会用 `data` 选项来声明组件的响应式状态。对象的所有顶层属性都会被代理到组件实例 (即方法和生命周期钩子中的 `this`) 上。

🟠不应该在定义 `methods` 时使用箭头函数，因为箭头函数没有自己的 `this` 上下文。

```js
export default {
  data() {
    return {
      count: 0
    }
  },
  methods: {
    increment() {
      this.count++
    },
    decrement: () => {
      // 反例：无法访问此处的 `this`!
    }
  },
  mounted() {
    // 在其他方法或是生命周期中也可以调用方法
    this.increment()
  }
}
```

💥对象的任何顶级 property 也会直接通过组件实例暴露出来

```js
const app = Vue.createApp({
  data() {
    return { count: 4 }
  }
})

const vm = app.mount('#app')

console.log(vm.$data.count) // => 4
console.log(vm.count)       // => 4

// 修改 vm.count 的值也会更新 $data.count
vm.count = 5
console.log(vm.$data.count) // => 5

// 反之亦然
vm.$data.count = 6
console.log(vm.count) // => 6
```

### 计算属性

[计算属性 | Vue.js (vuejs.org)](https://cn.vuejs.org/guide/essentials/computed.html)

计算属性会进行缓存，只会在相关响应式依赖发生改变时重新求值。

每当触发重新渲染时，调用方法将**始终**会再次执行函数。

### 类与样式绑定

[Class 与 Style 绑定 | Vue.js (vuejs.org)](https://cn.vuejs.org/guide/essentials/class-and-style.html#binding-html-classes)

可以动态切换样式：

- 绑定对象，控制是否生效

```html
<div :class="{ active: isActive }"></div>
<!-- isActive:true -->
```

- 绑定数组，渲染多个 class，也能嵌套对象

```html
<div :class="[activeClass, errorClass]"></div>
```

组件上的 class 会合并到 `<template>` 中的根元素。

### 条件渲染

`v-if` 指令，真实的渲染，条件区块内的事件监听器和子组件都会被销毁与重建。

`v-show` 指令，组件始终会被渲染，只是切换 CSS `display` 属性。

`v-cloak` 隐藏所有元素直到完成渲染。避免显示未渲染的 {{value}}。

**切换多个元素**

渲染的结果并不会包含 `<template>` 元素。

```vue
<template v-if="ok">
    <h1>Title</h1>
    <p>Paragraph 1</p>
    <p>Paragraph 2</p>
</template>
```

### 列表渲染

[列表渲染 | Vue.js (vuejs.org)](https://cn.vuejs.org/guide/essentials/list.html#v-for-with-an-object)

```html
<span v-for="n in 10">{{ n }}</span>
```

```html
<ul>
  <template v-for="item in items">
    <li>{{ item.msg }}</li>
    <li class="divider" role="presentation"></li>
  </template>
</ul>
```

### 事件处理

[事件处理 | Vue.js (vuejs.org)](https://cn.vuejs.org/guide/essentials/event-handling.html)

`v-on:click="methodName"` *可以简写为* `@click="methodName"`

- 事件修饰符
- 按键修饰符
- 鼠标按键修饰符

🟢在内联事件处理器中穿传入事件参数

### 表单输入绑定

`v-model`

```html
<p>Message is: {{ message }}</p>
<input v-model="message" placeholder="edit me" />

<textarea v-model="text"></textarea>
```

### 组件基础（选项式）

[组件基础 | Vue.js (vuejs.org)](https://cn.vuejs.org/guide/essentials/component-basics.html)

通过prop向子组件传递数据，props 不可变

使用 `v-bind` 来动态传递 prop

**监听子组件事件**

父级组件可以像处理原生 DOM 事件一样通过 `v-on` 或 `@` 监听子组件实例的任意事件

```html
<blog-post ... @enlarge-text="postFontSize += 0.1"></blog-post>
```

同时子组件可以通过调用内建的 $emit 方法并传入事件名称来触发一个事件

```html
<button @click="$emit('enlargeText')">
  Enlarge text
</button>
```

**动态组件**

```html
<!-- 组件会在 `currentTabComponent` 改变时改变 -->
<component :is="currentTabComponent"></component>
```

通过点击事件更改当前的tab变量，通过currentTabComponent返回拼接的字符串。

**区分大小写**

HTML attribute 名不区分大小写，因此浏览器将所有大写字符解释为小写。这意味着当你在 DOM 模板中使用时，驼峰 prop 名称和 event 处理器参数需要使用它们的 kebab-cased (横线字符分隔) 等效值。

```js
//  在 JavaScript 中是驼峰式

app.component('blog-post', {
  props: ['postTitle'],
  template: `
    <h3>{{ postTitle }}</h3>
  `
})
```

```html
<!-- 在 HTML 中则是横线字符分割 -->

<blog-post post-title="hello!"></blog-post>
```

#### HTML写法（不推荐）

```js
// Create a Vue application
const app = Vue.createApp({})

// Define a new global component called button-counter
app.component('button-counter', {
  data() {
    return {
      count: 0
    }
  },
  template: `
    <button v-on:click="count++">
      You clicked me {{ count }} times.
    </button>`
})

app.mount('#components-demo')
```

```html
<div id="components-demo">
  <button-counter></button-counter>
</div>
```

🟢通过 `component` 方法全局注册的组件可以在应用中的任何组件的模板中使用。

## 操作数组

🟠`HTML写法`

**变更方法**

- `push()`
- `pop()`
- `shift()`
- `unshift()`
- `splice()`
- `sort()`
- `reverse()`

注意要使用app挂载后返回的示例vm。

在前面items数组的例子中，使用：

```js
vm.items.push({message:"sfsfsfsf jojo!!!!!!!!!!wryyyyyy"})
```

**替换数组**

`filter()`、`concat()` 和 `slice()`不会变更原始数组，而**总是返回一个新数组**。

当使用非变更方法时，可以用新数组替换旧数组：

```js
vm.items = vm.items.filter(item => item.message.match(/wryyy/))
```

**显示过滤/排序后的结果**

🟢显示一个数组经过过滤或排序后的版本，而不实际变更或重置原始数据。在这种情况下，可以创建一个**计算属性**，来返回过滤或排序后的数组。

在计算属性不适用的情况下 (例如，在嵌套的 `v-for` 循环中) 你可以使用一个方法。

```html
<ul v-for="numbers in sets">
  <li v-for="n in even(numbers)" :key="n">{{ n }}</li>
</ul>
```

---

`v-for` 也可以接受整数。在这种情况下，它会把模板重复对应次数。

```html
<div id="range" class="demo">
  <span v-for="n in 10">{{ n }} </span>
</div>
```

在 \<template> 中使用 v-for

---

🟠`v-for` 与 `v-if` 一同使用

```html
<template v-for="todo in todos" :key="todo.name">
  <li v-if="!todo.isComplete">
    {{ todo.name }}
  </li>
</template>
```

---

**在组件上使用v-for**

**组件有自己独立的作用域，要使用props来传递迭代数据。**

```html
<my-component
  v-for="(item, index) in items"
  :item="item"
  :index="index"
  :key="item.id"
></my-component>
```

---

### 使用解构

```js
function addTag(newTag) {
    this.postTagList = [newTag, ...this.postTagList];
}
function deleteTag(slug) {
      this.postTagList = this.postTagList.filter((item) => item.slug != slug);
}
```

## 动态组件 & 插槽

[组件基础 | Vue.js (vuejs.org)](https://cn.vuejs.org/guide/essentials/component-basics.html#dynamic-components)

[插槽 Slots | Vue.js (vuejs.org)](https://cn.vuejs.org/guide/components/slots.html#slots)

[Vue3中使用component :is 加载组件_会说法语的猪的博客-CSDN博客_components vue3](https://blog.csdn.net/m0_51431448/article/details/122875963)

## Vite + Vue3 项目构建参考

- [Vite创建的Vue3+TS项目的必备依赖与环境设置 - lqqgis - 博客园 (cnblogs.com)](https://www.cnblogs.com/lqqgis/p/15906489.html)
- [Vue3 Composition API如何替换Vue Mixins - 掘金 (juejin.cn)](https://juejin.cn/post/6844904136065056781)
- [Installation: Tailwind CLI - Tailwind CSS](https://tailwindcss.com/docs/installation)
- [vue中涉及的字符串模板与dom模板 - 简书 (jianshu.com)](https://www.jianshu.com/p/8c63c93a346b)
  （字符串模板）写在 `.vue` 文件中的 `<template>` 或者在 `<script>` 块中全局注册的时候组件名都是驼峰写法 `MyComponent`；（dom 模板）写在 `html` 中要写成小写，驼峰式的大写转换为 `my-component`
