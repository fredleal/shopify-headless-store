import { shopifyFetch } from "../client";
import { reshapeCollection, reshapeProduct } from "../types";
import type { ShopifyCollection, Collection } from "../types";
import { COLLECTION_FRAGMENT, PRODUCT_FRAGMENT } from "./fragments";

const COLLECTIONS_QUERY = /* GraphQL */ `
  query Collections($first: Int!) {
    collections(first: $first) {
      edges {
        node {
          ...CollectionFields
        }
      }
    }
  }
  ${COLLECTION_FRAGMENT}
`;

const COLLECTION_BY_HANDLE_QUERY = /* GraphQL */ `
  query CollectionByHandle($handle: String!, $productsFirst: Int!) {
    collection(handle: $handle) {
      ...CollectionFields
      products(first: $productsFirst) {
        edges {
          node {
            ...ProductFields
          }
        }
      }
    }
  }
  ${COLLECTION_FRAGMENT}
  ${PRODUCT_FRAGMENT}
`;

interface CollectionsQueryResult {
  collections: {
    edges: { node: Omit<ShopifyCollection, "products"> }[];
  };
}

interface CollectionByHandleQueryResult {
  collection: ShopifyCollection | null;
}

export async function getCollections(
  first: number = 20,
): Promise<Omit<Collection, "products">[]> {
  const data = await shopifyFetch<CollectionsQueryResult>(COLLECTIONS_QUERY, {
    first,
  });

  return data.collections.edges.map((edge) => ({
    ...edge.node,
    products: [] as ReturnType<typeof reshapeProduct>[],
  }));
}

export async function getCollection(
  handle: string,
  productsFirst: number = 20,
): Promise<Collection | null> {
  const data = await shopifyFetch<CollectionByHandleQueryResult>(
    COLLECTION_BY_HANDLE_QUERY,
    { handle, productsFirst },
  );

  if (!data.collection) return null;
  return reshapeCollection(data.collection);
}
