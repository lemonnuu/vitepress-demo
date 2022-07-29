---
outline: deep
---

# 条件渲染 {#conditional-rendering}

<script setup>
import { ref } from 'vue'
const awesome = ref(true)
</script>

## `v-if` {#v-if}

`v-if` 指令被用于按条件渲染一个区块。这个区块只会在指令的表达式为真时才被渲染。

```vue-html
<h1 v-if="awesome">Vue is awesome!</h1>
```

## `v-else` {#v-else}

你也可以使用 `v-else` 为 `v-if` 添加一个“else 区块”。

```vue-html
<button @click="awesome = !awesome">Toggle</button>

<h1 v-if="awesome">Vue is awesome!</h1>
<h1 v-else>Oh no 😢</h1>
```

<div class="demo">
  <button @click="awesome = !awesome">Toggle</button>
  <h1 v-if="awesome">Vue is awesome!</h1>
  <h1 v-else>Oh no 😢</h1>
</div>

<div class="composition-api">

[在演练场中尝试一下](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHJlZiB9IGZyb20gJ3Z1ZSdcblxuY29uc3QgYXdlc29tZSA9IHJlZih0cnVlKVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cbiAgPGJ1dHRvbiBAY2xpY2s9XCJhd2Vzb21lID0gIWF3ZXNvbWVcIj50b2dnbGU8L2J1dHRvbj5cblxuXHQ8aDEgdi1pZj1cImF3ZXNvbWVcIj5WdWUgaXMgYXdlc29tZSE8L2gxPlxuXHQ8aDEgdi1lbHNlPk9oIG5vIPCfmKI8L2gxPlxuPC90ZW1wbGF0ZT4iLCJpbXBvcnQtbWFwLmpzb24iOiJ7XG4gIFwiaW1wb3J0c1wiOiB7XG4gICAgXCJ2dWVcIjogXCJodHRwczovL3NmYy52dWVqcy5vcmcvdnVlLnJ1bnRpbWUuZXNtLWJyb3dzZXIuanNcIlxuICB9XG59In0=)

</div>

一个 `v-else` 元素必须跟在一个 `v-if` 或者 `v-else-if` 元素后面，否则将不会识别它。

### `v-else-if` {#v-else-if}

顾名思义，`v-else-if` 提供的是相应于 `v-if` 的“else if 区块”。它可以连续多次重复使用：

```vue-html
<div v-if="type === 'A'">
  A
</div>
<div v-else-if="type === 'B'">
  B
</div>
<div v-else-if="type === 'C'">
  C
</div>
<div v-else>
  Not A/B/C
</div>
```

和 `v-else` 相似，一个使用 `v-else-if` 的元素必须紧跟在一个 `v-if` 或一个 `v-else-if` 元素后面。

## `<template>` 上的 `v-if` {#v-if-on-template}

因为 `v-if` 是一个指令，他必须依附于某个元素。但如果我们想要切换不止一个元素呢？在这种情况下我们可以在一个 `<template>` 元素上使用 `v-if`，这只是一个不可见的包装器元素，最后渲染的结果并不会包含这个 `<template>` 元素。

```vue-html
<template v-if="ok">
  <h1>Title</h1>
  <p>Paragraph 1</p>
  <p>Paragraph 2</p>
</template>
```

`v-else` 和 `v-else-if` 也可以在 `<template>` 上使用。

## `v-show` {#v-show}

另一个可以用来按条件显示一个元素的指令是 `v-show`。其用法基本一样：

```vue-html
<h1 v-show="ok">Hello!</h1>
```

不同之处在于 `v-show` 会在 DOM 渲染中保留该元素；`v-show` 仅切换了该元素上名为 `display` 的 CSS 属性。

`v-show` 不支持在 `<template>` 元素上使用，也没有 `v-else` 来配合。

## `v-if` vs `v-show` {#v-if-vs-v-show}

`v-if` 是“真实的”按条件渲染，因为它确保了条件区块内的事件监听器和子组件都会在切换时被销毁与重建。

`v-if` 也是**懒加载**的：如果在初次渲染时条件值为 false，则不会做任何事。条件区块会直到条件首次变为 true 时才渲染。

相比之下，`v-show` 简单许多，元素无论初始条件如何，始终会被渲染，仅作 CSS class 的切换。

<span style="background: rgba(122, 205, 166, 0.5)">总的来说，`v-if` 在首次渲染时的切换成本比 `v-show` 更高。因此当你需要非常频繁切换时 `v-show` 会更好，而运行时不常改变的时候 `v-if` 会更合适。</span>

## `v-if` 和 `v-for` {#v-if-with-v-for}

::: warning 警告
同时使用 `v-if` 和 `v-for` 是**极其不推荐的**，因为这样二者的优先级不明显。
:::

<span style="background: rgba(254, 43, 80, 0.5)">当 `v-if` 和 `v-for` 同时存在于一个元素上的时候，`v-if` 会首先被执行，`v-if` 的优先级比 `v-for` 高。</span>

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
