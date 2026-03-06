# Implementation Plan — Shopify Headless Store

## Phase 0: Foundation

- [x] Task 0.2: Repo init + config base
- [x] Task 0.3: CI/CD (GitHub Actions)
- [ ] Task 0.4: Vercel setup (manual)
- [ ] Task 0.5: Branch protection (manual)

## Phase 1: Track A — Shopify Storefront API Layer

Branch: `feature/shopify-api-layer`

- [ ] A.1: Shopify GraphQL client tipado (`src/lib/shopify/client.ts`)
- [ ] A.2: Types Storefront API + reshaping (`src/lib/shopify/types.ts`)
- [ ] A.3: Queries: products, collections (`src/lib/shopify/queries/`)
- [ ] A.4: Queries: cart (create, add, remove, update) (`src/lib/shopify/queries/cart.ts`)
- [ ] A.5: Domain logic TDD: price formatting, cart calc (`src/lib/domain/`)
- [ ] A.6: Test mocks for other tracks (`src/test/mocks/shopify/`)
- [ ] A.7: Hydrogen patterns comparison (`src/lib/shopify/hydrogen-patterns/`)

## Phase 1: Track B — Product Pages + UI Components

Branch: `feature/product-pages`

- [ ] B.1: Layout shell (Header/Footer)
- [ ] B.2: ProductCard adapted from template
- [ ] B.3: PriceDisplay atom
- [ ] B.4: Product list page (/products)
- [ ] B.5: Product detail page (/products/[handle])
- [ ] B.6: VariantSelector + OptionButton
- [ ] B.7: Collection pages
- [ ] B.8: Component tests

## Phase 1: Track C — Cart + Checkout

Branch: `feature/cart-system`

- [ ] C.1: useCart hook (Shopify Cart API state)
- [ ] C.2: Server Actions for cart mutations
- [ ] C.3: CartLineItem molecule
- [ ] C.4: CartSummary molecule
- [ ] C.5: Cart page
- [ ] C.6: Checkout redirect (Shopify hosted)
- [ ] C.7: Cart tests

## Phase 1: Track D — SEO, Metadata & Documentation

Branch: `feature/seo-and-docs`

- [x] D.1: Metadata helpers (generateProductMetadata, etc)
- [x] D.2: JSON-LD structured data (Product, BreadcrumbList)
- [x] D.3: Sitemap + robots.ts
- [ ] D.4: Content preview (Next.js draft mode) — skipped for Phase 1, documented in architecture.md
- [x] D.5: Liquid migration audit doc
- [x] D.6: Architecture doc
- [x] D.7: Hydrogen comparison doc

## Phase 2: Integration

Branch: `feature/integration`

- [ ] INT.1: Connect pages (Track B) with real API (Track A)
- [ ] INT.2: Connect cart actions (Track C) with API (Track A)
- [ ] INT.3: Apply SEO metadata (Track D) to pages (Track B)
- [ ] INT.4: Home page: featured collection + product grid
- [ ] INT.5: E2E tests with Playwright
- [ ] INT.6: Smoke test on Vercel preview
