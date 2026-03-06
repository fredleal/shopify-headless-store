# Track B — Product Pages + UI Components

## Context

**Project**: `shopify-headless-store` — a headless Shopify storefront built with Next.js 14 + Shopify Storefront API.
**Purpose**: Personal project demonstrating Shopify frontend expertise (job application for Frontend Shopify Engineer).
**Repo**: `github.com/fredleal/shopify-headless-store` (public)

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
4. Named exports ONLY (never default export, except Next.js pages which REQUIRE default export)
5. CSS Variables with fallback hex: `bg-[var(--color-primary-500,#3b82f6)]`
6. Object-map for variants (NEVER if/else chains)
7. `'use client'` ONLY when hooks/events/browser APIs are used
8. Branch from `develop`, PR to `develop`
9. NEVER merge — create PR and STOP

## Your Branch

```
git checkout develop
git pull origin develop
git checkout -b feature/product-pages
```

## Your Files (EXCLUSIVE OWNERSHIP)

You may ONLY create/modify files in:

- `src/app/(store)/layout.tsx`
- `src/app/(store)/products/page.tsx`
- `src/app/(store)/products/[handle]/page.tsx`
- `src/app/(store)/collections/page.tsx`
- `src/app/(store)/collections/[handle]/page.tsx`
- `src/components/organisms/StoreHeader/StoreHeader.tsx`
- `src/components/organisms/StoreHeader/StoreHeader.test.tsx`
- `src/components/organisms/StoreFooter/StoreFooter.tsx`
- `src/components/organisms/StoreFooter/StoreFooter.test.tsx`
- `src/components/organisms/ProductGrid/ProductGrid.tsx`
- `src/components/organisms/ProductGrid/ProductGrid.test.tsx`
- `src/components/organisms/ProductDetail/ProductDetail.tsx`
- `src/components/organisms/ProductDetail/ProductDetail.test.tsx`
- `src/components/molecules/ProductCard/ProductCard.tsx`
- `src/components/molecules/ProductCard/ProductCard.test.tsx`
- `src/components/molecules/VariantSelector/VariantSelector.tsx`
- `src/components/molecules/VariantSelector/VariantSelector.test.tsx`
- `src/components/molecules/CollectionCard/CollectionCard.tsx`
- `src/components/molecules/CollectionCard/CollectionCard.test.tsx`
- `src/components/atoms/PriceDisplay/PriceDisplay.tsx`
- `src/components/atoms/PriceDisplay/PriceDisplay.test.tsx`
- `src/components/atoms/OptionButton/OptionButton.tsx`
- `src/components/atoms/OptionButton/OptionButton.test.tsx`

Do NOT touch any file outside this list.

## Important: Shopify Types

Since Track A creates the types in parallel, you must define your own LOCAL type stubs at the top of your files or in a local types file. These will be replaced during integration (Phase 2). Use these shapes:

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

interface ShopifyProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  price: ShopifyMoneyV2;
  compareAtPrice: ShopifyMoneyV2 | null;
  selectedOptions: { name: string; value: string }[];
  image: ShopifyImage | null;
}

interface Product {
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
  priceRange: {
    minVariantPrice: ShopifyMoneyV2;
    maxVariantPrice: ShopifyMoneyV2;
  };
}

interface Collection {
  id: string;
  handle: string;
  title: string;
  description: string;
  image: ShopifyImage | null;
  products: Product[];
}
```

## Tasks

### B.1: Store Layout Shell (Header + Footer)

Create `src/app/(store)/layout.tsx`:

- Wraps children with StoreHeader + StoreFooter
- Default export (required by Next.js)

Create `src/components/organisms/StoreHeader/StoreHeader.tsx`:

- Logo/store name linking to `/`
- Nav links: Products, Collections, Cart
- Named export `StoreHeader`
- Use `'use client'` only if needed (mobile menu toggle)

Create `src/components/organisms/StoreFooter/StoreFooter.tsx`:

- Simple footer with copyright, links
- Named export `StoreFooter`

### B.2: ProductCard (adapted from template)

Create `src/components/molecules/ProductCard/ProductCard.tsx`:

Adapt from template-saas-ecommerce pattern but use Shopify types:

```typescript
"use client";

import React from "react";
import NextImage from "next/image";
import Link from "next/link";

