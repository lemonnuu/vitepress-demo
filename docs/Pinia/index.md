---
outline: deep
---

# Pinia

Pinia 是 Vue 的存储库, 它允许跨组件/页面共享状态。

> Pinia 天然支持 Composition API, 但也支持一组类似于 Vuex 的 map helpers, 例如 `mapStores()`、`mapState()` 或 `mapActions()`。

## 与 Vuex 3.x/4.x 的比较

Pinia API 与 Vuex ≤ 4 有很大不同, 即：

- **mutations 不再存在**。它们经常被认为是非常冗长的, mutations 最初带来了 devtools 集成，但这不再是问题
- 无需创建自定义复杂包装器来支持 TypeScript，所有内容都是类型化的，并且 API 的设计方式尽可能利用 TS 类型推断
- 不再需要注入、导入函数、调用函数、享受自动完成功能！
- 无需动态添加 Store, 默认情况下它们都是动态的，你甚至都不会注意到。请注意，你仍然可以随时手动使用 Store 进行注册，但因为它是自动的，你无需担心
- **不再有 modules 的嵌套结构**。但你仍然可以通过在另一个 Store 中导入和使用 来隐式嵌套 Store，但 Pinia 通过设计提供平面结构，同时仍然支持 Store 之间的交叉组合方式。 甚至可以拥有 Store 的循环依赖关系
- **没有命名空间模块**。鉴于 Store 的扁平架构，“命名空间” Store 是其定义方式所固有的，您可以说所有 Store 都是命名空间的

## 使用 Pinia

### 安装

```sh
yarn add pinia
# 或者使用 npm
npm install pinia
```

### 使用

创建一个 Pinia 实例(根存储)并传递给应用程序：

```js
import { createPinia } from "pinia";

app.use(createPinia());
```

## Store

一个 Store 是一个实体, 用于**托管全局状态**。 它拥有三个概念：`state`、`getters` 和 `actions`, 这些概念可以安全的假设等同于组件的 `data`、`computed`、和 `methods`。

### 定义一个 Store

Store 使用 `defineStore()` 定义, 需要一个**唯一**名称作为第一个参数传递：

```js {4,6}
import { defineStore } from "pinia";

// useStore 可以是 useUser、useCart 之类的任何东西
// 命名为 use... 是可跨组合项的约定, 以符合使用习惯
export const useStore = defineStore("main", {
  // 第一个参数是应用程序中 store 的唯一 id
  // other options...
});
```

第二个参数甚至可以使用一个函数(类似于组件的 `setup()`)：

```js {1}
export const useCounterStore = defineStore("counter", () => {
  const count = ref(0);
  function increment() {
    count.value++;
  }

  return { count, increment };
});
```

可以根据需要定义任意数量的 store, 最重要的是, **应该在不同文件中定义每个 store** 以充分利用 pinia。

:::tip Note
使用某一存储库 `useStore` 必须在 `app.use(createPinia())` 之后调用。
:::

### 使用 Store

在 `setup` 组件中使用 Store 需要先导入我们定义的 Store, 然后创建 store 实例。一旦 store 被实例化, 就可以直接在 store 上访问 `state`、`getters` 和 `actions` 中定义的任何属性。

> 1. 导入定义的 Store
> 2. 创建 store 实例
> 3. 直接在 store 上访问 `state`、`getters` 和 `actions` 中定义的任何属性

```js {1,8-9}
import { useStore } from "@/stores/counter";

export default {
  setup() {
    const store = useStore();

    return {
      // 您可以返回整个 store 实例以在模板中使用它
      store,
    };
  },
};
```

请注意, `store` 是一个用 `reactive` 包裹的对象, 这意味着不需要在 getters 之后写 `.value`, 但是, 就像 `setup` 中的 `props` 一样, **不能对其进行解构**。

```js {6}
import { useStore } from "@/stores/counter";

export default defineComponent({
  setup() {
    const store = useStore();
    // ❌ 这不起作用，因为它会破坏响应式
    // 这和从 props 解构是一样的
    const { name, doubleCount } = store;

    name; // "eduardo"
    doubleCount; // 2

    return {
      // 一直会是 "eduardo"
      name,
      // 一直会是 2
      doubleCount,
      // 这将是响应式的
      doubleValue: computed(() => store.doubleCount),
    };
  },
});
```

