import { GraphQLClient, ClientError } from "graphql-request";

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN;

if (!domain) {
  throw new Error(
    "Missing NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN environment variable. " +
      "Add it to .env.local (e.g. your-store.myshopify.com)",
  );
}

if (!token) {
  throw new Error(
    "Missing NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN environment variable. " +
      "Add it to .env.local",
  );
}

const endpoint = `https://${domain}/api/2024-01/graphql.json`;

const client = new GraphQLClient(endpoint, {
  headers: {
    "X-Shopify-Storefront-Access-Token": token,
    "Content-Type": "application/json",
  },
});

export class ShopifyApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly query?: string,
  ) {
    super(message);
    this.name = "ShopifyApiError";
  }
}

export async function shopifyFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  try {
    return await client.request<T>(query, variables);
  } catch (error) {
    if (error instanceof ClientError) {
      const status = error.response.status;
      const messages =
        error.response.errors?.map((e) => e.message).join("; ") ??
        error.message;
      throw new ShopifyApiError(
        `Shopify API error (${status}): ${messages}`,
        status,
        query,
      );
    }
    throw new ShopifyApiError(
      `Shopify API request failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      undefined,
      query,
    );
  }
}
