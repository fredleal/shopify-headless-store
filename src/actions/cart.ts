"use server";

import type { Cart } from "@/types/cart";

export async function createCartAction(): Promise<Cart> {
  // Will call: createCart() from @/lib/shopify/queries/cart in Phase 2
  throw new Error("Not connected to Shopify API yet — Phase 2");
}

export async function addToCartAction(
  cartId: string,
  merchandiseId: string,
  quantity: number,
): Promise<Cart> {
  void cartId;
  void merchandiseId;
  void quantity;
  // Will call: addToCart() from @/lib/shopify/queries/cart in Phase 2
  throw new Error("Not connected to Shopify API yet — Phase 2");
}

export async function removeFromCartAction(
  cartId: string,
  lineId: string,
): Promise<Cart> {
  void cartId;
  void lineId;
  // Will call: removeFromCart() in Phase 2
  throw new Error("Not connected to Shopify API yet — Phase 2");
}

export async function updateCartAction(
  cartId: string,
  lineId: string,
  quantity: number,
): Promise<Cart> {
  void cartId;
  void lineId;
  void quantity;
  // Will call: updateCartLines() in Phase 2
  throw new Error("Not connected to Shopify API yet — Phase 2");
}

export async function getCartAction(cartId: string): Promise<Cart | null> {
  void cartId;
  // Will call: getCart() in Phase 2
  throw new Error("Not connected to Shopify API yet — Phase 2");
}
