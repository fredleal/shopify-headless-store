import { GraphQLClient } from "graphql-request";

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!;
const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN!;
const endpoint = `https://${domain}/api/2024-01/graphql.json`;

const client = new GraphQLClient(endpoint, {
  headers: {
    "X-Shopify-Storefront-Access-Token": token,
    "Content-Type": "application/json",
  },
});

export async function shopifyFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  return client.request<T>(query, variables);
}
