export default {
  title: "Vue3 & TypeScript",
  description: "Vue3 & TypeScript share",
  lastUpdated: true,
  logo: "logo.png",
  themeConfig: {
    nav: nav(),
    sidebar: {
      "/Vue3/": sidebarVue3(),
      "/TypeScript/": sidebarTypeScript(),
    },
    outlineTitle: "大纲",
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
    { text: "Vue3", link: "/Vue3/000_draft", activeMatch: "/vue3/" },
    {
      text: "TypeScript",
      link: "/TypeScript/001_introduction",
      activeMatch: "/TypeScript/",
    },
    {
      text: "生态系统",
      items: [
        {
          text: "Vue Router",
          link: "/VueRouter/index",
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
      text: "介绍",
      collapsible: true,
      items: [
        { text: "draft", link: "/Vue3/000_draft" },
        { text: "Introduction", link: "/Vue3/001_introduction" },
      ],
    },
    {
      text: "选项式API",
      collapsible: true,
      items: [
        { text: "draft", link: "/Vue3/000_draft" },
        { text: "test", link: "/Vue3/999_test" },
      ],
    },
    {
      text: "组合式API",
      collapsible: true,
      items: [
        { text: "draft", link: "/Vue3/000_draft" },
        { text: "test", link: "/Vue3/999_test" },
      ],
    },
    {
      text: "深入组件",
      collapsible: true,
      items: [
        { text: "draft", link: "/Vue3/000_draft" },
        { text: "test", link: "/Vue3/999_test" },
      ],
    },
  ];
}

function sidebarTypeScript() {
  return [
    {
      text: "TypeScript",
      collapsible: true,
      items: [{ text: "introduction", link: "/TypeScript/001_introduction" }],
    },
  ];
}
