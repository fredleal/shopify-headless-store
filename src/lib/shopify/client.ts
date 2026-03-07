import { GraphQLClient, ClientError } from "graphql-request";

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

function getClient(): GraphQLClient {
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN;

  if (!domain) {
    throw new ShopifyApiError(
      "Missing NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN environment variable. " +
        "Add it to .env.local (e.g. your-store.myshopify.com)",
    );
  }

  if (!token) {
    throw new ShopifyApiError(
      "Missing NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN environment variable. " +
        "Add it to .env.local",
    );
  }

  return new GraphQLClient(`https://${domain}/api/2024-01/graphql.json`, {
    headers: {
      "X-Shopify-Storefront-Access-Token": token,
      "Content-Type": "application/json",
    },
  });
}

let clientInstance: GraphQLClient | null = null;

function getOrCreateClient(): GraphQLClient {
  if (!clientInstance) {
    clientInstance = getClient();
  }
  return clientInstance;
}

export async function shopifyFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  try {
    return await getOrCreateClient().request<T>(query, variables);
  } catch (error) {
    if (error instanceof ShopifyApiError) {
      throw error;
    }
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
