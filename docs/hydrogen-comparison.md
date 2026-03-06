# Hydrogen vs Next.js — Side-by-Side Comparison

A detailed comparison of Shopify Hydrogen (Remix-based) and Next.js 14 (App Router) for building headless Shopify storefronts. Each section includes code examples from both approaches.

## 1. Project Setup

### Hydrogen

```bash
npm create @shopify/hydrogen@latest -- --template demo-store
```

Hydrogen scaffolds a full Remix project pre-configured with Shopify:

```
app/
├── entry.client.tsx
├── entry.server.tsx
├── root.tsx
├── routes/
│   ├── ($locale)._index.tsx
│   ├── ($locale).products.$handle.tsx
│   └── ($locale).collections.$handle.tsx
└── components/
```

- Comes with Shopify-specific Remix conventions
- Built-in i18n routing via `$locale` param
- Pre-wired to Oxygen hosting

### Next.js

```bash
npx create-next-app@14 --typescript --tailwind --app
# Then manually add: graphql-request, Shopify types, API client
```

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── (store)/
│       ├── products/[handle]/page.tsx
│       └── collections/[handle]/page.tsx
├── lib/shopify/
│   ├── client.ts
│   ├── types.ts
│   └── queries/
└── components/
```

- Manual Shopify integration setup required
- Full control over project structure
- Any hosting provider works

**Verdict:** Hydrogen is faster to start if you're building exclusively for Shopify. Next.js requires more upfront setup but offers complete flexibility.

## 2. Data Fetching

### Hydrogen

```typescript
// app/routes/($locale).products.$handle.tsx
import { useLoaderData } from '@remix-run/react';
import { json, type LoaderFunctionArgs } from '@shopify/remix-oxygen';

export async function loader({ params, context }: LoaderFunctionArgs) {
  const { handle } = params;
  const { storefront } = context;

  const { product } = await storefront.query(PRODUCT_QUERY, {
    variables: { handle },
    cache: storefront.CacheLong(),
  });

  if (!product) throw new Response(null, { status: 404 });
  return json({ product });
}

export default function ProductPage() {
  const { product } = useLoaderData<typeof loader>();
  return <ProductDetail product={product} />;
}
```

- `context.storefront` is injected by Hydrogen's server runtime
- Cache strategies are predefined: `CacheLong()`, `CacheShort()`, `CacheNone()`
- Uses Remix loader pattern (server-side, typed)

### Next.js

```typescript
// src/app/(store)/products/[handle]/page.tsx
import { shopifyFetch } from '@/lib/shopify/client';
import { PRODUCT_QUERY } from '@/lib/shopify/queries/product';
import { notFound } from 'next/navigation';

interface ProductPageProps {
  params: { handle: string };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { product } = await shopifyFetch<ProductQueryResult>(PRODUCT_QUERY, {
    variables: { handle: params.handle },
    next: { revalidate: 900 },
  });

  if (!product) notFound();
  return <ProductDetail product={product} />;
}
```

- Custom `shopifyFetch` wrapper around `graphql-request`
- Native `fetch` cache options: `revalidate`, `cache`, `tags`
- Server Component — no hooks needed, data flows as props

**Verdict:** Hydrogen provides a more integrated experience with `context.storefront`. Next.js requires a custom client but gives finer cache control via standard `fetch` options.

## 3. Cart Management

### Hydrogen

```typescript
// Hydrogen provides CartProvider and hooks out of the box
import { CartForm, useCart } from '@shopify/hydrogen';

function AddToCartButton({ variantId }: { variantId: string }) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesAdd}
      inputs={{ lines: [{ merchandiseId: variantId, quantity: 1 }] }}
    >
      <button type="submit">Add to Cart</button>
    </CartForm>
  );
}

function CartCount() {
  const { totalQuantity } = useCart();
  return <span>{totalQuantity}</span>;
}
```

- `CartForm` handles mutations via Remix actions
- `useCart()` provides reactive cart state
- Built-in optimistic UI

### Next.js

```typescript
// src/actions/cart.ts — Server Action
"use server";

import { cookies } from "next/headers";
import { shopifyFetch } from "@/lib/shopify/client";
import { ADD_TO_CART_MUTATION } from "@/lib/shopify/queries/cart";

export async function addToCart(variantId: string) {
  const cartId = cookies().get("cartId")?.value;

  const { cartLinesAdd } = await shopifyFetch(ADD_TO_CART_MUTATION, {
    variables: {
      cartId,
      lines: [{ merchandiseId: variantId, quantity: 1 }],
    },
    cache: "no-store",
  });

  return cartLinesAdd.cart;
}
```

```typescript
// src/components/AddToCartButton.tsx
'use client';

