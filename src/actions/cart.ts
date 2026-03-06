"use server";

import type { Cart } from "@/lib/shopify/types";
import {
  createCart,
  addToCart,
  removeFromCart,
  updateCartLines,
  getCart,
} from "@/lib/shopify/queries/cart";

export async function createCartAction(): Promise<Cart> {
  return createCart();
}

export async function addToCartAction(
  cartId: string,
  merchandiseId: string,
  quantity: number,
): Promise<Cart> {
  return addToCart(cartId, [{ merchandiseId, quantity }]);
}

export async function removeFromCartAction(
  cartId: string,
  lineId: string,
): Promise<Cart> {
  return removeFromCart(cartId, [lineId]);
}

export async function updateCartAction(
  cartId: string,
  lineId: string,
  quantity: number,
): Promise<Cart> {
  return updateCartLines(cartId, [{ id: lineId, quantity }]);
}

export async function getCartAction(cartId: string): Promise<Cart | null> {
  return getCart(cartId);
}
