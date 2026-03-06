# Liquid to Headless React — Migration Audit

A comprehensive checklist for migrating Shopify Liquid themes to a headless React storefront (Next.js 14 + Storefront API).

## 1. Template Mapping

| Liquid Template                | Headless Equivalent                          | Notes                                              |
| ------------------------------ | -------------------------------------------- | -------------------------------------------------- |
| `templates/index.liquid`       | `app/page.tsx`                               | Server Component, fetches featured collections     |
| `templates/product.liquid`     | `app/(store)/products/[handle]/page.tsx`     | Dynamic route with `generateMetadata`              |
| `templates/collection.liquid`  | `app/(store)/collections/[handle]/page.tsx`  | Cursor-based pagination replaces Liquid paginate   |
| `templates/cart.liquid`        | `app/cart/page.tsx`                          | Client-side state + Server Actions for mutations   |
| `templates/page.liquid`        | `app/(store)/pages/[handle]/page.tsx`        | Fetch via Storefront API `page` query              |
| `templates/blog.liquid`        | `app/(store)/blog/[handle]/page.tsx`         | Articles fetched via `articles` query              |
| `templates/article.liquid`     | `app/(store)/blog/[blog]/[article]/page.tsx` | Nested dynamic route                               |
| `templates/search.liquid`      | `app/(store)/search/page.tsx`                | Uses `predictiveSearch` or `search` query          |
| `templates/404.liquid`         | `app/not-found.tsx`                          | Next.js convention file                            |
| `templates/customers/*.liquid` | External auth flow                           | Customer accounts need separate auth (see gotchas) |
| `layout/theme.liquid`          | `app/layout.tsx`                             | Root layout with header/footer components          |
| `layout/checkout.liquid`       | N/A                                          | Checkout stays on Shopify domain                   |

## 2. Liquid Tag Equivalents

### Output Tags

| Liquid                                              | React/JSX                                                               | Example                                       |
| --------------------------------------------------- | ----------------------------------------------------------------------- | --------------------------------------------- |
| `{{ product.title }}`                               | `{product.title}`                                                       | Direct interpolation                          |
| `{{ product.description }}`                         | `<div dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />` | HTML content requires dangerouslySetInnerHTML |
| `{{ product.price \| money }}`                      | `{formatPrice(product.priceRange.minVariantPrice)}`                     | Custom formatter using `Intl.NumberFormat`    |
| `{{ product.featured_image \| img_url: 'medium' }}` | `<Image src={product.featuredImage.url} ... />`                         | `next/image` with Shopify CDN URL             |

### Control Flow Tags

| Liquid                                      | React/JSX                                    |
| ------------------------------------------- | -------------------------------------------- |
| `{% if product.available %}`                | `{product.availableForSale && (...)}`        |
| `{% unless product.available %}`            | `{!product.availableForSale && (...)}`       |
| `{% for variant in product.variants %}`     | `{product.variants.map((variant) => (...))}` |
| `{% case product.type %}{% when 'shirt' %}` | Switch statement or object-map pattern       |
| `{% if forloop.first %}`                    | `{index === 0 && (...)}`                     |
| `{% if forloop.last %}`                     | `{index === array.length - 1 && (...)}`      |

### Include/Render Tags

| Liquid                                       | React                                                              |
| -------------------------------------------- | ------------------------------------------------------------------ |
| `{% include 'product-card' %}`               | `import { ProductCard } from '@/components/molecules/ProductCard'` |
| `{% render 'icon-cart' %}`                   | `import { CartIcon } from '@/components/atoms/CartIcon'`           |
| `{% section 'header' %}`                     | `<StoreHeader />` component in layout                              |
| `{% section 'footer' %}`                     | `<StoreFooter />` component in layout                              |
| `{% render 'product-card', product: item %}` | `<ProductCard product={item} />`                                   |

### Form Tags

| Liquid                          | React                                               |
| ------------------------------- | --------------------------------------------------- |
| `{% form 'product', product %}` | `<form action={addToCartAction}>` (Server Action)   |
| `{% form 'cart' %}`             | Cart mutations via Storefront API `cartLinesUpdate` |
| `{% form 'customer_login' %}`   | External auth provider or Customer Account API      |

## 3. Liquid Filter Equivalents

