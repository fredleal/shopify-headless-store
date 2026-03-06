import { describe, it, expect } from "vitest";
import {
  generateProductJsonLd,
  generateBreadcrumbJsonLd,
  generateCollectionJsonLd,
} from "./json-ld";

const mockProduct = {
  id: "gid://shopify/Product/1",
  handle: "classic-leather-jacket",
  title: "Classic Leather Jacket",
  description: "Premium full-grain leather jacket with quilted lining.",
  featuredImage: {
    url: "https://cdn.shopify.com/s/files/1/leather-jacket.jpg",
    altText: "Black leather jacket front view",
    width: 1200,
    height: 1600,
  },
  priceRange: {
    minVariantPrice: { amount: "299.00", currencyCode: "USD" },
    maxVariantPrice: { amount: "349.00", currencyCode: "USD" },
  },
  seo: {
    title: "Premium Leather Jacket",
    description: "Shop our handcrafted leather jacket.",
  },
};

const mockProductNoImage = {
  ...mockProduct,
  id: "gid://shopify/Product/2",
  featuredImage: null,
};

const mockCollection = {
  id: "gid://shopify/Collection/1",
  handle: "winter-essentials",
  title: "Winter Essentials",
  description: "Stay warm with our curated winter collection.",
  image: null,
};

describe("generateProductJsonLd", () => {
  it("returns valid schema.org Product structure", () => {
    const jsonLd = generateProductJsonLd(
      mockProduct,
      "https://example.com/products/classic-leather-jacket",
    );

    expect(jsonLd["@context"]).toBe("https://schema.org");
    expect(jsonLd["@type"]).toBe("Product");
  });

  it("includes product name and description", () => {
    const jsonLd = generateProductJsonLd(
      mockProduct,
      "https://example.com/products/classic-leather-jacket",
    );

    expect(jsonLd.name).toBe("Classic Leather Jacket");
    expect(jsonLd.description).toBe(
      "Premium full-grain leather jacket with quilted lining.",
    );
  });

  it("includes featured image URL", () => {
    const jsonLd = generateProductJsonLd(
      mockProduct,
      "https://example.com/products/classic-leather-jacket",
    );

    expect(jsonLd.image).toBe(
      "https://cdn.shopify.com/s/files/1/leather-jacket.jpg",
    );
  });

  it("sets image to undefined when featuredImage is null", () => {
    const jsonLd = generateProductJsonLd(
      mockProductNoImage,
      "https://example.com/products/classic-leather-jacket",
    );

    expect(jsonLd.image).toBeUndefined();
  });

  it("includes AggregateOffer with price range", () => {
    const jsonLd = generateProductJsonLd(
      mockProduct,
      "https://example.com/products/classic-leather-jacket",
    );

    expect(jsonLd.offers["@type"]).toBe("AggregateOffer");
    expect(jsonLd.offers.lowPrice).toBe("299.00");
    expect(jsonLd.offers.highPrice).toBe("349.00");
    expect(jsonLd.offers.priceCurrency).toBe("USD");
    expect(jsonLd.offers.availability).toBe("https://schema.org/InStock");
  });

  it("includes the canonical URL", () => {
    const url = "https://example.com/products/classic-leather-jacket";
    const jsonLd = generateProductJsonLd(mockProduct, url);

    expect(jsonLd.url).toBe(url);
  });
});

describe("generateBreadcrumbJsonLd", () => {
  const breadcrumbItems = [
    { name: "Home", url: "https://example.com" },
    { name: "Products", url: "https://example.com/products" },
    {
      name: "Leather Jacket",
      url: "https://example.com/products/leather-jacket",
    },
  ];

  it("returns valid schema.org BreadcrumbList structure", () => {
    const jsonLd = generateBreadcrumbJsonLd(breadcrumbItems);

    expect(jsonLd["@context"]).toBe("https://schema.org");
    expect(jsonLd["@type"]).toBe("BreadcrumbList");
  });

  it("generates correct number of list items", () => {
    const jsonLd = generateBreadcrumbJsonLd(breadcrumbItems);

    expect(jsonLd.itemListElement).toHaveLength(3);
  });

  it("assigns sequential positions starting from 1", () => {
    const jsonLd = generateBreadcrumbJsonLd(breadcrumbItems);

    expect(jsonLd.itemListElement[0].position).toBe(1);
    expect(jsonLd.itemListElement[1].position).toBe(2);
    expect(jsonLd.itemListElement[2].position).toBe(3);
  });

  it("maps name and item (URL) correctly", () => {
    const jsonLd = generateBreadcrumbJsonLd(breadcrumbItems);

    expect(jsonLd.itemListElement[0].name).toBe("Home");
    expect(jsonLd.itemListElement[0].item).toBe("https://example.com");
    expect(jsonLd.itemListElement[2].name).toBe("Leather Jacket");
  });

  it("each item has ListItem type", () => {
    const jsonLd = generateBreadcrumbJsonLd(breadcrumbItems);

    jsonLd.itemListElement.forEach((element) => {
      expect(element["@type"]).toBe("ListItem");
    });
  });

  it("handles empty breadcrumb list", () => {
    const jsonLd = generateBreadcrumbJsonLd([]);

    expect(jsonLd.itemListElement).toEqual([]);
  });

  it("handles single breadcrumb item", () => {
    const jsonLd = generateBreadcrumbJsonLd([
      { name: "Home", url: "https://example.com" },
    ]);

    expect(jsonLd.itemListElement).toHaveLength(1);
    expect(jsonLd.itemListElement[0].position).toBe(1);
  });
});

describe("generateCollectionJsonLd", () => {
  it("returns valid schema.org CollectionPage structure", () => {
    const jsonLd = generateCollectionJsonLd(
      mockCollection,
      "https://example.com/collections/winter-essentials",
    );

    expect(jsonLd["@context"]).toBe("https://schema.org");
    expect(jsonLd["@type"]).toBe("CollectionPage");
  });

  it("includes collection name and description", () => {
    const jsonLd = generateCollectionJsonLd(
      mockCollection,
      "https://example.com/collections/winter-essentials",
    );

    expect(jsonLd.name).toBe("Winter Essentials");
    expect(jsonLd.description).toBe(
      "Stay warm with our curated winter collection.",
    );
  });

  it("includes the canonical URL", () => {
    const url = "https://example.com/collections/winter-essentials";
    const jsonLd = generateCollectionJsonLd(mockCollection, url);

    expect(jsonLd.url).toBe(url);
  });
});
