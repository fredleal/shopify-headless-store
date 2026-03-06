"use client";

import { useState, useCallback, useEffect } from "react";
import type { Cart } from "@/types/cart";
import {
  createCartAction,
  addToCartAction,
  removeFromCartAction,
  updateCartAction,
  getCartAction,
} from "@/actions/cart";

const CART_ID_KEY = "shopify-cart-id";

export function useCart() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cartId = localStorage.getItem(CART_ID_KEY);
    if (cartId) {
      setIsLoading(true);
      getCartAction(cartId)
        .then((fetchedCart) => {
          if (fetchedCart) {
            setCart(fetchedCart);
          } else {
            localStorage.removeItem(CART_ID_KEY);
          }
        })
        .catch(() => {
          localStorage.removeItem(CART_ID_KEY);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, []);

  const addItem = useCallback(
    async (merchandiseId: string, quantity: number) => {
      setIsLoading(true);
      setError(null);
      try {
        let currentCart = cart;
        if (!currentCart) {
          currentCart = await createCartAction();
          localStorage.setItem(CART_ID_KEY, currentCart.id);
        }
        const updatedCart = await addToCartAction(
          currentCart.id,
          merchandiseId,
          quantity,
        );
        setCart(updatedCart);
        localStorage.setItem(CART_ID_KEY, updatedCart.id);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to add item");
      } finally {
        setIsLoading(false);
      }
    },
    [cart],
  );

  const removeItem = useCallback(
    async (lineId: string) => {
      if (!cart) return;
      setIsLoading(true);
      setError(null);
      try {
        const updatedCart = await removeFromCartAction(cart.id, lineId);
        setCart(updatedCart);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to remove item");
      } finally {
        setIsLoading(false);
      }
    },
    [cart],
  );

  const updateQuantity = useCallback(
    async (lineId: string, quantity: number) => {
      if (!cart) return;
      setIsLoading(true);
      setError(null);
      try {
        const updatedCart = await updateCartAction(cart.id, lineId, quantity);
        setCart(updatedCart);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to update quantity",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [cart],
  );

  return {
    cart,
    isLoading,
    error,
    addItem,
    removeItem,
    updateQuantity,
    totalQuantity: cart?.totalQuantity ?? 0,
    checkoutUrl: cart?.checkoutUrl ?? null,
  };
}
