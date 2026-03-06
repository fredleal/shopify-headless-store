import { describe, it, expect } from "vitest";
import { calculateCartTotal, getCartItemCount, isCartEmpty } from "./cart";
import type { CartLine } from "@/lib/shopify/types";

const mockLines: CartLine[] = [
  {
    id: "line-1",
    quantity: 2,
    merchandiseId: "gid://shopify/ProductVariant/1",
    variantTitle: "Small / Black",
    productHandle: "classic-tee",
    productTitle: "Classic Tee",
    productImage: null,
    price: { amount: "29.99", currencyCode: "USD" },
    selectedOptions: [
      { name: "Size", value: "Small" },
      { name: "Color", value: "Black" },
    ],
    totalAmount: { amount: "59.98", currencyCode: "USD" },
  },
  {
    id: "line-2",
    quantity: 1,
    merchandiseId: "gid://shopify/ProductVariant/2",
    variantTitle: "One Size",
    productHandle: "leather-belt",
    productTitle: "Leather Belt",
    productImage: null,
    price: { amount: "45.00", currencyCode: "USD" },
    selectedOptions: [{ name: "Size", value: "One Size" }],
    totalAmount: { amount: "45.00", currencyCode: "USD" },
  },
  {
    id: "line-3",
    quantity: 3,
    merchandiseId: "gid://shopify/ProductVariant/3",
    variantTitle: "Default",
    productHandle: "cotton-socks",
    productTitle: "Cotton Socks",
    productImage: null,
    price: { amount: "9.99", currencyCode: "USD" },
    selectedOptions: [],
    totalAmount: { amount: "29.97", currencyCode: "USD" },
  },
];

describe("calculateCartTotal", () => {
  it("sums all line item total amounts", () => {
    const total = calculateCartTotal(mockLines);
    expect(total).toBeCloseTo(134.95, 2);
  });

  it("returns 0 for empty cart", () => {
    expect(calculateCartTotal([])).toBe(0);
  });

  it("handles single line item", () => {
    const singleLine = [mockLines[0]];
    expect(calculateCartTotal(singleLine)).toBeCloseTo(59.98, 2);
  });
});

describe("getCartItemCount", () => {
  it("sums all quantities", () => {
    expect(getCartItemCount(mockLines)).toBe(6);
  });

  it("returns 0 for empty cart", () => {
    expect(getCartItemCount([])).toBe(0);
  });

  it("handles single item with quantity 1", () => {
    const singleLine = [mockLines[1]];
    expect(getCartItemCount(singleLine)).toBe(1);
  });
});

describe("isCartEmpty", () => {
  it("returns false when cart has items", () => {
    expect(isCartEmpty(mockLines)).toBe(false);
  });

  it("returns true for empty array", () => {
    expect(isCartEmpty([])).toBe(true);
  });
});
