# Track D — SEO, Metadata & Documentation

## Context

**Project**: `shopify-headless-store` — a headless Shopify storefront built with Next.js 14 + Shopify Storefront API.
**Purpose**: Personal project demonstrating Shopify frontend expertise (job application for Frontend Shopify Engineer).
**Repo**: `github.com/fredleal/shopify-headless-store` (public)

The recruiter specifically asked about **SEO metadata**, **content previews**, and **Liquid auditing**. This track creates all the evidence for those questions.

## Stack (exact versions)

- Runtime: Bun (latest)
- Framework: Next.js 14.2.x (App Router)
- Language: TypeScript strict
- Styling: Tailwind CSS 3.4
- Testing: Vitest + happy-dom + @testing-library/react
- Linting: ESLint 9 (flat config) + Prettier
- Commits: Conventional Commits (@commitlint/config-conventional)

## MANDATORY Rules

1. NO Co-Authored-By, NO AI signatures in commits, code, or PRs
2. Validation BEFORE commit: `bun run build` -> `bun run lint` -> `bun run test`
3. Conventional commits: `feat|fix|refactor|test|chore|docs: description`
4. Named exports ONLY (never default export, except Next.js pages/routes which REQUIRE default export)
5. `'use client'` ONLY when hooks/events/browser APIs are used
6. Branch from `develop`, PR to `develop`
7. NEVER merge — create PR and STOP

## Your Branch

```
git checkout develop
git pull origin develop
git checkout -b feature/seo-and-docs
```

## Your Files (EXCLUSIVE OWNERSHIP)

You may ONLY create/modify files in:

- `src/lib/seo/metadata.ts`
- `src/lib/seo/metadata.test.ts`
- `src/lib/seo/json-ld.ts`
- `src/lib/seo/json-ld.test.ts`
- `src/components/atoms/JsonLd/JsonLd.tsx`
- `src/components/atoms/JsonLd/JsonLd.test.tsx`
- `src/app/sitemap.ts`
- `src/app/robots.ts`
- `docs/liquid-audit.md`
- `docs/architecture.md`
- `docs/hydrogen-comparison.md`

Do NOT touch any file outside this list.

## Important: Shopify Types (local stubs)

Since Track A creates the types in parallel, define local type stubs:

```typescript
// Stub types — will be replaced by imports from @/lib/shopify/types in Phase 2
interface ShopifyMoneyV2 {
  amount: string;
  currencyCode: string;
}

interface ShopifyImage {
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

interface Product {
  id: string;
  handle: string;
  title: string;
  description: string;
  featuredImage: ShopifyImage | null;
  priceRange: {
    minVariantPrice: ShopifyMoneyV2;
    maxVariantPrice: ShopifyMoneyV2;
  };
  seo: { title: string | null; description: string | null };
}

interface Collection {
  id: string;
  handle: string;
  title: string;
  description: string;
  image: ShopifyImage | null;
}
```

## Tasks

### D.1: Metadata Helpers

Create `src/lib/seo/metadata.ts`:

```typescript
import type { Metadata } from "next";

const SITE_NAME = "Shopify Headless Store";
const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://shopify-headless-store.vercel.app";

export function generateProductMetadata(product: Product): Metadata {
  const title = product.seo.title || product.title;
  const description = product.seo.description || product.description;

  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `${BASE_URL}/products/${product.handle}`,
      images: product.featuredImage
        ? [
            {
              url: product.featuredImage.url,
              width: product.featuredImage.width,
              height: product.featuredImage.height,
              alt: product.featuredImage.altText || title,
            },
          ]
        : [],
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: product.featuredImage ? [product.featuredImage.url] : [],
    },
  };
}

export function generateCollectionMetadata(collection: Collection): Metadata {
  return {
    title: `${collection.title} | ${SITE_NAME}`,
    description:
      collection.description || `Browse ${collection.title} collection`,
    openGraph: {
      title: collection.title,
      description: collection.description,
      type: "website",
      url: `${BASE_URL}/collections/${collection.handle}`,
      images: collection.image
        ? [
            {
              url: collection.image.url,
              width: collection.image.width,
              height: collection.image.height,
              alt: collection.image.altText || collection.title,
            },
          ]
        : [],
      siteName: SITE_NAME,
    },
  };
}

export function generateBaseMetadata(): Metadata {
  return {
    title: {
      default: SITE_NAME,
      template: `%s | ${SITE_NAME}`,
    },
    description: "Premium headless storefront powered by Next.js and Shopify",
    metadataBase: new URL(BASE_URL),
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "en_US",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
```

Create `src/lib/seo/metadata.test.ts`:

- Test that `generateProductMetadata` returns correct title, description, og tags
- Test fallback when seo fields are null
- Test image inclusion when featuredImage exists vs null

### D.2: JSON-LD Structured Data

Create `src/lib/seo/json-ld.ts`:

```typescript
export function generateProductJsonLd(product: Product, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.featuredImage?.url,
    url,
    offers: {
      "@type": "AggregateOffer",
      lowPrice: product.priceRange.minVariantPrice.amount,
      highPrice: product.priceRange.maxVariantPrice.amount,
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      availability: "https://schema.org/InStock",
    },
  };
}

export function generateBreadcrumbJsonLd(
  items: { name: string; url: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateCollectionJsonLd(collection: Collection, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: collection.title,
    description: collection.description,
    url,
  };
}
```

Create `src/lib/seo/json-ld.test.ts`:

- Test JSON-LD output structure
- Test Product schema matches schema.org spec
- Test BreadcrumbList positions

Create `src/components/atoms/JsonLd/JsonLd.tsx`:

