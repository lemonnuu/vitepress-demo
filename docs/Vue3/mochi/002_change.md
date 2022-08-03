---
outline: deep
---

# Vue3 的改动

![0002_Vue3新特性](https://cdn.jsdelivr.net/gh/lemonnuu/PicGoPictureBed/markdown/free/0002_Vue3新特性.png)

![0003_Vue3非兼容变更](https://cdn.jsdelivr.net/gh/lemonnuu/PicGoPictureBed/markdown/free/0003_Vue3非兼容变更.png)

## 值得注意的新特性 {#new-features}

Vue 3 中一些需要关注的新功能包括：

- Fragments 片段
- Composition API
- SFC 组合式 API 语法糖 `<script setup>`
- Teleport 传送门
- Emits 组件选项
- SFC 状态驱动的 CSS 变量 (`<style>` 中的 `v-bind`)
- SFC `<style scoped>` 可以包含全局规则或只针对插槽内容的规则
- `createRenderer` API 自定义渲染器
- Suspense

## 非兼容的变更

下面列出了从 2.x 开始的非兼容的变更：

### 全局 API

- 全局 Vue API 已更改为使用应用程序实例
- 全局和内部 API 已经被重构为支持 tree-shake

### 模板指令

- 组件上 `v-model` 用法已更改，以替换 `v-bind.sync`
- `<template v-for>` 和非 `v-for` 节点上的 key 用法已更改
- 在同一元素上使用的 `v-if` 和 `v-for` 优先级已更改
- `v-bind="object"` 现在排序敏感
- `v-on:event.native` 修饰符已移除
- `v-for` 中的 `ref` 不再注册 ref 数组

### 组件

- 只能使用普通函数创建函数式组件
- functional attribute 在单文件组件 (SFC) 的 `<template>` 和 functional 组件选项中被废弃
- 异步组件现在需要使用 `defineAsyncComponent` 方法来创建
- 组件事件现在需要在 `emits` 选项中声明
- #渲染函数
- 渲染函数 API 更改
- `$scopedSlots` property 已移除，所有插槽都通过 `$slots` 作为函数暴露
- `$listeners` 被移除或整合到 `$attrs`
- `$attrs` 现在包含 `class` 和 `style` attribute

### 自定义元素

- 自定义元素检测现在在模板编译时执行
- 特殊的 `is` attribute 的使用被严格限制在被保留的 `<component>` 标签中

### 其他小改变

- `destroyed` 生命周期选项被重命名为 `unmounted`
- `beforeDestroy` 生命周期选项被重命名为 `beforeUnmount`
- `default` prop 工厂函数不再可以访问 this 上下文
- 自定义指令的 API 已更改为与组件生命周期一致，且 `binding.expression` 已移除
- `data` 选项应始终被声明为一个函数
- 来自 `mixin` 的 data 选项现在为浅合并
- Attribute 强制策略已更改
- 一些过渡的 class 被重命名
- `<TransitionGroup>` 不再默认渲染包裹元素
- 当侦听一个数组时，只有当数组被替换时，回调才会触发，如果需要在变更时触发，则必须指定 deep 选项
- 没有特殊指令的标记 (`v-if/else-if/else`、`v-for` 或 `v-slot`) 的 `<template>` 现在被视为普通元素，并将渲染为原生的 `<template>` 元素，而不是渲染其内部内容。
- 已挂载的应用不会取代它所挂载的元素
- 生命周期的 `hook:` 事件前缀改为 `vnode-`

### 被移除的 API

- `keyCode` 作为 `v-on` 修饰符的支持
- `$on`、`$off` 和 `$once` 实例方法
- 过滤器 (filter)
- 内联模板 attribute
- `$children` 实例 property
- `propsData` 选项
- `$destroy` 实例方法。用户不应再手动管理单个 Vue 组件的生命周期。
- 全局函数 `set` 和 `delete` 以及实例方法 `$set` 和 `$delete`。基于代理的变化检测已经不再需要它们了
