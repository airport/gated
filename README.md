# Gated

Nuxt.js frontend with [Frosted UI](https://storybook.whop.dev/) (Whop design system) imported and ready to build on.

## Stack

- **Nuxt 4** — Vue frontend
- **Frosted UI** (`frosted-ui`) — Whop UI kit ([Getting started](https://storybook.whop.dev/?path=/docs/guides-1-getting-started--docs))
- **React island bridge** — Frosted is React-based; components render via `ReactIsland` + `virtual:frosted-ui`
- **Tailwind CSS v4** — with `frostedThemePlugin()` design tokens

## Setup

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## How Frosted UI is wired

1. **Styles** — `app/assets/css/main.css` imports `frosted-ui/styles.css` in the `frosted_ui` layer (per Storybook Tailwind guide).
2. **Tokens** — `tailwind.config.js` registers `frostedThemePlugin()`.
3. **Components** — `virtual:frosted-ui` (esbuild vendor bundle in `nuxt.config.ts`) exports Frosted primitives + a shared React instance.
4. **Rendering** — Vue pages mount React trees with `<ReactIsland>` (see `app/pages/index.vue` + `app/react/FrostedDemo.ts`).

```ts
import { Theme, Button, Heading } from 'virtual:frosted-ui'
```

Docs: [Getting started](https://storybook.whop.dev/?path=/docs/guides-1-getting-started--docs) · [Tailwind plugin](https://storybook.whop.dev/?path=/docs/guides-5-tailwind-plugin--docs)

## Scripts

```bash
pnpm dev       # development server
pnpm build     # production build
pnpm preview   # preview production build
```