如果想从 Store 中提取属性同时保持其响应式, 需要使用 `storeToRefs()`。它将为任何响应式属性创建 refs：

```js {10}
import { useStore } from "@/stores/counter";
import { storeToRefs } from "pinia";

export default defineComponent({
  setup() {
    const store = useStore();
    // `name` 和 `doubleCount` 是响应式引用
    // 这也会为插件添加的属性创建引用
    // 但跳过任何 action 或 非响应式（不是 ref/reactive）的属性
    const { name, doubleCount } = storeToRefs(store);

    return {
      name,
      doubleCount,
    };
  },
});
```

## State

### 定义 State

state 是 store 的核心部分, 在 Pinia 中, **状态被定义为返回初始状态的函数**, 且推荐使用箭头函数:

```js {5}
import { defineStore } from 'pinia',

const useCounterStore = defineStore('counterStore', {
  // 推荐使用 完整类型推断的箭头函数
  // 所有这些属性都将自动推断其类型
  state: () => ({
    counter: 0
  })
})
```

### `setup()` 中使用 state

在 Composition API 中使用 Pinia 更容易, 不需要额外的 map helper!

```js
import { useCounterStore } from "../stores/counterStore";

export default {
  setup() {
    const counterStore = useCounterStore();

    return { counterStore };
  },
  computed: {
    tripleCounter() {
      return counterStore.counter * 3;
    },
  },
};
```

默认情况下, 可以通过 `store` 实例访问状态来**直接读取和写入状态**：

```js
const store = useStore();

store.counter++;
```

可以通过调用 store 上的 `$reset()` 方法将状态重置到初始值：

```js
const store = useStore();

store.$reset();
```

### 非 `setup()` 中使用 state

如果不使用 Composition API, 则可以借助 `mapState()` 与 `mapWritableState()` 帮助器将状态映射为计算属性。

- `mapState()` 只能将状态映射为只读计算属性
- `mapWritableState` 映射的计算属性可修改状态

**`mapState()`**

```js {6}
import { mapState } from "pinia";
import { useCounterStore } from "../stores/counterStore";

export default {
  computed: {
    // 允许访问组件内部的 this.counter, 但无法正常写入...
    // 与从 store.counter 读取相同
    ...mapState(useCounterStore, {
      myOwnName: "counter",
      // 还可以编写一个访问 store 的函数
      double: (store) => store.counter * 2,
      // 它可以正常读取“this”，但无法正常写入...
      magicValue(store) {
        return store.someGetter + this.counter + this.double;
      },
    }),
  },
};
```

**`mapWritableState`**

```js {6}
import { mapWritableState } from 'pinia'
import { useCounterStore } from '../stores/counterStore'

export default {
  computed: {
    // 允许访问组件内的 this.counter 并允许设置它
    // this.counter++
    // 与从 store.counter 读取相同
    ...mapWritableState(useCounterStore, ['counter'])
    // 与上面相同，但将其注册为 this.myOwnName
    ...mapWritableState(useCounterStore, {
      myOwnName: 'counter',
    }),
  },
}
```

:::tip Note
对于像数组这样的集合, 不需要使用 `mapWritableState()`, 除非想替换整个数组，`mapState()` 仍然允许调用集合上的方法, 如 `push`。
:::

### `$patch` 批量改变状态

除了直接使用 `store.counter++` 修改 store, 还可以调用 `$patch` 方法。它允许同时更改多个 state：

```js
store.$patch({
  counter: store.counter + 1,
  name: "Abalam",
});
```

`$patch` 方法也可以接收一个函数来批量修改多个 state, 更适用于集合类型 state 的修改：

```js
cartStore.$patch((state) => {
  state.items.push({ name: "shoes", quantity: 1 });
  state.hasChanged = true;
});
```

`state` 和 `$patch` 的直接更改都会出现在 devtools 中。

