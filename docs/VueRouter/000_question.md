---
outline: deep
---

# 问题

1. 路由是什么？
2. 客户端 VS 服务端路由
3. URL 改变的方式？URL 改变但不刷新页面的方式？
4. history.go(num) 一定会刷新页面嘛？如果不是, 什么时候刷新, 什么时候又不刷新？
5. hashchange、popstate 事件触发的条件, 两者能同时触发嘛？如果能, 先后顺序是什么？
6. hash 与 history 模式有何区别？
7. hash, history 模式实现一个简单的路由？
8. VueRouter 导航守卫分为哪几种, 可以用来干嘛？执行顺序？
9. Vuex、Pinia 是什么？为什么要有这个东西？
10. 刷新页面 Vuex 的 state 会丢失嘛？

URL 改变 | 历史堆栈 -> 页面跳转 | 锚点

history.go 刷新页面 ? -> 得看历史堆栈里边会不会刷新(hash、pushState、replaceState 入栈的不刷新)

:::tip 页面跳转

- form 表单提交默认行为
- a 标签默认行为
- 修改 `(window || document).location` 对象(hash 除外), location、location.href
- `history.go()`、`history.forward()`、`history.back()`

:::
