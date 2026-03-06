import { describe, it, expect } from "vitest";
import {
  generateProductMetadata,
  generateCollectionMetadata,
  generateBaseMetadata,
} from "./metadata";

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
    title: "Premium Leather Jacket - Handcrafted",
    description: "Shop our handcrafted leather jacket. Free shipping.",
  },
};

const mockProductNoSeo = {
  ...mockProduct,
  id: "gid://shopify/Product/2",
  handle: "basic-tee",
  title: "Basic Cotton Tee",
  description: "Comfortable everyday cotton t-shirt.",
  featuredImage: null,
  seo: { title: null, description: null },
};

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

describe("generateProductMetadata", () => {
  it("returns correct title from seo fields", () => {
    const metadata = generateProductMetadata(mockProduct);
    expect(metadata.title).toBe(
      "Premium Leather Jacket - Handcrafted | Shopify Headless Store",
    );
  });

  it("returns correct description from seo fields", () => {
    const metadata = generateProductMetadata(mockProduct);
    expect(metadata.description).toBe(
      "Shop our handcrafted leather jacket. Free shipping.",
    );
  });

  it("includes OpenGraph tags with image", () => {
    const metadata = generateProductMetadata(mockProduct);
    const og = metadata.openGraph;

    expect(og).toBeDefined();
    expect(og?.title).toBe("Premium Leather Jacket - Handcrafted");
    expect(og?.type).toBe("website");
    expect(og?.siteName).toBe("Shopify Headless Store");

    const images = og?.images as Array<{
      url: string;
      width: number;
      height: number;
      alt: string;
    }>;
    expect(images).toHaveLength(1);
    expect(images[0].url).toBe(
      "https://cdn.shopify.com/s/files/1/leather-jacket.jpg",
    );
    expect(images[0].alt).toBe("Black leather jacket front view");
  });

  it("includes Twitter card metadata", () => {
    const metadata = generateProductMetadata(mockProduct);
    const twitter = metadata.twitter;

    expect(twitter?.card).toBe("summary_large_image");
    expect(twitter?.title).toBe("Premium Leather Jacket - Handcrafted");
    expect(twitter?.images).toEqual([
      "https://cdn.shopify.com/s/files/1/leather-jacket.jpg",
    ]);
  });

  it("falls back to product title when seo.title is null", () => {
    const metadata = generateProductMetadata(mockProductNoSeo);
    expect(metadata.title).toBe("Basic Cotton Tee | Shopify Headless Store");
  });

  it("falls back to product description when seo.description is null", () => {
    const metadata = generateProductMetadata(mockProductNoSeo);
    expect(metadata.description).toBe("Comfortable everyday cotton t-shirt.");
  });

  it("returns empty images array when featuredImage is null", () => {
    const metadata = generateProductMetadata(mockProductNoSeo);

    const og = metadata.openGraph;
    const images = og?.images as Array<Record<string, unknown>>;
    expect(images).toEqual([]);

    const twitter = metadata.twitter;
    expect(twitter?.images).toEqual([]);
  });

  it("uses product title as alt text fallback when altText is null", () => {
    const productWithNullAlt = {
      ...mockProduct,
      featuredImage: { ...mockProduct.featuredImage, altText: null },
      seo: { title: null, description: null },
    };
    const metadata = generateProductMetadata(productWithNullAlt);

    const images = metadata.openGraph?.images as Array<{ alt: string }>;
    expect(images[0].alt).toBe("Classic Leather Jacket");
  });

  it("generates correct product URL in OpenGraph", () => {
    const metadata = generateProductMetadata(mockProduct);
    const og = metadata.openGraph;
    expect(og?.url).toContain("/products/classic-leather-jacket");
  });
});

describe("generateCollectionMetadata", () => {
  it("returns correct title", () => {
    const metadata = generateCollectionMetadata(mockCollection);
    expect(metadata.title).toBe("Winter Essentials | Shopify Headless Store");
  });

  it("returns collection description", () => {
    const metadata = generateCollectionMetadata(mockCollection);
    expect(metadata.description).toBe(
      "Stay warm with our curated winter collection.",
    );
  });

  it("falls back to generated description when empty", () => {
    const metadata = generateCollectionMetadata(mockCollectionNoImage);
    expect(metadata.description).toBe("Browse New Arrivals collection");
  });

  it("includes OpenGraph image when collection has image", () => {
    const metadata = generateCollectionMetadata(mockCollection);

    const images = metadata.openGraph?.images as Array<{
      url: string;
      alt: string;
    }>;
    expect(images).toHaveLength(1);
    expect(images[0].url).toBe("https://cdn.shopify.com/s/files/1/winter.jpg");
    expect(images[0].alt).toBe("Winter collection banner");
  });

  it("returns empty images array when collection image is null", () => {
    const metadata = generateCollectionMetadata(mockCollectionNoImage);

    const images = metadata.openGraph?.images as Array<Record<string, unknown>>;
    expect(images).toEqual([]);
  });

  it("generates correct collection URL in OpenGraph", () => {
    const metadata = generateCollectionMetadata(mockCollection);
    expect(metadata.openGraph?.url).toContain("/collections/winter-essentials");
  });
});

describe("generateBaseMetadata", () => {
  it("returns title template configuration", () => {
    const metadata = generateBaseMetadata();
    const title = metadata.title as { default: string; template: string };

    expect(title.default).toBe("Shopify Headless Store");
    expect(title.template).toBe("%s | Shopify Headless Store");
  });

  it("returns site description", () => {
    const metadata = generateBaseMetadata();
    expect(metadata.description).toBe(
      "Premium headless storefront powered by Next.js and Shopify",
    );
  });

  it("sets metadataBase URL", () => {
    const metadata = generateBaseMetadata();
    expect(metadata.metadataBase).toBeInstanceOf(URL);
  });

  it("configures OpenGraph defaults", () => {
    const metadata = generateBaseMetadata();
    expect(metadata.openGraph?.type).toBe("website");
    expect(metadata.openGraph?.siteName).toBe("Shopify Headless Store");
    expect(metadata.openGraph?.locale).toBe("en_US");
  });

  it("allows search engine indexing", () => {
    const metadata = generateBaseMetadata();
    const robots = metadata.robots as { index: boolean; follow: boolean };
    expect(robots.index).toBe(true);
    expect(robots.follow).toBe(true);
  });
});
