import { shopifyFetch } from "../client";
import { reshapeProduct } from "../types";
import type { ShopifyProduct, Product } from "../types";
import {
  IMAGE_FRAGMENT,
  VARIANT_FRAGMENT,
  PRODUCT_FRAGMENT,
} from "./fragments";

const PRODUCTS_QUERY = /* GraphQL */ `
  query Products($first: Int!) {
    products(first: $first) {
      edges {
        node {
          ...ProductFields
        }
      }
    }
  }
  ${IMAGE_FRAGMENT}
  ${VARIANT_FRAGMENT}
  ${PRODUCT_FRAGMENT}
`;

const PRODUCT_BY_HANDLE_QUERY = /* GraphQL */ `
  query ProductByHandle($handle: String!) {
    product(handle: $handle) {
      ...ProductFields
    }
  }
  ${IMAGE_FRAGMENT}
  ${VARIANT_FRAGMENT}
  ${PRODUCT_FRAGMENT}
`;

interface ProductsQueryResult {
  products: { edges: { node: ShopifyProduct }[] };
}

interface ProductByHandleQueryResult {
  product: ShopifyProduct | null;
}

export async function getProducts(first: number = 20): Promise<Product[]> {
  const data = await shopifyFetch<ProductsQueryResult>(PRODUCTS_QUERY, {
    first,
  });

  return data.products.edges.map((edge) => reshapeProduct(edge.node));
}

export async function getProduct(handle: string): Promise<Product | null> {
  const data = await shopifyFetch<ProductByHandleQueryResult>(
    PRODUCT_BY_HANDLE_QUERY,
    { handle },
  );

  if (!data.product) return null;
  return reshapeProduct(data.product);
}