### 替换 state

可以将 store 的 `$state` 属性设置为新对象来替换 Store 的整个状态：

```js
store.$state = { counter: 666, name: "Paimon" };
```

还可以通过更改 `pinia` 实例的 `state` 来替换应用程序的整个状态。这在 SSR for hydration 期间使用。

```js
pinia.state.value = {};
```

### 订阅状态

可以通过 store 的 `$subscribe()` 方法订阅状态的变化, 类似于 Vuex 的 subscribe 方法。与常规的 `watch()` 相比, 使用 `$subscribe()` 的优点是 subscriptions 只会在 patches 之后触发一次(例如, 当使用 `$patch` 时)。

```js
cartStore.$subscribe((mutation, state) => {
  // import { MutationType } from 'pinia'
  mutation.type; // 'direct' | 'patch object' | 'patch function'
  // 与 cartStore.$id 相同
  mutation.storeId; // 'cart'
  // 仅适用于 mutation.type === 'patch object'
  mutation.payload; // 补丁对象传递给 to cartStore.$patch()

  // 每当它发生变化时，将整个状态持久化到本地存储
  localStorage.setItem("cart", JSON.stringify(state));
});
```

默认情况下, state subscriptions 绑定到添加它们的组件上。当组件被卸载时, 它们也将被自动删除。如果想要在卸载组件后保留它们, 需要将 `{detached: true}` 作为第二个参数传递给 state subscriptions:

```js
export default {
  setup() {
    const someStore = useSomeStore();

    // 此订阅将在组件卸载后保留
    someStore.$subscribe(callback, { detached: true });

    // ...
  },
};
```

:::tip Note
可以在 pinia 实例上查看整个状态：

```js
watch(
  pinia.state,
  (state) => {
    // 每当它发生变化时，将整个状态持久化到本地存储
    localStorage.setItem("piniaState", JSON.stringify(state));
  },
  { deep: true }
);
```

:::

## Getters

Getters 完全等同于 Store 状态的计算属性。

### 定义 getters

在 Pinia 中, `defineStore()` 中的 `getters` 属性用于定义 Getters, getter 接收 state 作为第一个参数, 且推荐使用箭头函数：

```js
export const useStore = defineStore("main", {
  state: () => ({
    counter: 0,
  }),
  getters: {
    doubleCount: (state) => state.counter * 2,
  },
});
```

大多数时候, getter 只依赖状态, 但有时候也可能需要依赖其他 getter, **可以在定义常规函数时通过 `this` 访问到整个 store 实例**。

> 在 TypeScript 中, 访问 `this` 的常规函数需要定义返回类型(这是由于 TypeScript 中的一个已知限制, 但是不会影响使用箭头函数的 getter, 也
> 不会影响不使用 `this` 的常规函数 getter)。

```js {10}
export const useStore = defineStore("main", {
  state: () => ({
    counter: 0,
  }),
  getters: {
    // 可以自动将返回类型推断为数字
    doubleCount(state) {
      return state.counter * 2;
    },
    // TypeScript 中, 访问 `this` 的常规函数返回类型必须明确设置
    doublePlusOne(): number {
      return this.counter * 2 + 1;
    },
  },
});
```

通过 `this` 访问其他 getter 时, 即使不使用 TypeScript, 也可以使用 JSDoc 来帮助 IDE 提示类型：

```js {8-14}
export const useStore = defineStore("main", {
  state: () => ({
    counter: 0,
  }),
  getters: {
    // 类型是自动推断的，因为我们没有使用 `this`
    doubleCount: (state) => state.counter * 2,
    // 这里需要我们自己添加类型（在 JS 中使用 JSDoc）。 我们还可以
    // 使用它来记录 getter
    /**
     * 返回计数器值乘以二加一。
     *
     * @returns {number}
     */
    doubleCountPlusOne() {
      // 自动完成 ✨
      return this.doubleCount + 1;
    },
  },
});
```

### getter 返回函数

Getters 只是幕后的 computed 属性, 因此无法向它们传递任何参数。但是, 可以从 getter 返回一个函数以接收任何参数：

