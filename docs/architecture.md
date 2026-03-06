# Architecture — Shopify Headless Store

## Overview

A headless Shopify storefront built with Next.js 14 (App Router) and the Shopify Storefront API. This project demonstrates how to decouple the frontend from Shopify's monolithic Liquid theme engine while retaining full e-commerce functionality.

## Why Next.js 14 over Hydrogen

| Factor                      | Hydrogen (Remix)                    | Next.js 14                               | Our Choice                     |
| --------------------------- | ----------------------------------- | ---------------------------------------- | ------------------------------ |
| **Ecosystem**               | Shopify-specific, smaller community | Massive ecosystem, broad adoption        | Next.js                        |
| **Hosting**                 | Optimized for Oxygen (Shopify CDN)  | Vercel, AWS, self-hosted, any Node host  | Next.js (flexibility)          |
| **Data fetching**           | `useShopQuery`, loader-based        | Server Components + `fetch` with caching | Next.js (simpler mental model) |
| **Routing**                 | File-based (Remix conventions)      | File-based (App Router conventions)      | Next.js (more mature)          |
| **React Server Components** | Partial support (Remix model)       | First-class support                      | Next.js                        |
| **Static Generation**       | Limited (SSR-focused)               | Full SSG + ISR + dynamic                 | Next.js (better for SEO)       |
| **Image optimization**      | `<Image>` component (Shopify CDN)   | `next/image` (automatic optimization)    | Next.js                        |
| **Caching**                 | Built-in (Oxygen cache API)         | ISR + fetch cache + revalidation         | Next.js (more granular)        |
| **Learning curve**          | Shopify-specific patterns           | Industry-standard React                  | Next.js (transferable skills)  |
| **Customization**           | Opinionated, Shopify-locked         | Fully flexible                           | Next.js                        |

**Decision rationale:** Next.js provides a more portable, industry-standard architecture. Skills transfer across projects. Vercel deployment gives preview deploys, edge functions, and analytics out of the box. The tradeoff is losing Hydrogen's Shopify-specific optimizations (e.g., Oxygen caching, built-in cart hooks), which we replicate manually.

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (HTML shell, providers)
│   ├── page.tsx                  # Homepage
│   ├── sitemap.ts                # Dynamic sitemap generation
│   ├── robots.ts                 # Robots.txt configuration
│   ├── globals.css               # Tailwind base + CSS custom properties
│   ├── cart/
│   │   └── page.tsx              # Cart page
│   └── (store)/                  # Route group for store pages
│       ├── products/
│       │   └── [handle]/
│       │       └── page.tsx      # Product detail page (SSG)
│       └── collections/
│           └── [handle]/
│               └── page.tsx      # Collection page (ISR)
│
├── components/                   # Atomic Design hierarchy
│   ├── atoms/                    # Smallest UI primitives
│   │   ├── JsonLd/               # JSON-LD structured data injector
│   │   ├── PriceDisplay/         # Formatted price display
│   │   └── OptionButton/         # Variant option selector button
│   ├── molecules/                # Composed atom groups
│   │   └── ProductCard/          # Product card (image + title + price)
│   └── organisms/                # Complex UI sections
│       └── ProductGrid/          # Grid layout of ProductCards
│
├── lib/                          # Pure logic and API layer
│   ├── shopify/                  # Shopify Storefront API integration
│   │   ├── client.ts             # graphql-request client setup
│   │   ├── types.ts              # TypeScript types matching API schema
│   │   ├── queries/              # GraphQL query strings
│   │   └── hydrogen-patterns/    # Patterns inspired by Hydrogen
│   ├── domain/                   # Pure business logic (TDD)
│   │   └── price.ts              # Price formatting, comparison
│   └── seo/                      # SEO utilities
│       ├── metadata.ts           # Next.js Metadata generators
│       └── json-ld.ts            # Schema.org JSON-LD generators
│
├── hooks/                        # Client-side React hooks
│   └── useCart.ts                # Cart state management hook
│
├── actions/                      # Server Actions
│   └── cart.ts                   # Cart mutations (add, update, remove)
│
└── test/                         # Test configuration
    └── setup.ts                  # Vitest + Testing Library setup
