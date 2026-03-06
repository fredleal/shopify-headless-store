import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CartLineItem } from "./CartLineItem";
import type { CartLine } from "@/lib/shopify/types";

const mockLine: CartLine = {
  id: "line-1",
  quantity: 2,
  merchandiseId: "variant-1",
  variantTitle: "M / Black",
  productHandle: "classic-tee",
  productTitle: "Classic Tee",
  productImage: {
    url: "https://cdn.shopify.com/tee.jpg",
    altText: "Classic Tee front",
    width: 800,
    height: 800,
  },
  price: { amount: "29.99", currencyCode: "USD" },
  selectedOptions: [
    { name: "Size", value: "M" },
    { name: "Color", value: "Black" },
  ],
  totalAmount: { amount: "59.98", currencyCode: "USD" },
};

const mockLineNoImage: CartLine = {
  ...mockLine,
  id: "line-2",
  productImage: null,
  variantTitle: "",
};

describe("CartLineItem", () => {
  const onUpdateQuantity = vi.fn();
  const onRemove = vi.fn();

  it("renders product title", () => {
    render(
      <CartLineItem
        line={mockLine}
        onUpdateQuantity={onUpdateQuantity}
        onRemove={onRemove}
      />,
    );
    expect(screen.getByText("Classic Tee")).toBeInTheDocument();
  });

  it("renders variant title", () => {
    render(
      <CartLineItem
        line={mockLine}
        onUpdateQuantity={onUpdateQuantity}
        onRemove={onRemove}
      />,
    );
    expect(screen.getByText("M / Black")).toBeInTheDocument();
  });

  it("renders price", () => {
    render(
      <CartLineItem
        line={mockLine}
        onUpdateQuantity={onUpdateQuantity}
        onRemove={onRemove}
      />,
    );
    expect(screen.getByText("$29.99")).toBeInTheDocument();
  });

  it("renders quantity", () => {
    render(
      <CartLineItem
        line={mockLine}
        onUpdateQuantity={onUpdateQuantity}
        onRemove={onRemove}
      />,
    );
    expect(screen.getByTestId("quantity-display")).toHaveTextContent("2");
  });

  it("renders product image when available", () => {
    render(
      <CartLineItem
        line={mockLine}
        onUpdateQuantity={onUpdateQuantity}
        onRemove={onRemove}
      />,
    );
    const img = screen.getByAltText("Classic Tee front");
    expect(img).toBeInTheDocument();
  });

  it("renders placeholder when no image", () => {
    render(
      <CartLineItem
        line={mockLineNoImage}
        onUpdateQuantity={onUpdateQuantity}
        onRemove={onRemove}
      />,
    );
    expect(screen.getByText("No image")).toBeInTheDocument();
  });

  it("calls onUpdateQuantity with decremented value on minus click", async () => {
    const user = userEvent.setup();
    render(
      <CartLineItem
        line={mockLine}
        onUpdateQuantity={onUpdateQuantity}
        onRemove={onRemove}
      />,
    );
    const minusBtn = screen.getByLabelText("Decrease quantity of Classic Tee");
    await user.click(minusBtn);
    expect(onUpdateQuantity).toHaveBeenCalledWith("line-1", 1);
  });

  it("calls onUpdateQuantity with incremented value on plus click", async () => {
    const user = userEvent.setup();
    render(
      <CartLineItem
        line={mockLine}
        onUpdateQuantity={onUpdateQuantity}
        onRemove={onRemove}
      />,
    );
    const plusBtn = screen.getByLabelText("Increase quantity of Classic Tee");
    await user.click(plusBtn);
    expect(onUpdateQuantity).toHaveBeenCalledWith("line-1", 3);
  });

  it("calls onRemove when remove button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <CartLineItem
        line={mockLine}
        onUpdateQuantity={onUpdateQuantity}
        onRemove={onRemove}
      />,
    );
    const removeBtn = screen.getByLabelText("Remove Classic Tee from cart");
    await user.click(removeBtn);
    expect(onRemove).toHaveBeenCalledWith("line-1");
  });

  it("applies disabled styling when loading", () => {
    render(
      <CartLineItem
        line={mockLine}
        onUpdateQuantity={onUpdateQuantity}
        onRemove={onRemove}
        isLoading
      />,
    );
    const container = screen.getByTestId("cart-line-item");
    expect(container.className).toContain("opacity-50");
  });
});