```js
export const useStore = defineStore("main", {
  getters: {
    // 函数柯里化
    getUserById: (state) => {
      return (userId) => state.users.find((user) => user.id === userId);
    },
  },
});
```

需要注意的是, 这样一来 getter 不再缓存, 它们只是充当调用函数的角色。

### 访问其他 Store 的 getter

要使用其他 Store 中的 getter, 只需要在内部使用这个 Store 即可：

```js {9}
import { useOtherStore } from "./other-store";

export const useStore = defineStore("main", {
  state: () => ({
    // ...
  }),
  getters: {
    otherGetter(state) {
      const otherStore = useOtherStore();
      return state.localData + otherStore.data;
    },
  },
});
```

### `setup()` 中使用 getters

在 Composition API 中使用 Pinia 更容易, 不需要额外的 map helper!

```js
// Example File Path:
// ./src/stores/counterStore.js

import { defineStore } from 'pinia',

const useCounterStore = defineStore('counterStore', {
  state: () => ({
    counter: 0
  }),
  getters: {
    doubleCounter() {
      return this.counter * 2
    }
  }
})
```

```js {11}
import { useCounterStore } from "../stores/counterStore";

export default {
  setup() {
    const counterStore = useCounterStore();

    return { counterStore };
  },
  computed: {
    quadrupleCounter() {
      return counterStore.doubleCounter * 2;
    },
  },
};
```

### 非 `setup()` 中使用 getters

如果不使用 Composition API, 则可以借助 `mapState()` 将 getter 映射为只读计算属性：

```js
import { mapState } from 'pinia'
import { useCounterStore } from '../stores/counterStore'

export default {
  computed: {
    // 允许访问组件内的 this.doubleCounter
    // 与从 store.doubleCounter 中读取相同
    ...mapState(useCounterStore, ['doubleCount'])
    // 与上面相同，但将其注册为 this.myOwnName
    ...mapState(useCounterStore, {
      myOwnName: 'doubleCounter',
      // 您还可以编写一个访问 store 的函数
      double: store => store.doubleCount,
    }),
  },
}
```

## Actions

Actions 相当于组件中的 methods, 可以使用 `defineStore` 中的 actions 属性定义, 非常适合定义业务逻辑。

### 定义 actions

```js
// Example File Path:
// ./src/stores/counterStore.js

import { defineStore } from 'pinia',

const useCounterStore = defineStore('counterStore', {
  state: () => ({
    counter: 0
  }),
  actions: {
    increment() {
      this.counter++
    }
  }
})
```

Actions 可以通过 `this` 访问整个 Store 实例, 且提供完整类型支持。**`actions` 是可以异步的, 可以在其中 `await` 任何异步操作**：

```js {14}
import { mande } from "mande";

const api = mande("/api/users");

export const useUsers = defineStore("users", {
  state: () => ({
    userData: null,
    // ...
  }),

  actions: {
    async registerUser(login, password) {
      try {
        this.userData = await api.post({ login, password });
        showTooltip(`Welcome back ${this.userData.name}!`);
      } catch (error) {
        showTooltip(error);
        // 让表单组件显示错误
        return error;
      }
    },
  },
});
```

可以完全自由的设置任何参数并返回任何参数, 调用 Actions 时, 它都会自动推断类型。

### 访问其他 Store 的 action

要使用其他 Store 中的 action, 只需要在内部使用这个 Store 即可：

```js {1,9}
import { useAuthStore } from "./auth-store";

export const useSettingsStore = defineStore("settings", {
  state: () => ({
    // ...
  }),
  actions: {
    async fetchUserPreferences(preferences) {
      const auth = useAuthStore();
      if (auth.isAuthenticated) {
        this.preferences = await fetchPreferences();
      } else {
        throw new Error("User must be authenticated");
      }
    },
  },
});
```

### `setup()` 中使用 action

在 Composition API 中使用 Pinia 更容易, 不需要额外的 map helper!

