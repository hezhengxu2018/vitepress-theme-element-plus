---
title: VitePress Theme Element Plus
description: A VitePress theme styled with Element Plus, built for consistent theming, demo containers, and enhanced Markdown in component docs.
keywords:
  - VitePress Theme Element Plus
  - Element Plus documentation theme
  - VitePress theme
image: /logo.svg
layout: home
page: true

hero:
  name: Vitepress Theme Element Plus
  image:
    src: /favicon.svg
    alt: Vitepress Theme Element Plus
  tagline: An Element Plus styled VitePress theme for component documentation
  actions:
    - theme: alt
      text: Guide
      link: ./guide/introduction
    - theme: brand
      text: Render Tests
      link: ./guide/render-test-page

features:
  - title: Unified component styling
    details: The theme aligns with Element Plus visuals and stays fully compatible with the official VitePress theme options.
  - title: Lightweight by design
    details: Only a few opinionated features are bundled. You get a recommended plugin list and full freedom to extend without blog-specific bloat.
  - title: VitePress 2.x
    details: Built on VitePress 2.x. Do not use with 1.x.
---

<style>
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: -webkit-linear-gradient(120deg, #bd34fe 30%, #41d1ff);

  --vp-home-hero-image-background-image: linear-gradient(-45deg, #bd34fe 50%, #47caff 50%);
  --vp-home-hero-image-filter: blur(44px);
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
