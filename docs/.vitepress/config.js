export default {
  title: "Vue3",
  description: "Vue3 share",
  lastUpdated: true,
  themeConfig: {
    logo: "/logo.png",
    nav: nav(),
    sidebar: {
      "/Vue3/": sidebarVue3(),
      "/VueRouter/": sidebarVueRouter(),
      "/Vuex/": sidebarVuex(),
      "/Pinia/": sidebarPinia(),
    },
    outlineTitle: "页面梗概",
    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
    ],
    editLink: {
      pattern:
        "https://github.com/lemonnuu/vitepress-demo/blob/master/docs/:path",
      text: "Edit this page on GitHub",
    },
    footer: {
      message: "Vue3 & TypeScript share.",
      copyright: "Copyright © 2019-present Mochi",
    },
  },
};

function nav() {
  return [
    {
      text: "Vue3",
      link: "/Vue3/mochi/001_optimization",
      activeMatch: "/vue3/",
    },
    { text: "VueRouter", link: "/VueRouter/index", activeMatch: "/VueRouter/" },
    {
      text: "状态管理器",
      items: [
        {
          text: "Vuex",
          link: "/Vuex/index",
        },
        {
          text: "Pinia",
          link: "/Pinia/index",
        },
      ],
    },
  ];
}

function sidebarVue3() {
  return [
    {
      text: "快速上手",
      collapsible: true,
      items: [
        { text: "Vue3 的优化", link: "/Vue3/mochi/001_optimization" },
        { text: "Vue3 的改动", link: "/Vue3/mochi/002_change" },
        { text: "术语", link: "/Vue3/mochi/003_term" },
        { text: "应用", link: "/Vue3/mochi/004_application" },
        { text: "基础知识", link: "/Vue3/mochi/005_basic" },
        { text: "响应式API", link: "/Vue3/mochi/006_composition" },
      ],
    },
    {
      text: "开始",
      collapsible: true,
      items: [
        { text: "简介", link: "/Vue3/001_introduction" },
        { text: "快速开始", link: "/Vue3/002_quick-startion" },
      ],
    },
    {
      text: "基础",
      collapsible: true,
      items: [
        { text: "创建一个应用", link: "/Vue3/essentials/001_application" },
        { text: "模板语法", link: "/Vue3/essentials/002_template-syntax" },
        {
          text: "响应式基础",
          link: "/Vue3/essentials/003_reactivity-fundamentals",
        },
        { text: "计算属性", link: "/Vue3/essentials/004_computed" },
        { text: "类与样式绑定", link: "/Vue3/essentials/005_class-and-style" },
        { text: "条件渲染", link: "/Vue3/essentials/006_conditional" },
        { text: "列表渲染", link: "/Vue3/essentials/007_list" },
        { text: "事件处理", link: "/Vue3/essentials/008_event-handling" },
        { text: "表单输入绑定", link: "/Vue3/essentials/009_forms" },
        { text: "生命周期", link: "/Vue3/essentials/010_lifecycle" },
        { text: "侦听器", link: "/Vue3/essentials/011_watchers" },
        { text: "模板 ref", link: "/Vue3/essentials/012_template-refs" },
        { text: "组件基础", link: "/Vue3/essentials/013_component-basics" },
      ],
    },
    {
      text: "深入组件",
      collapsible: true,
      items: [
        { text: "注册", link: "/Vue3/components/001_registration" },
        { text: "Prop", link: "/Vue3/components/002_props" },
        { text: "事件", link: "/Vue3/components/003_events" },
        { text: "透传 Attribute", link: "/Vue3/components/004_attrs" },
        { text: "插槽", link: "/Vue3/components/005_slots" },
        { text: "依赖注入", link: "/Vue3/components/006_provide-inject" },
        { text: "异步组件", link: "/Vue3/components/007_async" },
      ],
    },
    {
      text: "可重用性",
      collapsible: true,
      items: [
        { text: "组合式函数", link: "/Vue3/reusability/001_composables" },
        { text: "自定义指令", link: "/Vue3/reusability/002_custom-directives" },
        { text: "插件", link: "/Vue3/reusability/003_plugins" },
      ],
    },
    {
      text: "内置组件",
      collapsible: true,
      items: [
        { text: "Transition", link: "/Vue3/built-ins/001_transition" },
        {
          text: "TransitionGroup",
          link: "/Vue3/built-ins/002_transition-group",
        },
        { text: "KeepAlive", link: "/Vue3/built-ins/003_keep-alive" },
        { text: "Teleport", link: "/Vue3/built-ins/004_teleport" },
        { text: "Suspense", link: "/Vue3/built-ins/005_suspense" },
      ],
    },
  ];
}

function sidebarVueRouter() {
  return [
    {
      text: "VueRouter directory",
      collapsible: true,
      items: [{ text: "VueRouter", link: "/VueRouter/index" }],
    },
  ];
}

function sidebarVuex() {
  return [
    {
      text: "Vuex directory",
      collapsible: true,
      items: [{ text: "Vuex", link: "/Vuex/index" }],
    },
  ];
}

function sidebarPinia() {
  return [
    {
      text: "Pinia directory",
      collapsible: true,
      items: [{ text: "Pinia", link: "/Pinia/index" }],
    },
  ];
}
