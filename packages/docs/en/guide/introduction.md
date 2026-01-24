---
title: Introduction
description: Learn the goals, constraints, and configuration approach of VitePress Theme Element Plus to see if it fits your component docs.
keywords:
  - VitePress Theme Element Plus introduction
  - Element Plus styled theme
  - VitePress documentation customization
---

# Introduction

::: warning Note
This theme is built for VitePress 2.x. Do not mix it with 1.x.
:::

VitePress Theme Element Plus follows the Element Plus visual guidelines. The main goal is to keep multiple component docs visually consistent while staying lightweight. All Markdown features, site config, and Vite extensions are enabled explicitly so you can opt in as needed. For the most complete example, check `packages/docs/.vitepress/config.mts`.

::: tip Tip
This package ships source files (Vue SFCs are not precompiled). If any dependencies are missing at runtime, install them as prompted.
:::

## Configuration

This theme mirrors the official theme options with two additions: the `version` field and the `footer.blogroll` list for version display and friendly links. For a full example, see [Quick Start](./quick-start).

The config types are declared here:

<<< @../../theme/index.ts#snippet
