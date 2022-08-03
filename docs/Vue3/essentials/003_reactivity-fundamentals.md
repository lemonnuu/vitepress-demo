---
outline: deep
---

# 响应式基础 {#reactivity-fundamentals}

## 声明响应式状态 {#declaring-reactive-state}

<div class="composition-api">

<span style="background: rgba(122, 205, 166, 0.5)">我们可以使用 `reactive()` 函数创建一个响应式对象或数组：</span>

```js
import { reactive } from "vue";

const state = reactive({ count: 0 });
```

响应式对象其实是 [JavaScript Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)，其行为表现与一般对象相似。不同之处在于 Vue 能够跟踪对响应式对象 property 的访问与更改操作。

要在组件模板中使用响应式状态，请在 `setup()` 函数中定义并返回。

```js{5,9-11}
import { reactive } from 'vue'

export default {
  // `setup` 是一个专门用于组合式 API 的特殊钩子
  setup() {
    const state = reactive({ count: 0 })

    // 暴露 state 到模板
    return {
      state
    }
  }
}
```

```vue-html
<div>{{ state.count }}</div>
```

相似地，我们也可以在这个作用域下定义可更改响应式 state 的函数，并作为一个方法与 state 一起暴露出去：

```js{7-9,14}
import { reactive } from 'vue'

export default {
  setup() {
    const state = reactive({ count: 0 })

    function increment() {
      state.count++
    }

    // 不要忘记同时暴露 increment 函数
    return {
      state,
      increment
    }
  }
}
```

暴露的方法通常会被用作事件监听器：

```vue-html
<button @click="increment">
  {{ state.count }}
</button>
```

### `<script setup>`

在 `setup()` 函数中手动暴露状态和方法可能非常繁琐。幸运的是，你可以通过使用构建工具来简化该操作。当使用单文件组件（SFC）时，我们可以使用 `<script setup>` 来简化大量样板代码。

```vue
<script setup>
import { reactive } from "vue";

const state = reactive({ count: 0 });

function increment() {
  state.count++;
}
</script>

<template>
  <button @click="increment">
    {{ state.count }}
  </button>
</template>
```

