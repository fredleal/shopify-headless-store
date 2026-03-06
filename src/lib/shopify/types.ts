// Raw Shopify Storefront API types
export interface ShopifyMoneyV2 {
  amount: string;
  currencyCode: string;
}

export interface ShopifyImage {
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

export interface ShopifyProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  price: ShopifyMoneyV2;
  compareAtPrice: ShopifyMoneyV2 | null;
  selectedOptions: { name: string; value: string }[];
  image: ShopifyImage | null;
}

export interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  availableForSale: boolean;
  featuredImage: ShopifyImage | null;
  images: { edges: { node: ShopifyImage }[] };
  variants: { edges: { node: ShopifyProductVariant }[] };
  options: { id: string; name: string; values: string[] }[];
  seo: { title: string | null; description: string | null };
  tags: string[];
  priceRange: {
    minVariantPrice: ShopifyMoneyV2;
    maxVariantPrice: ShopifyMoneyV2;
  };
}

export interface ShopifyCollection {
  id: string;
  handle: string;
  title: string;
  description: string;
  image: ShopifyImage | null;
  products: { edges: { node: ShopifyProduct }[] };
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    totalAmount: ShopifyMoneyV2;
    subtotalAmount: ShopifyMoneyV2;
    totalTaxAmount: ShopifyMoneyV2 | null;
  };
  lines: {
    edges: {
      node: {
        id: string;
        quantity: number;
        merchandise: {
          id: string;
          title: string;
          product: {
            handle: string;
            title: string;
            featuredImage: ShopifyImage | null;
          };
          price: ShopifyMoneyV2;
          selectedOptions: { name: string; value: string }[];
        };
        cost: {
          totalAmount: ShopifyMoneyV2;
        };
      };
    }[];
  };
}

// Reshaped types (flattened edges/nodes for easier consumption)
export interface Product {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  availableForSale: boolean;
  featuredImage: ShopifyImage | null;
  images: ShopifyImage[];
  variants: ShopifyProductVariant[];
  options: { id: string; name: string; values: string[] }[];
  seo: { title: string | null; description: string | null };
  tags: string[];
  priceRange: {
    minVariantPrice: ShopifyMoneyV2;
    maxVariantPrice: ShopifyMoneyV2;
  };
}

export interface Collection {
  id: string;
  handle: string;
  title: string;
  description: string;
  image: ShopifyImage | null;
  products: Product[];
}

export interface CartLine {
  id: string;
  quantity: number;
  merchandiseId: string;
  variantTitle: string;
  productHandle: string;
  productTitle: string;
  productImage: ShopifyImage | null;
  price: ShopifyMoneyV2;
  selectedOptions: { name: string; value: string }[];
  totalAmount: ShopifyMoneyV2;
}

export interface Cart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    totalAmount: ShopifyMoneyV2;
    subtotalAmount: ShopifyMoneyV2;
    totalTaxAmount: ShopifyMoneyV2 | null;
  };
  lines: CartLine[];
}

// Reshaping functions — flatten Relay-style edges/nodes
export function reshapeProduct(raw: ShopifyProduct): Product {
  return {
    ...raw,
    images: raw.images.edges.map((e) => e.node),
    variants: raw.variants.edges.map((e) => e.node),
  };
}

export function reshapeCollection(raw: ShopifyCollection): Collection {
  return {
    ...raw,
    products: raw.products.edges.map((e) => reshapeProduct(e.node)),
  };
}

export function reshapeCart(raw: ShopifyCart): Cart {
  return {
    id: raw.id,
    checkoutUrl: raw.checkoutUrl,
    totalQuantity: raw.totalQuantity,
    cost: raw.cost,
    lines: raw.lines.edges.map((e) => ({
      id: e.node.id,
      quantity: e.node.quantity,
      merchandiseId: e.node.merchandise.id,
      variantTitle: e.node.merchandise.title,
      productHandle: e.node.merchandise.product.handle,
      productTitle: e.node.merchandise.product.title,
      productImage: e.node.merchandise.product.featuredImage,
      price: e.node.merchandise.price,
      selectedOptions: e.node.merchandise.selectedOptions,
      totalAmount: e.node.cost.totalAmount,
    })),
  };
}
