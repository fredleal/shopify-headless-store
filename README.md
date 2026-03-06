# Shopify Headless Storefront — Reference Architecture

A modern, headless e-commerce storefront built to demonstrate composable commerce patterns using Next.js 14 and the Shopify Storefront API.

Live Demo: [shopify-headless-store.vercel.app](https://shopify-headless-store-git-fix-typech-cffc33-fredleals-projects.vercel.app/)

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
- **Testing:** Vitest + React Testing Library (161 tests)
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
```
