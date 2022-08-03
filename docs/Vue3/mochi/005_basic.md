---
outline: deep
---

# 基础知识

![0007_基础知识](https://cdn.jsdelivr.net/gh/lemonnuu/PicGoPictureBed/markdown/free/0007_基础知识.png)

## 模板语法

在底层机制中, Vue 会将模板编译成高度优化的 JavaScript 代码。结合响应式系统, 当应用状态变更时, Vue 能够智能的推导出需要重新渲染的组件最少数量, 并应用最少的 DOM 结构。

### 虚拟 DOM

虚拟 DOM(VDOM) 是一种编程概念, 意为将目标所需的 UI 通过数据结构"虚拟"地表示出来, 保存在内存中, 并与真实的 DOM 保持同步。

与其说虚拟 DOM 是一种具体的技术, 不如说是一种模式, 所以没有一个标准的实现, 例如：

```js
const vnode = {
  type: "div",
  props: {
    id: "hello",
  },
  children: [
    /* 更多 vnode */
  ],
};
```

一个运行时渲染器将会遍历整个虚拟 DOM 树, 并据此构建真实的 DOM 树, 这个过程被称为**挂载**。

如果我们有两份虚拟 DOM 树, 渲染器将会有比较地遍历它们, 找出它们之间地区别, 并应用这其中的变化到真实的 DOM 上。这个过程被称为 **修补(patch)**, 又被称为 "比较差异(diffing)" 或 "协调(reconciliation)"。

虚拟 DOM 带来的主要收益是它赋予了开发者编程式、声明式地创建、审查和组合所需 UI 结构的能力, 而把直接与 DOM 相关的操作交给了渲染器。

### 渲染管线

从更高的层面看, Vue 组件挂载后发生了如下几件事：

1. **编译** : Vue 模板被编译为了**渲染函数** : 即用来返回虚拟 DOM 树的函数。这一步骤可以通过构建步骤提前完成, 也可以通过使用运行时编译器即使完成。

2. **挂载** : 运行时渲染器调用渲染函数, 遍历返回的虚拟 DOM 树, 并基于它创建实际的 DOM 节点。这一步会作为响应式副作用执行, 因此它会追踪其中所用到的所有响应式依赖。

3. **修补** : 当一个依赖发生变化后, 副作用会重新运行, 这时候会创建一个更新后的虚拟 DOM 树。运行时渲染器遍历这颗新树, 将它与旧树进行比较, 然后将必要的更新应用到真实 DOM 上去。

![render-pipeline](./images/render-pipeline.png)

### 模板 VS 渲染函数

Vue 模板会被预编译成虚拟 DOM 渲染函数。Vue 也提供了 API 使我们可以不使用模板编译，直接手写渲染函数。在处理高度动态的逻辑时，渲染函数相比于模板更加灵活，因为可以完全地使用 JavaScript 来构造你想要的 vnode。

但是 Vue 默认推荐使用模板, 有以下几点原因：

1. 模板更贴近实际的 HTML。使得能够更方便地重用一些已有的 HTML 代码片段，能够带来更好的可访问性体验、能更方便地使用 CSS 应用样式，并且更容易使设计师理解和修改。

2. 由于其确定的语法，更容易对模板做静态分析。这使得 Vue 的模板编译器能够应用许多编译时优化来提升虚拟 DOM 的性能表现。

### 布尔型 Attribute

[布尔型 attribute](https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#boolean-attributes) 是依据 true / false 值来决定 attribute 是否应该存在于该元素上。`disabled` 就是常见的例子之一。

`v-bind` 在这种场景下的行为略有不同：

```html
<button :disabled="isButtonDisabled">Button</button>
```

当 `isButtonDisabled` 为[真值](https://developer.mozilla.org/en-US/docs/Glossary/Truthy)或为一个空字符串(即 `<button disabled="">`)时, 元素会包含这个 `disabled` attribute。而当其为其他[假值](https://developer.mozilla.org/en-US/docs/Glossary/Falsy)时 attribute 将被忽略。

### v-bind 合并行为

在 2.x 中, 如果一个元素同时定义了 `v-bind="object"` 和一个独立的 attribute, 那么这个独立的 attribute 总是会覆盖 `object` 中的绑定：

```html
<!-- 模板 -->
<div id="red" v-bind="{ id: 'blue' }"></div>
<!-- 结果 -->
<div id="red"></div>
```

在 3.x 中, 如果一个元素同时定义了 `v-bind="object"` 和一个独立的 attribute, 绑定的声明顺序决定它们如何被合并, 后者覆盖前者：

```html
<!-- 模板 -->
<div id="red" v-bind="{ id: 'blue' }"></div>
<!-- 结果 -->
<div id="blue"></div>

<!-- 模板 -->
<div v-bind="{ id: 'blue' }" id="red"></div>
<!-- 结果 -->
<div id="red"></div>
```

## 模板 ref

虽然 Vue 的声明性渲染模型抽象了大部分对 DOM 的直接操作, 但在某些情况下, 仍然避免不了需要访问底层 DOM 元素。要实现这一点, 可以使用特殊的 `ref` attribute :

```html
<input ref="input" />
```

`ref` 是一个特殊的 attribute, 它允许我们在一个特定的 DOM 元素或子组件实例被挂载后, 获得对它的直接引用。

### 访问模板 ref

使用 Composition API 获得模板 ref, 需要声明一个**同名的 ref** :

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

如果不使用 `<script setup>`, 需确保从 `setup()` 返回 ref :

```js {6}
export default {
  setup() {
    const input = ref(null);
    // ...
    return {
      input,
    };
  },
};
```

需要注意的是, `ref` 只有在组件被挂载后才能访问到, 如果试图观察一个模板 ref 的变化, 一定要确保考虑到 ref 值为 `null` 的情况 :

```js
watchEffect(() => {
  if (input.value) {
    input.value.focus();
  } else {
    // 此时还未挂载，或此元素已经被卸载（例如通过 v-if 控制）
  }
});
```

### `v-for` 中的 ref

> 需要 v3.2.25 及以上版本

当 `ref` 在 `v-for` 中使用时, 相应的 ref 中包含的值是一个数组, 它将在元素被挂载后填充:

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

:::warning Note
ref 数组**不能**保证和源数组相同的顺序。
:::

### 函数型 ref

除了使用字符串值作名字, `ref` attribute 还可以绑定一个函数, 会在每次组件更新时都被调用。函数接受该元素引用作为第一个参数：

```html
<input :ref="(el) => { /* 将 el 分配给 property 或 ref */ }" />
```

如果使用动态 `:ref` 绑定, 也可以传入一个函数。当函数卸载时, 这个 `el` 参数会是 `null`。

### 组件上 ref

`ref` 也可以被用在一个子组件上。此时 ref 引用的是组件实例：

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

- 如果子组件使用的是选项式 API 或没有使用 `<script setup>`, 被引用的组件实例和该子组件的 `this` 完全一致, 也就是说, 父组件对子组件的每一个属性和方法都有完全访问权。

- 但是, 有一个例外情况, **使用了 `<script setup>` 的组件是默认私有的** : **父组件无法访问到一个使用了 `<script setup>` 子组件的任何东西, 除非子组件在其中通过 defineExpose 宏显式暴露**

:::tip Note
应该只在绝对需要时才使用组件 ref, 大多数情况下, 应该首先使用标准的 props 和 emit 接口来实现父子组件通信。
:::

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

## 列表渲染

可以使用 `v-for` 指令基于一个**数组数字或对象**来渲染一个列表, `v-for` 指令需要一种特殊的语法形式 `item in items` (或 `item of items`), 其中 `items` 是源数据, 而 `item` 是迭代项的别名：

- 当源数据为数组时, `v-for` 也支持使用第二个可选参数, 表示当前项的位置索引
- 当源数据为对象时, `v-for` 支持使用第二个可选参数 `key` 键名, 与第三个可选参数 `index` 当前项索引

```js
const items = ref([{ message: "Foo" }, { message: "Bar" }]);
```

```html
<li v-for="(item, index) in items">{{ item.message }} - {{index}}</li>
```

### `v-for` 变量解构

实际上, 可以在定义 `v-for` 变量别名时使用解构：

```html
<li v-for="{ message } in items">{{ message }}</li>

<!-- 有 index 索引时 -->
<li v-for="({ message }, index) in items">{{ message }} {{ index }}</li>
```

### 通过 `key` 来管理状态

**Vue 默认按照"就地更新"的策略来更新通过 `v-for` 渲染的元素列表**。当数据项的顺序改变时, Vue 不会随之移动 DOM 元素的顺序, 而是就地更新每个元素, 确保它们在原本指定的索引位置上渲染。

默认模式是高效的, **但只适用于列表渲染输出不依赖子组件状态或者临时 DOM 状态(例如表单输入值)**。

为了给 Vue 一个提示, 以便它可以跟踪每个节点的标识, 从而重用和重新排序现有的元素, 需要为每个项目提供一个唯一的 `key` attribute :

```html
<div v-for="item in items" :key="item.id">
  <!-- 内容 -->
</div>
```

:::danger Note
将 `key` 赋值为 `index` 没有任何意义 ❗❗❗
:::

:::warning Note
推荐在任何可行的时候为 `v-for` 提供一个 `key` attribute, 除非有意依赖默认行为来获得性能效益。
:::

:::tip Note
`key` 不单单局限于 `v-for`, 需要动态控制 DOM 元素的重新渲染就可以使用 `key`。
:::

### `<template>` 上的 `v-for`

在 Vue2.x 中, `<template>` 标签不能拥有 `key`, 不过可以为其每个子节点分别设置 `key`。

```html
<!-- Vue 2.x -->
<template v-for="item in list">
  <div :key="'heading-' + item.id">...</div>
  <span :key="'content-' + item.id">...</span>
</template>
```

在 Vue3.x 中, `key` 应该被设置在 `<template>` 标签上。

```html
<!-- Vue 3.x -->
<template v-for="item in list" :key="item.id">
  <div>...</div>
  <span>...</span>
</template>
```

## 条件渲染

### `v-if` 和 `v-for`

:::danger Note
同时使用 `v-if` 和 `v-for` 是极其不推荐的 ❗❗❗
:::

- 在 Vue2.x 版本中, 同一个元素上使用 `v-if` 和 `v-for` 时, `v-for` 会优先作用。

- 在 Vue3.x 版本中, 同一个元素上使用 `v-if` 和 `v-for` 时, `v-if` 会优先作用。

### `v-if` 与 `v-show`

- `v-if` 是"真实的"按条件渲染, 它确保条件区块内的元素都会在切换时被销毁与重建
- `v-show` 是通过控制元素 CSS 的 `display` 属性来实现切换, 元素无论初始条件如何, 始终会被渲染

需要非常频繁切换时使用 `v-show`, 运行不常改变的时候使用 `v-if`。

## 类与样式绑定

Vue 对于 `class` 和 `style` 的 `v-bind` 用法提供了特殊的功能增强, 除了字符串外, 表达式的结果还可以是对象或者数组, 且可以在数组中使用对象语法。

```html
<div :class="[{ active: isActive }, errorClass]"></div>
```

## 表单输入绑定

在前端处理表单时, 常常需要将表单输入框的内容同步给 JavaScript 中相应的变量。手动连接值绑定和更改事件监听器可能会很麻烦：

```html
<input :value="text" @input="event => text = event.target.value" />
```

`v-model` 指令简化了这一步骤：

```html
<input v-model="text" />
```

`v-model` 可用于各种不同类型的输入:

- 文本类型的 `<input>` 和 `<textarea>` 元素会使用到 `value` 和 `input` 事件
- `<input type="checkbox">` 和 `<input type="radio">` 使用 `checked` 属性和 `change` 事件
- `<select>` 使用的 `value` 作为 prop, `change` 作为事件

:::tip Note
`v-model` 会忽略任何表单元素上的初始 `value`、`checked` 或 `selected` attribute。它始终将当前绑定的 JavaScript 状态视为数据的正确来源。
:::

### 多行文本

注意插值表达式在 `<textarea>` 中不会工作, 需要使用 `v-model` 替代：

```html
<!-- 错误 -->
<textarea>{{ text }}</textarea>

<!-- 正确 -->
<textarea v-model="text"></textarea>
```

### 修饰符

**`.lazy`**

默认情况下, `v-model` 会在每次 `input` 事件后更新数据。可以添加 `lazy` 修饰符来改为在每次 `change` 事件后更新数据：

```html
<!-- 在 "change" 事件后同步更新而不是 "input" -->
<input v-model.lazy="msg" />
```

**`.trim`**

可以在 `v-model` 后添加 `.trim` 修饰符来自动去除用户输入内容两端的空格：

```html
<input v-model.trim="msg" />
```

**`.number`**

如果想让用户输入自动转换为数字, 可以在 `v-model` 后添加 `.number` 修饰符：

```html
<input v-model.number="age" />
```

如果该值无法被 `parseFloat()` 处理, 那么将返回原始值。

`number` 修饰符会在输入框有 `type="number"` 时自动应用。

## 事件处理

可以使用 `v-on` 指令(简写为 `@`) 来监听 DOM 事件和运行 JavaScript 代码。用法：`v-on:click="methodName"` 或 `@click="handler"`。

事件处理器的值可以是：

1. **内联事件处理器**：事件被触发时执行的内联 JavaScript 语句 (与 `onclick` 类似)。
2. **方法事件处理器**：一个组件的属性名、或对某个方法的访问。

### 方法与内联事件判断

模板编译器会通过检查 `v-on` 的值是否是合法的 JavaScript 标识符或属性访问来断定是何种形式的事件处理器。

- `foo`、`foo.bar` 和 `foo['bar']` 会被视为方法事件处理器, 而 `foo()` 和 `count++` 会被视为内联事件处理器。

### 方法事件处理器

方法事件处理器会自动接收原生 DOM 事件并触发执行。能够通过被触发事件的 `event.target` 获取到触发事件的元素。

```html
<!-- `greet` 是下面定义过的方法名 -->
<button @click="greet">Greet</button>
```

```js
const name = ref("Vue.js");

function greet(event) {
  alert(`Hello ${name.value}!`);
  // `event` 是 DOM 原生事件
  if (event) {
    alert(event.target.tagName);
  }
}
```

### 在内联事件处理器中访问事件参数

有时需要在内联事件处理器中访问原生 DOM 事件, 可以向该处理器方法传入一个特殊的 `$event` 变量, 或者使用箭头函数：

```html
<!-- 使用特殊的 $event 变量 -->
<button @click="warn('Form cannot be submitted yet.', $event)">Submit</button>

<!-- 使用内联箭头函数 -->
<button @click="(event) => warn('Form cannot be submitted yet.', event)">
  Submit
</button>
```

```js
function warn(message, event) {
  // 这里可以访问原生事件
  if (event) {
    event.preventDefault();
  }
  alert(message);
}
```

### 事件修饰符

在处理事件时调用 `event.preventDefault()` 或 `event.stopPropagation()` 是很常见的。

Vue 为 `v-on` 提供了事件修饰符。修饰符是用点表示的指令后缀。

- `.stop`
- `.prevent`
- `.self`
- `.capture`
- `.once`
- `.passive`

```html
<!-- 单击事件将停止传递 -->
<a @click.stop="doThis"></a>

<!-- 提交事件将不再重新加载页面 -->
<form @submit.prevent="onSubmit"></form>

<!-- 修饰语可以使用链式书写 -->
<a @click.stop.prevent="doThat"></a>

<!-- 也可以只有修饰符 -->
<form @submit.prevent></form>

<!-- 仅当 event.target 是元素本身时才会触发事件处理器 -->
<!-- 例如：事件处理器不来自子元素 -->
<div @click.self="doThat">...</div>

<!-- 添加事件监听器时，使用 `capture` 捕获模式 -->
<!-- 例如：指向内部元素的事件，在被内部元素处理前，先被外部处理 -->
<div @click.capture="doThis">...</div>

<!-- 点击事件最多被触发一次 -->
<a @click.once="doThis"></a>

<!-- 滚动事件的默认行为 (scrolling) 将立即发生而非等待 `onScroll` 完成 -->
<!-- 以防其中包含 `event.preventDefault()` -->
<div @scroll.passive="onScroll">...</div>
```

**`.passive` 修饰符一般用于触摸事件的监听器, 可以用来改善移动端设备的滚屏性能**

:::tip Note
使用修饰符时需要注意调用顺序，因为相关代码是以相同的顺序生成的。因此使用 `@click.prevent.self` 会阻止元素及其子元素的所有点击事件的默认行为而 `@click.self.prevent` 则只会阻止对元素本身的点击事件的默认行为。
:::

:::tip Note
请勿同时使用 `.passive` 和 `.prevent`，因为 `.prevent` 会被忽略并且你的浏览器可能会抛出警告。请记住，`.passive` 是向浏览器表明你不想阻止事件的默认行为。并且如果你这样做，可能在浏览器中收到一个警告。
:::

### 按键修饰符

在监听键盘事件时, 经常需要检查特定的按键。Vue 运行在 `v-on` 或 `@` 监听按键事件时添加按键修饰符。

```html
<!-- 仅在 `key` 为 `Enter` 时调用 `vm.submit()` -->
<input @keyup.enter="submit" />
```

可以直接使用 `KeyboardEvent.key` 暴露的按键名称作为修饰符, 但需要转为 kebab-cese 形式：

```html
<input @keyup.page-down="onPageDown" />
```

**按键别名**

Vue 为一些常用的按键提供了别名：

- `.enter`
- `.tab`
- `.delete` (捕获“Delete”和“Backspace”两个按键)
- `.esc`
- `.space`
- `.up`
- `.down`
- `.left`
- `.right`

**系统按键修饰符**

可以使用以下系统按键修饰符来触发鼠标或键盘事件监听器，只有当按键被按下时才会触发。

- `.ctrl`
- `.alt`
- `.shift`
- `.meta`

```html
<!-- Alt + Enter -->
<input @keyup.alt.enter="clear" />

<!-- Ctrl + 点击 -->
<div @click.ctrl="doSomething">Do something</div>
```

**`.exact`**

`.exact` 修饰符允许控制触发一个事件所需的确定组合的系统按键修饰符。

```html
<!-- 当按下 Ctrl 时，即使同时按下 Alt 或 Shift 也会触发 -->
<button @click.ctrl="onClick">A</button>

<!-- 仅当按下 Ctrl 且未按任何其他键时才会触发 -->
<button @click.ctrl.exact="onCtrlClick">A</button>

<!-- 仅当没有按下任何系统按键时触发 -->
<button @click.exact="onClick">A</button>
```

### 鼠标按键修饰符

- .`left`
- .`right`
- .`middle`

这些修饰符将处理程序限定为由特定鼠标按键触发的事件。

## 计算属性

`computed()` 期望接收一个 getter 函数, **返回值为一个计算属性 `ref`**。

```vue {2,14-16}
<script setup>
import { reactive, computed } from "vue";

const author = reactive({
  name: "John Doe",
  books: [
    "Vue 2 - Advanced Guide",
    "Vue 3 - Basic Guide",
    "Vue 4 - The Mystery",
  ],
});

// 一个计算属性 ref
const publishedBooksMessage = computed(() => {
  return author.books.length > 0 ? "Yes" : "No";
});
</script>

<template>
  <p>Has published books:</p>
  <span>{{ publishedBooksMessage }}</span>
</template>
```

### 计算属性缓存 VS 方法

- **计算属性值会基于其响应式依赖被缓存**, 一个计算属性仅会在其响应式依赖更新时才重新计算
- **方法调用总是会在重渲染发生时再次执行函数**

### 可写计算属性

计算属性默认仅能通过计算函数得到结果, 当尝试修改一个计算属性时, 会收到一个运行时警告。

只在某些特殊场景中才可能用到可写计算属性, 可同时提供 getter 和 setter 来创建：

```vue
<script setup>
import { ref, computed } from "vue";

const firstName = ref("John");
const lastName = ref("Doe");

const fullName = computed({
  // getter
  get() {
    return firstName.value + " " + lastName.value;
  },
  // setter
  set(newValue) {
    // 注意：这里使用的是解构赋值语法
    [firstName.value, lastName.value] = newValue.split(" ");
  },
});
</script>
```

**组件 `v-model` 可以使用可写计算属性**

```vue
<!-- CustomInput.vue -->
<script setup>
import { computed } from "vue";

const props = defineProps(["modelValue"]);
const emit = defineEmits(["update:modelValue"]);

const value = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});
</script>

<template>
  <input v-model="value" />
</template>
```

### 最佳实践

- **计算属性不应有副作用, 不要在计算属性中做异步请求或者更改 DOM!**
- **避免直接修改计算属性， 计算属性的返回值应该只被视为只读的, 并且永远不应该被直接更改。**

## 侦听器

计算属性允许声明性地计算推导值。然而, 在有些情况下, 为了应对一些状态的变化, 我们需要运行些"副作用"：例如更改 DOM, 或者根据异步操作的结果, 去修改另一处的状态。

### 侦听来源类型

`watch` 的第一个参数可以是不同形式的"来源": 它可以是一个 ref (包括计算属性)、一个响应式对象、一个 getter 函数、或多个来源组成的数组：

```js
const x = ref(0);
const y = ref(0);

// 单个 ref
watch(x, (newX) => {
  console.log(`x is ${newX}`);
});

// getter 函数
watch(
  () => x.value + y.value,
  (sum) => {
    console.log(`sum of x + y is: ${sum}`);
  }
);

// 多个来源组成的数组
watch([x, () => y.value], ([newX, newY]) => {
  console.log(`x is ${newX} and y is ${newY}`);
});
```

**注意, 不能侦听响应式对象的原始类型 property**, 例如：

```js
const obj = reactive({ count: 0 });

// 这不起作用，因为你向 watch() 传入了一个 number
watch(obj.count, (count) => {
  console.log(`count is: ${count}`);
});
```

**而是使用 getter 函数**

```js
// 提供一个 getter 函数
watch(
  () => obj.count,
  (count) => {
    console.log(`count is: ${count}`);
  }
);
```

### 深层侦听器

**直接给 `watch()` 传入一个响应式对象, 会隐式的创建一个深层的监听器**---该回调函数在所有嵌套的变更时都会触发：

```js
const obj = reactive({ count: 0 });

watch(obj, (newValue, oldValue) => {
  // 在嵌套的 property 变更时触发
  // 注意：`newValue` 此处和 `oldValue` 是相等的
  // 因为它们是同一个对象！
});

obj.count++;
```

这不同于返回响应式对象的 getter 函数：只有在 getter 函数返回不同的对象时, 才会触发回调：

```js
watch(
  () => state.someObject,
  () => {
    // 仅当 state.someObject 被替换时触发
  }
);
```

可以显示地加上 `deep` 选项, 强制转成深层监听器：

```js
watch(
  () => state.someObject,
  (newValue, oldValue) => {
    // 注意：`newValue` 此处和 `oldValue` 是相等的
    // *除非* state.someObject 被整个替换了
  },
  { deep: true }
);
```

:::warning Note
深度侦听需要遍历被侦听对象中的所有嵌套的 property，当用于大型数据结构时，开销很大。因此请只在必要时才使用它，并且要留意性能。
:::

### watchEffet()

`watch()` 是懒执行的：仅在侦听源变化时, 才会执行回调。在某些场景中, 我们希望在创建监听器时, 立即执行一遍回调, 例如：

```js
const url = ref("https://...");
const data = ref(null);

async function fetchData() {
  const response = await fetch(url.value);
  data.value = await response.json();
}

// 立即获取
fetchData();
// ...再侦听 url 变化
watch(url, fetchData);
```

这段代码还可以用 `watchEffect` 函数 来简化。

**`watchEffect()` 会立即执行一遍回调函数，如果这时函数产生了副作用，Vue 会自动追踪副作用的依赖关系，自动分析出响应源**。

```js
watchEffect(async () => {
  const response = await fetch(url.value);
  data.value = await response.json();
});
```

:::danger Note
`watchEffet` 仅会在其同步执行期间, 才会追踪依赖。在使用异步回调时, 只有在第一个 `await` 正常工作前访问到的 property 才会被追踪。
:::

### watch VS wactchEffect

`watch` 和 `watchEffect` 都能够响应式地执行有副作用的回调。它们之间的主要区别是追踪响应式依赖的方式：

- `watch` 只追踪明确侦听的源。它不会追踪任何在回调中访问到的东西。另外, 仅在响应源确实改变时才会触发回调。`watch` 会避免在发生副作用时追踪依赖, 因此, 能更加精确地控制回调函数的触发时机。

- `watchEffect`, 则会在副作用发生期间追踪依赖。它会在**同步**执行过程中, 自动追踪所有能够访问到的响应式 property。这更方便, 而且代码往往更简洁, 但响应式依赖关系不那么明确。

### 回调的刷新时机

当更改了响应式状态, 它可能会同时触发 Vue 组件更新和侦听器回调。

**默认情况下, 侦听器回调都会在 Vue 组件更新之间被调用**。这意味着在侦听器回调中访问的 DOM 将是被 Vue 更新之前的状态。

如果想在侦听器回调中能够访问被 Vue 更新之后的 DOM, 需要指明 `flush: 'post'` 选项：

```js
watch(source, callback, {
  flush: "post",
});

watchEffect(callback, {
  flush: "post",
});
```

后置刷新的 `watchEffect()` 有个更方便的别名 `watchPostEffect()`。

### 停止侦听器

**在 `setup()` 或 `<script setup>` 中用同步语句创建的侦听器，会自动绑定到宿主组件实例上，并且会在宿主组件卸载时自动停止**。因此，在大多数情况下，无需关心怎么停止一个侦听器。

**一个关键点是，侦听器必须用同步语句创建：如果用异步回调创建一个侦听器，那么它不会绑定到当前组件上，你必须手动停止它，以防内存泄漏。**

```html
<script setup>
  import { watchEffect } from "vue";

  // 它会自动停止
  watchEffect(() => {});

  // ...这个则不会！
  setTimeout(() => {
    watchEffect(() => {});
  }, 100);
</script>
```

要手动停止一个侦听器，请调用 watch 或 watchEffect 返回的函数：

```js
const unwatch = watchEffect(() => {});

// ...当该侦听器不再需要时
unwatch();
```

**注意，需要异步创建侦听器的情况很少，请尽可能选择同步创建**。如果需要等待一些异步数据，你可以使用条件式的侦听逻辑:

```js
// 需要异步请求得到的数据
const data = ref(null);

watchEffect(() => {
  if (data.value) {
    // 数据加载后执行某些操作...
  }
});
```