export interface ProductCardProps {
  product: Product;
  variant?: "default" | "compact" | "featured";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const ProductCard = ({
  product,
  variant = "default",
  size = "md",
  className = "",
}: ProductCardProps) => {
  const baseClasses =
    "bg-white rounded-lg overflow-hidden transition-all duration-200 border border-gray-200 hover:shadow-lg group";

  const variantClasses = {
    default: "",
    compact: "max-w-sm",
    featured: "border-2 border-[var(--color-primary-500,#3b82f6)] shadow-md",
  };

  const sizeClasses = {
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
  };

  const imageHeightClasses = {
    sm: "h-40",
    md: "h-48",
    lg: "h-64",
  };

  // ... render with Link to /products/[handle], next/image, PriceDisplay
};
```

Key differences from template:

- Uses `Product` type (Shopify) instead of primitive props
- Uses `next/image` instead of custom Image component
- Uses `Link` to `/products/${product.handle}`
- Price from `product.priceRange.minVariantPrice`

### B.3: PriceDisplay Atom

Create `src/components/atoms/PriceDisplay/PriceDisplay.tsx`:

```typescript
export interface PriceDisplayProps {
  amount: string;
  currencyCode: string;
  compareAtAmount?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const PriceDisplay = ({
  amount,
  currencyCode,
  compareAtAmount,
  size = "md",
  className = "",
}: PriceDisplayProps) => {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl",
  };

  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(parseFloat(amount));

  // If compareAtAmount, show strikethrough original + current price
  // ...
};
```

### B.4: Product List Page (/products)

Create `src/app/(store)/products/page.tsx`:

- Default export (Next.js page)
- For now, use mock data (will be connected to API in Phase 2)
- Render `ProductGrid` with product list
- Page title "All Products"

Create `src/components/organisms/ProductGrid/ProductGrid.tsx`:

- Named export `ProductGrid`
- Props: `{ products: Product[], columns?: 2 | 3 | 4 }`
- Responsive grid using Tailwind
- Maps products to `ProductCard`

### B.5: Product Detail Page (/products/[handle])

Create `src/app/(store)/products/[handle]/page.tsx`:

- Default export (Next.js page)
- For now, use mock data
- Render `ProductDetail` organism

Create `src/components/organisms/ProductDetail/ProductDetail.tsx`:

- Named export `ProductDetail`
- Image gallery (main image + thumbnails)
- Product title, description (render HTML safely)
- PriceDisplay
- VariantSelector
- "Add to Cart" button (no-op for now, connected in Phase 2)

### B.6: VariantSelector + OptionButton

Create `src/components/atoms/OptionButton/OptionButton.tsx`:

- Named export `OptionButton`
- Props: `{ value: string, selected: boolean, available: boolean, onClick: () => void }`
- Visual states: default, selected (primary border), unavailable (opacity + strikethrough)

Create `src/components/molecules/VariantSelector/VariantSelector.tsx`:

- Named export `VariantSelector`
- Props: `{ options: { name: string, values: string[] }[], selectedOptions: Record<string, string>, onOptionChange: (name: string, value: string) => void }`
- Renders option groups with OptionButtons
- `'use client'` (handles click events)

### B.7: Collection Pages

Create `src/app/(store)/collections/page.tsx`:

- List all collections with CollectionCard
- Default export

Create `src/app/(store)/collections/[handle]/page.tsx`:

- Show collection title + description
- ProductGrid with collection products
- Default export

Create `src/components/molecules/CollectionCard/CollectionCard.tsx`:

- Named export `CollectionCard`
- Links to `/collections/[handle]`
- Collection image + title + product count

### B.8: Component Tests

Add `.test.tsx` for each component:

- Test rendering with mock data
- Test variant/size props apply correct classes
- Test links point to correct URLs
- Test accessibility (aria labels)
- Use `@testing-library/react` + `vitest`

## Component Pattern Reference (from template-saas-ecommerce)

**Object-map variants (ALWAYS use this, never if/else):**

```typescript
const variantClasses = {
  primary: "bg-[var(--color-primary-500,#3b82f6)] text-white",
  secondary: "bg-[var(--color-gray-500,#6b7280)] text-white",
  outline: "border border-[var(--color-primary-500,#3b82f6)]",
};
const finalClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
```

**Props extending HTML attributes:**

```typescript
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
}
```

## Validation

```bash
bun run build && bun run lint && bun run test
```

All must pass before committing.

## Commit & PR

```bash
git add src/app/\(store\)/ src/components/
git commit -m "feat: product pages and UI components with Shopify types"
git push origin feature/product-pages
gh pr create --base develop --title "feat: Product pages and UI components" --body "## Summary
- Store layout with Header/Footer
- ProductCard, PriceDisplay, OptionButton atoms/molecules
- Product list and detail pages
- VariantSelector for product options
- Collection list and detail pages
- Component tests for all components

## Test plan
- [ ] All component tests pass
- [ ] Build succeeds
- [ ] ESLint clean
- [ ] Pages render with mock data"
```

Then STOP. Do NOT merge.