```typescript
export interface JsonLdProps {
  data: Record<string, unknown>
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
```

Create `src/components/atoms/JsonLd/JsonLd.test.tsx`:

- Test renders script tag with type="application/ld+json"
- Test JSON content matches input data

### D.3: Sitemap + Robots

Create `src/app/sitemap.ts`:

```typescript
import type { MetadataRoute } from "next";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://shopify-headless-store.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/collections`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/cart`,
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 0.3,
    },
  ];

  // Dynamic routes will be added in Phase 2 (fetch products/collections from API)
  return staticRoutes;
}
```

Create `src/app/robots.ts`:

```typescript
import type { MetadataRoute } from "next";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://shopify-headless-store.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/cart", "/api/"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
```

### D.4: Content Preview (Draft Mode)

This task is optional for Phase 1. If time permits, set up Next.js draft mode:

- Create `src/app/api/draft/route.ts` for enabling/disabling draft mode
- Document how it works with Shopify preview URLs

If skipped, document the approach in `docs/architecture.md` instead.

**NOTE**: This file (`src/app/api/draft/route.ts`) is NOT in your ownership list. Skip implementation and document in architecture.md instead.

### D.5: Liquid Migration Audit Doc

Create `docs/liquid-audit.md`:

A comprehensive checklist for migrating Shopify Liquid themes to headless React. Include:

1. **Template mapping**: Liquid templates -> React components
   - `templates/product.liquid` -> `app/(store)/products/[handle]/page.tsx`
   - `templates/collection.liquid` -> `app/(store)/collections/[handle]/page.tsx`
   - `templates/index.liquid` -> `app/page.tsx`
   - `templates/cart.liquid` -> `app/cart/page.tsx`

2. **Liquid tag equivalents**:
   - `{{ product.title }}` -> `{product.title}`
   - `{% for variant in product.variants %}` -> `product.variants.map()`
   - `{{ product.price | money }}` -> `formatPrice()` helper
   - `{% if product.available %}` -> `{product.availableForSale && ...}`
   - `{{ 'image.png' | asset_url }}` -> `next/image` with CDN URL
   - `{% include 'snippet' %}` -> React component import
   - `{% section 'header' %}` -> `<StoreHeader />` component

3. **Liquid filter equivalents**:
   - `| money` -> `Intl.NumberFormat`
   - `| img_url: 'medium'` -> Shopify CDN URL transformation
   - `| date` -> `Intl.DateTimeFormat`
   - `| json` -> `JSON.stringify()`
   - `| escape` -> React auto-escapes by default
   - `| strip_html` -> DOM parser or regex

4. **Data access patterns**:
   - Liquid global objects (`shop`, `cart`, `customer`) -> API calls + React context
   - `forloop` variables -> `.map()` with index
   - `paginate` tag -> cursor-based pagination with Storefront API

5. **SEO considerations**:
   - Liquid `{% seo %}` tag -> Next.js `generateMetadata`
   - Schema.org markup -> JSON-LD component
   - Canonical URLs -> Next.js metadata

6. **Common gotchas**:
   - Liquid is server-rendered; React hydration mismatches
   - Shopify sections/blocks have no direct React equivalent
   - Customer accounts need separate auth flow
   - Checkout is always on Shopify (can't be headless)

### D.6: Architecture Doc

Create `docs/architecture.md`:

Document:

- Why Next.js 14 over Hydrogen (trade-offs)
- Project structure explanation
- Data flow: Storefront API -> GraphQL client -> reshaping -> components
- Rendering strategy: SSG for product pages, dynamic for cart
- Caching strategy with Next.js fetch cache + revalidation
- Image optimization with next/image + Shopify CDN
- Component architecture (Atomic Design)
- Testing strategy (unit for domain, component for UI, E2E for flows)
- Deployment (Vercel) + preview deploys
- Draft mode / content preview approach

### D.7: Hydrogen Comparison Doc

Create `docs/hydrogen-comparison.md`:

Side-by-side comparison:

1. **Project setup**: Hydrogen (Remix-based) vs Next.js
2. **Data fetching**: `useShopQuery` vs `graphql-request` + server components
3. **Cart management**: Hydrogen `CartProvider`/`useCart` vs custom hook + Server Actions
4. **Routing**: Hydrogen file routes vs Next.js App Router
5. **SEO**: Hydrogen `Seo` component vs Next.js `generateMetadata`
6. **Image handling**: Hydrogen `Image` component vs `next/image`
7. **Caching**: Hydrogen's built-in caching vs Next.js ISR/fetch cache
8. **Deployment**: Oxygen vs Vercel
9. **When to choose each**: decision matrix

For each comparison point, include brief code examples from both approaches.

## Validation

```bash
bun run build && bun run lint && bun run test
```

All must pass before committing.

## Commit & PR

```bash
git add src/lib/seo/ src/components/atoms/JsonLd/ src/app/sitemap.ts src/app/robots.ts docs/
git commit -m "feat: SEO helpers, structured data, and documentation"
git push origin feature/seo-and-docs
gh pr create --base develop --title "feat: SEO, metadata helpers, and documentation" --body "## Summary
- Metadata generators for products, collections, and base site
- JSON-LD structured data (Product, BreadcrumbList, CollectionPage)
- JsonLd component for script injection
- Sitemap and robots.ts
- Liquid migration audit doc (comprehensive Liquid -> React mapping)
- Architecture documentation
- Hydrogen vs Next.js comparison doc

## Test plan
- [ ] All SEO helper tests pass
- [ ] JSON-LD tests pass
- [ ] JsonLd component test passes
- [ ] Build succeeds (sitemap + robots generate)
- [ ] ESLint clean"
```

Then STOP. Do NOT merge.
