import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CartSummary } from "./CartSummary";

const defaultProps = {
  subtotal: { amount: "59.98", currencyCode: "USD" },
  total: { amount: "64.78", currencyCode: "USD" },
  tax: { amount: "4.80", currencyCode: "USD" },
  totalQuantity: 2,
  checkoutUrl: "https://shop.myshopify.com/checkout/cart-1",
};

describe("CartSummary", () => {
  it("renders order summary heading", () => {
    render(<CartSummary {...defaultProps} />);
    expect(screen.getByText("Order Summary")).toBeInTheDocument();
  });

  it("renders subtotal with item count", () => {
    render(<CartSummary {...defaultProps} />);
    expect(screen.getByText("Subtotal (2 items)")).toBeInTheDocument();
    expect(screen.getByText("$59.98")).toBeInTheDocument();
  });

  it("renders singular item text for 1 item", () => {
    render(<CartSummary {...defaultProps} totalQuantity={1} />);
    expect(screen.getByText("Subtotal (1 item)")).toBeInTheDocument();
  });

  it("renders tax when present", () => {
    render(<CartSummary {...defaultProps} />);
    expect(screen.getByText("Tax")).toBeInTheDocument();
    expect(screen.getByText("$4.80")).toBeInTheDocument();
  });

  it("hides tax row when tax is null", () => {
    render(<CartSummary {...defaultProps} tax={null} />);
    expect(screen.queryByText("Tax")).not.toBeInTheDocument();
  });

  it("hides tax row when tax amount is zero", () => {
    render(
      <CartSummary
        {...defaultProps}
        tax={{ amount: "0.00", currencyCode: "USD" }}
      />,
    );
    expect(screen.queryByText("Tax")).not.toBeInTheDocument();
  });

  it("renders total amount", () => {
    render(<CartSummary {...defaultProps} />);
    expect(screen.getByText("Total")).toBeInTheDocument();
    expect(screen.getByText("$64.78")).toBeInTheDocument();
  });

  it("renders checkout link pointing to Shopify checkout", () => {
    render(<CartSummary {...defaultProps} />);
    const link = screen.getByTestId("checkout-link");
    expect(link).toHaveAttribute(
      "href",
      "https://shop.myshopify.com/checkout/cart-1",
    );
    expect(link).toHaveTextContent("Proceed to Checkout");
  });

  it("disables checkout link when cart is empty", () => {
    render(<CartSummary {...defaultProps} totalQuantity={0} />);
    const link = screen.getByTestId("checkout-link");
    expect(link).toHaveAttribute("aria-disabled", "true");
    expect(link.className).toContain("pointer-events-none");
  });
});
