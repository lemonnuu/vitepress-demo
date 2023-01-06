---
outline: deep
---

# 路由前置知识

## History

history 对象表示当前窗口首次使用以来用户的导航历史记录。history 是 window 的属性, 每个 window 都有自己的 history 对象

:::tip Note
出于安全考虑, 这个对象不会暴露用户访问过的 URL, 但可以通过它, 在不知道实际 URL 的情况下前进和后退。
:::

:::danger Note
只要页面 URL 发生变化, 就会在历史记录中生成一个新条目, 包括 hash 的变化！
:::

### state 与 length

**`history.state`**

当前页面的状态值, 为 pushState 或 replaceState 的第一个参数, 如果不是以上两种方式产生的页面, 则为 null。

**`history.length`**

表示历史记录中有多少个条目, 包括可前进和后退的页面。对于窗口或标签页中加载的第一个页面, `history.length` 等于 1。

:::danger Note
如果当前页不处在历史记录中最后一页时跳转页面, 会以当前页面所处的位置为基准添加记录并**覆盖**当前页之后的页面记录。
:::

### `history.pushState(state, title, url)`

- `state` : 一个与记录关联的状态对象, 会作为 popstate 事件对象的 state 属性传入, 也可使用 `history.state` 获取。如果不需要, 设置为 `null` 即可。为防止滥用, 大小也有限制, 通常在 500KB ~ 1MB 以内。
- `title` : 新页面标题, 一般不起作用(比如 FireFox 浏览器), 填空字符串即可。
- `url` : 一个相对 URL。

```js
history.pushState(null, "", "./");
```

### `history.replaceState(state, title, url)`

replaceState 与 pushState 接收相同的参数, 唯一的区别就是 pushState 用于创建新的历史记录, 而 replaceState 用于替换当前历史记录。

```js
history.replaceState(null, "", "./");
```

:::danger pushState 与 replaceState
`history.pushState()` 与 `history.replaceState()` 都可以改变浏览器 URL 而不刷新页面。
:::

### popstate 事件

当 URL 改变且不刷新页面时(pushState、replaceState 除外), 就会触发 `popstate` 事件。

:::danger `popstate` 触发时机

1. 通过 `history.go()`、`history.back()`、`history.forward()` 进入由 pushState 或 replaceState 注册的历史记录页面
2. 修改 URL 的 hash

:::

:::tip Note
当 URL 的 hash 发生改变时, popstate 事件与 hashchange 事件都会触发, 且 popstate 事件触发在前。
:::

### 导航

**`history.go(num)`**

go() 方法可以在用户历史记录中沿任何方向导航, 可以前进也可以后退。这个方法只接收一个参数, 这个参数可以是一个整数, 表示前进或后退多少步。

负值表示在历史记录中后退(类似点击浏览器的"后退"按钮), 而正值表示在历史记录中前进(类似点击浏览器的"前进"按钮)。

```js
// 后退一页
history.go(-1);

// 前进一页
history.go(1);
```

:::tip Note
`history.go()` 不指定参数, 或指定参数 0, 会刷新当前页面。
:::

:::danger
`history.go()` 进入到由 pushState 或 replaceState 注册的历史记录页面中不会刷新页面。
:::

**history.back()**

后退一页, `history.go(-1)` 的简写。

**history.forward()**

前进一页, `history.go(-1)` 的简写。
