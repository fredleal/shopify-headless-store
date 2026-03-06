# Shopify Headless Store — Agent Onboarding

## READ THIS FIRST

You are an AI agent working on shopify-headless-store. Follow these rules EXACTLY.

## Project Overview

Headless Shopify storefront built with Next.js 14 + Shopify Storefront API.
Demonstrates proficiency in: Storefront API, Hydrogen patterns, SEO/metadata, Liquid migration auditing.

## Tech Stack

Next.js 14 (App Router) | TypeScript strict | Tailwind CSS | Shopify Storefront API | graphql-request | Bun | Vitest | Playwright

## Architecture

- src/lib/shopify/ — GraphQL client, queries, types (Storefront API)
- src/lib/domain/ — Pure business logic (price formatting, cart calculations) — TDD
- src/lib/seo/ — Metadata helpers, JSON-LD generators
- src/app/ — Next.js pages, layouts, Server Actions
- src/components/ — Atomic Design (atoms, molecules, organisms)
- src/hooks/ — Client-side hooks (useCart, etc.)
- src/actions/ — Server Actions (cart mutations)
- docs/ — Architecture, Hydrogen comparison, Liquid audit

## Design System Pattern

Full custom components (NO shadcn, NO Radix, NO Headless UI).
CSS variables with fallback hex:

```
bg-[var(--color-primary-500,#3b82f6)]
text-[var(--color-gray-900,#111827)]
```

Object-map for variants (NOT if/else). Named exports only (NO default exports).
`'use client'` only when hooks/events/browser APIs are used.
Props interface extends HTML attributes when applicable.

## Your Workflow

1. Read IMPLEMENTATION_PLAN.md — find next unclaimed `- [ ]` task
2. Claim it: change `- [ ]` to `- [🔄 agent-name]` (prevents double-work)
3. Create branch: `feature/task-description` from `develop`
4. Implement the task
5. Validate in order: `bun run build` → `bun run lint` → `bun run test`
6. Mark complete: change to `- [x]` + add session notes
7. Commit + Push + Create PR targeting `develop`
8. STOP. Do NOT merge. Do NOT start another task.

## Critical Rules

1. Build-first: `bun run build` BEFORE lint/test
2. TDD for src/lib/domain/ — write tests BEFORE implementation
3. NO AI signatures in commits (no Co-Authored-By, no Generated)
4. NEVER merge PRs — create PR and STOP
5. Branch from `develop`, NEVER from `main`
6. Conventional Commits: feat|fix|refactor|test|chore|docs: description
7. ONE task per session — finish, validate, PR, exit

## Validation Order (MANDATORY before every commit)

```bash
bun run build     # TypeScript project-wide check
bun run lint      # ESLint
bun run test      # Vitest
```

## Known Pitfalls

- ESLint 9 flat config: use `eslint.config.mjs`, not `.eslintrc`
- Vitest config must be `.mjs` (ESM compatibility with Vite)
- Empty barrel exports cause build errors: only export from files with actual exports
- `eslint-config-next` conflicts with flat config — removed, using typescript-eslint directly
- Next.js images from Shopify: configured in next.config.mjs remotePatterns
