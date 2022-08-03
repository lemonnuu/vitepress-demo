---
outline: deep
---

# TransitionGroup·过渡组 {#transitiongroup}

`<TransitionGroup>` 是一个内置组件，设计用于呈现一个列表中的元素或组件的插入、移除和顺序改变的动画效果。

## 和 `<Transition>` 的区别 {#differences-from-transition}

`<TransitionGroup>` 支持和 `<Transition>` 基本相同的 prop、CSS 过渡 class 和 JavaScript 钩子监听器，但有以下几点区别：

- 默认情况下，它不会渲染一个包装器元素。但你可以通过传入 `tag` prop 来指定一个元素作为包装器元素来渲染。

- 过渡模式在这里不可用，因为我们不再是在互斥的元素之间进行切换。

- 其中的元素**总是必须**有一个独一无二的 `key` attribute。

- CSS 过渡 class 会被应用在其中的每一个元素上，**而不是**这个组的容器上。

:::tip
当你是在 DOM 模板中使用时，组件名需要写为 `<transition-group>`。
:::

## 进入 / 离开过渡 {#enter-leave-transitions}

这里是 `<TransitionGroup>` 对一个 `v-for` 列表应用进入 / 离开过渡的示例：

```vue-html
<TransitionGroup name="list" tag="ul">
  <li v-for="item in items" :key="item">
    {{ item }}
  </li>
</TransitionGroup>
```

```css
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
```

## 移动过渡 {#move-transitions}

上面的示例有一些明显的缺陷：当某一项被插入或移除时，它周围的元素会立即发生“跳跃”而不是平稳地移动。我们可以通过添加一些额外的 CSS 规则来解决这个问题：

```css{1,13-17}
.list-move, /* 对移动中的元素应用的过渡 */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* 确保将离开的元素从布局流中删除
  以便能够正确地计算移动的动画。 */
.list-leave-active {
  position: absolute;
}
```

现在它看起来好多了，甚至对整个列表执行洗牌的动画也都非常流畅：

## 交错的列表过渡 {#staggering-list-transitions}

如果通过 data attribute 用 JavaScript 来执行过渡时，那么我们也可以实现列表中的交错过渡。首先，我们把某一项的索引作为 DOM 元素上的一个 data attribute 呈现出来。

```vue-html{11}
<TransitionGroup
  tag="ul"
  :css="false"
  @before-enter="onBeforeEnter"
  @enter="onEnter"
  @leave="onLeave"
>
  <li
    v-for="(item, index) in computedList"
    :key="item.msg"
    :data-index="index"
  >
    {{ item.msg }}
  </li>
</TransitionGroup>
```

接着，在 JavaScript 钩子中，我们基于这个 data attribute 对该元素执行一个延迟动画。以下是一个基于 [GreenSock library](https://greensock.com/) 的动画示例：

```js{5}
function onEnter(el, done) {
  gsap.to(el, {
    opacity: 1,
    height: '1.6em',
    delay: el.dataset.index * 0.15,
    onComplete: done
  })
}
```

---
