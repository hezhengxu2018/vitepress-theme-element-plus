---
layout: home
page: true

hero:
  name: Vitepress Theme Element Plus
  image:
    src: /favicon.svg
    alt: Vitepress Theme Element Plus
  tagline: 一个Element-plus风格的Vitepress文档主题
  actions:
    - theme: alt
      text: 指南
      link: ./guide/introduction
    - theme: brand
      text: 组件总览
      link: ./component/overview

features:
  - title: 💡 融合的组件风格
    details: 主题风格向Element Plus靠拢，文档配置项完全兼容官方主题。
  - title: 🔌 轻量化设计
    details: 在保证文档风格的基础上仅内置少量特性，提供推荐的插件列表，自由扩展。不内置博客等与该主题无关的功能。
  - title: ⚠️ Vitepress 2.x
    details: 基于Vitepress 2.x开发的文档主题，请勿与1.x版本使用。
---

<style>
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: -webkit-linear-gradient(120deg, #bd34fe 30%, #41d1ff);

  --vp-home-hero-image-background-image: linear-gradient(-45deg, #bd34fe 50%, #47caff 50%);
  --vp-home-hero-image-filter: blur(44px);
}

h2:not(.VPFeatures h2) {
  text-align: center;
}

@media (min-width: 640px) {
  :root {
    --vp-home-hero-image-filter: blur(56px);
  }
}

@media (min-width: 960px) {
  :root {
    --vp-home-hero-image-filter: blur(68px);
  }
}
</style>
