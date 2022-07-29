---
layout: home
hero:
  name: 中银前端
  text: Vue3 share.
  tagline: Come on...
  image:
    src: /deer.png
    alt: VitePress
  actions:
    - theme: brand
      text: Get Started
      link: /Vue3/000_optimization
    - theme: alt
      text: View on GitHub
      link: https://github.com/lemonnuu/vitepress-demo
---

<style>
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: -webkit-linear-gradient(120deg, #bd34fe, #41d1ff);
}
</style>

<script setup>
import { VPTeamMembers } from 'vitepress/theme'

const members = [
  {
    avatar: '/avatar/hh.jpg',
    name: 'Hou Hao',
    title: 'Leader',
  },
  {
    avatar: '/avatar/nlf.jpg',
    name: 'Niu Lifeng',
    title: 'Member',
  },
  {
    avatar: '/avatar/ljx.jpg',
    name: 'Lei Junxin',
    title: 'Member',
  },
  {
    avatar: '/avatar/zzh.jpg',
    name: 'Chu Zhihui',
    title: 'Member',
  },
  {
    avatar: '/avatar/zbc.jpg',
    name: 'Zhang Baochao',
    title: 'Member',
  },
  {
    avatar: '/avatar/xdr.jpg',
    name: 'Xi Dongran',
    title: 'Member',
  },
  {
    avatar: '/avatar/lyj.jpg',
    name: 'Lu Yujie',
    title: 'Member',
  },
  {
    avatar: '/avatar/hw.jpg',
    name: 'Han Wei',
    title: 'Member',
  },{
    avatar: '/avatar/cxk.jpg',
    name: 'Chen Xiaokang',
    title: 'Member',
  },
]
</script>

<VPTeamMembers size="small" :members="members" />
