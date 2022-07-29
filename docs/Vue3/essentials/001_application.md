---
outline: deep
---

# 创建一个 Vue 应用 {#creating-a-vue-application}

## 应用实例 {#the-app-instance}

<span style="background: rgba(65, 102, 101, 0.5)">每个 Vue 应用都是通过 `createApp` 函数创建一个新的 **应用实例**：</span>

```js
import { createApp } from "vue";

const app = createApp({
  /* 根组件选项 */
});
```

## 根组件 {#the-root-component}

<span style="background: rgba(65, 102, 101, 0.5)">我们传入 `createApp` 的对象实际上是一个组件，每个应用都需要一个“根组件”，其他组件将作为其子组件。</span>

如果你使用的是单文件组件，我们可以直接从另一个文件中导入根组件。

```js
import { createApp } from "vue";
// 从一个单文件组件中导入根组件
import App from "./App.vue";

const app = createApp(App);
```

虽然本指南中的许多示例只需要一个组件，但大多数真实的应用都是由一棵嵌套的、可重用的组件树组成的。例如，待办事项应用程序的组件树可能是这样的：

```
App (root component)
├─ TodoList
│  └─ TodoItem
│     ├─ TodoDeleteButton
│     └─ TodoEditButton
└─ TodoFooter
   ├─ TodoClearButton
   └─ TodoStatistics
```

一个组件内到底发生了什么 ❓

## 挂载应用 {#mounting-the-app}

<span style="background: rgba(65, 102, 101, 0.5)">应用实例必须在调用了 `.mount()` 方法后才会渲染出来。该方法接收一个“容器”参数，可以是一个实际的 DOM 元素或是一个 CSS 选择器字符串：</span>

```html
<div id="app"></div>
```

```js
app.mount("#app");
```

<span style="background: rgba(65, 102, 101, 0.5)">应用根组件的内容将会被渲染在容器元素里面。容器元素自己将不会被视为应用的一部分。</span>

`.mount()` 方法应该始终在整个应用配置和资源注册完成后被调用。同时请注意，不同于其他资源注册方法，它的返回值是根组件实例而非应用实例。

### DOM 中的根组件模板 {#in-dom-root-component-template}

当在未采用构建流程的情况下使用 Vue 时，我们可以在挂载容器中直接书写根组件模板：

```html
<div id="app">
  <button @click="count++">{{ count }}</button>
</div>
```

```js
import { createApp } from "vue";

const app = createApp({
  data() {
    return {
      count: 0,
    };
  },
});

app.mount("#app");
```

<span style="background: rgba(65, 102, 101, 0.5)">当根组件没有设置 `template` 或 `render` 选项时，Vue 将自动使用容器的 `innerHTML` 作为模板。</span>

## 应用配置 {#app-configurations}

应用实例会暴露一个 `.config` 对象允许我们配置一些应用级的选项，例如定义一个应用级的错误处理器，它将捕获所有由子组件上抛而未被处理的错误：

```js
app.config.errorHandler = (err) => {
  /* 处理错误 */
};
```

应用实例还提供了一些方法来注册应用范围内可用的资源，例如注册一个组件：

```js
app.component("TodoDeleteButton", TodoDeleteButton);
```

这使得 `TodoDeleteButton` 在应用的任何地方都是可用的。

必须确保在挂载应用实例之前完成所有应用配置 ❗❗❗

## 多个应用实例 {#multiple-app-instances}

<span style="background: rgba(122, 205, 166, 0.5)">不必再受限于一个页面只能拥有一个应用实例</span>。`createApp` API 允许多个 Vue 应用共存于同一个页面上，而且每个应用都拥有自己的用于配置和全局资源的作用域。

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