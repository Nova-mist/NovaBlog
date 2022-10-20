# 🍍Pinia

## 状态管理的概念

- [Pinia 官网](https://pinia.vuejs.org/)

> 特别是使用路由的时候，切换页面后组件就会 unmount 导致数据丢失，但如果数据都统一保存在一个 store 中，每个组件都通过 store 来使用数据，就解决了数据共享和持久化的问题。
>
> 通过 store 中的 Getter 读取数据，Action 修改数据。

全局状态管理的本质是**组件之间的数据持久化**。

以单页面应用中的 Counter 举例（点击按钮就会加1）：

- 在初始模板中，切换页面后 counter 就会归零。
- 使用全局状态管理，页面的切换不会影响 counter。**但刷新页面还是会归零**

A Vue component instance holds its own reactive state just like *a simple counter component*.

🟢Parts of a self- contained unit:

- The **state**, the source of truth that drives our app;
- The **view**, a declarative mapping of the **state**;
- The **actions**, the possible ways the state could change in reaction to user inputs from the **view**.

🟡Solutions for **multiple components that share a common state** :

- extract the shared state out of the components
- manage components in a global singleton

全局状态管理的核心思路：数据和方法都存放于 `CountStore.js` ，其他组件通过引入来访问。

---

**Simple State Management with Reactivity API**

> 在简单的项目中自己实现状态管理
>
> 其他组件或直接 `store.js` 中的变量，或调用方法间接的增减变量，不可以在组件中修改变量。
>
> 如果使用 Pinia 会自动双向绑定

Use `reactive()` to create a reactive object, and then import it from multiple components.

```js
// store.js
import { reactive } from 'vue'

export const store = reactive({
  count: 0,
  increment() {
    this.count++
  }
})
```

```vue
<!-- ComponentA.vue -->
<script>
import { store } from './store.js'

export default {
  data() {
    return {
      store
    }
  }
}
</script>

<template>
  <button @click="store.increment()">
    From A: {{ store.count }}
  </button>
</template>
```

```vue
<!-- ComponentB.vue -->
<script>
import { store } from './store.js'

export default {
  data() {
    return {
      store
    }
  }
}
</script>

<template>
  <button @click="store.increment()">
    From B: {{ store.count }}
  </button>
</template>
```

🟠**Use state management library**

> - Vuex3 for Vue2.x
> - Vuex4 for Vue3.x
> - **Pinia (Vuex5) for Vue2.x & Vue3.x**

Check the doc [Introduction | Pinia (vuejs.org)](https://pinia.vuejs.org/introduction.html)

## 🍍Pinia

### Install

🟠Notes only for Vue3 + Vite.

**Install:**

```powershell
npm install pinia
```

**Usage:**

Create a pinia instance and pass it to the app as a plugin.

```js
// main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.mount('#app')
```

> A Store hosts global state.
>
> Store has three concepts, the `state` , `getters` and `actions` and these concepts are the quivalent of `data` , `computed`, and `methods` in components.

**There is no need for local state to be stored in the Pinia Store.**

| Store   | Component |          |
| ------- | --------- | -------- |
| state   | data      | 数据     |
| getters | computed  | 计算属性 |
| actions | methods   | 方法     |

### Define a Store

🟠有两种写法

- 【推荐】Setup Stores 对应着 vue 的组合 API
  使用 `ref()` / `computed()` /  `function()` 然后在末尾 return

- Option Stores 对应着 vue 的选项 API

[Defining a Store | Pinia (vuejs.org)](https://pinia.vuejs.org/core-concepts/#setup-stores)

官方文档主要是选项式写法，并且在组件中使用的时候主要还是 使用 `setup()` ，但我推荐写成 `<script setup>` 中的组合式写法。

**下面的基本都是选项式的笔记。**

Global Store:

- ProductStore.js
- UserStore.js
- ...

```js
// couter.js
import { defineStore } from 'pinia'

// useStore could be anything like useUser, useCart
// the first argument is a unique id of the store across your application
export const useStore = defineStore('main', {
    state: () => {
        return {
           // all these properties will have their type inferred automatically
         counter: 0,
         name: 'kikukaji',
         isAdmin: true, 
        }   
    },
})
```

### Using the store

**使用整个 store 实例**

```js
// app.vue
import { useStore } from '@/stores/counter'

export default {
    setup() {
        const store = useStore()
        
        return {
            // you can return the whole store instance to use it in the template
        store,
        }
    },
}
```

**通过解构使用部分属性和方法**

- use `storeToRefs()` to extract properties from the store while keeping its reactivity.
- Actions can be destructured directly from the store as they are bound to the store.
- 静态属性直接通过实例访问，`store.xx`

```js
// app.vue
import { storeToRefs } from 'pinia'

export default defineComponent({
    setup() {
        const store = useStore()
        // `name` and `counter` are reactive refs
        // This will also create refs for properties added by plugins
        // but skip any action or non reactive (non ref/reactive) property
        const { name, counter } = storeToRefs(store)
        // the increment action can be just extracted
        const { increment } = store

        return {
          name,
          doubleCount,
          increment,
        }
    },
})
```

### State

> In Pinia the state is defined as a function that returns the initial state. This allows Pinia to work in both Server and Client Side.

**Accessing the state**

```js
// app.vue
const store = useStore()
store.counter++
```

**Resetting the state**

```js
// app.vue
const store = useStore()
store.$reset()
```

---

🟡 可以看到在使用存储实例的时候，主体结构是 Composition API 的形式，关键看那个 `setup()`，区别于传统的 `data()` 、`computed` 、 `methods` 的结构。

```js
// app.vue
import { useStore } from '@/stores/counter'

export default {
    setup() {
        const store = useStore()
        return {
        store,
        }
    },
}
```

此时可以使用 `mapState()` 、`mapWritableState()` 等方法来将状态属性（state）映射为计算属性（computed）。

具体可以查看文档 [State | Pinia (vuejs.org)](https://pinia.vuejs.org/core-concepts/state.html#usage-with-the-options-api)

**修改整个状态**

Apply multiple changes at the same time.

```js
store.$patch({
  counter: store.counter + 1,
  age: 120,
  name: 'DIO',
})
```

Handle with complex behavior of array.

```js
cartStore.$patch((state) => {
  state.items.push({ name: 'shoes', quantity: 1 })
  state.hasChanged = true
})
```

### Getter

**声明 Getter**

```js
import {defineStore} from 'pinia'

export const useCartStore = defineStore('CartStore', {
    state: () => {
        return {
            items: [],
        }
    },
    getters: {
        count() {
            return this.items.length
        },
        // arrow function
        // count: (state) => state.items.length 
        
        // can use getter in getter
        isEmpty() {
            return this.count === 0
        }
        // arrow function
        // isEmpty: (state) => state.count === 0
    }
})
```

🟢**Encourage to use arrow function.**

```js
export const useStore = defineStore('main', {
    state: () => ({
        counter: 0,
    }),
    getters: {
        doubleCount: (state) => state.counter * 2,
    },
})
```

**通过实例直接使用 Setter**

```vue
<template>
  <p>Double count is {{ store.doubleCount }}</p>
</template>

<script>
    export default {
        setup() {
            const store = useStore()
            
            return { store }
        },
    }
</script>
```

🟢**Use `this` to access other getters.**

**向 Getter 传递参数**

> 🟠*Getters* are just *computed* properties behind the scenes, so it's not possible to pass any parameters to them. However, you can return a function from the *getter* to accept any arguments
>
> 不能直接向 Getter 方法直接传递参数，但可以传递一个方法。

[Getters | Pinia (vuejs.org)](https://pinia.vuejs.org/core-concepts/getters.html#passing-arguments-to-getters)

```js
export const useStore = defineStore('main', {
    getters: {
        getUserById: (state) => {
            return (userId) => state.users.find( (user) => user.id === userId )
        },
    },
})
```

**访问其他 Store 的 Getter**

```js
import { useOtherStore } from './other-store'

export const useStore = defineStore('main', {
    state: () => ({
        localData: 2
    }),
    getters: {
        otherGetter(state) {
            const otherStore = useOtherStore()
            return state.localData + otherStore.data
        },
    },
})
```

🟢**Encourage to `setup()` instead of Composition API such as map helper `mapState()`.**

```js
// counterStore.js

import { defineStore } from 'pinia',

const useCounterStore = defineStore('counterStore', {
  state: () => ({
    counter: 0
  }),
  getters: {
    doubleCounter(state) {
      return state.counter * 2
    }
  }
})
```

```js
// app.vue
import { useCounterStore } from '@/stores/counterStore'

export default {
    setup() {
        const counterStore = useCounterStore()
        
        return { counterStore }
    },
    computed: {
        quadrupleCounter() {
            return this.counterStore.doubleCounter * 2
        },
    },
}
```

### Action

```js
export const useStore = defineStore('main', {
  state: () => ({
    counter: 0,
  }),
  actions: {
    increment() {
      this.counter++
    },
    randomizeCounter() {
      this.counter = Math.round(100 * Math.random())
    },
  },
})
```

**Action 使用起来就相当于 Method**

🟠但区别于方法，没有 `function` 关键字。

可以传递参数的，如果报错 `xxx is not a function` 就检查 store 是否引用对了。

```js
export default defineComponent({
  setup() {
    const main = useMainStore()
    // call the action as a method of the store
    main.randomizeCounter()

    return {}
  },
})
```

💥 **`actions` can be asynchronous**, you can `await` inside of actions any API call or even other actions!

- async
- await

异步是非常重要的，特别是请求后端的接口的时候。

如果组件在 `onMounted` 块中使用 store 的 action 来请求数据，并且在 `computed` 块中使用 Getter 来获取数据，那么就一定要使用**异步**，否则数据不会更新。

```js
actions: {
    async getTag(id) {
        this.pid = id;

        try {
            const data = await axios.post("http://localhost:8080/getPostTag", {
                id: id,
            });
            // console.log(data.data);
            this.postTagList = data.data;
        } catch (error) {
            alert(error);
            console.log(error);
        }
    },
```

**Usage with the Options API**

如果不使用 Composition API 比如 `setup()` , 就要使用 `mapActions()` 来将 Action 属性映射为组件的方法。
