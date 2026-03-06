import type { CartLine } from "@/lib/shopify/types";

export function calculateCartTotal(lines: CartLine[]): number {
  return lines.reduce(
    (total, line) => total + parseFloat(line.totalAmount.amount),
    0,
  );
}

export function getCartItemCount(lines: CartLine[]): number {
  return lines.reduce((count, line) => count + line.quantity, 0);
}

export function isCartEmpty(lines: CartLine[]): boolean {
  return lines.length === 0;
}
