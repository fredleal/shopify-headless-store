import type { ShopifyProduct, Product } from "@/lib/shopify/types";
import { reshapeProduct } from "@/lib/shopify/types";

export const rawMockProducts: ShopifyProduct[] = [
  {
    id: "gid://shopify/Product/1",
    handle: "classic-leather-jacket",
    title: "Classic Leather Jacket",
    description: "Premium full-grain leather jacket with quilted lining.",
    descriptionHtml:
      "<p>Premium full-grain leather jacket with quilted lining.</p>",
    availableForSale: true,
    featuredImage: {
      url: "https://cdn.shopify.com/s/files/1/leather-jacket-front.jpg",
      altText: "Black leather jacket front view",
      width: 1200,
      height: 1600,
    },
    images: {
      edges: [
        {
          node: {
            url: "https://cdn.shopify.com/s/files/1/leather-jacket-front.jpg",
            altText: "Black leather jacket front view",
            width: 1200,
            height: 1600,
          },
        },
        {
          node: {
            url: "https://cdn.shopify.com/s/files/1/leather-jacket-back.jpg",
            altText: "Black leather jacket back view",
            width: 1200,
            height: 1600,
          },
        },
      ],
    },
    variants: {
      edges: [
        {
          node: {
            id: "gid://shopify/ProductVariant/101",
            title: "Small / Black",
            availableForSale: true,
            price: { amount: "299.00", currencyCode: "USD" },
            compareAtPrice: { amount: "399.00", currencyCode: "USD" },
            selectedOptions: [
              { name: "Size", value: "Small" },
              { name: "Color", value: "Black" },
            ],
            image: {
              url: "https://cdn.shopify.com/s/files/1/leather-jacket-front.jpg",
              altText: "Black leather jacket front view",
              width: 1200,
              height: 1600,
            },
          },
        },
        {
          node: {
            id: "gid://shopify/ProductVariant/102",
            title: "Medium / Black",
            availableForSale: true,
            price: { amount: "299.00", currencyCode: "USD" },
            compareAtPrice: { amount: "399.00", currencyCode: "USD" },
            selectedOptions: [
              { name: "Size", value: "Medium" },
              { name: "Color", value: "Black" },
            ],
            image: null,
          },
        },
        {
          node: {
            id: "gid://shopify/ProductVariant/103",
            title: "Large / Brown",
            availableForSale: false,
            price: { amount: "349.00", currencyCode: "USD" },
            compareAtPrice: null,
            selectedOptions: [
              { name: "Size", value: "Large" },
              { name: "Color", value: "Brown" },
            ],
            image: null,
          },
        },
      ],
    },
    options: [
      { id: "opt-1", name: "Size", values: ["Small", "Medium", "Large"] },
      { id: "opt-2", name: "Color", values: ["Black", "Brown"] },
    ],
    seo: {
      title: "Premium Leather Jacket - Handcrafted",
      description:
        "Shop our handcrafted leather jacket. Free shipping on orders over $200.",
    },
    tags: ["leather", "jacket", "outerwear", "premium"],
    priceRange: {
      minVariantPrice: { amount: "299.00", currencyCode: "USD" },
      maxVariantPrice: { amount: "349.00", currencyCode: "USD" },
    },
  },
  {
    id: "gid://shopify/Product/2",
    handle: "organic-cotton-tee",
    title: "Organic Cotton Tee",
    description: "Soft organic cotton t-shirt, ethically sourced.",
    descriptionHtml: "<p>Soft organic cotton t-shirt, ethically sourced.</p>",
    availableForSale: true,
    featuredImage: {
      url: "https://cdn.shopify.com/s/files/1/cotton-tee.jpg",
      altText: "White cotton tee",
      width: 800,
      height: 1000,
    },
    images: {
      edges: [
        {
          node: {
            url: "https://cdn.shopify.com/s/files/1/cotton-tee.jpg",
            altText: "White cotton tee",
            width: 800,
            height: 1000,
          },
        },
      ],
    },
    variants: {
      edges: [
        {
          node: {
            id: "gid://shopify/ProductVariant/201",
            title: "Small",
            availableForSale: true,
            price: { amount: "39.00", currencyCode: "USD" },
            compareAtPrice: null,
            selectedOptions: [{ name: "Size", value: "Small" }],
            image: null,
          },
        },
        {
          node: {
            id: "gid://shopify/ProductVariant/202",
            title: "Medium",
            availableForSale: true,
            price: { amount: "39.00", currencyCode: "USD" },
            compareAtPrice: null,
            selectedOptions: [{ name: "Size", value: "Medium" }],
            image: null,
          },
        },
      ],
    },
    options: [
      { id: "opt-3", name: "Size", values: ["Small", "Medium", "Large"] },
    ],
    seo: { title: null, description: null },
    tags: ["cotton", "tee", "organic"],
    priceRange: {
      minVariantPrice: { amount: "39.00", currencyCode: "USD" },
      maxVariantPrice: { amount: "39.00", currencyCode: "USD" },
    },
  },
  {
    id: "gid://shopify/Product/3",
    handle: "wool-beanie",
    title: "Merino Wool Beanie",
    description: "Warm merino wool beanie for cold weather.",
    descriptionHtml: "<p>Warm merino wool beanie for cold weather.</p>",
    availableForSale: false,
    featuredImage: null,
    images: { edges: [] },
    variants: {
      edges: [
        {
          node: {
            id: "gid://shopify/ProductVariant/301",
            title: "One Size",
            availableForSale: false,
            price: { amount: "29.99", currencyCode: "USD" },
            compareAtPrice: null,
            selectedOptions: [{ name: "Size", value: "One Size" }],
            image: null,
          },
        },
      ],
    },
    options: [{ id: "opt-4", name: "Size", values: ["One Size"] }],
    seo: { title: null, description: null },
    tags: ["wool", "beanie", "accessories"],
    priceRange: {
      minVariantPrice: { amount: "29.99", currencyCode: "USD" },
      maxVariantPrice: { amount: "29.99", currencyCode: "USD" },
    },
  },
];

export const mockProducts: Product[] = rawMockProducts.map(reshapeProduct);
