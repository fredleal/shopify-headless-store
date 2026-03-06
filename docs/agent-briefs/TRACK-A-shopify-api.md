# Track A — Shopify Storefront API Layer

## Context

**Project**: `shopify-headless-store` — a headless Shopify storefront built with Next.js 14 + Shopify Storefront API.
**Purpose**: Personal project demonstrating Shopify frontend expertise (job application for Frontend Shopify Engineer).
**Repo**: `github.com/fredleal/shopify-headless-store` (public)

## Stack (exact versions)

- Runtime: Bun (latest)
- Framework: Next.js 14.2.x (App Router)
- Language: TypeScript strict
- HTTP/GraphQL: graphql-request
- Styling: Tailwind CSS 3.4
- Testing: Vitest + happy-dom + @testing-library/react
- Linting: ESLint 9 (flat config) + Prettier
- Commits: Conventional Commits (@commitlint/config-conventional)

## MANDATORY Rules

1. NO Co-Authored-By, NO AI signatures in commits, code, or PRs
2. Validation BEFORE commit: `bun run build` -> `bun run lint` -> `bun run test`
3. Conventional commits: `feat|fix|refactor|test|chore|docs: description`
4. Named exports ONLY (never default export, except Next.js pages)
5. TDD for `src/lib/domain/` (write test BEFORE implementation)
6. `'use client'` ONLY when hooks/events/browser APIs are used
7. Branch from `develop`, PR to `develop`
8. NEVER merge — create PR and STOP

## Your Branch

```
git checkout develop
git pull origin develop
git checkout -b feature/shopify-api-layer
```

## Your Files (EXCLUSIVE OWNERSHIP)

You may ONLY create/modify files in:

- `src/lib/shopify/client.ts`
- `src/lib/shopify/types.ts`
- `src/lib/shopify/queries/products.ts`
- `src/lib/shopify/queries/collections.ts`
- `src/lib/shopify/queries/cart.ts`
- `src/lib/shopify/queries/fragments.ts`
- `src/lib/shopify/hydrogen-patterns/README.md`
- `src/lib/domain/price.ts`
- `src/lib/domain/price.test.ts` (already exists — replace placeholder)
- `src/lib/domain/cart.ts`
- `src/lib/domain/cart.test.ts`
- `src/test/mocks/shopify/products.ts`
- `src/test/mocks/shopify/collections.ts`
- `src/test/mocks/shopify/cart.ts`

Do NOT touch any file outside this list.

## Tasks

### A.1: Shopify GraphQL Client (typed)

Create `src/lib/shopify/client.ts`:

```typescript
import { GraphQLClient } from "graphql-request";

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!;
const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN!;
const endpoint = `https://${domain}/api/2024-01/graphql.json`;

const client = new GraphQLClient(endpoint, {
  headers: {
    "X-Shopify-Storefront-Access-Token": token,
    "Content-Type": "application/json",
  },
});

export async function shopifyFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  return client.request<T>(query, variables);
}
```

### A.2: Storefront API Types + Reshaping

Create `src/lib/shopify/types.ts` with:

```typescript
// Raw Shopify Storefront API types
export interface ShopifyMoneyV2 {
  amount: string;
  currencyCode: string;
}

export interface ShopifyImage {
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

export interface ShopifyProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  price: ShopifyMoneyV2;
  compareAtPrice: ShopifyMoneyV2 | null;
  selectedOptions: { name: string; value: string }[];
  image: ShopifyImage | null;
}

export interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  availableForSale: boolean;
  featuredImage: ShopifyImage | null;
  images: { edges: { node: ShopifyImage }[] };
  variants: { edges: { node: ShopifyProductVariant }[] };
  options: { id: string; name: string; values: string[] }[];
  seo: { title: string | null; description: string | null };
  tags: string[];
  priceRange: {
    minVariantPrice: ShopifyMoneyV2;
    maxVariantPrice: ShopifyMoneyV2;
  };
}

export interface ShopifyCollection {
  id: string;
  handle: string;
  title: string;
  description: string;
  image: ShopifyImage | null;
  products: { edges: { node: ShopifyProduct }[] };
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    totalAmount: ShopifyMoneyV2;
    subtotalAmount: ShopifyMoneyV2;
    totalTaxAmount: ShopifyMoneyV2 | null;
  };
  lines: {
    edges: {
      node: {
        id: string;
        quantity: number;
        merchandise: {
          id: string;
          title: string;
          product: {
            handle: string;
            title: string;
            featuredImage: ShopifyImage | null;
          };
          price: ShopifyMoneyV2;
          selectedOptions: { name: string; value: string }[];
        };
        cost: {
          totalAmount: ShopifyMoneyV2;
        };
      };
    }[];
  };
}

// Reshaped types (flattened edges/nodes for easier consumption)
export interface Product {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  availableForSale: boolean;
  featuredImage: ShopifyImage | null;
  images: ShopifyImage[];
  variants: ShopifyProductVariant[];
  options: { id: string; name: string; values: string[] }[];
  seo: { title: string | null; description: string | null };
  tags: string[];
  priceRange: {
    minVariantPrice: ShopifyMoneyV2;
    maxVariantPrice: ShopifyMoneyV2;
  };
}

export interface Collection {
  id: string;
  handle: string;
  title: string;
  description: string;
  image: ShopifyImage | null;
  products: Product[];
}

