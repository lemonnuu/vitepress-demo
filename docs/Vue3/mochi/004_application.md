---
outline: deep
---

# 应用

![0006_Vue应用](https://cdn.jsdelivr.net/gh/lemonnuu/PicGoPictureBed/markdown/free/0006_Vue应用.png)

## 应用实例

**createApp()** 用于创建一个应用实例, **一个页面可用包含多个应用实例**。

- 第一个参数是根组件
- 第二个参数可选, 它是要传递给根组件的 prop

```js
import { createApp } from "vue";

const app = createApp(
  {
    /* root component options */
  },
  {
    /* prop passed to root */
  }
);
```

## 插件

插件可以是一个带有 `install` 方法的对象, 亦或是一个直接被用作 `install` 方法的函数。通常用于为 Vue 添加全局功能代码。

**install()** 会接收两个参数：

- 第一个参数是当前应用实例 app, 通过它可执行一系列操作
- 第二个参数 options 则为 `app.use()` 传入的第二个参数

**app.use()**

- 插件作为第一个参数, 插件选项作为可选的第二个参数
- 返回值为当前应用实例

```js
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

createApp(App).use(store).use(router).mount("#app");
```

插件选项(`app.use()`的第二个参数)会传递给插件的 `install` 方法, 若 `app.use()` 对同一个插件多次调用, 该插件只会安装一次。

### 插件的使用场景

1. 通过 `app.component()` 和 `app.directive()` 注册一到多个全局组件或自定义指令
2. 通过 `app.provide()` 使一个资源注入到整个应用
3. 向 `app.config.globalProperties` 中添加一些全局实例属性或方法
4. 一个可能上述三种都包含了的功能库(例如 vue-router)

## 版本

`app.version` 提供当前应用所使用的 Vue 版本号。通常用于插件, 因为可能需要在不同版本的 Vue 上有不同的逻辑。

## 全局变量

`app.config.globalProperties` 用于注册能够被应用内所有组件实例访问到的全局变量, 相当于 Vue2 中的 `Vue.prototype.`。

## 自定义指令

**自定义指令主要是为了重用涉及普通元素的底层 DOM 访问逻辑。**

一个自定义指令被定义为一个包含类似于组件生命周期钩子的对象, 钩子接收指令绑定到的元素。

### 指令钩子

一个指令的定义对象可以提供几种钩子函数(都是可选的)：

```js
const myDirective = {
  // 在绑定元素的 attribute 前
  // 或事件监听器应用前调用
  created(el, binding, vnode, prevVnode) {
    // 下面会介绍各个参数的细节
  },
  // 在元素被插入到 DOM 前调用
  beforeMount(el, binding, vnode, prevVnode) {},
  // 在绑定元素的父组件
  // 及他自己的所有子节点都挂载完成后调用
  mounted(el, binding, vnode, prevVnode) {},
  // 绑定元素的父组件更新前调用
  beforeUpdate(el, binding, vnode, prevVnode) {},
  // 在绑定元素的父组件
  // 及他自己的所有子节点都更新后调用
  updated(el, binding, vnode, prevVnode) {},
  // 绑定元素的父组件卸载前调用
  beforeUnmount(el, binding, vnode, prevVnode) {},
  // 绑定元素的父组件卸载后调用
  unmounted(el, binding, vnode, prevVnode) {},
};
```

#### 钩子参数

指令的钩子会传递以下几种参数：

- `el` : 指令绑定到的元素, 这可直接用于操作 DOM。
- `binding` : 一个对象, 包含有关指令的 property
  - `value` : 传递给指令的值。例如在 `v-my-directive="1+1"` 中, 值是 `2`
  - `oldValue` : 之前的值, 仅在 `beforeUpdate` 和 `updated` 中可用。无论值是否更改, 它都可用
  - `arg` : 传递给指令的参数(如果有的话)。例如在 `v-my-directive:foo` 中, 参数是 `"foo"`
  - `modifiers` : 一个包含修饰符的对象(如果有的话)。例如在 `v-my-directive.foo.bar` 中, 修饰符对象是 `{foo: true, bar: true}`
  - `instance` : 使用该指令的组件实例
  - `dir` : 指令的定义对象
- `vnode` : 代表绑定元素的底层 VNode
- `prevNode` : 之前的渲染中代表指令所绑定元素的 VNode。仅在 `beforeUpdate` 和 `updated` 钩子中可用。

:::warning Note
除了 `el` 外, 应该将这些参数都视为只读的, 并一律不更改它们。如果需要在不同钩子间共享信息, 推荐使用元素的 [dataset](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset) attribute 实现。
:::

### 简化形式

对于自定义指令来说, 通常需要在 `mounted` 和 `updated` 上实现相同的行为、且并不关心其他钩子。此时可以将指令定义成函数：

```html
<div v-color="color"></div>
```

```js
app.directive("color", (el, binding) => {
  // 这会在 `mounted` 和 `updated` 时都调用
  el.style.color = binding.value;
});
```

### 对象字面量

如果自定义指令需要多个值, 也可以向它传递一个 JavaScript 对象字面量。**指令也可以接收任何合法的 JavaScript 表达式**

```html
<div v-demo="{ color: 'white', text: 'hello!' }"></div>
```

```js
app.directive("demo", (el, binding) => {
  console.log(binding.value.color); // => "white"
  console.log(binding.value.text); // => "hello!"
});
```

:::tip 组件上使用自定义指令
如果是在组件上使用自定义指令, 始终应用于组件根节点, 和透传 attributes 类似。当应用到一个多根组件时, 指令会被忽略且抛出一个警告。
和 attribute 不同, 指令不能通过 `v-bind="$attrs"` 来传递给一个不同的元素。
:::

:::danger Note
不推荐在组件上使用自定义指令 ❗
:::

### 全局注册自定义指令

**app.directive()** 用于全局注册自定义指令：

- 第一个参数为自定义指令的名字, 使用时需要在其前加 `v-`, 如果有且只有第一个参数, 返回值为已注册的自定义指令
- 第二个参数为可选的自定义指令对象或函数, 包含此参数则返回值为当前应用实例

```js
import { createApp } from "vue";

const app = createApp({});

// 注册（对象形式的指令）
app.directive("my-directive", {
  /* 自定义指令钩子 */
});

// 注册（函数形式的指令）
app.directive("my-directive", () => {
  /* ... */
});

// 得到一个已注册的指令
const myDirective = app.directive("my-directive");
```

## 全局组件

**app.component()** 用于全局注册组件。

- 第一个参数为注册组件名称, 如果有且只有第一个参数, 返回值为已注册的全局组件
- 第二个参数为可选的组件选项, 包含此参数则返回值为当前应用实例

```js
import { createApp } from "vue";

const app = createApp({});

// 注册一个选项对象
app.component("my-component", {
  /* ... */
});

// 得到一个已注册的组件
const MyComponent = app.component("my-component");
```

## 应用供给

**app.provide()** 用于提供一个值, 可在应用中的所有后代组件注入使用。

- 注入的 key 作为第一个参数, 并将供给的值作为第二个参数, 返回值为当前应用实例

```js
import { createApp } from "vue";

const app = createApp(/* ... */);

app.provide("message", "hello");
```

在应用的组件中：

```js
import { inject } from "vue";

export default {
  setup() {
    console.log(inject("message")); // 'hello'
  },
};
```

## 应用挂载

**app.mount()** 用于将应用实例挂载至一个容器元素中。

- 参数可以是一个实际的 DOM 元素或一个 CSS 选择器(使用第一个匹配到的元素), 返回根组件实例

**如果该根组件定义了模板或渲染函数, 它将替换容器的 `innerHTML`。否则, 将使用容器元素的 `innerHTML` 用作模板。**

:::warning Note
对于每个应用实例, `mount()` 仅能调用一次, 哪怕卸载都不能重新挂载 ❗
:::

```js
import { createApp } from "vue";
const app = createApp(/* ... */);

app.mount("#app");
```

也可以挂载到一个实际的 DOM 元素：

```js
app.mount(document.body.firstChild);
```

## 应用卸载

**app.unmount()** 用于卸载一个已经挂好的应用实例, 会触发应用组件树上所有组件的卸载生命周期钩子。

[尝试一下](https://stackblitz.com/edit/003-application?file=src%2FApp.vue)
