"use client";

import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { CartView } from "@/components/organisms/CartView/CartView";

export default function CartPage() {
  const { cart, isLoading, error, updateQuantity, removeItem } = useCart();

  if (isLoading && !cart) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <p className="text-center text-[var(--color-gray-500,#6b7280)]">
          Loading cart...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <p className="text-center text-[var(--color-red-500,#ef4444)]">
          {error}
        </p>
      </div>
    );
  }

  if (!cart || cart.lines.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-[var(--color-gray-900,#111827)] mb-4">
          Your cart is empty
        </h1>
        <p className="text-[var(--color-gray-500,#6b7280)] mb-6">
          Browse our products to find something you like.
        </p>
        <Link
          href="/products"
          className="inline-block py-3 px-6 rounded-md font-medium text-white bg-[var(--color-primary-500,#3b82f6)] hover:bg-[var(--color-primary-600,#2563eb)] transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <CartView
        cart={cart}
        onUpdateQuantity={updateQuantity}
        onRemove={removeItem}
        isLoading={isLoading}
      />
    </div>
  );
}
