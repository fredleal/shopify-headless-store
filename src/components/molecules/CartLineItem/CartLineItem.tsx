"use client";

import Image from "next/image";
import type { CartLine } from "@/types/cart";

export interface CartLineItemProps {
  line: CartLine;
  onUpdateQuantity: (lineId: string, quantity: number) => void;
  onRemove: (lineId: string) => void;
  isLoading?: boolean;
  className?: string;
}

function formatMoney(amount: string, currencyCode: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(parseFloat(amount));
}

export const CartLineItem = ({
  line,
  onUpdateQuantity,
  onRemove,
  isLoading = false,
  className = "",
}: CartLineItemProps) => {
  const disabledClass = isLoading ? "opacity-50 pointer-events-none" : "";

  return (
    <div
      className={`flex gap-4 py-4 border-b border-[var(--color-gray-200,#e5e7eb)] ${disabledClass} ${className}`}
      data-testid="cart-line-item"
    >
      <div className="w-20 h-20 flex-shrink-0 rounded-md overflow-hidden bg-[var(--color-gray-100,#f3f4f6)]">
        {line.productImage ? (
          <Image
            src={line.productImage.url}
            alt={line.productImage.altText ?? line.productTitle}
            width={80}
            height={80}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[var(--color-gray-400,#9ca3af)]">
            <span aria-hidden="true">No image</span>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-[var(--color-gray-900,#111827)] truncate">
          {line.productTitle}
        </h3>
        {line.variantTitle && (
          <p className="mt-1 text-sm text-[var(--color-gray-500,#6b7280)]">
            {line.variantTitle}
          </p>
        )}
        <p className="mt-1 text-sm font-medium text-[var(--color-gray-900,#111827)]">
          {formatMoney(line.price.amount, line.price.currencyCode)}
        </p>
      </div>

      <div className="flex flex-col items-end gap-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              onUpdateQuantity(line.id, Math.max(0, line.quantity - 1))
            }
            disabled={isLoading}
            className="w-8 h-8 flex items-center justify-center rounded border border-[var(--color-gray-300,#d1d5db)] text-[var(--color-gray-600,#4b5563)] hover:bg-[var(--color-gray-50,#f9fafb)] disabled:opacity-50"
            aria-label={`Decrease quantity of ${line.productTitle}`}
          >
            -
          </button>
          <span
            className="w-8 text-center text-sm"
            data-testid="quantity-display"
          >
            {line.quantity}
          </span>
          <button
            type="button"
            onClick={() => onUpdateQuantity(line.id, line.quantity + 1)}
            disabled={isLoading}
            className="w-8 h-8 flex items-center justify-center rounded border border-[var(--color-gray-300,#d1d5db)] text-[var(--color-gray-600,#4b5563)] hover:bg-[var(--color-gray-50,#f9fafb)] disabled:opacity-50"
            aria-label={`Increase quantity of ${line.productTitle}`}
          >
            +
          </button>
        </div>
        <button
          type="button"
          onClick={() => onRemove(line.id)}
          disabled={isLoading}
          className="text-sm text-[var(--color-red-500,#ef4444)] hover:text-[var(--color-red-700,#b91c1c)] disabled:opacity-50"
          aria-label={`Remove ${line.productTitle} from cart`}
        >
          Remove
        </button>
      </div>
    </div>
  );
};
