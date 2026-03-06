import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProductGrid } from "./ProductGrid";

const mockProducts = [
  {
    id: "gid://shopify/Product/1",
    handle: "leather-jacket",
    title: "Leather Jacket",
    description: "A leather jacket.",
    descriptionHtml: "<p>A leather jacket.</p>",
    availableForSale: true,
    featuredImage: {
      url: "https://cdn.shopify.com/s/files/1/jacket.jpg",
      altText: "Leather jacket",
      width: 800,
      height: 1000,
    },
    images: [],
    variants: [],
    options: [],
    seo: { title: null, description: null },
    tags: [],
    priceRange: {
      minVariantPrice: { amount: "299.00", currencyCode: "USD" },
      maxVariantPrice: { amount: "299.00", currencyCode: "USD" },
    },
  },
  {
    id: "gid://shopify/Product/2",
    handle: "cotton-tee",
    title: "Cotton Tee",
    description: "A cotton tee.",
    descriptionHtml: "<p>A cotton tee.</p>",
    availableForSale: true,
    featuredImage: null,
    images: [],
    variants: [],
    options: [],
    seo: { title: null, description: null },
    tags: [],
    priceRange: {
      minVariantPrice: { amount: "39.00", currencyCode: "USD" },
      maxVariantPrice: { amount: "39.00", currencyCode: "USD" },
    },
  },
];

describe("ProductGrid", () => {
  it("renders all products", () => {
    render(<ProductGrid products={mockProducts} />);

    expect(screen.getByText("Leather Jacket")).toBeInTheDocument();
    expect(screen.getByText("Cotton Tee")).toBeInTheDocument();
  });

  it("renders product links", () => {
    render(<ProductGrid products={mockProducts} />);

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute("href", "/products/leather-jacket");
    expect(links[1]).toHaveAttribute("href", "/products/cotton-tee");
  });

  it("shows empty message when no products", () => {
    render(<ProductGrid products={[]} />);

    expect(screen.getByText("No products found.")).toBeInTheDocument();
  });

  it("applies column classes via object-map", () => {
    const { container } = render(
      <ProductGrid products={mockProducts} columns={3} />,
    );

    const grid = container.firstChild as HTMLElement;
    expect(grid.className).toContain("lg:grid-cols-3");
  });

  it("defaults to 4 columns", () => {
    const { container } = render(<ProductGrid products={mockProducts} />);

    const grid = container.firstChild as HTMLElement;
    expect(grid.className).toContain("lg:grid-cols-4");
  });
});