export interface CartLine {
  id: string;
  quantity: number;
  merchandiseId: string;
  variantTitle: string;
  productHandle: string;
  productTitle: string;
  productImage: ShopifyImage | null;
  price: ShopifyMoneyV2;
  selectedOptions: { name: string; value: string }[];
  totalAmount: ShopifyMoneyV2;
}

export interface Cart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    totalAmount: ShopifyMoneyV2;
    subtotalAmount: ShopifyMoneyV2;
    totalTaxAmount: ShopifyMoneyV2 | null;
  };
  lines: CartLine[];
}
```

Add reshaping functions:

```typescript
export function reshapeProduct(raw: ShopifyProduct): Product {
  return {
    ...raw,
    images: raw.images.edges.map((e) => e.node),
    variants: raw.variants.edges.map((e) => e.node),
  };
}

export function reshapeCollection(raw: ShopifyCollection): Collection {
  return {
    ...raw,
    products: raw.products.edges.map((e) => reshapeProduct(e.node)),
  };
}

export function reshapeCart(raw: ShopifyCart): Cart {
  return {
    id: raw.id,
    checkoutUrl: raw.checkoutUrl,
    totalQuantity: raw.totalQuantity,
    cost: raw.cost,
    lines: raw.lines.edges.map((e) => ({
      id: e.node.id,
      quantity: e.node.quantity,
      merchandiseId: e.node.merchandise.id,
      variantTitle: e.node.merchandise.title,
      productHandle: e.node.merchandise.product.handle,
      productTitle: e.node.merchandise.product.title,
      productImage: e.node.merchandise.product.featuredImage,
      price: e.node.merchandise.price,
      selectedOptions: e.node.merchandise.selectedOptions,
      totalAmount: e.node.cost.totalAmount,
    })),
  };
}
```

### A.3: Product & Collection Queries

Create `src/lib/shopify/queries/fragments.ts`:

- `PRODUCT_FRAGMENT` — reusable product fields
- `COLLECTION_FRAGMENT` — reusable collection fields

Create `src/lib/shopify/queries/products.ts`:

- `getProducts(first?: number)` — fetch all products
- `getProduct(handle: string)` — fetch single product by handle
- Both should use `shopifyFetch` and return reshaped types

Create `src/lib/shopify/queries/collections.ts`:

- `getCollections(first?: number)` — fetch all collections
- `getCollection(handle: string)` — fetch single collection with products

### A.4: Cart Queries (Mutations)

Create `src/lib/shopify/queries/cart.ts`:

- `createCart()` — cartCreate mutation
- `addToCart(cartId: string, lines: { merchandiseId: string; quantity: number }[])` — cartLinesAdd
- `removeFromCart(cartId: string, lineIds: string[])` — cartLinesRemove
- `updateCartLines(cartId: string, lines: { id: string; quantity: number }[])` — cartLinesUpdate
- `getCart(cartId: string)` — cart query
- All return reshaped `Cart` type

### A.5: Domain Logic (TDD)

**Write tests FIRST, then implement.**

Create `src/lib/domain/price.ts` + update `src/lib/domain/price.test.ts`:

- `formatPrice(amount: string, currencyCode: string): string` — e.g. "29.99" + "USD" -> "$29.99"
- `calculateDiscount(price: ShopifyMoneyV2, compareAtPrice: ShopifyMoneyV2): number` — percentage
- Handle edge cases: same currency comparison, zero prices, invalid inputs

Create `src/lib/domain/cart.ts` + `src/lib/domain/cart.test.ts`:

- `calculateCartTotal(lines: CartLine[]): number` — sum of line totals
- `getCartItemCount(lines: CartLine[]): number` — sum of quantities
- `isCartEmpty(lines: CartLine[]): boolean`

### A.6: Test Mocks

Create mock data in `src/test/mocks/shopify/`:

- `products.ts` — 3+ mock products with variants, images, prices
- `collections.ts` — 2+ mock collections with products
- `cart.ts` — mock cart with 2+ line items

These mocks will be used by Track B, C, D agents for their component tests.
Export both raw Shopify types AND reshaped types.

### A.7: Hydrogen Patterns Comparison

Create `src/lib/shopify/hydrogen-patterns/README.md`:

- Document how each query/hook maps to Hydrogen equivalents
- Example: `getProduct()` -> Hydrogen's `useShopQuery` + `ProductProvider`
- Example: cart mutations -> Hydrogen's `useCart` hook
- Show code snippets side by side (Next.js vs Hydrogen)

## Validation

```bash
bun run build && bun run lint && bun run test
```

All must pass before committing.

## Commit & PR

```bash
git add src/lib/shopify/ src/lib/domain/ src/test/mocks/shopify/
git commit -m "feat: shopify storefront API layer with typed client, queries, and domain logic"
git push origin feature/shopify-api-layer
gh pr create --base develop --title "feat: Shopify Storefront API layer" --body "## Summary
- Typed GraphQL client for Shopify Storefront API
- Product, collection, and cart queries with reshaping
- Domain logic (TDD): price formatting, cart calculations
- Test mocks for other tracks
- Hydrogen patterns comparison doc

## Test plan
- [ ] All domain tests pass (price + cart)
- [ ] Build succeeds with TypeScript strict
- [ ] ESLint clean"
```

Then STOP. Do NOT merge.
