import { describe, it, expect } from "vitest";
import { formatPrice, calculateDiscount } from "./price";

describe("formatPrice", () => {
  it("formats USD price correctly", () => {
    expect(formatPrice("29.99", "USD")).toBe("$29.99");
  });

  it("formats EUR price correctly", () => {
    expect(formatPrice("49.00", "EUR")).toBe("€49.00");
  });

  it("formats GBP price correctly", () => {
    expect(formatPrice("35.50", "GBP")).toBe("£35.50");
  });

  it("formats zero price", () => {
    expect(formatPrice("0.00", "USD")).toBe("$0.00");
  });

  it("formats large prices with thousands separator", () => {
    const result = formatPrice("1299.99", "USD");
    expect(result).toBe("$1,299.99");
  });

  it("formats whole number prices", () => {
    expect(formatPrice("100", "USD")).toBe("$100.00");
  });

  it("handles string amounts with leading zeros", () => {
    expect(formatPrice("09.99", "USD")).toBe("$9.99");
  });

  it("formats BRL price correctly", () => {
    const result = formatPrice("199.90", "BRL");
    expect(result).toContain("199");
  });
});

describe("calculateDiscount", () => {
  it("calculates percentage discount correctly", () => {
    const price = { amount: "80.00", currencyCode: "USD" };
    const compareAtPrice = { amount: "100.00", currencyCode: "USD" };

    expect(calculateDiscount(price, compareAtPrice)).toBe(20);
  });

  it("returns 0 when prices are equal", () => {
    const price = { amount: "50.00", currencyCode: "USD" };
    const compareAtPrice = { amount: "50.00", currencyCode: "USD" };

    expect(calculateDiscount(price, compareAtPrice)).toBe(0);
  });

  it("returns 0 when compare price is lower (no discount)", () => {
    const price = { amount: "100.00", currencyCode: "USD" };
    const compareAtPrice = { amount: "80.00", currencyCode: "USD" };

    expect(calculateDiscount(price, compareAtPrice)).toBe(0);
  });

  it("rounds discount to nearest integer", () => {
    const price = { amount: "33.33", currencyCode: "USD" };
    const compareAtPrice = { amount: "100.00", currencyCode: "USD" };

    expect(calculateDiscount(price, compareAtPrice)).toBe(67);
  });

  it("returns 0 when compare price is zero", () => {
    const price = { amount: "50.00", currencyCode: "USD" };
    const compareAtPrice = { amount: "0.00", currencyCode: "USD" };

    expect(calculateDiscount(price, compareAtPrice)).toBe(0);
  });

  it("handles 100% discount (free item)", () => {
    const price = { amount: "0.00", currencyCode: "USD" };
    const compareAtPrice = { amount: "50.00", currencyCode: "USD" };

    expect(calculateDiscount(price, compareAtPrice)).toBe(100);
  });

  it("calculates small discount percentages", () => {
    const price = { amount: "95.00", currencyCode: "USD" };
    const compareAtPrice = { amount: "100.00", currencyCode: "USD" };

    expect(calculateDiscount(price, compareAtPrice)).toBe(5);
  });
});
