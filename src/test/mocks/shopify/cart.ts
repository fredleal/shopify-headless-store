import type { ShopifyCart, Cart } from "@/lib/shopify/types";
import { reshapeCart } from "@/lib/shopify/types";

export const rawMockCart: ShopifyCart = {
  id: "gid://shopify/Cart/1",
  checkoutUrl: "https://test-store.myshopify.com/cart/c/abc123",
  totalQuantity: 3,
  cost: {
    totalAmount: { amount: "367.99", currencyCode: "USD" },
    subtotalAmount: { amount: "337.99", currencyCode: "USD" },
    totalTaxAmount: { amount: "30.00", currencyCode: "USD" },
  },
  lines: {
    edges: [
      {
        node: {
          id: "gid://shopify/CartLine/1",
          quantity: 2,
          merchandise: {
            id: "gid://shopify/ProductVariant/101",
            title: "Small / Black",
            product: {
              handle: "classic-leather-jacket",
              title: "Classic Leather Jacket",
              featuredImage: {
                url: "https://cdn.shopify.com/s/files/1/leather-jacket-front.jpg",
                altText: "Black leather jacket front view",
                width: 1200,
                height: 1600,
              },
            },
            price: { amount: "299.00", currencyCode: "USD" },
            selectedOptions: [
              { name: "Size", value: "Small" },
              { name: "Color", value: "Black" },
            ],
          },
          cost: {
            totalAmount: { amount: "598.00", currencyCode: "USD" },
          },
        },
      },
      {
        node: {
          id: "gid://shopify/CartLine/2",
          quantity: 1,
          merchandise: {
            id: "gid://shopify/ProductVariant/201",
            title: "Small",
            product: {
              handle: "organic-cotton-tee",
              title: "Organic Cotton Tee",
              featuredImage: {
                url: "https://cdn.shopify.com/s/files/1/cotton-tee.jpg",
                altText: "White cotton tee",
                width: 800,
                height: 1000,
              },
            },
            price: { amount: "39.00", currencyCode: "USD" },
            selectedOptions: [{ name: "Size", value: "Small" }],
          },
          cost: {
            totalAmount: { amount: "39.00", currencyCode: "USD" },
          },
        },
      },
    ],
  },
};

export const mockCart: Cart = reshapeCart(rawMockCart);
