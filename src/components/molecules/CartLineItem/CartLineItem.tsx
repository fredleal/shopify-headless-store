"use client";

import Image from "next/image";
import type { CartLine } from "@/lib/shopify/types";

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
      className={`flex gap-4 py-4 border-b border-secondary-200 ${disabledClass} ${className}`}
      data-testid="cart-line-item"
    >
      <div className="w-20 h-20 flex-shrink-0 rounded-md overflow-hidden bg-secondary-100">
        {line.productImage ? (
          <Image
            src={line.productImage.url}
            alt={line.productImage.altText ?? line.productTitle}
            width={80}
            height={80}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-secondary-400">
            <span aria-hidden="true">No image</span>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-secondary-900 truncate">
          {line.productTitle}
        </h3>
        {line.variantTitle && (
          <p className="mt-1 text-sm text-secondary-500">{line.variantTitle}</p>
        )}
        <p className="mt-1 text-sm font-medium text-secondary-900">
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
            className="w-8 h-8 flex items-center justify-center rounded border border-secondary-300 text-secondary-600 hover:bg-secondary-50 disabled:opacity-50"
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
            className="w-8 h-8 flex items-center justify-center rounded border border-secondary-300 text-secondary-600 hover:bg-secondary-50 disabled:opacity-50"
            aria-label={`Increase quantity of ${line.productTitle}`}
          >
            +
          </button>
        </div>
        <button
          type="button"
          onClick={() => onRemove(line.id)}
          disabled={isLoading}
          className="text-sm text-accent-red hover:text-accent-red-700 disabled:opacity-50"
          aria-label={`Remove ${line.productTitle} from cart`}
        >
          Remove
        </button>
      </div>
    </div>
  );
};
