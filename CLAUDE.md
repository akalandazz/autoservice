# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project structure

All application code lives in `frontend/` — a single Next.js 16.2.4 + React 19.2.4 app using the App Router exclusively.

## Commands

Run all commands from the `frontend/` directory:

```bash
npm run dev       # dev server at http://localhost:3000
npm run build     # production build
npm run start     # serve production build
npm run lint      # ESLint 9 (flat config)
```

## Critical: This is Next.js 16

Next.js 16 has breaking changes from earlier versions. **Before writing any Next.js code, read the relevant guide in `frontend/node_modules/next/dist/docs/`.** Key differences from what training data may assume:

- **`params` and `searchParams` are now `Promise`s** — always `await` them before accessing properties:
  ```tsx
  export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
  ```
- **Middleware is renamed `proxy.ts`** — the file convention is `proxy.ts` at the project root (same level as `app/`), not `middleware.ts`.
- **Caching uses the `'use cache'` directive**, not `fetch` cache options or `export const revalidate`. Enable with `cacheComponents: true` in `next.config.ts`.
- **Instant client-side navigation** requires exporting `unstable_instant` from the route segment — Suspense boundaries alone are not enough. Read `node_modules/next/dist/docs/01-app/02-guides/instant-navigation.md` before touching navigation performance.
- **ESLint 9 flat config** — `eslint.config.mjs` uses `defineConfig` from `eslint/config`, not the legacy `.eslintrc` format.

## Architecture

- **App Router** — all routes live under `frontend/app/`. Layouts, pages, loading, and error files follow Next.js file conventions.
- **TypeScript strict mode** — path alias `@/*` resolves to `frontend/` (e.g., `@/app/lib/data` → `frontend/app/lib/data`).
- **Tailwind CSS v4** — configured via `postcss.config.mjs` using `@tailwindcss/postcss`. In CSS, use `@import "tailwindcss"` and `@theme` blocks instead of v3's `@tailwind` directives. Custom tokens are defined in `app/globals.css` under `@theme inline`.
- **Fonts** — Geist Sans and Geist Mono are loaded via `next/font/google` in `app/layout.tsx` and exposed as CSS variables (`--font-geist-sans`, `--font-geist-mono`).
- **Server vs Client Components** — components are Server Components by default; add `'use client'` only when you need state, event handlers, or browser APIs.
