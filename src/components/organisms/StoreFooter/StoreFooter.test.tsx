import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StoreFooter } from "./StoreFooter";

describe("StoreFooter", () => {
  it("renders copyright text with current year", () => {
    render(<StoreFooter />);

    const currentYear = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(currentYear))).toBeInTheDocument();
  });

  it("renders link to Storefront API docs", () => {
    render(<StoreFooter />);

    const apiLink = screen.getByRole("link", { name: /storefront api/i });
    expect(apiLink).toBeInTheDocument();
    expect(apiLink).toHaveAttribute(
      "href",
      "https://shopify.dev/docs/api/storefront",
    );
    expect(apiLink).toHaveAttribute("target", "_blank");
    expect(apiLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders link to GitHub repo", () => {
    render(<StoreFooter />);

    const ghLink = screen.getByRole("link", { name: /github/i });
    expect(ghLink).toBeInTheDocument();
    expect(ghLink).toHaveAttribute("target", "_blank");
  });

  it("renders inside a footer element", () => {
    render(<StoreFooter />);

    const footer = document.querySelector("footer");
    expect(footer).toBeInTheDocument();
  });
});
