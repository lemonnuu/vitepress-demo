---
layout: doc
---

# Pinia

## 注册

- 全局注册：`app.component`
  - 无法 tree shaking
  - 使依赖关系不明确， 难以维护
- 局部注册：`<script setup>` 无需注册 否则 `components选项`
  - 局部注册组件在后代组件中并不可用

组件名: PascalCase

- DOM 模板 不可用
- Vue 支持将 kebab-case 标签解析为 PascalCase

## Prop

组件需要知道父组件传入的值哪些是 Prop, 哪些是透传 attribute

- `<script setup>` props 使用 `defineProps()` 宏来定义
- 否则, 使用 `setup(props)` 选项来定义

Props 名字: 如果 prop 的名字很长，应使用 camelCase 形式

- 传递给子组件时, 可以 camelCase, DOM 模板除外, 会转成 kebab-case

Prop 不限制类型

单向数据流！！！

不应该在子组件里更改 Prop, Prop 是只读的

- prop 需要转换的时候, 定义一个数据或计算属性
- 大多数的用例场景中，子组件都应该抛出一个事件来通知父组件做出改变。

Prop 校验：

defineProps() 宏中的参数不可以访问 `<script setup>` 中定义的其他变量，因为在编译时整个表达式都会被移到外部的函数中。

- 所有 prop 默认都是可选的，除非声明了 required: true。

- 除 Boolean 外的未传递的可选 prop 将会有一个默认值 undefined。

- Boolean 类型的未传递 prop 将被转换为 false。你应该为它设置一个 default 值来确保行为符合预期。

- 如果声明了 default 值，那么在 prop 的值被解析为 undefined 时，无论 prop 是未被传递还是显式指明的 undefined，都会改为 default 值。

- 当 prop 的校验失败后，Vue 会抛出一个控制台警告 (在开发模式下)。

如果使用了基于类型的 prop 声明，Vue 会尽最大努力在运行时按照 prop 的类型标注进行编译。举个例子，defineProps<{ msg: string }> 会被编译为 { msg: { type: String, required: true }}。

type 也可以是自定义的类或构造函数，可以通过 instanceof 来检查、断言。

## 事件

像组件与 prop 一样，事件的名字也提供了自动的转换。请注意，我们触发了一个以 camelCase 形式命名的事件，但在父组件中可以使用 kebab-case 形式来监听

和原生 DOM 事件不太一样，组件触发的事件不会冒泡。你只能监听直接子组件触发的事件。

所有传入 $emit() 的额外参数都会被直接传向监听器

`defineEmits()` 宏不能在子函数中使用，他必须直接放置在 `<script setup>` 中

如果一个原生事件的名字 (例如 click) 被定义在 emits 选项中，则监听器只会监听组件触发的 click 事件而不会再响应原生的 click 事件。

### v-model

- 原生 DOM 的 v-model, `v-model="xxx"`
  - 相当于 `:value="xxx"`, `@input="xxx = e.target.value"`
- 组件的 v-model, `v-model="xxx"`
  - 相当于 `:modelValue="xxx"`, `@update:modelValue="(newValue) => xxx = newValue"`
  - 在 props 和 emits 选项中必须定义 `modelValue` 和 `update:modelValue`

组件的 modelValue 使用：

- 可以正常使用, `v-bind:modelValue="yyy`", 事件触发 `this.$emit('update:modelVal', payload)`
- 计算属性中使用！！！形式比较新颖, 但包一层感觉写的代码比较容易理解了

model 参数

- 默认都是 `modelValue` 当作 prop, `update:modelValue` 作为对应事件, 可以给 `v-model` 指定一个参数来更改这些名字
- `v-model:title="yyy"` => `title` 作为 prop, `update:title` 作为对应事件, 这样一来就可以绑定多个 `v-mdoel`

`v-mdoel` 修饰符

- 内置修饰符, `.trim`, `.number`, `.lazy`
- 组件自定义修饰符

其实很简单

props: 里面声明一个 modelModifiers Props, 防止没有自定义修饰符的情况, 其默认值返回一个空对象即可

```js
props: {
  modelModifiers: {
    default () {
      return {}
    }
  }
}
```

然后在 modelModifiers Prop 里就可以看粗有没有自定义的修饰符, 例如 `v-model:title.capitalize="xxx"`

那么 modelModifiers 就是 `{capitalize: true}`

这样一来就可以在 emit `update:title` 事件之前判断有没有相应修饰符执行一系列操作即可

## emits 选项

和 props 类似, 声明由组件触发的自定义事件

- 字符串数组简易形式
- 对象完整形式, 每个 property 键名是事件名, 值是 null 或验证函数, 验证函数返回布尔值, flase 表示不通过

验证函数将接收传递给组件的 `$emit` 调用的额外参数(一模一样)

注意： `emits` 选项决定了被触发组件的事件监听器是组件监听器还是原生的 DOM 事件监听器。

