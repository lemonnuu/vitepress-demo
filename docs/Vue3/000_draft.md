---
layout: doc
title: 草稿
editLink: true
head:
  - - meta
    - name: description
      content: hello
  - - meta
    - name: keywords
      content: super duper SEO
lastUpdated: true
aside: true
---

# 草稿

## API 风格

Vue 的组件可以按两种不同的风格书写：<span style="background: rgba(255,255,0,0.6);">选项式 API 和组合式 API。</span>

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

通过组合式 API，我们可以使用导入的 API 函数来描述组件逻辑。在单文件组件中，组合式 API 通常会与 [`<script setup>`](/api/sfc-script-setup) 搭配使用。这个 `setup` attribute 是一个标识，告诉 Vue 需要在编译时进行转换，来减少使用组合式 API 时的样板代码。例如，`<script setup>` 中的导入和顶层变量/函数都能够在模板中直接使用。

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

[尝试一下](https://stackblitz.com/edit/vitejs-vite-2zw3tn?file=src%2FApp.vue)

### 该选哪一个？{#which-one-to-choose}

两种 API 风格都能够覆盖大部分的应用场景。它们只是同一个底层系统所提供的两套不同的接口。实际上，选项式 API 是在组合式 API 的基础上实现的！关于 Vue 的基础概念和知识在它们之间都是通用的。

选项式 API 以“组件实例”的概念为中心 (即上述例子中的 `this`)，对于有面向对象语言背景的用户来说，这通常与基于类的心智模型更为一致。同时，它将响应性相关的细节抽象出来，并强制按照选项来组织代码，从而对初学者而言更为友好。

组合式 API 的核心思想是直接在函数作用域内定义响应式状态变量，并将从多个函数中得到的状态组合起来处理复杂问题。这种形式更加自由，也需要你对 Vue 的响应式系统有更深的理解才能高效使用。相应的，它的灵活性也使得组织和重用逻辑的模式变得更加强大。

- 出于学习目的使用时，推荐采用更易于自己理解的风格。再强调一下，大部分的核心概念在这两种风格之间都是通用的。熟悉了一种风格以后，你也能轻松掌握另一种风格。

- 出于生产目的使用时

  - 当不需要使用构建工具，或者打算主要在低复杂度的场景中使用 Vue，例如渐进增强策略的应用场景，推荐采用选项式 API。

  - <span style="background: rgba(255,255,0,0.6);">当打算用 Vue 构建完整的应用，推荐采用组合式 API + 单文件组件。</span>

## 应用实例 {#the-app-instance}

每个 Vue 应用都是通过 [`createApp`](/api/application#createapp) 函数创建一个新的 **应用实例**：

```js
import { createApp } from "vue";

const app = createApp({
  /* 根组件选项 */
});
```

## 根组件 {#the-root-component}

我们传入 `createApp` 的对象实际上是一个组件配置对象，每个应用都需要一个“根组件”，其他组件将作为其子组件。

如果你使用的是单文件组件，我们可以直接从另一个文件中导入根组件。

```js
import { createApp } from "vue";
// 从一个单文件组件中导入根组件
import App from "./App.vue";

const app = createApp(App);
```

## 挂载应用 {#mounting-the-app}

应用实例必须在调用了 `.mount()` 方法后才会渲染出来。该方法接收一个“容器”参数，可以是一个实际的 DOM 元素或是一个 CSS 选择器字符串：

```html
<div id="app"></div>
```

```js
app.mount("#app");
```

应用根组件的内容将会被渲染在容器元素里面。容器元素自己将不会被视为应用的一部分。

`.mount()` 方法应该始终在整个应用配置和资源注册完成后被调用。同时请注意，不同于其他资源注册方法，它的返回值是根组件实例而非应用实例。
<span style="background: rgba(255,255,0,0.6);">同时请注意，不同于其他资源注册方法，它的返回值是根组件实例而非应用实例。</span>

<span style="background: rgba(255,255,0,0.6);">当根组件没有设置 `template` 选项时，Vue 将自动使用容器的 `innerHTML` 作为模板。</span>

## 多个应用实例 {#multiple-app-instances}

你不必再受限于一个页面只能拥有一个应用实例。`createApp` API 允许多个 Vue 应用共存于同一个页面上，而且每个应用都拥有自己的用于配置和全局资源的作用域。

```js
const app1 = createApp({
  /* ... */
});
app1.mount("#container-1");

const app2 = createApp({
  /* ... */
});
app2.mount("#container-2");
```

如果你正在使用 Vue 来增强服务端渲染 HTML，并且只想要 Vue 去控制一个大型页面中特殊的一小部分，应避免将一个单独的 Vue 应用实例挂载到整个页面上，而是应该创建多个小的应用实例，将它们分别挂载到所需的元素上去。

## 模板语法 {#template-syntax}

如果你对虚拟 DOM 的概念比较熟悉，并且偏向于 JavaScript 的原始力量，你也可以结合可选的 JSX 支持[直接手写渲染函数](/guide/extras/render-function.html)而不采用模板。但请注意，这将不会享受到和模板同等级别的编译时优化。

## Attribute 绑定 {#attribute-bindings}

### 布尔型 Attribute {#boolean-attributes}

[布尔型 attribute](https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#boolean-attributes) 依据 true / false 值来决定 attribute 是否应该存在于该元素上。[`disabled`](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/disabled) 就是最常见的例子之一。

`v-bind` 在这种场景下的行为略有不同：

```vue-html
<button :disabled="isButtonDisabled">Button</button>
```

当 `isButtonDisabled` 为[真值](https://developer.mozilla.org/en-US/docs/Glossary/Truthy)或一个空字符串 (即 `<button disabled="">`) 时，元素会包含这个 `disabled` attribute。而当其为其他[假值](https://developer.mozilla.org/en-US/docs/Glossary/Falsy)时 attribute 将被忽略。

### 动态绑定多个值 {#dynamically-binding-multiple-attributes}

如果你有像这样的一个包含多个 attribute 的 JavaScript 对象：

<div class="composition-api">

```js
const objectOfAttrs = {
  id: "container",
  class: "wrapper",
};
```

</div>
<div class="options-api">

```js
data() {
  return {
    objectOfAttrs: {
      id: 'container',
      class: 'wrapper'
    }
  }
}
```

</div>

通过不带参数的 `v-bind`，你可以将它们绑定到单个元素上：

```vue-html
<div v-bind="objectOfAttrs"></div>
```

### 调用函数 {#calling-functions}

可以在绑定的表达式中使用一个组件暴露的方法：

```vue-html
<span :title="toTitleDate(date)">
  {{ formatDate(date) }}
</span>
```

:::tip
绑定在表达式中的方法在组件每次更新时都会被重新调用，因此**不**应该产生任何副作用，比如改变数据或触发异步操作。
:::

### 受限的全局访问 {#restricted-globals-access}

模板中的表达式将被沙盒化，仅能够访问到[有限的全局对象列表](https://github.com/vuejs/core/blob/main/packages/shared/src/globalsWhitelist.ts#L3)。该列表中会暴露常用的内置全局对象，比如 `Math` 和 `Date`。

没有显式包含在列表中的全局对象将不能在模板内表达式中访问，例如用户附加在 `window` 上的 property。然而，你也可以自行在 [`app.config.globalProperties`](/api/application.html#app-config-globalproperties) 上显式地添加他们，供所有的 Vue 表达式使用。