| Liquid Filter                 | Headless Equivalent           | Implementation                                                           |
| ----------------------------- | ----------------------------- | ------------------------------------------------------------------------ |
| `\| money`                    | `formatPrice()`               | `new Intl.NumberFormat('en-US', { style: 'currency', currency: code })`  |
| `\| money_with_currency`      | `formatPrice()` with currency | Same as above — `Intl.NumberFormat` includes currency symbol             |
| `\| img_url: 'medium'`        | Shopify CDN URL transform     | Append `_medium` or use width param: `url?width=400`                     |
| `\| img_url: '300x300'`       | `next/image` sizing           | `<Image width={300} height={300} />` with Shopify CDN                    |
| `\| date: '%B %d, %Y'`        | `Intl.DateTimeFormat`         | `new Intl.DateTimeFormat('en-US', { dateStyle: 'long' })`                |
| `\| json`                     | `JSON.stringify()`            | Used in JSON-LD and data attributes                                      |
| `\| escape`                   | Auto-escaped by React         | JSX escapes strings by default                                           |
| `\| strip_html`               | DOMParser or sanitize         | `new DOMParser().parseFromString(html, 'text/html').body.textContent`    |
| `\| handleize`                | `slugify()` helper            | `str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-\|-$)/g, '')` |
| `\| pluralize`                | Conditional logic             | `count === 1 ? 'item' : 'items'`                                         |
| `\| truncate: 100`            | `string.slice(0, 100)`        | `str.length > 100 ? str.slice(0, 100) + '...' : str`                     |
| `\| split: ','`               | `string.split(',')`           | Native JS                                                                |
| `\| upcase`                   | `string.toUpperCase()`        | Native JS                                                                |
| `\| downcase`                 | `string.toLowerCase()`        | Native JS                                                                |
| `\| replace: 'foo', 'bar'`    | `string.replace()`            | Native JS                                                                |
| `\| append: '.js'`            | Template literal              | `` `${str}.js` ``                                                        |
| `\| default: 'N/A'`           | Nullish coalescing            | `value ?? 'N/A'`                                                         |
| `\| size`                     | `.length`                     | Native JS property                                                       |
| `\| sort`                     | `Array.sort()`                | Native JS                                                                |
| `\| where: 'available', true` | `Array.filter()`              | `variants.filter(v => v.availableForSale)`                               |
| `\| first`                    | `array[0]`                    | Or `array.at(0)`                                                         |
| `\| last`                     | `array.at(-1)`                | ES2022 `.at()` method                                                    |

## 4. Data Access Patterns

### Global Objects

| Liquid Global      | Headless Equivalent         | Access Pattern                                  |
| ------------------ | --------------------------- | ----------------------------------------------- |
| `shop`             | Storefront API `shop` query | Server Component fetch at layout level          |
| `cart`             | Storefront API Cart API     | React Context (`CartProvider`) + Server Actions |
| `customer`         | Customer Account API        | Auth context + protected routes                 |
| `product`          | `product(handle:)` query    | Fetched in `page.tsx` via `params.handle`       |
| `collection`       | `collection(handle:)` query | Fetched in `page.tsx` via `params.handle`       |
| `collections`      | `collections(first:)` query | Server Component fetch                          |
| `all_products`     | Not available               | Use `products(first:)` query instead            |
| `request`          | `headers()` / `cookies()`   | Next.js server-side functions                   |
| `template`         | Route segment               | Determined by file-system routing               |
| `canonical_url`    | `generateMetadata`          | Set via Next.js metadata API                    |
| `page_title`       | `generateMetadata`          | Set via Next.js metadata API                    |
| `page_description` | `generateMetadata`          | Set via Next.js metadata API                    |

### Loop Variables

| Liquid `forloop` | JavaScript/React Equivalent            |
| ---------------- | -------------------------------------- |
| `forloop.index`  | `index + 1` (inside `.map()` callback) |
| `forloop.index0` | `index` (inside `.map()` callback)     |
| `forloop.first`  | `index === 0`                          |
| `forloop.last`   | `index === array.length - 1`           |
| `forloop.length` | `array.length`                         |
| `forloop.rindex` | `array.length - index`                 |

### Pagination

| Liquid                                     | Headless                                        |
| ------------------------------------------ | ----------------------------------------------- |
| `{% paginate collection.products by 12 %}` | Cursor-based pagination with `after` / `before` |
| `paginate.pages`                           | Compute from `pageInfo.hasNextPage`             |
| `paginate.next.url`                        | Pass `endCursor` as search param                |
| `paginate.previous.url`                    | Pass `startCursor` as search param              |

**Example — Storefront API pagination:**

```graphql
query CollectionProducts($handle: String!, $first: Int!, $after: String) {
  collection(handle: $handle) {
    products(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          handle
          title
        }
      }
    }
  }
}
```

## 5. SEO Considerations

