# Shopify Headless Storefront — Reference Architecture

![Tests](https://img.shields.io/badge/tests-161%20passing-brightgreen) ![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue) ![Next.js](https://img.shields.io/badge/Next.js-14-black)

A modern, headless e-commerce storefront built to demonstrate composable commerce patterns using Next.js 14 and the Shopify Storefront API.

Live Demo: [shopify-headless-store.vercel.app](https://shopify-headless-store-git-fix-typech-cffc33-fredleals-projects.vercel.app/)

## Key Features

- **Headless Commerce** — Full storefront (PDP, PLP, collections, cart) powered by Shopify Storefront GraphQL API
- **ISR Caching** — Incremental Static Regeneration for optimal performance without stale data
- **XSS Protection** — All API HTML content sanitized via DOMPurify before rendering
- **Typed API Layer** — Custom `shopifyFetch` with typed errors, retry context, and env validation
- **Server Actions** — Next.js App Router mutations with error handling and cache revalidation
- **Error Boundaries** — Graceful error recovery at global and route-segment levels
- **Design System** — CSS variable-backed Tailwind tokens for themeable, consistent styling
- **SEO** — JSON-LD structured data, OpenGraph metadata, sitemap, and robots.txt
- **Atomic Architecture** — Components organized as atoms/molecules/organisms

## Architecture Documentation

Please refer to the `docs/` directory for detailed architectural decisions and comparisons:

- [Architecture Overview & Flowcharts](./docs/architecture-overview.md)
- [Liquid to Headless Migration Audit](./docs/liquid-audit.md)
- [Hydrogen vs Next.js Comparison](./docs/hydrogen-comparison.md)

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Commerce API:** Shopify Storefront API (GraphQL)
- **Styling:** Tailwind CSS (custom atom-based design system)
- **Language:** TypeScript (Strict)
- **Testing:** Vitest + React Testing Library (161 tests, 18 suites)
- **CI/CD:** GitHub Actions + Vercel Edge

## Running Locally

1. Install dependencies:

   ```bash
   bun install
   ```

2. Create a `.env.local` file with your Shopify credentials:

   ```env
   NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
   NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=your_public_token
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

3. Run the development server:
   ```bash
   bun run dev
   ```

## Testing

```bash
bun run test        # Run unit and component tests
bun run test:watch  # Run in watch mode
bun run typecheck   # TypeScript strict checking
bun run lint        # ESLint
```