```js {11}
import { useCounterStore } from "../stores/counterStore";

export default {
  setup() {
    const counterStore = useCounterStore();

    return { counterStore };
  },
  methods: {
    incrementAndPrint() {
      counterStore.increment();
      console.log("New Count:", counterStore.count);
    },
  },
};
```

### 非 `setup()` 中使用 action

如果不使用 Composition API, 则可以借助 `mapActions()` 将操作属性映射为组件中的方法：

```js {1,8,10}
import { mapActions } from 'pinia'
import { useCounterStore } from '../stores/counterStore'

export default {
  methods: {
    // gives access to this.increment() inside the component
    // same as calling from store.increment()
    ...mapActions(useCounterStore, ['increment'])
    // same as above but registers it as this.myOwnName()
    ...mapActions(useCounterStore, { myOwnName: 'doubleCounter' }),
  },
}
```

### 订阅 Actions

可以使用 `store.$onAction()` 订阅 action 及其结果, 传递给它的回调将会在 action 之前执行。且回调的第 4 个参数 `after` 函数会在 action 完全成功运行后触发, 回调的第 5 个参数 `onError` 则允许在处理中抛出错误。

> 这些对于运行时跟踪错误很有用。

```js
const unsubscribe = someStore.$onAction(
  ({
    name, // action 的名字
    store, // store 实例
    args, // 调用这个 action 的参数
    after, // 在这个 action 执行完毕之后，执行这个函数
    onError, // 在这个 action 抛出异常的时候，执行这个函数
  }) => {
    // 记录开始的时间变量
    const startTime = Date.now();
    // 这将在 `store` 上的操作执行之前触发
    console.log(`Start "${name}" with params [${args.join(", ")}].`);

    // 如果 action 成功并且完全运行后，after 将触发。
    // 它将等待任何返回的 promise
    after((result) => {
      console.log(
        `Finished "${name}" after ${
          Date.now() - startTime
        }ms.\nResult: ${result}.`
      );
    });

    // 如果 action 抛出或返回 Promise.reject ，onError 将触发
    onError((error) => {
      console.warn(
        `Failed "${name}" after ${Date.now() - startTime}ms.\nError: ${error}.`
      );
    });
  }
);

// 手动移除订阅
unsubscribe();
```

`store.$onAction()` 返回一个函数可取消订阅 actions。

默认情况下, action subscriptions 绑定到添加它们的组件上。当组件被卸载时, 它们也将被自动删除。如果想要在卸载组件后保留它们, 需要将 `true` 作为第二个参数传递给 detach action subscriptions:

```js
export default {
  setup() {
    const someStore = useSomeStore();

    // 此订阅将在组件卸载后保留
    someStore.$onAction(callback, true);

    // ...
  },
};
```

## 插件

由于是底层 API, Pinia Store 可以完全扩展。以下是插件可以执行的操作列表：

- 向 Store 添加新属性
- 定义 Store 时添加新选项
- 为 Store 添加新方法
- 包装现有方法
- 更改甚至取消操作
- 实现本地缓存等副作用
- 仅适用于特定 Store

### Pinia 插件介绍

**Pinia 插件是一个函数**, 接收一个可选参数 `context` (`{pinia, app, store, options}`), 且可返回要添加到 store 的状态。

```js
export function myPiniaPlugin(context) {
  context.pinia; // 使用 `createPinia()` 创建的 pinia
  context.app; // 使用 `createApp()` 创建的当前应用程序（仅限 Vue 3）
  context.store; // 插件正在扩充的 store
  context.options; // 定义存储的选项对象传递给`defineStore()`
  // ...
}
```

接着使用 `pinia.use()` 可以将插件添加到 pinia 实例中。

```js
pinia.use(myPiniaPlugin);
```

### 扩充 Store(添加属性)

**插件返回值的属性会被自动添加至每个 Store**, 可以简单的在插件中返回一个对象来为每个 Store 添加属性：

```js
pinia.use(() => ({ hello: "world" }));
```

通过返回值为每个 Store 添加属性的方式会被 devtools 自动跟踪, 为了让插件为 Store 添加的属性在 devtools 可见, 请尽可能使用该方式。