- `emits` 未声明, 就是原生 DOM 事件监听器, 在对象的 `$attrs` 能找得到, 不过前面会加上 `on` 前缀
  - 如果组件只有一个根元素, 会将该事件继承至根元素中, 参数是原生的 event
  - 否则, 抛出一个警告, 又不是组件监听器, 又继承不了
- `emits` 声明了, 就是组件监听器, 事件监听器不会添加到组件根元素中, 且会从组件的 `$attrs` 移除

## 透传 Attributes

太简单，不想说

简而言之, 就是调用组件上声明的属性或事件, 在组件内 props 和 emmit 选项没有声明, 就可以在 `$attrs` 找的到, 当只有一个根元素时,
就会透传, 常见的就是 `class`， `style`, `id`

如果不想要透传, 将 inheritAttrs 选项置为 flase 即可。 `inheritAttrs: false`, 就是想干嘛呢, 不想将 $attrs 属性直接继承给根元素, 想给其他元素, 隔代亲！

- 透传 attributes 在 JavaScript 中保留了它们原始的大小写，所以像 foo-bar 这样的一个 attribute 需要通过 $attrs['foo-bar'] 来访问。

- 像 @click 这样的一个 v-on 事件监听器将在此对象下被暴露为一个函数 $attrs.onClick, 加一个 `on`

多根节点不会透传的, 只有单个根元素才会

使用 $attrs, useAttrs()

## 插槽

也很简单, 咱就是说

- 子组件：暴露插槽插口, 可提供默认内容 `<slot>默认内容</slot>`
- 父组件：提供插槽内容，插槽内容默认无法访问子组件的数据

`<slot></slot>` 是插槽的插口, 标示了父元素提供的插槽内容将在哪里被渲染。

### 具名插槽

有时候插口不止一个, 就需要给插口定义唯一标识 `name`, 以确定每一处要渲染的内容

- 没有提供 `name` 的 `<slot>` 插口隐式的命名为 "default"

父组件怎么插呢, 需要一个含有 `v-slot:name` 的 `<template>` 元素, `v-slot` 可以简写为 `#`, 可以为动态插槽名 `#[nameVariable]`

所有位于顶级的非 `<template>` 节点都被隐式的视为默认插槽的内容

### 作用域插槽

有时候父组件就是想获取子组件里面的数据

- 子组件：在插口上定义需要传递的属性

```html
<slot :attr1="xxx" :attr2="yyy'></slot>
```

- 父组件：子组件传入插槽的 props 作为了 `v-slot` 的值, 且可以解构,

```html
<MyComponent v-slot="slotProps">{{slotProps.attr1}}</MyComponent>
```

当只有默认插槽时, `v-slot`接收插槽 props 可以简写在组件上, 不用 template 包裹起来

利用作用域插槽, 可以实现无渲染组件：子组件不渲染页面，只处理数据或逻辑，渲染页面的权力交给父组件

## 依赖注入

痛点： 多级嵌套组件, 祖父组件给曾孙组件传值, prosp 需要沿着组件链逐级传递(prop 逐级透传)

- 祖父组件提供：`provide('key', value)`, 可多次调用, 可提供一个响应式状态
- 曾孙组件注入：`inject('keyName', 默认值-可以是函数)`

### 配合响应性

曾孙组件最好不要更改祖父组件的 provide, 祖父可以在 provide 的时候用 `readonly()` 函数包装一下值

然后提供给曾孙组件 provide 的同时也暴露出更改 provide 的方法

```js
const keyValue = ref("");
provide("key", {
  keyValue,
  handleKeyValue: (params) => {
    keyValue.value = params;
  },
});
```

### 为防止冲突, 可以使用 Symbol() 作为键名

## 异步组件

某些大型项目时, 可能需要将应用分为更小的块, 并在需要的时候再从**服务器**加载相关组件

```js
defineAsyncComponent(() => {
  // ...Promise加载函数
  return new Promise((resolve, reject) => {});
});
```

ES 模块动态导入也会返回一个 Promise, 通常用它搭配 `defineAsyncComponent` 使用

```js
defineAsyncComponent(() => {
  import("./components/MyComponent.vue");
});
```

### 加载与错误状态

```js
const AsyncComp = defineAsyncComponent({
  // 加载函数
  loader: () => import("./Foo.vue"),

  // 加载异步组件时使用的组件
  loadingComponent: LoadingComponent,
  // 展示加载组件前的延迟时间，默认为 200ms
  delay: 200,

  // 加载失败后展示的组件
  errorComponent: ErrorComponent,
  // 如果提供了一个 timeout 时间限制，并超时了
  // 也会显示这里配置的报错组件，默认值是：Infinity
  timeout: 3000,
});
```

## nextTick

当在 Vue 中更改响应式状态时, 最终的 DOM 更新并不是同步生效的。而是 Vue 将它们缓存到了 "next tick", 以确保每个组件无论发生多少状态改变, 都仅执行一次更新。

`nextTick()` 可以在状态改变后立即使用, 可以传递一个回调函数作为参数。它会返回一个 Promise, 其内部异步操作就是更新 DOM, 当 DOM 更新完成时执行回调, 也可以不传参且搭配 await 使用。
