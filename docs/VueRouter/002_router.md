---
outline: deep
---

# 前端路由

## 路由是什么

在 Web 开发中, 路由指的是根据 URL 分配到对应的处理程序。

### 客户端路由 VS 服务端路由

前端路由的概念, 是伴随 SPA(Single-Page-Application) 出现的, 在此之前, 页面跳转都是通过服务器端进行控制的。

**服务端路由**

传统的页面跳转, 是前端向后台发送一个请求, 后台再通过模板引擎的渲染, 返回一个全新的 html 送往前端展示。

服务端路由指的就是服务器根据用户访问的 URL 路径返回不同的响应结果。

**客户端路由**

在 SPA 中, 客户端 JavaScript 可以拦截页面的跳转请求, 动态获取新的数据, 然后在无需重新加载的情况下更新当前页面。这样一来, 前端可自由控制组件的渲染, 来模拟页面的跳转行为。

在这类 SPA 中, "路由"是在客户端执行的。一个客户端路由器的职责就是利用诸如 [History API](https://developer.mozilla.org/en-US/docs/Web/API/History) 或是 [`hashchange 事件`](https://developer.mozilla.org/en-US/docs/Web/API/Window/hashchange_event)这样的浏览器 API 来管理应用当前应该渲染的视图。

:::tip 前端路由应包含两部分

1. URL 处理
2. 组件加载

:::

## 路由的分类

客户端路由通过其实现方式可分为三类, 分别是：

- history 模式
- hash 模式
- memory 模式

其中, history 模式与 hash 模式使用较为广泛。memory 模式就是将路由信息存储在一个对象里, 在 URL 中看不见对应的路径, 适用于手机端, 使用极少。

:::danger 前端路由实现的前提
一个 SPA, URL 改变但不刷新页面
:::

### hash 模式

hash 一般用作锚点, 修改 hash 值会在浏览器历史堆栈中添加一条新记录, 但并不会触发页面刷新。

### history 模式

HTML5 为 history 对象增加了方便的状态管理特性, 状态管理 API 可以实现改变 URL 但不刷新页面。

### hash 路由与 history 路由的区别

- hash 路由会携带一个 `#` 号, 不够美观; 但 history 路由不存在这个问题。
- hash 路由不支持 SSR(Server-Side Rendering); 但 history 路由支持。
- history 路由需要额外的服务器配置; 但 hash 路由不需要。

:::warning 一探究竟
hash 模式不会向服务器发出请求, 所以不支持服务端渲染, 但也因为这样, 所以服务器不需要做额外配置。而 history 模式在前端路由没有拦截时, 是可以向服务器发送请求的, 所以支持 SSR, 但也因为这样, 如果没有适当的服务器配置, 在浏览器中直接访问一个路径或刷新时, 就会得到一个 404 错误, 这就丑了。
:::

**history 模式 Nginx 服务器配置**

```nginx
# 单个服务器部署(假定根目录提供服务)
location / {
  try_files $uri $uri/ /index.html;
}

# 存在代理的情况
location / {
  rewrite ^ /file/index.html break; # 这⾥代表的是 xxx.cdn 的资源路径
  proxy_pass https://www.xxx.cdn.com;
}
```

这表示如果 URL 不匹配任何静态资源, 它应提供应用程序中的 `index.html` 页面。

## 实现一个简单的路由

### hash 路由

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Hash Router</title>
    <style>
      a {
        display: block;
        margin-bottom: 15px;
      }
    </style>
    <script src="./HashRouter.js"></script>
  </head>
  <body>
    <a href="#/">首页</a>
    <a href="#/about">关于我们</a>
    <a href="#/user">用户列表</a>
    <div id="container"></div>
  </body>

  <script>
    // 0. 路由处理函数
    function handle(text, color) {
      container.innerText = text;
      container.style.color = color;
    }
    // 1. 初始化路由实例
    const RouterHash = new HashRouter();
    // 2. 注册路由
    RouterHash.route("/", () => {
      handle("首页", "#000");
    });
    RouterHash.route("/about", () => {
      handle("关于我们", "#000");
    });
    RouterHash.route("/user", () => {
      handle("用户列表", "#000");
    });
  </script>
</html>
```

```js
class HashRouter {
  constructor() {
    this.router = {};
    // 初始化页面不会触发 hashchange 事件, 需要在 load 时触发一遍 hashchange 事件
    window.addEventListener("load", () => {
      this.onHandleHashChange();
    });
    window.addEventListener("hashchange", (e) => {
      // hashchange 事件对象包含 hash 改变前后的 URL: `e.oldURL`, `e.newURL`
      console.log("e -> ", e);
      this.onHandleHashChange();
    });
  }

  // 路由注册函数
  route(path, callback) {
    const realCallback =
      typeof callback === "function" ? callback : function () {};
    this.router[path] = realCallback;
  }

  // hashchange 事件回调
  onHandleHashChange() {
    const currentURL = window.location.hash
      ? window.location.hash.slice(1)
      : "/";
    this.router[currentURL] && this.router[currentURL]();
  }
}
```

### history 路由

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>History Router</title>
    <style>
      a {
        display: block;
        margin-bottom: 15px;
      }
    </style>
    <script src="./HistoryRouter.js"></script>
  </head>
  <body>
    <div id="wrap">
      <a href="./">首页</a>
      <a href="./about">关于我们</a>
      <a href="./user">用户列表</a>
    </div>
    <div id="container"></div>

    <script>
      function handle(text, color) {
        container.innerText = text;
        container.style.color = color;
      }

      const RouterHistory = new HistoryRouter();
      RouterHistory.route("/historyrouter.html", () => {
        handle("首页", "#000");
      });
      RouterHistory.route("/", () => {
        handle("首页", "#000");
      });
      RouterHistory.route("/about", () => {
        handle("关于我们", "#000");
      });
      RouterHistory.route("/user", () => {
        handle("用户列表", "#000");
      });

      wrap.addEventListener("click", (e) => {
        if (e.target.tagName === "A") {
          e.preventDefault();
          RouterHistory.push(e.target.getAttribute("href"));
        }
      });
    </script>
  </body>
</html>
```

```js
class HistoryRouter {
  constructor() {
    this.router = {};

    // 初始化页面时用 replaceState 替换历史栈
    window.addEventListener("load", () => {
      this.replace(window.location.pathname);
    });

    // 监听 popstate 事件, 执行一遍回调
    // popstate 触发条件: URL 改变但不刷新页面 -> pushState、replaceState 入历史栈后的前进后退, 修改 hash
    window.addEventListener("popstate", (e) => {
      // popstate 事件对象的 state 属性是 pushState、replaceState 的第一个参数, 也可以通过 history.state 获取
      console.log("e.state", e.state);
      this.onHandlePopstate();
    });

    // window.addEventListener("hashchange", () => {
    //   console.log("hashchange");
    // });
  }

  // 路由注册函数
  route(path, callback) {
    const realCallback =
      typeof callback === "function" ? callback : function () {};
    this.router[path] = realCallback;
  }

  push(path) {
    history.pushState({ path }, null, path);
    this.router[window.location.pathname] &&
      this.router[window.location.pathname]();
  }

  replace(path) {
    history.replaceState({ path }, null, path);
    this.router[window.location.pathname] &&
      this.router[window.location.pathname]();
  }

  onHandlePopstate() {
    this.router[window.location.pathname] &&
      this.router[window.location.pathname]();
  }
}
```

### Vue 实现一个简单的路由

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
