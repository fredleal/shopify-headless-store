import type { ShopifyMoneyV2 } from "@/lib/shopify/types";

export interface CartSummaryProps {
  subtotal: ShopifyMoneyV2;
  total: ShopifyMoneyV2;
  tax: ShopifyMoneyV2 | null;
  totalQuantity: number;
  checkoutUrl: string;
  className?: string;
}

function formatMoney(amount: string, currencyCode: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(parseFloat(amount));
}

export const CartSummary = ({
  subtotal,
  total,
  tax,
  totalQuantity,
  checkoutUrl,
  className = "",
}: CartSummaryProps) => {
  return (
    <div
      className={`bg-secondary-50 rounded-lg p-6 ${className}`}
      data-testid="cart-summary"
    >
      <h2 className="text-lg font-semibold text-secondary-900 mb-4">
        Order Summary
      </h2>

      <div className="space-y-2">
        <div className="flex justify-between text-sm text-secondary-600">
          <span>
            Subtotal ({totalQuantity} {totalQuantity === 1 ? "item" : "items"})
          </span>
          <span>{formatMoney(subtotal.amount, subtotal.currencyCode)}</span>
        </div>

        {tax && parseFloat(tax.amount) > 0 && (
          <div className="flex justify-between text-sm text-secondary-600">
            <span>Tax</span>
            <span>{formatMoney(tax.amount, tax.currencyCode)}</span>
          </div>
        )}

        <div className="border-t border-secondary-200 pt-2 mt-2">
          <div className="flex justify-between text-base font-semibold text-secondary-900">
            <span>Total</span>
            <span>{formatMoney(total.amount, total.currencyCode)}</span>
          </div>
        </div>
      </div>

      <a
        href={checkoutUrl}
        className={`mt-6 block w-full text-center py-3 px-4 rounded-md font-medium text-white bg-primary hover:bg-primary-600 transition-colors ${
          totalQuantity === 0 ? "opacity-50 pointer-events-none" : ""
        }`}
        aria-disabled={totalQuantity === 0}
        data-testid="checkout-link"
      >
        Proceed to Checkout
      </a>
    </div>
  );
};
