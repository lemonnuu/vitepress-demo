---
outline: deep
---

# 模板 ref {#template-refs}

虽然 Vue 的声明性渲染模型为你抽象了大部分对 DOM 的直接操作，但在某些情况下，我们仍然需要直接访问底层 DOM 元素。要实现这一点，我们可以使用特殊的 `ref` attribute：

```vue-html
<input ref="input">
```

`ref` 是一个特殊的 attribute，和 `v-for` 章节中提到的 `key` 类似。它允许我们在一个特定的 DOM 元素或子组件实例被挂载后，获得对它的直接引用。这可能很有用，比如说在组件挂载时编程式地聚焦到一个 input 元素上，或在一个元素上初始化一个第三方库。

## 访问模板 ref {#accessing-the-refs}

<div class="composition-api">

<span style="background: rgba(242, 191, 69, 0.5)">为了通过组合式 API 获得该模板 ref，我们需要声明一个同名的 ref：</span>

```vue
<script setup>
import { ref, onMounted } from "vue";

// 声明一个 ref 来存放该元素的引用
// 必须和模板 ref 同名
const input = ref(null);

onMounted(() => {
  input.value.focus();
});
</script>

<template>
  <input ref="input" />
</template>
```

<span style="background: rgba(122, 205, 166, 0.5)">如果不使用 `<script setup>`，需确保从 `setup()` 返回 ref</span>：

```js{6}
export default {
  setup() {
    const input = ref(null)
    // ...
    return {
      input
    }
  }
}
```

</div>

注意，你只可以**在组件挂载后**才能访问 ref。如果你想在模板中的表达式上访问 <span class="composition-api">`input`</span>，在初次渲染时会是 `null`。这是因为在初次渲染前这个元素还压根不存在呢！

<div class="composition-api">

如果你正试图观察一个模板 ref 的变化，确保考虑到 ref 的值为 `null` 的情况：

```js
watchEffect(() => {
  if (input.value) {
    input.value.focus();
  } else {
    // 此时还未挂载，或此元素已经被卸载（例如通过 v-if 控制）
  }
});
```

</div>

## `v-for` 中的 ref {#refs-inside-v-for}

> 需要 v3.2.25 及以上版本

<div class="composition-api">

当 `ref` 在 `v-for` 中使用时，相应的 ref 中包含的值是一个数组，它将在元素被挂载后填充：

```vue
<script setup>
import { ref, onMounted } from "vue";

const list = ref([
  /* ... */
]);

const itemRefs = ref([]);

onMounted(() => console.log(itemRefs.value));
</script>

<template>
  <ul>
    <li v-for="item in list" ref="itemRefs">
      {{ item }}
    </li>
  </ul>
</template>
```

[尝试一下]()

</div>

<span style="background: rgba(242, 191, 69, 0.5)">应该注意的是，ref 数组**不能**保证与源数组相同的顺序。</span>

## 函数型 ref {#function-refs}

除了使用字符串值作名字，`ref` attribute 还可以绑定为一个函数，会在每次组件更新时都被调用。函数接受该元素引用作为第一个参数：

```vue-html
<input :ref="(el) => { /* 将 el 分配给 property 或 ref */ }">
```

如果你正在使用一个动态的 `:ref` 绑定，我们也可以传一个函数。当元素卸载时，这个 `el` 参数会是 `null`。你当然也可以使用一个方法而不是内联函数。

## 组件上的 ref {#ref-on-component}

`ref` 也可以被用在一个子组件上。此时 ref 中引用的是组件实例：

<div class="composition-api">

```vue
<script setup>
import { ref, onMounted } from "vue";
import Child from "./Child.vue";

const child = ref(null);

onMounted(() => {
  // child.value 是 <Child /> 组件的实例
});
</script>

<template>
  <Child ref="child" />
</template>
```

</div>

如果一个子组件使用的是选项式 API <span class="composition-api">或没有使用 `<script setup>`</span>，被引用的组件实例和该子组件的 `this` 完全一致，这意味着父组件对子组件的每一个属性和方法都有完全的访问权。这使得在父组件和子组件之间创建紧密耦合的实现细节变得很容易，当然也因此，应该只在绝对需要时才使用组件引用。大多数情况下，你应该首先使用标准的 props 和 emit 接口来实现父子组件交互。

<div class="composition-api">

有一个例外的情况，<span style="background: rgba(254, 43, 80, 0.5)">使用了 `<script setup>` 的组件是**默认私有**的：一个父组件无法访问到一个使用了 `<script setup>` 的子组件中的任何东西，除非子组件在其中通过 `defineExpose` 宏显式暴露</span>：

```vue
<script setup>
import { ref } from "vue";

const a = 1;
const b = ref(2);

defineExpose({
  a,
  b,
});
</script>
```

当父组件通过模板 ref 获取到了该组件的实例时，得到的实例类型为 `{ a: number, b: number }` (ref 都会自动解包，和一般的实例一样)。

</div>
