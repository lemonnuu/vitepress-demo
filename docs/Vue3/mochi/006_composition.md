---
outline: deep
---

# 响应式 API

## 响应式基础

使用 Vue 的响应式系统的最佳实践是**仅使用你声明对象的代理版本**。且尽量用 `const` 声明变量。

### `reactive()` 特性

- 为保证访问代理的一致性，对同一个对象调用 `reactive()` 会总是返回同样的代理，而对一个已存在代理调用 `reactive()` 也是返回同样的代理：

```js
// 在同一个对象上调用 reactive() 会返回相同的代理
console.log(reactive(raw) === proxy); // true

// 在一个代理上调用 reactive() 会返回它自己
console.log(reactive(proxy) === proxy); // true
```

- 依靠深层响应性，响应式对象内的嵌套对象依然是代理：

```js
const proxy = reactive({});

const raw = {};
proxy.nested = raw;

console.log(proxy.nested === raw); // false
```

### `reactive()` 的局限性

`reactive()` API 有两条限制：

- 仅对对象类型有效（对象、数组和 Map、Set 这样的集合类型），而对 `string`、`number` 和 `boolean` 这样的**原始类型无效**

- 因为 Vue 的响应式系统是通过 property 访问进行追踪的，因此我们必须始终保持对该响应式对象的相同引用。这意味着**不可以随意地“替换”一个响应式对象**，因为这将导致对初始引用的响应性连接丢失

这意味着将响应式对象的原始值类型 property 赋值或解构至本地变量时，或是将该 property 传入一个函数时，我们会失去响应性：

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

### `ref()` 定义响应式变量

为了解决 `reactive()` 带来的限制，Vue 也提供了一个 `ref()` 方法来允许我们创建可以使用**任何值类型**的响应式 ref：

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

和响应式对象的 property 类似，ref 的 `.value` property 也是响应式的。**同时，当值为对象类型时，会用 `reactive()` 自动转换它的 `.value`**。

### ref 解包

:::danger ref 解包(有且仅有)
√ 作为模板的顶层 property 被访问
√ 作为响应式对象的 property 被访问
:::

[尝试一下](https://stackblitz.com/edit/004-basic?file=src%2FApp.vue,src%2Fcomponents%2FHelloWorld.vue,src%2Fcomponents%2FCompositionAPI.vue&terminal=dev)
