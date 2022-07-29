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
    { text: "Vue3", link: "/Vue3/000_optimization", activeMatch: "/vue3/" },
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
      text: "开始",
      collapsible: true,
      items: [
        { text: "Vue3 的优化", link: "/Vue3/000_optimization" },
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
        { text: "draft", link: "/Vue3/000_optimization" },
        { text: "test", link: "/Vue3/999_test" },
      ],
    },
    {
      text: "差异",
      collapsible: true,
      items: [{ text: "draft", link: "/Vue3/00000_draft" }],
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
