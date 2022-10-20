# Vue Router

`vue3`

[官方文档](https://router.vuejs.org/zh/)

开发单页面应用，要使用 `vue-router` 库，路由工具。

> vue 单页面项目中
>
> 1. 导入全局依赖
> 2. 编写路由规则
> 3. 使用 `<router-link>` 和 `<router-view>`
> 4. 匹配动态路由

 

## 使用

```powershell
npm install vue-router@4
```

**HTML部分**

🟢参照下面这篇文章效果更好，路由组件放在 `App.vue` 中。

[How to Use Vue Router: A Complete Tutorial - Vue School Blog](https://vueschool.io/articles/vuejs-tutorials/how-to-use-vue-router-a-complete-tutorial/)

```html
<script src="https://unpkg.com/vue@3"></script>
<script src="https://unpkg.com/vue-router@4"></script>

<div id="app">
  <h1>Hello App!</h1>
  <p>
    <!--使用 router-link 组件进行导航 -->
    <!--通过传递 `to` 来指定链接 -->
    <!--`<router-link>` 将呈现一个带有正确 `href` 属性的 `<a>` 标签-->
    <router-link to="/">Go to Home</router-link>
    <router-link to="/about">Go to About</router-link>
  </p>
  <!-- 路由出口 -->
  <!-- 路由匹配到的组件将渲染在这里 -->
  <router-view></router-view>
</div>
```

`router-link` 使得 Vue Router 可以在不重新加载页面的情况下更改 URL。**需要指定 to 属性**

`router-view` 将显示与 URL 对应的组件。**可以使用 v-bind 向页面传递数据和方法。**

**JavaScript部分**

```js
// 1. 定义路由组件 也可以导入
const Home = {
    template: `<div>Home</div>`
}
const About = {
    template: `<div>About</div>`
}
// 2. 定义路由 每个路径映射到一个组件 可选名称
const routes = [
    {path: '/', name: 'Home', component: Home},
    {path: '/about', name: 'about', component: About},
]
// 3. 创建路由实例 并进行配置
const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes, // routes: routes
})
// 4. 创建并挂载根实例
const app = Vue.createApp({})
app.use(router)
app.mount('#app')
```

🟠单项目应用中需要分离router的 `index.js` 和 `main.js`

```js
// router/index.js
import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../components/HelloWorld.vue'
import Test from '../components/Test.vue'

const routes = [
    {path: '/', name: 'Home', component: Home},
    {path: '/test', name: 'Test', component: Test}
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
    // 始终滚动到顶部
    return { top: 0 };
  },
})

export default router
```

```js
// main.js
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index'

createApp(App).use(router).mount('#app')
```

---

**高级特性**

```js
const adminRoutes = [
    
]
const routes = [
    // 可以嵌套路由
    ...adminRoutes,
    {
        path: "/admin",
        name: "Admin", // 可以在编程式路由 router.push() 使用
        redirect: "/admin/dashboard", // 重定向
        children: [
            {
                // 不需要前缀
                path: "dashboard",
                component: () => import("@/layout/component/dashboard.vue"),
                name: "Dashboard",
                meta: {
                    title: "Dashborad",
                    icon: "dashboard"
                },
                // 自定义的属性 可以在渲染 el-menu 的时候控制是否显示此 item
            	hidden: "false", 
            }
        ]
    }
]
```







## 带参数的动态路由匹配

根据不同的参数来渲染同一个的组件。

```js
const User = {
  template: '<div>User</div>',
}

// 这些都会传递给 `createRouter`
const routes = [
  // 动态字段以冒号开始
  { path: '/users/:id', component: User },
]
```

当一个路由被匹配时，它的 *params* 的值将在每个组件中以 `this.$route.params` 的形式暴露出来。

🟢显示用户的ID

```js
const User = {
  template: '<div>User {{ $route.params.id }}</div>',
}
```

**可以有多个路径参数**

`/users/:username/posts/:postId` 就很适合渲染用户的动态

如果两个页面有着相同的组件，仅仅是用户参数不同，页面之间的跳转过程中，**相同的组件实例会被重复使用**，不会先销毁再创建，因此**生命周期钩子不会被调用**。

使用 watch 对组件中的参数变化做出响应。

**可以通过路径参数的正则表达式捕获404路由**



## 路由的匹配语法

- 静态路由 `/about`
- 动态路由 `/user/:userId`

**自定义正则**

```js
const routes = [
  // /:orderId -> 仅匹配数字
  { path: '/:orderId(\\d+)' },
  // /:productName -> 匹配其他任何内容
  { path: '/:productName' },
]
```

**可重复的参数**

```js
const routes = [
  // /:chapters ->  匹配 /one, /one/two, /one/two/three, 等
  { path: '/:chapters+' },
  // /:chapters -> 匹配 /, /one, /one/two, /one/two/three, 等
  { path: '/:chapters*' },
]
// 组合使用 /:chapters(\\d+)* --> /, /1, /1/2
```

**默认情况下，所有路由是不区分大小写的，并且能匹配带有或不带有尾部斜线的路由。**

```js
const router = createRouter({
  history: createWebHistory(),
  routes: [
    // 将匹配 /users/posva 而非：
    // - /users/posva/ 当 strict: true
    // - /Users/posva 当 sensitive: true
    { path: '/users/:id', sensitive: true },
    // 将匹配 /users, /Users, 以及 /users/42 而非 /users/ 或 /users/42/
    { path: '/users/:id?' },
  ]
  strict: true, // applies to all routes
})
```



## 嵌套路由

可以在组件内部嵌套一个 `<router-view>` ，只需要在路由中配置 `children` 。



## 编程式导航

通过 `$router` 访问路由实例，调用 `this.$router.push` 方法会跳转到新的页面并向 history 栈添加一个新的记录，点击浏览器后退会回到之前的之前的URL。

| 声明式                    | 编程式             |
| ------------------------- | ------------------ |
| `<router-link :to="...">` | `router.push(...)` |

```js
const username = 'eduardo'
// 我们可以手动建立 url，但我们必须自己处理编码
router.push(`/user/${username}`) // -> /user/eduardo
// 同样
router.push({ path: `/user/${username}` }) // -> /user/eduardo
// 如果可能的话，使用 `name` 和 `params` 从自动 URL 编码中获益
router.push({ name: 'user', params: { username } }) // -> /user/eduardo
// `params` 不能与 `path` 一起使用
router.push({ path: '/user', params: { username } }) // -> /user
```

**替换当前位置不会向history添加新记录**

```js
router.push({ path: '/home', replace: true })
// 相当于
router.replace({ path: '/home' })
```



## 命名路由

`name` 可以和 `params` 搭配使用，能够自动编码。

```js
// index.js
const routes = [
  {
    path: '/user/:username',
    name: 'user',
    component: User,
  },
]
```

链接到一个命名的路由：

```html
// app.vue
<router-link :to="{ name: 'user', params: { username: 'erina' }}">
  User
</router-link>
```

```js
router.push({ name: 'user', params: { username: 'erina' } })
```

🟠`path` 不能和 `params` 搭配使用。

如果需要拼接地址，有下面两种写法。

```vue
<template>
    <router-link
                 :to="{
                      path: '/post/' + post.id,
                      // params: {
                      //   id: post.id,
                      // },
                      }"
                 >

    <router-link :to="'/tag/' + tag.slug" class="tag-title">
        {{ tag.title }}
    </router-link>
</template>
```

默认传参都是 `$route.params.id` ，也可以显示写出来。



## 命名视图

对于有多个同级视图的布局，可以有多个 `<router-view>` ，没有设置名字的默认为 `default` 。

```html
<router-view class="view left-sidebar" name="LeftSidebar"></router-view>
<router-view class="view main-content"></router-view>
<router-view class="view right-sidebar" name="RightSidebar"></router-view>
```

```js
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      components: {
        default: Home,
        // LeftSidebar: LeftSidebar 的缩写
        LeftSidebar,
        // 它们与 `<router-view>` 上的 `name` 属性匹配
        RightSidebar,
      },
    },
  ],
})
```



## 重定向和别名

🟠重定向也是通过 `routes` 配置来完成

从 `/home` 重定向到 `/` ：

```js
const routes = [{ path: '/home', redirect: '/'}]
```

重定向到一个命名的路由：

```js
const routes = [{ path: '/home', redirect: { name: 'homepage'}}]
```

**使用方法的动态重定向：**

```js
const routes = [
  {
    // /search/screens -> /search?q=screens
    path: '/search/:searchText',
    redirect: to => {
      // 方法接收目标路由作为参数
      // return 重定向的字符串路径/路径对象
      return { path: '/search', query: { q: to.params.searchText } }
    },
  },
  {
    path: '/search',
    // ...
  },
]
```

**可以重定向到相对位置**



**🟠使用别名**

重定向是指当用户访问 `/home` 时，URL 会被 `/` 替换，然后匹配成 `/`。

**将 `/` 别名为 `/home`，意味着当用户访问 `/home` 时，URL 仍然是 `/home`，但会被匹配为用户正在访问 `/`。**

```js
const routes = [{ path: '/', component: Homepage, alias: '/home' }]
```

- 可以在嵌套路径中使用
- 可以使用数组
- 如果路由有参数，别名中也要写参数



## 路由组件传参

组件如果要用动态路由的参数，比如页面的 `id`，有下面几种方法：

- `$route.params.id`
- 直接作为 `props` 同名参数

当 `props` 设置为 `true` 时，`route.params` 将被设置为组件的 props。

```js
const User = {
  template: '<div>User {{ $route.params.id }}</div>'
}
const routes = [{ path: '/user/:id', component: User }]
```

替换成props的形式：

```js
const User = {
  // 请确保添加一个与路由参数完全相同的 prop 名
  props: ['id'],
  template: '<div>User {{ id }}</div>'
}
const routes = [{ path: '/user/:id', component: User, props: true }]
```

---

`<script setup>` 中使用：

```js
import { useRoute } from "vue-router";

const route = useRoute();
let pid = ref(route.params.id);
```