当然, 也可以直接在 `store` 上设置属性, 通过此方式为 Store 添加的属性不会被 devtools 跟踪。如果想在 devtools 中调试它, 需要仅在开发模式下将它添加至 `store._customProperties`。

```js {1-2,4,6}
pinia.use(({ store }) => {
  store.hello = "world";
  // 确保您的打包器可以处理这个问题。 webpack 和 vite 应该默认这样做
  if (process.env.NODE_ENV === "development") {
    // 添加您在 store 中设置的任何 keys
    store._customProperties.add("hello");
  }
});
```

需要注意的是, 每个 store 都使用 `reactive` 包装过, 所以会自动展开任何 Ref(ref(), computed(), ...)。

```js
const sharedRef = ref("shared");
pinia.use(({ store }) => {
  // 每个 store 都有自己的 `hello` 属性
  store.hello = ref("secret");
  // 它会自动展开
  store.hello; // 'secret'

  // 所有 store 都共享 value `shared` 属性
  store.shared = sharedRef;
  store.shared; // 'shared'
});
```

这也是为什么可以在没有 `.value` 的情况下访问所有计算属性及它们是响应式的原因。

### 添加新状态『响应式』

如果想将新状态添加至 store 或是打算添加在 hydration 中使用的属性, **必须在两个地方添加状态**:

- **在 `store` 上**, 因此可以使用 `store.myState` 访问它
- **在 `store.$state` 上**, 因此它可以在 devtools 中使用, **且在 SSR 期间被序列化**

```js {4-5}
const globalSecret = ref("secret");
pinia.use(({ store }) => {
  // `secret` 在所有 store 之间共享
  store.$state.secret = globalSecret;
  store.secret = globalSecret;
  // 它会自动展开
  store.secret; // 'secret'

  const hasError = ref(false);
  store.$state.hasError = hasError;
  // 这个必须始终设置
  store.hasError = toRef(store.$state, "hasError");

  // 在这种情况下，最好不要返回 `hasError`，因为它
  // 将显示在 devtools 的 `state` 部分
  // 无论如何，如果我们返回它，devtools 将显示它两次。
});
```

### 添加新的外部属性『静态』

当添加外部属性、来自其他库的类实例或仅仅是非响应式的东西时，应该在将对象传递给 pinia 之前使用 markRaw() 包装对象。

这是一个将路由添加到每个 store 的示例：

```js {1,6}
import { markRaw } from "vue";
// 根据您的路由所在的位置进行调整
import { router } from "./router";

pinia.use(({ store }) => {
  store.router = markRaw(router);
});
```

### 在插件中调用 `$subscribe`

**可以在插件中使用 `store.$subscribe` 和 `store.$onAction`** ：

```js
pinia.use(({ store }) => {
  store.$subscribe(() => {
    // 在存储变化的时候执行
  });
  store.$onAction(() => {
    // 在 action 的时候执行
  });
});
```

### 添加新选项

可以在定义 store 时创建新选项，以便以后从插件中使用它们。

例如，您可以创建一个 debounce 选项，允许您对任何操作进行去抖动：

```js {8-9}
defineStore("search", {
  actions: {
    searchContacts() {
      // ...
    },
  },

  // 选项 debounce, 稍后将由插件读取
  debounce: {
    // 将动作 searchContacts 防抖 300ms
    searchContacts: 300,
  },
});
```

然后插件可以读取该选项以包装操作并替换原始操作：

```js
// 使用任何防抖库
import debounce from "lodash/debunce";

pinia.use(({ options, store }) => {
  if (options.debounce) {
    // 我们正在用新的action覆盖这些action
    return Object.keys(options.debounce).reduce((debouncedActions, action) => {
      debouncedActions[action] = debounce(
        store[action],
        options.debounce[action]
      );
      return debouncedActions;
    }, {});
  }
});
```

请注意，使用设置语法时, 自定义选项作为第三个参数传递：

```js
defineStore(
  "search",
  () => {
    // ...
  },
  {
    // 稍后将由插件读取
    debounce: {
      // 将动作 searchContacts 防抖 300ms
      searchContacts: 300,
    },
  }
);
```