```

## Data Flow

```
┌─────────────┐     GraphQL      ┌──────────────────┐     Reshaping     ┌────────────────┐
│  Storefront  │ ──────────────► │  graphql-request  │ ────────────────► │   Typed Data    │
│     API      │   queries/*.ts  │    client.ts      │   types.ts        │   (Product,     │
│  (Shopify)   │                 │                   │                   │    Collection)  │
└─────────────┘                  └──────────────────┘                    └───────┬────────┘
                                                                                │
                                                                                ▼
                                                                    ┌────────────────────┐
                                                                    │  Server Components  │
                                                                    │    (pages/*.tsx)    │
                                                                    │                    │
                                                                    │  - Fetch data      │
                                                                    │  - Generate meta   │
                                                                    │  - Render UI       │
                                                                    └────────────────────┘
```

1. **Storefront API** — Shopify's public GraphQL API. Accessed with a storefront access token (public, not secret).
2. **graphql-request client** — Lightweight GraphQL client configured with the store domain and access token from environment variables.
3. **Type reshaping** — Raw API responses are mapped to clean TypeScript interfaces. Edge/node structures from Relay-style pagination are flattened.
4. **Server Components** — Next.js pages fetch data at request time (or build time for SSG). No client-side data fetching for product/collection pages.
5. **Client Components** — Only used for interactive features: cart drawer, variant selector, quantity controls.

## Rendering Strategy

| Page Type      | Strategy      | Revalidation             | Rationale                      |
| -------------- | ------------- | ------------------------ | ------------------------------ |
| Homepage       | SSG + ISR     | `revalidate: 3600` (1h)  | Content changes infrequently   |
| Product Detail | SSG + ISR     | `revalidate: 900` (15m)  | Price/availability may change  |
| Collection     | ISR           | `revalidate: 1800` (30m) | Product additions are periodic |
| Cart           | Dynamic (SSR) | No cache                 | Must reflect real-time state   |
| Search         | Dynamic (SSR) | No cache                 | Query-dependent results        |

**Why not full SSG?** Shopify stores have dynamic inventory. ISR (Incremental Static Regeneration) provides the best balance: static performance with periodic freshness.

**`generateStaticParams`** is used for product and collection pages to pre-render popular items at build time. Less-visited pages are generated on-demand and cached.

## Caching Strategy

### Next.js Fetch Cache

```typescript
// Product page — cache for 15 minutes, serve stale while revalidating
const product = await shopifyFetch<ProductQuery>(PRODUCT_QUERY, {
  variables: { handle },
  next: { revalidate: 900 },
});

// Cart operations — never cache
const cart = await shopifyFetch<CartQuery>(CART_QUERY, {
  variables: { cartId },
  cache: "no-store",
});
```

### Cache Hierarchy

1. **Build-time (SSG):** Pages pre-rendered during `next build`
2. **ISR cache:** Stale pages served immediately, regenerated in background
3. **Fetch-level cache:** Individual API calls cached by Next.js
4. **CDN cache (Vercel):** Edge caching for static assets and ISR pages

### Cache Invalidation

- **Time-based:** ISR `revalidate` intervals per page type
- **On-demand:** Shopify webhooks can trigger `revalidatePath()` or `revalidateTag()` for inventory changes
- **Manual:** Admin API can be used to trigger revalidation programmatically

## Image Optimization

```typescript
// next.config.mjs
{
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        pathname: '/s/files/**',
      },
    ],
  },
}
```

- **Source:** Shopify CDN (`cdn.shopify.com`) serves original images
- **Optimization:** `next/image` automatically generates WebP/AVIF, responsive srcsets, and lazy-loads
- **Sizing:** Shopify CDN supports URL-based transforms (`?width=400&height=400&crop=center`)
- **Priority:** Hero images use `priority` prop to disable lazy loading (improves LCP)

## Component Architecture (Atomic Design)

### Atoms

Smallest, reusable UI elements. No business logic. Accept props for content and variants.

```typescript
// Example: PriceDisplay atom
export function PriceDisplay({ amount, currencyCode }: PriceDisplayProps) {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(parseFloat(amount));

  return <span className="text-lg font-semibold">{formatted}</span>;
}
```

### Molecules

Composed atoms forming a functional unit. May have minimal internal state.

```typescript
// Example: ProductCard molecule (combines Image atom + PriceDisplay atom)
export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.handle}`}>
      <Image src={product.featuredImage.url} alt={product.title} ... />
      <h3>{product.title}</h3>
      <PriceDisplay {...product.priceRange.minVariantPrice} />
    </Link>
  );
}
```

### Organisms

Complex sections combining multiple molecules. May connect to data sources.

```typescript
// Example: ProductGrid organism
export function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### Design System Rules

- **No component libraries** — All components are custom-built (no shadcn, Radix, or Headless UI)
- **CSS variables** — Theming via CSS custom properties with Tailwind fallbacks: `bg-[var(--color-primary-500,#3b82f6)]`
- **Object-map variants** — Variant styles use object maps, not if/else chains
- **Named exports only** — No default exports (except Next.js pages/routes which require them)

## Testing Strategy

### Unit Tests (Vitest)

Target: `src/lib/domain/` and `src/lib/seo/`

- Pure functions with no side effects
- TDD approach for domain logic (write test first)
- Price formatting, cart calculations, metadata generation

### Component Tests (Vitest + Testing Library)

Target: `src/components/`

- Render components in isolation with mock props
- Test user-visible output, not implementation details
- Use `@testing-library/react` for DOM queries

### End-to-End Tests (Playwright)

Target: Critical user flows

- Product browsing → add to cart → checkout redirect
- Collection navigation and filtering
- Search functionality
- Mobile responsive behavior

### Test Commands

```bash
bun run test              # Run all Vitest tests
bun run test:watch        # Watch mode for development
bun run test:coverage     # Coverage report
bun run test:e2e          # Playwright E2E tests
```

## Deployment

### Vercel (Primary)

- **Production:** Deploys from `main` branch
- **Preview:** Every PR gets a unique preview URL
- **Environment variables:** Shopify credentials configured in Vercel dashboard
- **Edge functions:** API routes run at the edge for low latency
- **Analytics:** Web Vitals monitoring built-in

### Environment Variables

```bash
SHOPIFY_STOREFRONT_ACCESS_TOKEN=   # Public storefront access token
SHOPIFY_STORE_DOMAIN=              # e.g., store-name.myshopify.com
NEXT_PUBLIC_SITE_URL=              # Production URL for SEO metadata
```

### Preview Deploys

Every pull request to `develop` triggers a Vercel preview deploy. This enables:

- Visual review of UI changes before merging
- Functional testing on a real URL
- Shareable links for stakeholder review

## Content Preview / Draft Mode

### Approach (Phase 2)

Next.js Draft Mode allows previewing unpublished Shopify content:

1. **Enable endpoint:** `GET /api/draft?secret=<token>` sets a draft cookie
2. **Disable endpoint:** `GET /api/draft/disable` clears the cookie
3. **Page detection:** `draftMode()` in Server Components checks the cookie
4. **Data fetching:** When draft mode is active, fetch with `@previewable` directive or use the Admin API for unpublished products

### Shopify Integration

- Shopify's Online Store preview URLs can be mapped to the headless frontend
- Configure Shopify admin to redirect previews to `https://site.com/api/draft?secret=TOKEN&handle=PRODUCT_HANDLE`
- Draft mode serves the latest content without ISR caching (`cache: 'no-store'`)

This feature is documented here for Phase 2 implementation. The draft route handler (`src/app/api/draft/route.ts`) is owned by a separate track.
