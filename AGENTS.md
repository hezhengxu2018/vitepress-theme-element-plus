# Repository Guidelines

## Project Structure & Module Organization
The repo is a pnpm workspace (`pnpm-workspace.yaml`) with two packages: `packages/theme` contains the VitePress theme source (`client`, `shared`, `styles`, and build entry `index.ts`), while `packages/docs` hosts the reference site (`guide`, `demo`, entry `index.md`, static assets in `public`). Root-level configs (`tsconfig.json`, `eslint.config.mjs`, `commitlint.config.js`, `package.json`) provide shared TypeScript, linting, and release settings.

## Build, Test, and Development Commands
- `pnpm install` hoists dependencies across the workspace (use Node 24.11.0 / pnpm 10 via Volta).
- `pnpm dev` proxies to `pnpm -C packages/docs dev`, launching the docs with hot reload while consuming the linked theme package.
- `pnpm build` runs `pnpm -r build`, emitting the theme bundle under `packages/theme/dist` and static docs under `.vitepress/dist`.
- `pnpm build:theme`, `pnpm build:docs`, and `pnpm -C packages/docs preview` let you target specific artifacts; `pnpm -C packages/theme build:watch` speeds up iterative theme work.

## Coding Style & Naming Conventions
ESLint extends `@antfu/eslint-config`, so keep 2-space indentation, single quotes in TS/Vue, script-setup components, and trailing commas where valid. Vue components/composables under `packages/theme/client` use PascalCase filenames (`LayoutHeader.vue`), whereas directories, helpers, and SCSS modules stay kebab-case (`shared/site-config.ts`, `styles/toc-panel.scss`). Run `pnpm exec eslint .` locally; husky + lint-staged auto-fix staged `*.{vue,js,ts,jsx,tsx,md,json}` files before commits.

## Testing Guidelines
There is no dedicated unit-test suite yet, so treat clean builds and manual docs reviews as regressions checks. Before pushing, run `pnpm build:theme` and `pnpm build:docs`, then `pnpm -C packages/docs preview` to click through `demo` pages and ensure navigation, API typing blocks, and Element Plus widgets behave correctly. Capture screenshots or recordings when reporting visual regressions.

## Commit & Pull Request Guidelines
Commits follow Conventional Commits enforced by commitlint and czg; invoke `pnpm commit` to launch the prompt and prefer English imperative messages such as `fix(docs-content): align API tables`. Keep PRs focused, describe scope, list the commands you ran, link issues, and attach before/after screenshots for UI changes. Call out config or schema changes (e.g., tsconfig paths, Volta updates) so reviewers can rebootstrap as needed.
