# Vue.js Course for Beginners

https://youtu.be/FXpIoQ_rT_c

只是看视频的笔记，没有参考价值。



## Style

v-show 只是修改了 css 的可见性。 

v-cloak 隐藏所有元素直到完成渲染。避免显示未渲染的 {{value}}。



## Events and Methods

@click="isVisible = !isVisible"

@keyup.enter = "greet"

@keyup.enter = "greet(props)"



## Component Props 

组件嵌套，向内层传递数据。

```js
app.component('login-form', {
  template:`
  	<form>
  		<custom-input v-bind:label="emailLabel"/>
  		<custom-input label="just string"/>
  	</form>
  `,
  components: ['custom-input'],
  data() {
    return {
   		emailLabel: 'password'   
    }
  }
})
app.component('custom-input', {
  template:`
  	<label>
  	{{label}}
  	</label>
  `,
  props: ['label']
})
```

🟢v-model 默认添加了一个props值modelValue，再通过**计算属性**的setter、getter来向外同步数据。

**传入的props是不可变的。**

```js
props: ['label', 'modelValue'],
computed: {
  inputValue: {
    get() {
      return this.modelValue
    },
    set(value) {
      this.$emit('update:modelValue', value)
    }
  }
}
```



## loop

🟠建议尽可能在使用 v-for 时提供 key attribute，除非遍历输出的 DOM 内容非常简单，或者是刻意依赖默认行为以获取性能上的提升。

```html
<p v-for="str in inputs" :key="str">
  {{str}}
</p>
```



## Lifecycle Hooks

created

mounted

updated

**Usages:**

- Check if user is authorized
- API Calls
- Creating or removing events
- Getting or cleaning up data



## demo app

**绑定数值**

```html
<input type="number" v-model.number="inventory.carrot" />
```

**将侧边栏转化为组件**

通过showSidebar控制可见性

```html
<sidebar v-if="showSidebar" />
```

**计算总价**

```js
app.component('sidebar', {
  props: ['toggle', 'cart'],
  computed: {
    cartTotal() {
      return (this.cart.carrots * 4.82).toFixed(2)
    }
  }
})
```

**循环列表**

```js
async mounted() {
  const res = await fetch('./food.json')
  const data = await res.json()
}
```

```html
<div v-for="product in inventory.slice(0,3)" :key="product.id" class="card">
</div>
```

**侧边栏的工具方法**

```js
app.component('sidebar', {
  props: ['toggle', 'cart', 'inventory'],
  computed: {
    
  },
  methods: {
    getPrice(name) {
      const product = this.inventory.find((p) => {
        return p.name == name
      })
      return product.price.USD
    },
    calculateTotal() {
      const total = Object.entries(this.cart).reduce((acc, curr, index) => {
        return acc + (curr[1] * this.getPrice(curr[0]))
      }, 0)
      return total.toFixed(2)
    }
  }
})
```

```js
// app
computed: {
  totalQuantity() {
    Object.values(this.cart).reduce((acc, curr) => {
      return acc + curr
    }, 0)
  }
}
```



## Reuseable Components

导出app.js

数据持久化 local storage



## Vue CLI

Single Page Application

\<router-link>

 router

`.vue` 组件



## 项目转换

由 HTML 页面转为**单文件组件** SFC

- \<a href="./products.html"> => \<router-link to="/products">
- 创建vue组件并在 index.js 中注册

> Vue files are parsed by the Vue and webpack.
>
> HTML template, js, css all in the same file, that gets parsed and all put together and bundled by the tools that Vue CLI sets up for us.

- 直接在组件中使用样式会影响内嵌的组件，使用 \<style scoped> 标签就不会传递影响。

  全局引用外部样式文件：

  - 在 main.js 中导入 css
  - 额外安装 sass-loader 包来导入 sass

- 将对应的静态html页面转换成 `.vue` 页面 (放入template标签)

- app.component() 转换为 App.vue 组件

  ```vue
  <router-view  :inventory="inventory" />
  <script>
    import Sidebar from '@/components/Sidebar.vue'
    import food from '../food.json'
    export default {
      components: {
        Sidebar
      },
      data() {
        
      }
    }
  </script>
  ```

- 向 router-view 传入要使用的方法，使用 v-bind，可简写为 `:`

- Vue X 默认的状态管理库