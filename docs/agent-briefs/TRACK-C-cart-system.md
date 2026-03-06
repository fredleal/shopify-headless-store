# Track C — Cart + Checkout System

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
git checkout -b feature/cart-system
```

## Your Files (EXCLUSIVE OWNERSHIP)

You may ONLY create/modify files in:

- `src/hooks/useCart.ts`
- `src/hooks/useCart.test.ts`
- `src/actions/cart.ts`
- `src/actions/cart.test.ts`
- `src/app/cart/page.tsx`
- `src/components/organisms/CartView/CartView.tsx`
- `src/components/organisms/CartView/CartView.test.tsx`
- `src/components/molecules/CartLineItem/CartLineItem.tsx`
- `src/components/molecules/CartLineItem/CartLineItem.test.tsx`
- `src/components/molecules/CartSummary/CartSummary.tsx`
- `src/components/molecules/CartSummary/CartSummary.test.tsx`

Do NOT touch any file outside this list.

## Important: Shopify Types (local stubs)

Since Track A creates the types in parallel, define local type stubs. These will be replaced during integration (Phase 2):

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

interface CartLine {
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

interface Cart {
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

## Tasks

### C.1: useCart Hook

Create `src/hooks/useCart.ts`:

```typescript
"use client";

import { useState, useCallback, useEffect } from "react";

// Cart state managed via Shopify Cart API
// Cart ID persisted in localStorage
// All mutations go through Server Actions (Task C.2)

export function useCart() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load cart from localStorage on mount
  useEffect(() => {
    const cartId = localStorage.getItem("shopify-cart-id");
    if (cartId) {
      // fetch cart via server action
    }
  }, []);

  const addItem = useCallback(
    async (merchandiseId: string, quantity: number) => {
      setIsLoading(true);
      setError(null);
      try {
        // If no cart, create one first
        // Then add item via server action
        // Update state + localStorage
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to add item");
      } finally {
        setIsLoading(false);
      }
    },
    [cart],
  );

  const removeItem = useCallback(
    async (lineId: string) => {
      // Remove via server action, update state
    },
    [cart],
  );

  const updateQuantity = useCallback(
    async (lineId: string, quantity: number) => {
      // Update via server action, update state
    },
    [cart],
  );

  return {
    cart,
    isLoading,
    error,
    addItem,
    removeItem,
    updateQuantity,
    totalQuantity: cart?.totalQuantity ?? 0,
    checkoutUrl: cart?.checkoutUrl ?? null,
  };
}
```

For now, server action calls should be stubbed (will be connected in Phase 2). The hook should still work with mock data for testing.

### C.2: Server Actions for Cart Mutations

Create `src/actions/cart.ts`:

```typescript
"use server";

// Server Actions that will call Shopify API (Track A)
// For now, these are typed stubs that return mock data

export async function createCartAction(): Promise<Cart> {
  // Will call: createCart() from @/lib/shopify/queries/cart
  throw new Error("Not connected to Shopify API yet — Phase 2");
}

export async function addToCartAction(
  cartId: string,
  merchandiseId: string,
  quantity: number,
): Promise<Cart> {
  // Will call: addToCart() from @/lib/shopify/queries/cart
  throw new Error("Not connected to Shopify API yet — Phase 2");
}

export async function removeFromCartAction(
  cartId: string,
  lineId: string,
): Promise<Cart> {
  // Will call: removeFromCart()
  throw new Error("Not connected to Shopify API yet — Phase 2");
}

export async function updateCartAction(
  cartId: string,
  lineId: string,
  quantity: number,
): Promise<Cart> {
  // Will call: updateCartLines()
  throw new Error("Not connected to Shopify API yet — Phase 2");
}

export async function getCartAction(cartId: string): Promise<Cart | null> {
  // Will call: getCart()
  throw new Error("Not connected to Shopify API yet — Phase 2");
}
```

### C.3: CartLineItem Molecule

Create `src/components/molecules/CartLineItem/CartLineItem.tsx`:

```typescript
"use client";

export interface CartLineItemProps {
  line: CartLine;
  onUpdateQuantity: (lineId: string, quantity: number) => void;
  onRemove: (lineId: string) => void;
  isLoading?: boolean;
  className?: string;
}

