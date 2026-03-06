import { shopifyFetch } from "../client";
import { reshapeCart } from "../types";
import type { ShopifyCart, Cart } from "../types";
import { CART_FRAGMENT } from "./fragments";

const CREATE_CART_MUTATION = /* GraphQL */ `
  mutation CartCreate {
    cartCreate {
      cart {
        ...CartFields
      }
    }
  }
  ${CART_FRAGMENT}
`;

const ADD_TO_CART_MUTATION = /* GraphQL */ `
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFields
      }
    }
  }
  ${CART_FRAGMENT}
`;

const REMOVE_FROM_CART_MUTATION = /* GraphQL */ `
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...CartFields
      }
    }
  }
  ${CART_FRAGMENT}
`;

const UPDATE_CART_LINES_MUTATION = /* GraphQL */ `
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFields
      }
    }
  }
  ${CART_FRAGMENT}
`;

const GET_CART_QUERY = /* GraphQL */ `
  query Cart($cartId: ID!) {
    cart(id: $cartId) {
      ...CartFields
    }
  }
  ${CART_FRAGMENT}
`;

interface CartCreateResult {
  cartCreate: { cart: ShopifyCart };
}

interface CartLinesAddResult {
  cartLinesAdd: { cart: ShopifyCart };
}

interface CartLinesRemoveResult {
  cartLinesRemove: { cart: ShopifyCart };
}

interface CartLinesUpdateResult {
  cartLinesUpdate: { cart: ShopifyCart };
}

interface CartQueryResult {
  cart: ShopifyCart | null;
}

export async function createCart(): Promise<Cart> {
  const data = await shopifyFetch<CartCreateResult>(CREATE_CART_MUTATION);

  return reshapeCart(data.cartCreate.cart);
}

export async function addToCart(
  cartId: string,
  lines: { merchandiseId: string; quantity: number }[],
): Promise<Cart> {
  const data = await shopifyFetch<CartLinesAddResult>(ADD_TO_CART_MUTATION, {
    cartId,
    lines,
  });

  return reshapeCart(data.cartLinesAdd.cart);
}

export async function removeFromCart(
  cartId: string,
  lineIds: string[],
): Promise<Cart> {
  const data = await shopifyFetch<CartLinesRemoveResult>(
    REMOVE_FROM_CART_MUTATION,
    { cartId, lineIds },
  );

  return reshapeCart(data.cartLinesRemove.cart);
}

export async function updateCartLines(
  cartId: string,
  lines: { id: string; quantity: number }[],
): Promise<Cart> {
  const data = await shopifyFetch<CartLinesUpdateResult>(
    UPDATE_CART_LINES_MUTATION,
    { cartId, lines },
  );

  return reshapeCart(data.cartLinesUpdate.cart);
}

export async function getCart(cartId: string): Promise<Cart | null> {
  const data = await shopifyFetch<CartQueryResult>(GET_CART_QUERY, {
    cartId,
  });

  if (!data.cart) return null;
  return reshapeCart(data.cart);
}
