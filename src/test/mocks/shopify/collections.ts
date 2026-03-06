import type { ShopifyCollection, Collection } from "@/lib/shopify/types";
import { reshapeCollection } from "@/lib/shopify/types";
import { rawMockProducts } from "./products";

export const rawMockCollections: ShopifyCollection[] = [
  {
    id: "gid://shopify/Collection/1",
    handle: "winter-essentials",
    title: "Winter Essentials",
    description: "Stay warm with our curated winter collection.",
    image: {
      url: "https://cdn.shopify.com/s/files/1/winter-collection.jpg",
      altText: "Winter collection banner",
      width: 1920,
      height: 1080,
    },
    products: {
      edges: [{ node: rawMockProducts[0] }, { node: rawMockProducts[2] }],
    },
  },
  {
    id: "gid://shopify/Collection/2",
    handle: "everyday-basics",
    title: "Everyday Basics",
    description: "Essential pieces for your everyday wardrobe.",
    image: {
      url: "https://cdn.shopify.com/s/files/1/basics-collection.jpg",
      altText: "Everyday basics collection",
      width: 1920,
      height: 1080,
    },
    products: {
      edges: [{ node: rawMockProducts[1] }],
    },
  },
];

export const mockCollections: Collection[] =
  rawMockCollections.map(reshapeCollection);
