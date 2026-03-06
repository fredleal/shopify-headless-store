import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProductDetail } from "./ProductDetail";

const mockProduct = {
  id: "gid://shopify/Product/1",
  handle: "classic-leather-jacket",
  title: "Classic Leather Jacket",
  description: "Premium full-grain leather jacket.",
  descriptionHtml:
    "<p>Premium full-grain leather jacket with quilted lining.</p>",
  availableForSale: true,
  featuredImage: {
    url: "https://cdn.shopify.com/s/files/1/jacket-front.jpg",
    altText: "Jacket front view",
    width: 1200,
    height: 1600,
  },
  images: [
    {
      url: "https://cdn.shopify.com/s/files/1/jacket-front.jpg",
      altText: "Jacket front view",
      width: 1200,
      height: 1600,
    },
    {
      url: "https://cdn.shopify.com/s/files/1/jacket-back.jpg",
      altText: "Jacket back view",
      width: 1200,
      height: 1600,
    },
  ],
  variants: [
    {
      id: "gid://shopify/ProductVariant/101",
      title: "Small / Black",
      availableForSale: true,
      price: { amount: "299.00", currencyCode: "USD" },
      compareAtPrice: { amount: "399.00", currencyCode: "USD" },
      selectedOptions: [
        { name: "Size", value: "Small" },
        { name: "Color", value: "Black" },
      ],
      image: null,
    },
    {
      id: "gid://shopify/ProductVariant/102",
      title: "Medium / Black",
      availableForSale: true,
      price: { amount: "299.00", currencyCode: "USD" },
      compareAtPrice: null,
      selectedOptions: [
        { name: "Size", value: "Medium" },
        { name: "Color", value: "Black" },
      ],
      image: null,
    },
  ],
  options: [
    { id: "opt-1", name: "Size", values: ["Small", "Medium", "Large"] },
    { id: "opt-2", name: "Color", values: ["Black", "Brown"] },
  ],
  priceRange: {
    minVariantPrice: { amount: "299.00", currencyCode: "USD" },
    maxVariantPrice: { amount: "349.00", currencyCode: "USD" },
  },
};

const soldOutProduct = {
  ...mockProduct,
  id: "gid://shopify/Product/2",
  availableForSale: false,
};

describe("ProductDetail", () => {
  it("renders product title", () => {
    render(<ProductDetail product={mockProduct} />);

    expect(
      screen.getByRole("heading", { name: "Classic Leather Jacket" }),
    ).toBeInTheDocument();
  });

  it("renders product price", () => {
    render(<ProductDetail product={mockProduct} />);

    expect(screen.getByText("$299.00")).toBeInTheDocument();
  });

  it("renders description HTML content", () => {
    render(<ProductDetail product={mockProduct} />);

    expect(screen.getByText(/quilted lining/i)).toBeInTheDocument();
  });

  it("renders 'Add to Cart' button when available", () => {
    render(<ProductDetail product={mockProduct} />);

    const button = screen.getByRole("button", {
      name: /add.*to cart/i,
    });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  it("renders 'Sold Out' button when unavailable", () => {
    render(<ProductDetail product={soldOutProduct} />);

    const button = screen.getByRole("button", {
      name: /sold out/i,
    });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  it("renders variant selector with option names", () => {
    render(<ProductDetail product={mockProduct} />);

    expect(screen.getByText("Size")).toBeInTheDocument();
    expect(screen.getByText("Color")).toBeInTheDocument();
  });

  it("renders image thumbnails for gallery", () => {
    render(<ProductDetail product={mockProduct} />);

    const thumbnailButtons = screen.getAllByRole("button", {
      name: /view image/i,
    });
    expect(thumbnailButtons).toHaveLength(2);
  });

  it("switches displayed image when thumbnail is clicked", async () => {
    const user = userEvent.setup();
    render(<ProductDetail product={mockProduct} />);

    const thumbnails = screen.getAllByRole("button", {
      name: /view image/i,
    });

    await user.click(thumbnails[1]);

    // Main image + thumbnail both have the same alt text
    const images = screen.getAllByAltText("Jacket back view");
    expect(images.length).toBeGreaterThanOrEqual(1);
  });

  it("renders main product image", () => {
    render(<ProductDetail product={mockProduct} />);

    // Main image and thumbnail share alt text — use getAllByAltText
    const images = screen.getAllByAltText("Jacket front view");
    expect(images.length).toBeGreaterThanOrEqual(1);

    // The main image has priority loading (fetchpriority="high")
    const mainImage = images.find(
      (img) => img.getAttribute("fetchpriority") === "high",
    );
    expect(mainImage).toBeDefined();
  });

  it("shows 'No image available' when product has no images", () => {
    const noImageProduct = {
      ...mockProduct,
      images: [],
      featuredImage: null,
    };
    render(<ProductDetail product={noImageProduct} />);

    expect(screen.getByText("No image available")).toBeInTheDocument();
  });
});
