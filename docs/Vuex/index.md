---
outline: deep
---

# Vuex

Vuex 是一个专为 Vue.js 应用程序开发的**状态管理模式 + 库**。它采用集中式存储管理应用所有组件的状态, 并以相应的规则保证状态以一种可预测的方式发生变化。

![vuex示例图](https://vuex.vuejs.org/vuex.png)

## 安装

### 直接下载 / CDN 引用

[https://unpkg.com/vuex@4](https://unpkg.com/vuex@4)

[Unpkg.com](https://unpkg.com/) 提供了基于 npm 的 CDN 链接。以上的链接会一直指向 npm 上发布的最新版本。也可以通过 https://unpkg.com/vuex@4.0.0/dist/vuex.global.js 这样的方式指定特定的版本。

在 Vue 之后引入 `vuex` 会进行自动安装：

```html
<script src="/path/to/vue.js"></script>
<script src="/path/to/vuex.js"></script>
```

### npm

```sh
npm install vuex@next --save
```

### yarn

```sh
yarn add vuex@next --save
```

### 自己构建

如果需要使用 dev 分支下的最新版本, 可以直接从 Github 上克隆代码并自己构建。

```sh
git clone https://github.com/vuejs/vuex.git node_modules/vuex
cd node_modules/vuex
yarn
yarn build
```

## Store

**Vuex 的核心就是 store(仓库)**。"store" 是一个容器, 其中存储着应用中的**全局状态(state)**。Vuex 和单纯的全局对象有两点不同：

1. **Vuex 的状态存储是响应式的。**当 Vue 组件从 store 中读取状态时, 若 store 中的状态发生改变, 那么相应的组件也会相应地得到高效更新。
2. **不能直接更改 store 中的状态, 改变 store 中状态的唯一途径就是显式地提交(commit) mutation。**这样可以方便 Vuex 跟踪每一个状态的变化, 从而让 devtools 这样的工具充分发挥作用。

### 创建 store

在安装完 Vuex 后, 需要使用 `createStore` 方法创建一个 store 实例, 再将这个 store 实例作为插件安装。

```js
import { createApp } from "vue";
import { createStore } from "vuex";

// 创建一个新的 store 实例
const store = createStore({
  state() {
    return {
      count: 0,
    };
  },
  mutations: {
    increment(state) {
      state.count++;
    },
  },
});

const app = createApp({
  /* 根组件 */
});

// 将 store 实例作为插件安装
app.use(store);
```

现在, 就可以通过 `store.state` 来获取状态对象, 并通过 `store.commit` 方法触发状态变更。

```js
store.commit("increment");

console.log(store.state.count); // -> 1
```

在 Vue 组件中, 可以通过 `this.$store` 访问 store 实例, 即可以从组件的方法提交一个变更：

```js
methods: {
  increment() {
    this.$store.commit('increment')
    console.log(this.$store.state.count)
  }
}
```

**再次强调, 更改状态必须通过提交 mutation 的方法, 而非直接改变 `store.state.xxx`**, 是因为

<span style="background: rgba(122, 205, 166, 0.5)">浅绿 0</span>
<span style="background: rgba(122, 205, 166, 0.5)"></span>

<span style="background: rgba(242, 191, 69, 0.5)">赤金 1</span>
<span style="background: rgba(242, 191, 69, 0.5)"></span>

<span style="background: rgba(254, 43, 80, 0.5)">火红 2</span>
<span style="background: rgba(254, 43, 80, 0.5)"></span>

<span style="background: rgba(67, 206, 245, 0.5)">蓝</span>

<span style="background: rgba(128, 236, 175, 0.5)">缥</span>

<span style="background: rgba(7, 82, 121, 0.5)">靛蓝</span>

<span style="background: rgba(65, 102, 101, 0.5)">黛</span>

<span style="background: rgba(255, 255, 0, 0.5)">黄色</span>

::: info
This is an info box.
:::

::: tip
This is a tip.
:::

::: warning
This is a warning.
:::

::: danger
This is a dangerous warning.
:::

::: details
This is a details block.
:::

vue3 学习笔记之 Fragment 和 Emits