| Liquid SEO                        | Headless Equivalent             | Implementation                                  |
| --------------------------------- | ------------------------------- | ----------------------------------------------- |
| `{% seo %}` tag                   | `generateMetadata()`            | Next.js Metadata API in each `page.tsx`         |
| `canonical_url`                   | `metadata.alternates.canonical` | Set in `generateMetadata` return                |
| `<title>{{ page_title }}</title>` | `metadata.title`                | Automatic via Metadata API                      |
| `<meta name="description">`       | `metadata.description`          | Automatic via Metadata API                      |
| `og:image` / `og:title`           | `metadata.openGraph`            | Configured in metadata helpers                  |
| `twitter:card`                    | `metadata.twitter`              | Configured in metadata helpers                  |
| Schema.org JSON-LD                | `<JsonLd data={...} />`         | Custom component with `dangerouslySetInnerHTML` |
| `<link rel="canonical">`          | Automatic                       | Next.js generates from `metadataBase`           |
| Hreflang tags                     | `metadata.alternates.languages` | For multi-language stores                       |
| `robots.txt` (theme asset)        | `app/robots.ts`                 | Next.js convention file                         |
| `sitemap.xml` (Shopify auto)      | `app/sitemap.ts`                | Next.js convention file with dynamic routes     |

## 6. Common Gotchas

### Rendering Model

- **Liquid is fully server-rendered.** Every page is HTML from Shopify's servers.
- **React hydration mismatches** occur when server HTML differs from client render. Use `suppressHydrationWarning` sparingly; prefer consistent rendering.
- **Server Components** (default in Next.js App Router) are the closest analog to Liquid templates — they render on the server and send HTML.
- **Client Components** (`'use client'`) should only be used for interactivity (cart drawer, variant selectors, quantity inputs).

### Sections and Blocks

- Shopify **sections** and **blocks** enable merchant customization via the Theme Editor. There is no direct React equivalent.
- For headless, consider a CMS integration (Shopify Metafields, Sanity, Contentful) to replicate section-level customization.
- Alternatively, build a configuration system using Shopify Metafields + Metaobjects.

### Checkout

- **Checkout cannot be made headless.** Shopify enforces checkout on their domain.
- Use `cartCreate` / `cartLinesAdd` mutations to build the cart, then redirect to `cart.checkoutUrl`.
- Shopify Plus merchants can use Checkout Extensibility (not full headless checkout).

### Customer Accounts

- Liquid `{% form 'customer_login' %}` uses Shopify's built-in auth.
- Headless requires the **Customer Account API** (OAuth 2.0 flow) or **Multipass** (Shopify Plus).
- Session management must be handled separately (cookies, JWT).

### Asset Pipeline

- Liquid `{{ 'style.css' | asset_url }}` references files in `assets/` directory.
- Headless uses standard bundler (webpack/turbopack via Next.js).
- Shopify CDN URLs for product images remain the same — just use the `url` field from Storefront API.

### Forms and AJAX

- Liquid forms (`/cart/add`, `/cart/update`) use Shopify's AJAX API.
- Headless uses **Storefront API mutations** (`cartLinesAdd`, `cartLinesUpdate`, `cartLinesRemove`).
- Server Actions in Next.js provide a clean pattern for form submissions without client-side fetch.

### Money Formatting

- Liquid `| money` uses the store's configured format.
- Headless must replicate this with `Intl.NumberFormat` using the currency code from the API response.
- The Storefront API returns `MoneyV2` (`{ amount: string, currencyCode: string }`).

### Metafields

- Liquid accesses metafields via `product.metafields.namespace.key`.
- Storefront API requires explicit metafield queries: `metafield(namespace: "...", key: "...")`.
- Metafields must be exposed to the Storefront API in Shopify admin settings.

## Migration Checklist

- [ ] Map all Liquid templates to Next.js routes
- [ ] Replace Liquid output tags with JSX interpolation
- [ ] Convert `{% for %}` loops to `.map()` calls
- [ ] Replace Liquid filters with JavaScript/TypeScript equivalents
- [ ] Convert forms to Server Actions + Storefront API mutations
- [ ] Implement `generateMetadata` for all page types
- [ ] Add JSON-LD structured data for products and collections
- [ ] Set up `sitemap.ts` and `robots.ts`
- [ ] Configure `next/image` for Shopify CDN images
- [ ] Implement cart state management (Context + Server Actions)
- [ ] Handle customer auth (if applicable)
- [ ] Test checkout redirect flow
- [ ] Verify SEO parity with Liquid theme (meta tags, schema, canonicals)
- [ ] Performance audit: compare LCP/FID/CLS with original theme
