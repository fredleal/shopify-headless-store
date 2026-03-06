import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StoreHeader } from "./StoreHeader";

describe("StoreHeader", () => {
  it("renders the store name as a link to home", () => {
    render(<StoreHeader />);

    const homeLink = screen.getByRole("link", {
      name: /shopify headless store/i,
    });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute("href", "/");
  });

  it("renders navigation link to Products", () => {
    render(<StoreHeader />);

    const productsLink = screen.getByRole("link", { name: /products/i });
    expect(productsLink).toBeInTheDocument();
    expect(productsLink).toHaveAttribute("href", "/products");
  });

  it("renders navigation link to Collections", () => {
    render(<StoreHeader />);

    const collectionsLink = screen.getByRole("link", {
      name: /collections/i,
    });
    expect(collectionsLink).toBeInTheDocument();
    expect(collectionsLink).toHaveAttribute("href", "/collections");
  });

  it("renders navigation link to Cart with aria-label", () => {
    render(<StoreHeader />);

    const cartLink = screen.getByRole("link", { name: /shopping cart/i });
    expect(cartLink).toBeInTheDocument();
    expect(cartLink).toHaveAttribute("href", "/cart");
  });

  it("renders inside a header element", () => {
    render(<StoreHeader />);

    const header = document.querySelector("header");
    expect(header).toBeInTheDocument();
  });
});