[尝试一下](https://stackblitz.com/edit/002-hello-vite?file=src%2Fcomponents%2FHelloWorld.vue)

<span style="background: rgba(242, 191, 69, 0.5)">`<script setup>` 中的顶层的导入和变量声明可在同一组件的模板中自动使用。</span>

> 基本上都会在组合式 API 示例中使用单文件组件 + `<script setup>` 的语法，因为大多数 Vue 开发者都会这样使用。

</div>

### DOM 更新时机 {#dom-update-timing}

<span style="background: rgba(254, 43, 80, 0.5)">当更改响应式状态后，DOM 也会自动更新。然而，你得注意 DOM 的更新并不是同步的。</span>
相反，Vue 将缓冲它们直到更新周期的 “下个时机” 以确保无论你进行了多少次声明更改，每个组件都只需要更新一次。

<span style="background: rgba(122, 205, 166, 0.5)">若要等待一个状态改变后的 DOM 更新完成，你可以使用 nextTick() 这个全局 API：</span>

<div class="composition-api">

```js
import { nextTick } from "vue";

function increment() {
  state.count++;
  nextTick(() => {
    // 访问更新后的 DOM
  });
}
```

</div>

<div class="composition-api">

```js
import { reactive } from "vue";

const obj = reactive({
  nested: { count: 0 },
  arr: ["foo", "bar"],
});

function mutateDeeply() {
  // 以下都会按照期望工作
  obj.nested.count++;
  obj.arr.push("baz");
}
```

</div>

你也可以直接创建一个浅层响应式对象。它们仅在顶层具有响应性，一般仅在某些特殊场景中需要。

<div class="composition-api">

### 响应式代理 vs. 原始对象 {#reactive-proxy-vs-original-1}

值得注意的是，`reactive()` 返回的是一个原始对象的 [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)，它和原始对象是不相等的：

```js
const raw = {};
const proxy = reactive(raw);

// 代理和原始对象不是全等的
console.log(proxy === raw); // false
```

只有代理是响应式的，更改原始对象不会触发更新。因此，<span style="background: rgba(254, 43, 80, 0.5)">使用 Vue 的响应式系统的最佳实践是 **仅使用你声明对象的代理版本**。且尽量用 `const` 声明变量。</span>

<span style="background: rgba(242, 191, 69, 0.5)">为保证访问代理的一致性，对同一个对象调用 `reactive()` 会总是返回同样的代理，而对一个已存在代理调用 `reactive()` 也是返回同样的代理</span>：

```js
// 在同一个对象上调用 reactive() 会返回相同的代理
console.log(reactive(raw) === proxy); // true

// 在一个代理上调用 reactive() 会返回它自己
console.log(reactive(proxy) === proxy); // true
```

<span style="background: rgba(242, 191, 69, 0.5)">这个规则对嵌套对象也适用。依靠深层响应性，响应式对象内的嵌套对象依然是代理</span>：

```js
const proxy = reactive({});

const raw = {};
proxy.nested = raw;

console.log(proxy.nested === raw); // false
```

### `reactive()` 的局限性 {#limitations-of-reactive}

`reactive()` API 有两条限制：

1. <span style="background: rgba(242, 191, 69, 0.5)">仅对对象类型有效（对象、数组和 `Map`、`Set` 这样的[集合类型](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects#%E4%BD%BF%E7%94%A8%E9%94%AE%E7%9A%84%E9%9B%86%E5%90%88%E5%AF%B9%E8%B1%A1)），而对 `string`、`number` 和 `boolean` 这样的 [原始类型](https://developer.mozilla.org/zh-CN/docs/Glossary/Primitive) 无效。</span>

2. 因为 Vue 的响应式系统是通过 property 访问进行追踪的，因此我们必须始终保持对该响应式对象的相同引用。这意味着我们<span style="background: rgba(242, 191, 69, 0.5)">不可以随意地“替换”一个响应式对象</span>，因为这将导致对初始引用的响应性连接丢失：

   ```js
   let state = reactive({ count: 0 });

   // 上面的引用 ({ count: 0 }) 将不再被追踪（响应性连接已丢失！）
   state = reactive({ count: 1 });
   ```

同时这也<span style="background: rgba(254, 43, 80, 0.5)">意味着当我们将响应式对象的 property 赋值或解构至本地变量时，或是将该 property 传入一个函数时，我们会失去响应性</span>：

:::tip
只有当响应式对象的 property 为原始类型时, 将其赋值或解构至本地变量时，或是将该 property 传入一个函数时，才失去响应性。
:::

```js
const state = reactive({ count: 0 });

// n 是一个局部变量，同 state.count
// 失去响应性连接
let n = state.count;
// 不影响原始的 state
n++;

// count 也和 state.count 失去了响应性连接
let { count } = state;
// 不会影响原始的 state
count++;

// 该函数接收一个普通数字，并且
// 将无法跟踪 state.count 的变化
callSomeFunction(state.count);
```

## `ref()` 定义响应式变量 {#reactive-variables-with-ref}

为了解决 `reactive()` 带来的限制，Vue 也提供了一个 `ref()` 方法来允许我们创建可以使用任何值类型的响应式 **ref**：

```js
import { ref } from "vue";

const count = ref(0);
```

`ref()` 从参数中获取到值，将其包装为一个带 `.value` property 的 ref 对象：

```js
const count = ref(0);

console.log(count); // { value: 0 }
console.log(count.value); // 0

count.value++;
console.log(count.value); // 1
```

和响应式对象的 property 类似，ref 的 `.value` property 也是响应式的。同时，当值为对象类型时，会用 `reactive()` 自动转换它的 `.value`。

一个包含对象类型值的 ref 可以响应式地替换整个对象：

```js
const objectRef = ref({ count: 0 });

// 这是响应式的替换
objectRef.value = { count: 1 };
```

ref 被传递给函数或是从一般对象上被解构时，不会丢失响应性：

```js
const obj = {
  foo: ref(1),
  bar: ref(2),
};

// 该函数接收一个 ref
// 需要通过 .value 取值
// 但它会保持响应性
callSomeFunction(obj.foo);

// 仍然是响应式的
const { foo, bar } = obj;
```

一言以蔽之，`ref()` 使我们能创造一种任意值的 “引用” 并能够不丢失响应性地随意传递。这个功能非常重要，因为它经常用于将逻辑提取到组合函数中。

### ref 在模板中的解包 {#ref-unwrapping-in-templates}

<span style="background: rgba(254, 43, 80, 0.5)">当 ref 在模板中作为顶层 property 被访问时，它们会被自动“解包”，所以不需要使用 `.value`</span>。下面是之前的计数器例子，用 `ref()` 代替：

```vue{13}
<script setup>
import { ref } from 'vue'

const count = ref(0)

function increment() {
  count.value++
}
</script>

<template>
  <button @click="increment">
    {{ count }} <!-- 无需 .value -->
  </button>
</template>
```

请注意，仅当 ref 是模板渲染上下文的顶层 property 时才适用自动“解包”。 例如， foo 是顶层 property，但 object.foo 不是。

所以我们给出以下 object：

```js
const object = { foo: ref(1) };
```

下面的表达式将**不会**像预期的那样工作：

```vue-html
{{ object.foo + 1 }}
```

渲染的结果会是一个 `[object Object]`，因为 `object.foo` 是一个 ref 对象。我们可以通过让 `foo` 成为顶级 property 来解决这个问题：

```js
const { foo } = object;
```

```vue-html
{{ foo + 1 }}
```

现在渲染结果将是 `2`。

需要注意的是，如果一个 ref 是文本插值（即一个 <code v-pre>{{ }}</code> 符号）计算的最终值，它也将被解包。因此下面的渲染结果将为 `1`：

```vue-html
{{ object.foo }}
```

这只是文本插值的一个方便功能，相当于 <code v-pre>{{ object.foo.value }}</code>。

### ref 在响应式对象中的解包 {#ref-unwrapping-in-reactive-objects}

<span style="background: rgba(254, 43, 80, 0.5)">当一个 `ref` 作为一个响应式对象的 property 被访问或更改时，它会自动解包</span>，因此会表现得和一般的 property 一样：

```js
const count = ref(0);
const state = reactive({
  count,
});

console.log(state.count); // 0

state.count = 1;
console.log(count.value); // 1
```

如果将一个新的 ref 赋值给一个关联了已有 ref 的 property，那么它会替换掉旧的 ref：

```js
const otherCount = ref(2);

state.count = otherCount;
console.log(state.count); // 2
// 原始 ref 现在已经和 state.count 失去联系
console.log(count.value); // 1
```

只有当嵌套在一个深层响应式对象内时，才会发生 ref 解包。当其作为浅层响应式对象的 property 被访问时不会解包。

#### 数组和集合类型的 ref 解包 {#ref-unwrapping-in-arrays-and-collections}

不像响应式对象，当 ref 作为响应式数组或像 `Map` 这种原生集合类型的元素被访问时，不会进行解包。

```js
const books = reactive([ref("Vue 3 Guide")]);
// 这里需要 .value
console.log(books[0].value);

const map = reactive(new Map([["count", ref(0)]]));
// 这里需要 .value
console.log(map.get("count").value);
```

</div>

:::danger ref 解包(有且仅有)

- √ 作为模板的顶层 property 被访问
- √ 作为响应式对象的 property 被访问

:::

<div class="composition-api">

## 响应性语法糖 {#reactivity-transform}

不得不对 ref 使用 `.value` 是一个受限于 JavaScript 语言限制的缺点。然而，通过编译时转换，我们可以在适当的位置自动添加 `.value` 来提升开发体验。Vue 提供了一种编译时转换，使得可以像这样书写之前的“计数器”示例：

```vue
<script setup>
let count = $ref(0);

function increment() {
  // 无需 .value
  count++;
}
</script>

<template>
  <button @click="increment">{{ count }}</button>
</template>
```

请注意响应性语法糖仍处于实验性阶段，在最终提案落地前仍可能发生改动。

</div>

<style>
  .composition-api {
    display: block;
  }
  .options-api {
    display: none;
  }
</style>