import { addToCart } from '@/actions/cart';
import { useTransition } from 'react';

export function AddToCartButton({ variantId }: { variantId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => addToCart(variantId))}
      disabled={isPending}
    >
      {isPending ? 'Adding...' : 'Add to Cart'}
    </button>
  );
}
```

- Server Actions handle mutations (no API routes needed)
- Cart state via React Context + `useOptimistic` for optimistic UI
- Cookie-based cart ID persistence

**Verdict:** Hydrogen's cart system is turnkey — `CartForm` + `useCart` handles everything. Next.js requires building the cart infrastructure manually, but Server Actions provide a clean mutation pattern.

## 4. Routing

### Hydrogen

```
app/routes/
├── ($locale)._index.tsx          # Homepage (optional locale prefix)
├── ($locale).products._index.tsx # Products listing
├── ($locale).products.$handle.tsx # Product detail
├── ($locale).collections.$handle.tsx
├── ($locale).cart.tsx
├── ($locale).search.tsx
└── [sitemap.xml].tsx             # Dynamic sitemap
```

- Remix flat-file routing with dot notation
- Built-in locale prefix support via `$locale` param
- Convention: `_index` for index routes, `$param` for dynamic segments

### Next.js

```
src/app/
├── page.tsx                       # Homepage
├── sitemap.ts                     # Sitemap (convention file)
├── robots.ts                      # Robots (convention file)
├── cart/page.tsx                   # Cart
└── (store)/                       # Route group (no URL segment)
    ├── products/
    │   ├── page.tsx               # Products listing
    │   └── [handle]/page.tsx      # Product detail
    ├── collections/
    │   └── [handle]/page.tsx      # Collection page
    └── search/page.tsx            # Search
```

- Directory-based routing with folder nesting
- Route groups `(store)` for layout organization without URL impact
- `[handle]` for dynamic segments, `[...slug]` for catch-all
- Convention files: `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`

**Verdict:** Both use file-system routing. Hydrogen's flat structure is simpler; Next.js's nested structure provides better co-location of layouts and loading states.

## 5. SEO

### Hydrogen

```typescript
// Hydrogen Seo component
import { Seo } from '@shopify/hydrogen';

export default function ProductPage() {
  const { product } = useLoaderData();

  return (
    <>
      <Seo
        type="product"
        data={{
          title: product.title,
          description: product.description,
          media: product.media,
          vendor: product.vendor,
        }}
      />
      <ProductDetail product={product} />
    </>
  );
}
```

- `<Seo>` component generates meta tags and JSON-LD automatically
- Type-aware: `type="product"` generates Product schema
- Injects into `<head>` via Remix's `meta` export

### Next.js

```typescript
// src/app/(store)/products/[handle]/page.tsx
import type { Metadata } from 'next';
import { generateProductMetadata } from '@/lib/seo/metadata';
import { generateProductJsonLd } from '@/lib/seo/json-ld';
import { JsonLd } from '@/components/atoms/JsonLd/JsonLd';

export async function generateMetadata({ params }): Promise<Metadata> {
  const { product } = await fetchProduct(params.handle);
  return generateProductMetadata(product);
}

export default async function ProductPage({ params }) {
  const { product } = await fetchProduct(params.handle);
  const jsonLd = generateProductJsonLd(product, `/products/${params.handle}`);

  return (
    <>
      <JsonLd data={jsonLd} />
      <ProductDetail product={product} />
    </>
  );
}
```

- `generateMetadata` is a Next.js convention — returns typed `Metadata` object
- JSON-LD generated via custom helpers and injected via `<script>` tag
- Full control over every meta tag

**Verdict:** Hydrogen's `<Seo>` is more concise and auto-generates schema markup. Next.js requires more code but provides granular control over every meta tag. For SEO-heavy sites, Next.js's explicit approach is easier to audit and customize.

## 6. Image Handling

### Hydrogen

```typescript
import { Image } from '@shopify/hydrogen';

function ProductImage({ image }) {
  return (
    <Image
      data={image}
      aspectRatio="1/1"
      sizes="(min-width: 45em) 50vw, 100vw"
      crop="center"
    />
  );
}
```

- Hydrogen `<Image>` accepts Shopify `Image` objects directly
- Automatic Shopify CDN URL transforms
- Built-in aspect ratio and crop support

### Next.js

```typescript
import Image from 'next/image';

