"use server";

import { revalidateTag } from "next/cache";
import type { Cart } from "@/lib/shopify/types";
import {
  createCart,
  addToCart,
  removeFromCart,
  updateCartLines,
  getCart,
} from "@/lib/shopify/queries/cart";

export async function createCartAction(): Promise<Cart> {
  try {
    const cart = await createCart();
    return cart;
  } catch {
    throw new Error("Failed to create cart. Please try again.");
  }
}

export async function addToCartAction(
  cartId: string,
  merchandiseId: string,
  quantity: number,
): Promise<Cart> {
  try {
    const cart = await addToCart(cartId, [{ merchandiseId, quantity }]);
    revalidateTag("cart");
    return cart;
  } catch {
    throw new Error("Failed to add item to cart. Please try again.");
  }
}

export async function removeFromCartAction(
  cartId: string,
  lineId: string,
): Promise<Cart> {
  try {
    const cart = await removeFromCart(cartId, [lineId]);
    revalidateTag("cart");
    return cart;
  } catch {
    throw new Error("Failed to remove item from cart. Please try again.");
  }
}

export async function updateCartAction(
  cartId: string,
  lineId: string,
  quantity: number,
): Promise<Cart> {
  try {
    const cart = await updateCartLines(cartId, [{ id: lineId, quantity }]);
    revalidateTag("cart");
    return cart;
  } catch {
    throw new Error("Failed to update cart. Please try again.");
  }
}

export async function getCartAction(cartId: string): Promise<Cart | null> {
  try {
    return await getCart(cartId);
  } catch {
    throw new Error("Failed to load cart. Please try again.");
  }
}
