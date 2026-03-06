import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { CartView } from "./CartView";
import type { Cart } from "@/lib/shopify/types";

const mockCart: Cart = {
  id: "cart-1",
  checkoutUrl: "https://shop.myshopify.com/checkout/cart-1",
  totalQuantity: 2,
  cost: {
    totalAmount: { amount: "59.98", currencyCode: "USD" },
    subtotalAmount: { amount: "59.98", currencyCode: "USD" },
    totalTaxAmount: null,
  },
  lines: [
    {
      id: "line-1",
      quantity: 1,
      merchandiseId: "variant-1",
      variantTitle: "M / Black",
      productHandle: "classic-tee",
      productTitle: "Classic Tee",
      productImage: {
        url: "https://cdn.shopify.com/tee.jpg",
        altText: "Classic Tee",
        width: 800,
        height: 800,
      },
      price: { amount: "29.99", currencyCode: "USD" },
      selectedOptions: [{ name: "Size", value: "M" }],
      totalAmount: { amount: "29.99", currencyCode: "USD" },
    },
    {
      id: "line-2",
      quantity: 1,
      merchandiseId: "variant-2",
      variantTitle: "One Size",
      productHandle: "beanie",
      productTitle: "Winter Beanie",
      productImage: null,
      price: { amount: "29.99", currencyCode: "USD" },
      selectedOptions: [{ name: "Size", value: "One Size" }],
      totalAmount: { amount: "29.99", currencyCode: "USD" },
    },
  ],
};

describe("CartView", () => {
  const onUpdateQuantity = vi.fn();
  const onRemove = vi.fn();

  it("renders shopping cart heading", () => {
    render(
      <CartView
        cart={mockCart}
        onUpdateQuantity={onUpdateQuantity}
        onRemove={onRemove}
      />,
    );
    expect(screen.getByText("Shopping Cart")).toBeInTheDocument();
  });

  it("renders all cart line items", () => {
    render(
      <CartView
        cart={mockCart}
        onUpdateQuantity={onUpdateQuantity}
        onRemove={onRemove}
      />,
    );
    expect(screen.getByText("Classic Tee")).toBeInTheDocument();
    expect(screen.getByText("Winter Beanie")).toBeInTheDocument();
  });

  it("renders cart summary", () => {
    render(
      <CartView
        cart={mockCart}
        onUpdateQuantity={onUpdateQuantity}
        onRemove={onRemove}
      />,
    );
    expect(screen.getByTestId("cart-summary")).toBeInTheDocument();
  });

  it("renders checkout link", () => {
    render(
      <CartView
        cart={mockCart}
        onUpdateQuantity={onUpdateQuantity}
        onRemove={onRemove}
      />,
    );
    const link = screen.getByTestId("checkout-link");
    expect(link).toHaveAttribute(
      "href",
      "https://shop.myshopify.com/checkout/cart-1",
    );
  });

  it("passes isLoading to line items", () => {
    render(
      <CartView
        cart={mockCart}
        onUpdateQuantity={onUpdateQuantity}
        onRemove={onRemove}
        isLoading
      />,
    );
    const lineItems = screen.getAllByTestId("cart-line-item");
    lineItems.forEach((item) => {
      expect(item.className).toContain("opacity-50");
    });
  });
});