function ProductImage({ image }: { image: ShopifyImage }) {
  return (
    <Image
      src={image.url}
      alt={image.altText || ''}
      width={image.width}
      height={image.height}
      sizes="(min-width: 45em) 50vw, 100vw"
      className="object-cover aspect-square"
      priority={false}
    />
  );
}
```

- `next/image` handles format conversion (WebP/AVIF), srcset, and lazy loading
- Requires explicit `width`/`height` or `fill` prop
- Shopify CDN configured in `next.config.mjs` `remotePatterns`

**Verdict:** Hydrogen's `<Image>` has tighter Shopify integration. `next/image` is more general-purpose and provides automatic format optimization regardless of CDN.

## 7. Caching

### Hydrogen

```typescript
// Built-in cache strategies
const { product } = await storefront.query(PRODUCT_QUERY, {
  variables: { handle },
  cache: storefront.CacheLong(), // max-age=3600, stale-while-revalidate=82800
});

// Or custom
const { cart } = await storefront.query(CART_QUERY, {
  variables: { cartId },
  cache: storefront.CacheNone(), // no-store
});
```

- Predefined strategies: `CacheLong()`, `CacheShort()`, `CacheNone()`, `CacheCustom()`
- Backed by Oxygen's CDN cache (Cache API at the edge)
- Sub-request caching per query

### Next.js

```typescript
// Fetch-level caching
const product = await shopifyFetch(PRODUCT_QUERY, {
  variables: { handle },
  next: { revalidate: 3600, tags: ["products"] },
});

// No cache for mutations
const cart = await shopifyFetch(CART_MUTATION, {
  variables: { cartId, lines },
  cache: "no-store",
});

// On-demand revalidation (e.g., from a webhook)
// revalidateTag('products');
// revalidatePath('/products/' + handle);
```

- Native `fetch` options integrated with Next.js cache
- Tag-based revalidation via `revalidateTag()`
- Path-based revalidation via `revalidatePath()`
- ISR for page-level caching

**Verdict:** Hydrogen's cache strategies are simpler (3 predefined levels). Next.js provides more granular control with tags, per-fetch revalidation, and ISR. For complex caching needs, Next.js is more powerful.

## 8. Deployment

### Hydrogen → Oxygen

```bash
npx shopify hydrogen deploy
```

- Oxygen is Shopify's edge hosting platform
- Automatic deployment from Shopify CLI
- Integrated with Shopify admin (manage from same dashboard)
- Worker-based runtime (similar to Cloudflare Workers)
- Free for Shopify Plus merchants

### Next.js → Vercel

```bash
vercel deploy
# Or: git push (auto-deploys with Vercel Git integration)
```

- Vercel is optimized for Next.js (same team)
- Preview deploys per PR
- Edge Functions + Serverless Functions
- Built-in analytics and Web Vitals
- Also deployable to: AWS (SST/Amplify), Docker, Node.js server

**Verdict:** Oxygen is free for Plus merchants and deeply integrated with Shopify admin. Vercel is the best Next.js host and works for any project, not just Shopify. For non-Plus stores, Vercel is the clear choice.

## 9. Decision Matrix — When to Choose Each

| Scenario                             | Recommendation | Why                                               |
| ------------------------------------ | -------------- | ------------------------------------------------- |
| **Shopify Plus store, new build**    | Hydrogen       | Free Oxygen hosting, tightest integration         |
| **Non-Plus Shopify store**           | Next.js        | Vercel/any host, no Oxygen access                 |
| **Team knows React but not Remix**   | Next.js        | Lower learning curve                              |
| **Multi-vendor / headless CMS**      | Next.js        | Not locked to Shopify patterns                    |
| **Need SSG for SEO**                 | Next.js        | Better static generation support                  |
| **Rapid Shopify prototype**          | Hydrogen       | Fastest time-to-market with demo-store template   |
| **Complex caching requirements**     | Next.js        | Tag-based, path-based, fetch-level control        |
| **Multiple sales channels**          | Next.js        | Single frontend, multiple backends                |
| **Existing Next.js codebase**        | Next.js        | Add Shopify as a data source                      |
| **Want Shopify theme editor parity** | Neither        | Use Liquid themes with custom storefront fallback |

## Summary

Both Hydrogen and Next.js are production-ready for headless Shopify. Hydrogen excels in Shopify-specific DX (cart, auth, caching primitives); Next.js excels in flexibility, ecosystem, and deployment options. This project uses Next.js to demonstrate proficiency with industry-standard tools while maintaining full Shopify Storefront API integration.
