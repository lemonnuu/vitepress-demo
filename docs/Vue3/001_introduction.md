---
outline: deep
---

# 简介

## 什么是 Vue？ {#what-is-vue}

Vue (发音为 /vjuː/，类似 **view**) 是一款用于构建用户界面的 JavaScript 框架。它基于标准 HTML、CSS 和 JavaScript 构建，并提供了一套声明式的、组件化的编程模型，帮助你高效地开发用户界面，无论任务是简单还是复杂。

下面是一个最基本的示例：

```js
import { createApp } from "vue";

createApp({
  data() {
    return {
      count: 0,
    };
  },
}).mount("#app");
```

```vue-html
<div id="app">
  <button @click="count++">
    Count is: {{ count }}
  </button>
</div>
```

**结果展示**

<script setup>
import { ref } from 'vue'
const count = ref(0)
</script>

<div class="demo">
  <button @click="count++">
    Count is: {{ count }}
  </button>
</div>

<style>
.demo {
  padding: 22px 24px;
  border-radius: 8px;
  box-shadow: 0 3px 12px rgba(0, 0, 0, .07), 0 1px 4px rgba(0, 0, 0, .07);
  margin-bottom: 1.2em;
  transition: background-color 0.5s ease;
}

.dark .demo {
  background-color: #242424;
}

.dark .demo button{
  background-color: #2f2f2f;
}

.demo p {
  margin: 0;
}

.demo button {
  background-color: #f1f1f1;
  transition: background-color 0.5s;
  padding: 5px 12px;
  border: 1px solid rgba(84, 84, 84, .65);
  border-radius: 8px;
  font-size: 0.9em;
  font-weight: 600;
}

.demo button + button {
  margin-left: 1em;
}
</style>

上面的示例展示了两个 Vue 的核心功能：

- <span style="background: rgba(122, 205, 166, 0.5)">**声明式渲染**</span>：Vue 通过自己的模板语法扩展了标准 HTML，使得我们可以声明式地描述基于 JavaScript 状态输出的 HTML。

- <span style="background: rgba(122, 205, 166, 0.5)">**响应性**</span>：Vue 会自动跟踪 JavaScript 状态变化并在改变发生时响应式地更新 DOM。

## 渐进式框架 {#the-progressive-framework}

Vue 是一个框架和生态，功能覆盖了大部分前端开发常见的需求。但 Web 世界又是十分多样化的，我们在 Web 上构建的东西可能在形式和规模上有很大不同。考虑到这一点，Vue 被设计成具有灵活性和可逐步集成的特点。根据你的需求场景，Vue 可以按不同的方式使用：

- 增强静态的 HTML 而无需构建步骤
- 在任何页面中作为 Web Components 嵌入
- 单页应用 (SPA)
- 全栈 / 服务端渲染 (SSR)
- Jamstack / 静态站点生成 (SSG)
- 目标为桌面端、移动端、WebGL，甚至是命令行终端

## 单文件组件 {#single-file-components}

在大多数启用了构建工具的 Vue 项目中，我们可以使用一种类似 HTML 格式的文件来书写 Vue 组件，它被称为**单文件组件** (也被称为 `*.vue` 文件，英文缩写为 **SFC**)。单文件组件是 Vue 的标志性功能。
顾名思义，Vue 的单文件组件会将一个组件的逻辑 (JavaScript)，模板 (HTML) 和样式 (CSS) 封装在同一个文件里。下面我们将用单文件组件的格式重写上面的计数器示例：

```vue
<script>
export default {
  data() {
    return {
      count: 0,
    };
  },
};
</script>

<template>
  <button @click="count++">Count is: {{ count }}</button>
</template>

<style scoped>
button {
  font-weight: bold;
}
</style>
```

## API 风格 {#api-styles}

<span style="background: rgba(122, 205, 166, 0.5)">Vue 的组件可以按两种不同的风格书写：**选项式 API** 和**组合式 API**。</span>

### 选项式 API {#options-api}

使用选项式 API，我们可以用包含多个选项的对象来描述组件的逻辑，例如 `data`、`methods` 和 `mounted`。选项所定义的属性都会暴露在函数内部的 `this` 上，它会指向当前的组件实例。

```vue
<script>
export default {
  // data() 返回的属性将会成为响应式的状态
  // 并且暴露在 `this` 上
  data() {
    return {
      count: 0,
    };
  },

  // methods 是一些用来更改状态与触发更新的函数
  // 它们可以在模板中作为事件监听器绑定
  methods: {
    increment() {
      this.count++;
    },
  },

  // 生命周期钩子会在组件生命周期的各个不同阶段被调用
  // 例如这个函数就会在组件挂载完成后被调用
  mounted() {
    console.log(`The initial count is ${this.count}.`);
  },
};
</script>

<template>
  <button @click="increment">Count is: {{ count }}</button>
</template>
```

### 组合式 API {#composition-api}

通过组合式 API，我们可以使用导入的 API 函数来描述组件逻辑。在单文件组件中，组合式 API 通常会与 `<script setup>`搭配使用。这个 `setup` attribute 是一个标识，告诉 Vue 需要在编译时进行转换，来减少使用组合式 API 时的样板代码。例如，`<script setup>` 中的导入和顶层变量/函数都能够在模板中直接使用。

下面是使用了组合式 API 与 `<script setup>` 改造后和上面的模板完全一样的组件：

```vue
<script setup>
import { ref, onMounted } from "vue";

// 响应式状态
const count = ref(0);

// 用来修改状态、触发更新的函数
function increment() {
  count.value++;
}

// 生命周期钩子
onMounted(() => {
  console.log(`The initial count is ${count.value}.`);
});
</script>

<template>
  <button @click="increment">Count is: {{ count }}</button>
</template>
```

### 该选哪一个 {#which-one-to-choose}

两种 API 风格都能够覆盖大部分的应用场景。它们只是同一个底层系统所提供的两套不同的接口。实际上，选项式 API 是在组合式 API 的基础上实现的！关于 Vue 的基础概念和知识在它们之间都是通用的。

选项式 API 以“组件实例”的概念为中心 (即上述例子中的 `this`)，对于有面向对象语言背景的用户来说，这通常与基于类的心智模型更为一致。同时，它将响应性相关的细节抽象出来，并强制按照选项来组织代码，从而对初学者而言更为友好。

组合式 API 的核心思想是直接在函数作用域内定义响应式状态变量，并将从多个函数中得到的状态组合起来处理复杂问题。这种形式更加自由，但需要对 Vue 的响应式系统有更深的理解才能高效使用。相应的，它的灵活性也使得组织和重用逻辑的模式变得更加强大。

如果你是使用 Vue 的新手，这里是我们的一般性建议：

- 出于学习目的使用时，推荐采用更易于自己理解的风格。再强调一下，大部分的核心概念在这两种风格之间都是通用的。熟悉了一种风格以后，也能轻松掌握另一种风格。

- 出于生产目的使用时

  - 当不需要使用构建工具，或者打算主要在低复杂度的场景中使用 Vue，例如渐进增强策略的应用场景，推荐采用选项式 API。

  - <span style="background: rgba(242, 191, 69, 0.5)">当打算用 Vue 构建完整的应用，推荐采用组合式 API + 单文件组件。</span>
