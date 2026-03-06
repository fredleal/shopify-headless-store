"use client";

import type { Cart } from "@/types/cart";
import { CartLineItem } from "@/components/molecules/CartLineItem/CartLineItem";
import { CartSummary } from "@/components/molecules/CartSummary/CartSummary";

export interface CartViewProps {
  cart: Cart;
  onUpdateQuantity: (lineId: string, quantity: number) => void;
  onRemove: (lineId: string) => void;
  isLoading?: boolean;
  className?: string;
}

export const CartView = ({
  cart,
  onUpdateQuantity,
  onRemove,
  isLoading = false,
  className = "",
}: CartViewProps) => {
  return (
    <div
      className={`grid grid-cols-1 lg:grid-cols-3 gap-8 ${className}`}
      data-testid="cart-view"
    >
      <div className="lg:col-span-2">
        <h1 className="text-2xl font-bold text-[var(--color-gray-900,#111827)] mb-6">
          Shopping Cart
        </h1>
        <div>
          {cart.lines.map((line) => (
            <CartLineItem
              key={line.id}
              line={line}
              onUpdateQuantity={onUpdateQuantity}
              onRemove={onRemove}
              isLoading={isLoading}
            />
          ))}
        </div>
      </div>

      <div className="lg:col-span-1">
        <CartSummary
          subtotal={cart.cost.subtotalAmount}
          total={cart.cost.totalAmount}
          tax={cart.cost.totalTaxAmount}
          totalQuantity={cart.totalQuantity}
          checkoutUrl={cart.checkoutUrl}
        />
      </div>
    </div>
  );
};
