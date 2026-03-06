import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProductCard } from "./ProductCard";

const mockProduct = {
  id: "gid://shopify/Product/1",
  handle: "classic-leather-jacket",
  title: "Classic Leather Jacket",
  description: "Premium full-grain leather jacket.",
  descriptionHtml: "<p>Premium full-grain leather jacket.</p>",
  availableForSale: true,
  featuredImage: {
    url: "https://cdn.shopify.com/s/files/1/leather-jacket.jpg",
    altText: "Black leather jacket",
    width: 1200,
    height: 1600,
  },
  images: [],
  variants: [],
  options: [],
  seo: { title: null, description: null },
  tags: [],
  priceRange: {
    minVariantPrice: { amount: "299.00", currencyCode: "USD" },
    maxVariantPrice: { amount: "349.00", currencyCode: "USD" },
  },
};

const soldOutProduct = {
  ...mockProduct,
  id: "gid://shopify/Product/2",
  handle: "sold-out-item",
  title: "Sold Out Item",
  availableForSale: false,
  featuredImage: null,
};

describe("ProductCard", () => {
  it("renders product title", () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText("Classic Leather Jacket")).toBeInTheDocument();
  });

  it("links to the correct product page", () => {
    render(<ProductCard product={mockProduct} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/products/classic-leather-jacket");
  });

  it("renders the product price", () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText("$299.00")).toBeInTheDocument();
  });

  it("renders product image with alt text", () => {
    render(<ProductCard product={mockProduct} />);

    const img = screen.getByAltText("Black leather jacket");
    expect(img).toBeInTheDocument();
  });

  it("shows 'No image' placeholder when featuredImage is null", () => {
    render(<ProductCard product={soldOutProduct} />);

    expect(screen.getByText("No image")).toBeInTheDocument();
  });

  it("shows 'Sold out' badge when product is not available", () => {
    render(<ProductCard product={soldOutProduct} />);

    expect(screen.getByText("SOLD OUT")).toBeInTheDocument();
  });

  it("does not show 'Sold out' badge when product is available", () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.queryByText("SOLD OUT")).not.toBeInTheDocument();
  });

  it("applies variant classes via object-map", () => {
    const { container } = render(
      <ProductCard product={mockProduct} variant="featured" />,
    );

    const link = container.querySelector("a");
    expect(link?.className).toContain("border-2");
  });

  it("applies custom className", () => {
    const { container } = render(
      <ProductCard product={mockProduct} className="my-custom" />,
    );

    const link = container.querySelector("a");
    expect(link?.className).toContain("my-custom");
  });
});
