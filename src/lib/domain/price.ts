import type { ShopifyMoneyV2 } from "@/lib/shopify/types";

export function formatPrice(amount: string, currencyCode: string): string {
  const numericAmount = parseFloat(amount);

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(numericAmount);
}

export function calculateDiscount(
  price: ShopifyMoneyV2,
  compareAtPrice: ShopifyMoneyV2,
): number {
  const currentPrice = parseFloat(price.amount);
  const originalPrice = parseFloat(compareAtPrice.amount);

  if (originalPrice <= 0 || currentPrice >= originalPrice) {
    return 0;
  }

  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
}