export const CartLineItem = ({
  line,
  onUpdateQuantity,
  onRemove,
  isLoading = false,
  className = "",
}: CartLineItemProps) => {
  // Product image (next/image)
  // Product title + variant title
  // Price display
  // Quantity controls (- / count / +)
  // Remove button
  // Disabled state when isLoading
};
```

### C.4: CartSummary Molecule

Create `src/components/molecules/CartSummary/CartSummary.tsx`:

```typescript
export interface CartSummaryProps {
  subtotal: ShopifyMoneyV2;
  total: ShopifyMoneyV2;
  tax: ShopifyMoneyV2 | null;
  totalQuantity: number;
  checkoutUrl: string;
  className?: string;
}

export const CartSummary = ({
  subtotal,
  total,
  tax,
  totalQuantity,
  checkoutUrl,
  className = "",
}: CartSummaryProps) => {
  // Subtotal row
  // Tax row (if present)
  // Total row (bold)
  // Item count
  // "Proceed to Checkout" button -> links to checkoutUrl (Shopify hosted checkout)
};
```

The checkout button should be an `<a>` tag linking to `checkoutUrl` — Shopify handles the checkout page.

### C.5: Cart Page

Create `src/app/cart/page.tsx`:

- Default export (Next.js page)
- `'use client'` (uses useCart hook)
- Shows CartView organism
- Empty state: "Your cart is empty" with link to /products

Create `src/components/organisms/CartView/CartView.tsx`:

- Named export `CartView`
- Props: `{ cart: Cart, onUpdateQuantity, onRemove, isLoading }`
- Lists CartLineItem for each line
- CartSummary at the bottom
- Responsive layout (items left, summary right on desktop)

### C.6: Checkout Redirect

The checkout redirect is simply the `checkoutUrl` from the Shopify Cart API. The CartSummary component's "Proceed to Checkout" button should:

- Be an `<a href={checkoutUrl}>` tag (external navigation to Shopify)
- Open in same tab (standard e-commerce UX)
- Be disabled if cart is empty or loading

No additional implementation needed beyond what's in CartSummary.

### C.7: Cart Tests

Write tests for:

- `useCart` hook: test state management, localStorage interaction
- `CartLineItem`: renders product info, quantity controls, fires callbacks
- `CartSummary`: renders totals, checkout link
- `CartView`: renders line items + summary, empty state

Mock localStorage in tests:

```typescript
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};
Object.defineProperty(window, "localStorage", { value: localStorageMock });
```

## Component Pattern Reference

**Object-map variants (ALWAYS use this):**

```typescript
const variantClasses = {
  primary:
    "bg-[var(--color-primary-500,#3b82f6)] text-white hover:bg-[var(--color-primary-600,#2563eb)]",
  secondary: "bg-[var(--color-gray-500,#6b7280)] text-white",
  outline:
    "border border-[var(--color-primary-500,#3b82f6)] text-[var(--color-primary-500,#3b82f6)]",
  ghost:
    "text-[var(--color-primary-500,#3b82f6)] hover:bg-[var(--color-primary-50,#eff6ff)]",
};
```

**Button pattern:**

```typescript
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}
```

## Validation

```bash
bun run build && bun run lint && bun run test
```

All must pass before committing.

## Commit & PR

```bash
git add src/hooks/ src/actions/ src/app/cart/ src/components/organisms/CartView/ src/components/molecules/CartLineItem/ src/components/molecules/CartSummary/
git commit -m "feat: cart system with useCart hook, server actions, and cart UI"
git push origin feature/cart-system
gh pr create --base develop --title "feat: Cart system with hook and UI components" --body "## Summary
- useCart hook with localStorage persistence
- Server Actions stubs for cart mutations (Phase 2 connection)
- CartLineItem, CartSummary molecules
- CartView organism with empty state
- Cart page with responsive layout
- Checkout redirect to Shopify hosted checkout

## Test plan
- [ ] All cart component tests pass
- [ ] useCart hook tests pass
- [ ] Build succeeds
- [ ] ESLint clean"
```

Then STOP. Do NOT merge.
