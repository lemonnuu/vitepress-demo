---
outline: deep
---

# Vue Router

## 路由

在 Web 开发中, 路由指的是根据 URL 分配到对应的处理程序。

### 客户端 VS 服务端路由

服务端路由指的是服务器根据用户访问的 URL 路径返回不同的响应结果。当在一个传统的服务端渲染的 web 应用中点击一个链接时, 浏览器会从服务端获得全新的 HTML, 然后重新加载整个页面。

然而, 在[单页面应用](https://developer.mozilla.org/en-US/docs/Glossary/SPA)中, 客户端的 JavaScript 可以拦截页面的跳转请求, 动态获取新的数据, 然后在无需重新加载的情况下更新当前页面。这样通常可以带来更顺滑的用户体验, 尤其是在更偏向"应用"的场景下, 因为这类场景用户通常会在很长的一段事件中做出多次交互。

在这类单页面应用中, "路由"是在客户端执行的。一个客户端路由器的职责就是利用诸如 [History API](https://developer.mozilla.org/en-US/docs/Web/API/History) 或是 [`hashchange` 事件](https://developer.mozilla.org/en-US/docs/Web/API/Window/hashchange_event) 这样的浏览器 API 来管理应用当前应该渲染的视图。

### 从头开始实现一个简单的路由

如果只需要一个简单的页面路由, 而不想为此引入一整个路由库, 可以通过动态组件的方式, 监听浏览器[`hashchange` 事件](https://developer.mozilla.org/en-US/docs/Web/API/Window/hashchange_event)或使用[History API](https://developer.mozilla.org/en-US/docs/Web/API/History)来更新当前组件。

```vue
<script setup>
import { ref, computed } from "vue";
import Home from "./Home.vue";
import About from "./About.vue";
import NotFound from "./NotFound.vue";
const routes = {
  "/": Home,
  "/about": About,
};
const currentPath = ref(window.location.hash);
window.addEventListener("hashchange", () => {
  currentPath.value = window.location.hash;
});
const currentView = computed(() => {
  return routes[currentPath.value.slice(1) || "/"] || NotFound;
});
</script>
<template>
  <a href="#/">Home</a> | <a href="#/about">About</a> |
  <a href="#/non-existent-path">Broken Link</a>
  <component :is="currentView" />
</template>
```

## 入门

用 Vue + Vue Router 创建单页面应用非常简单: 通过 Vue.js, 我们已经用组件组成了我们的应用。当加入 Vue Router 时, 我们需要做的就是将我们的组件映射到路由上, 让 Vue Router 知道在哪里渲染它们。

### HTML

```html
<script src="https://unpkg.com/vue@3"></script>
<script src="https://unpkg.com/vue-router@4"></script>

<div id="app">
  <h1>Hello App!</h1>
  <p>
    <!--使用 router-link 组件进行导航 -->
    <!--通过传递 `to` 来指定链接 -->
    <!--`<router-link>` 将呈现一个带有正确 `href` 属性的 `<a>` 标签-->
    <router-link to="/">Go to Home</router-link>
    <router-link to="/about">Go to About</router-link>
  </p>
  <!-- 路由出口 -->
  <!-- 路由匹配到的组件将渲染在这里 -->
  <router-view></router-view>
</div>
```

- 使用 `<router-link>` 组件进行导航, 通过传递 `to` 来指定链接, `<router-link>` 将呈现一个带有正确 `href` 属性的 `<a>` 标签
- `<router-view>` 是路由出口, 路由匹配到的组件都将渲染到这里

#### `<router-link>`

注意, 没有使用常规 `a` 标签, 而是需要使用自定义组件 `<router-link>` 来创建链接。这使得 Vue router 可以在不重新加载页面的情况下更改 URL, 处理 URL 的生成以及编码。

#### `<router-view>`

`<router-view>` 将显示与 URL 对应的组件。可以把它放在任何地方, 以适应布局。

### JavaScript

```js
// 1. 定义路由组件.
// 也可以从其他文件导入
const Home = { template: "<div>Home</div>" };
const About = { template: "<div>About</div>" };

// 2. 定义一些路由
// 每个路由都需要映射到一个组件。
// 我们后面再讨论嵌套路由。
const routes = [
  { path: "/", component: Home },
  { path: "/about", component: About },
];

// 3. 创建路由实例并传递 `routes` 配置
// 你可以在这里输入更多的配置，但我们在这里
// 暂时保持简单
const router = VueRouter.createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: VueRouter.createWebHashHistory(),
  routes, // `routes: routes` 的缩写
});

// 5. 创建并挂载根实例
const app = Vue.createApp({});
//确保 _use_ 路由实例使
//整个应用支持路由。
app.use(router);

app.mount("#app");

// 现在，应用已经启动了！
```

1. 定义路由组件
2. 定义一些路由 `routes`, 每个路由都需要映射到一个组件
3. 创建路由实例并传递 `routes` 配置, 并选择客户端路由实现模式
4. 使用路由实例插件 `router`

通过调用 `app.use(router)`, 可以在任何组件中以 `this.$router` 的形式访问它, 并且以 `this.$route` 的形式访问当前路由。

```js
// Home.vue
export default {
  computed: {
    username() {
      // 我们很快就会看到 `params` 是什么
      return this.$route.params.username;
    },
  },
  methods: {
    goToDashboard() {
      if (isAuthenticated) {
        this.$router.push("/dashboard");
      } else {
        this.$router.push("/login");
      }
    },
  },
};
```

要在 `setup` 函数中访问路由, 需要调用 `useRouter` 或 `useRoute` 函数。

:::warning Note
`this.$router` 与直接通过 `createRouter` 创建的 `router` 实例完全相同。使用 `this.$router` 的原因是, 不希望在每个操作路由的组件中都导入路由。
:::

- 动态路由 (一类路由匹配到同一个组件)(默认不区分大小写)
  - 参数(`:xxx`) -> this.$router.params
  - 相同的组件实例将被重复使用, 意味着组件的生命周期钩子不会被调用 {要对同一组件中的参数变化做出响应的话}
    - 可以 watch `$router` 对象上的任意属性
    - 或者, 使用 `beforeRouteUpdate` 导航守卫
  - 参数中自定义正则(用括号包裹)
  - 可重复参数 (+, \*), 重复参数 (?)
- 嵌套路由
