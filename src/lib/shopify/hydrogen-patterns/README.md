# Hydrogen Patterns — Next.js Equivalents

This directory documents how our Next.js implementation maps to Shopify Hydrogen patterns. Each section shows the Hydrogen approach alongside our equivalent.

## Data Fetching

### Hydrogen

```typescript
// Hydrogen uses context.storefront injected by the runtime
export async function loader({ params, context }: LoaderFunctionArgs) {
  const { product } = await context.storefront.query(PRODUCT_QUERY, {
    variables: { handle: params.handle },
    cache: context.storefront.CacheLong(),
  });

  return json({ product });
}

export default function ProductPage() {
  const { product } = useLoaderData<typeof loader>();
  return <ProductDetail product={product} />;
}
```

### Our Next.js Equivalent

```typescript
// src/lib/shopify/queries/products.ts
import { shopifyFetch } from '../client';
import { reshapeProduct } from '../types';

export async function getProduct(handle: string) {
  const data = await shopifyFetch<ProductByHandleQueryResult>(
    PRODUCT_BY_HANDLE_QUERY,
    { handle }
  );
  if (!data.product) return null;
  return reshapeProduct(data.product);
}

// app/(store)/products/[handle]/page.tsx
export default async function ProductPage({ params }) {
  const product = await getProduct(params.handle);
  if (!product) notFound();
  return <ProductDetail product={product} />;
}
```

**Key difference:** Hydrogen injects a `storefront` client via Remix context. We create our own typed client (`shopifyFetch`) with `graphql-request`. Both are server-side only.

## Cart Management

### Hydrogen

```typescript
// Hydrogen provides CartForm + useCart out of the box
import { CartForm, useCart } from '@shopify/hydrogen';

function AddToCartButton({ variantId }) {
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

function CartBadge() {
  const { totalQuantity } = useCart();
  return <span>{totalQuantity}</span>;
}
```

### Our Next.js Equivalent

```typescript
// src/lib/shopify/queries/cart.ts
export async function addToCart(cartId, lines) {
  const data = await shopifyFetch(ADD_TO_CART_MUTATION, { cartId, lines });
  return reshapeCart(data.cartLinesAdd.cart);
}

// Server Action wrapping the query
("use server");
export async function addToCartAction(variantId: string) {
  const cartId = cookies().get("cartId")?.value;
  return addToCart(cartId, [{ merchandiseId: variantId, quantity: 1 }]);
}
```

**Key difference:** Hydrogen's `CartForm` is a Remix-aware component that handles form submission, optimistic UI, and state updates. We use Next.js Server Actions + React Context for equivalent functionality.

## Product Queries

### Hydrogen

```typescript
// Hydrogen uses useShopQuery (deprecated) or storefront.query
const { product } = await context.storefront.query(PRODUCT_QUERY, {
  variables: { handle },
});

// With Hydrogen's ProductProvider for variant state
<ProductProvider data={product}>
  <ProductTitle />
  <ProductPrice />
  <ProductOptions />
</ProductProvider>
```

### Our Next.js Equivalent

```typescript
// Direct query function
const product = await getProduct(handle);

// No provider needed — pass props directly
<h1>{product.title}</h1>
<PriceDisplay amount={product.priceRange.minVariantPrice.amount}
              currencyCode={product.priceRange.minVariantPrice.currencyCode} />
<VariantSelector options={product.options} variants={product.variants} />
```

**Key difference:** Hydrogen's `ProductProvider` manages variant selection state (selected options, available variants, current price). We implement this with a client-side hook that tracks selected options and derives the active variant.

## Caching Strategies

| Hydrogen                                        | Next.js                                    | When to Use                              |
| ----------------------------------------------- | ------------------------------------------ | ---------------------------------------- |
| `CacheLong()`                                   | `{ next: { revalidate: 3600 } }`           | Product pages, collection listings       |
| `CacheShort()`                                  | `{ next: { revalidate: 60 } }`             | Search results, inventory-sensitive data |
| `CacheNone()`                                   | `{ cache: 'no-store' }`                    | Cart operations, customer data           |
| `CacheCustom({ maxAge, staleWhileRevalidate })` | `{ next: { revalidate: N, tags: [...] } }` | Custom revalidation logic                |

## Type System

### Hydrogen

Hydrogen auto-generates types from the Storefront API schema via `@shopify/hydrogen-codegen`. Types match the raw API response (with edges/nodes).

### Our Approach

We define types manually in `src/lib/shopify/types.ts`:

1. **Raw types** (`ShopifyProduct`, `ShopifyCollection`, `ShopifyCart`) — match the Storefront API response with edges/nodes
2. **Reshaped types** (`Product`, `Collection`, `Cart`) — flattened for easier consumption in components
3. **Reshaping functions** (`reshapeProduct`, `reshapeCollection`, `reshapeCart`) — transform raw → reshaped

This provides the same type safety without build-time codegen.

## Image Handling

### Hydrogen

```typescript
import { Image } from '@shopify/hydrogen';

<Image data={product.featuredImage} aspectRatio="1/1" sizes="50vw" />
```

### Our Next.js Equivalent

```typescript
import Image from 'next/image';

<Image
  src={product.featuredImage.url}
  alt={product.featuredImage.altText || product.title}
  width={product.featuredImage.width}
  height={product.featuredImage.height}
  sizes="50vw"
/>
```

**Key difference:** Hydrogen's `<Image>` accepts the Shopify image object directly and handles CDN transforms. `next/image` requires explicit `src`, `width`, `height` but provides automatic format conversion (WebP/AVIF).

## SEO

### Hydrogen

```typescript
import { Seo } from '@shopify/hydrogen';

<Seo type="product" data={product} />
// Automatically generates meta tags + JSON-LD for Product schema
```

### Our Next.js Equivalent

```typescript
// Metadata via generateMetadata (Next.js convention)
export async function generateMetadata({ params }) {
  const product = await getProduct(params.handle);
  return generateProductMetadata(product);
}

// JSON-LD via custom component
<JsonLd data={generateProductJsonLd(product, url)} />
```

**Key difference:** Hydrogen's `<Seo>` is a single component that generates both meta tags and JSON-LD. We split this into `generateMetadata` (Next.js convention) and `<JsonLd>` component for explicit control.

## Summary

| Feature        | Hydrogen                            | Our Next.js Implementation             |
| -------------- | ----------------------------------- | -------------------------------------- |
| GraphQL Client | `context.storefront`                | `shopifyFetch()` via `graphql-request` |
| Product Data   | `useShopQuery` / `storefront.query` | `getProduct()` / `getProducts()`       |
| Cart           | `CartForm` + `useCart`              | Server Actions + `useCart` hook        |
| Types          | Auto-generated codegen              | Manual types + reshaping               |
| Caching        | `CacheLong/Short/None`              | `fetch` options + ISR                  |
| Images         | `<Image data={...}>`                | `next/image` with explicit props       |
| SEO            | `<Seo type="product">`              | `generateMetadata` + `<JsonLd>`        |
| Routing        | Remix flat routes                   | Next.js App Router                     |
| Deployment     | Oxygen                              | Vercel                                 |
