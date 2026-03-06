import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CollectionCard } from "./CollectionCard";

const mockCollection = {
  id: "gid://shopify/Collection/1",
  handle: "winter-essentials",
  title: "Winter Essentials",
  description: "Stay warm with our curated winter collection.",
  image: {
    url: "https://cdn.shopify.com/s/files/1/winter.jpg",
    altText: "Winter collection banner",
    width: 1920,
    height: 1080,
  },
};

const mockCollectionNoImage = {
  ...mockCollection,
  id: "gid://shopify/Collection/2",
  handle: "new-arrivals",
  title: "New Arrivals",
  description: "",
  image: null,
};

describe("CollectionCard", () => {
  it("renders collection title", () => {
    render(<CollectionCard collection={mockCollection} />);

    expect(screen.getByText("Winter Essentials")).toBeInTheDocument();
  });

  it("links to the correct collection page", () => {
    render(<CollectionCard collection={mockCollection} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/collections/winter-essentials");
  });

  it("renders collection description when present", () => {
    render(<CollectionCard collection={mockCollection} />);

    expect(
      screen.getByText("Stay warm with our curated winter collection."),
    ).toBeInTheDocument();
  });

  it("does not render description when empty", () => {
    render(<CollectionCard collection={mockCollectionNoImage} />);

    const paragraphs = document.querySelectorAll("p");
    const descriptionP = Array.from(paragraphs).find(
      (p) =>
        p.textContent &&
        p.textContent.length > 0 &&
        !p.textContent.includes("product"),
    );
    expect(descriptionP).toBeUndefined();
  });

  it("renders collection image with alt text", () => {
    render(<CollectionCard collection={mockCollection} />);

    const img = screen.getByAltText("Winter collection banner");
    expect(img).toBeInTheDocument();
  });

  it("shows 'No image' placeholder when image is null", () => {
    render(<CollectionCard collection={mockCollectionNoImage} />);

    expect(screen.getByText("No image")).toBeInTheDocument();
  });

  it("renders product count when provided", () => {
    render(<CollectionCard collection={mockCollection} productCount={12} />);

    expect(screen.getByText("12 products")).toBeInTheDocument();
  });

  it("uses singular 'product' for count of 1", () => {
    render(<CollectionCard collection={mockCollection} productCount={1} />);

    expect(screen.getByText("1 product")).toBeInTheDocument();
  });

  it("does not render product count when not provided", () => {
    render(<CollectionCard collection={mockCollection} />);

    expect(screen.queryByText(/product/i)).not.toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <CollectionCard collection={mockCollection} className="test-class" />,
    );

    const link = container.querySelector("a");
    expect(link?.className).toContain("test-class");
  });
});
