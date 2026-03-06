import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCart } from "./useCart";

vi.mock("@/actions/cart", () => ({
  createCartAction: vi.fn(),
  addToCartAction: vi.fn(),
  removeFromCartAction: vi.fn(),
  updateCartAction: vi.fn(),
  getCartAction: vi.fn(),
}));

import {
  createCartAction,
  addToCartAction,
  removeFromCartAction,
  updateCartAction,
  getCartAction,
} from "@/actions/cart";

const mockCart = {
  id: "cart-1",
  checkoutUrl: "https://shop.myshopify.com/checkout/cart-1",
  totalQuantity: 2,
  cost: {
    totalAmount: { amount: "59.98", currencyCode: "USD" },
    subtotalAmount: { amount: "59.98", currencyCode: "USD" },
    totalTaxAmount: null,
  },
  lines: [
    {
      id: "line-1",
      quantity: 1,
      merchandiseId: "variant-1",
      variantTitle: "M / Black",
      productHandle: "classic-tee",
      productTitle: "Classic Tee",
      productImage: {
        url: "https://cdn.shopify.com/tee.jpg",
        altText: "Classic Tee",
        width: 800,
        height: 800,
      },
      price: { amount: "29.99", currencyCode: "USD" },
      selectedOptions: [
        { name: "Size", value: "M" },
        { name: "Color", value: "Black" },
      ],
      totalAmount: { amount: "29.99", currencyCode: "USD" },
    },
    {
      id: "line-2",
      quantity: 1,
      merchandiseId: "variant-2",
      variantTitle: "One Size",
      productHandle: "beanie",
      productTitle: "Winter Beanie",
      productImage: null,
      price: { amount: "29.99", currencyCode: "USD" },
      selectedOptions: [{ name: "Size", value: "One Size" }],
      totalAmount: { amount: "29.99", currencyCode: "USD" },
    },
  ],
};

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});

async function setupCartViaAddItem() {
  vi.mocked(createCartAction).mockResolvedValue(mockCart);
  vi.mocked(addToCartAction).mockResolvedValue(mockCart);

  const hook = renderHook(() => useCart());

  await act(async () => {
    await hook.result.current.addItem("variant-1", 1);
  });

  return hook;
}

describe("useCart", () => {
  it("initializes with null cart and no loading", () => {
    const { result } = renderHook(() => useCart());

    expect(result.current.cart).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.totalQuantity).toBe(0);
    expect(result.current.checkoutUrl).toBeNull();
  });

  it("attempts to load cart from localStorage on mount", async () => {
    localStorage.setItem("shopify-cart-id", "cart-1");
    vi.mocked(getCartAction).mockResolvedValue(mockCart);

    await act(async () => {
      renderHook(() => useCart());
    });

    expect(getCartAction).toHaveBeenCalledWith("cart-1");
  });

  it("does not call getCartAction when no cart in localStorage", () => {
    renderHook(() => useCart());
    expect(getCartAction).not.toHaveBeenCalled();
  });

  it("creates cart and adds item when no existing cart", async () => {
    vi.mocked(createCartAction).mockResolvedValue(mockCart);
    vi.mocked(addToCartAction).mockResolvedValue(mockCart);

    const { result } = renderHook(() => useCart());

    await act(async () => {
      await result.current.addItem("variant-1", 1);
    });

    expect(createCartAction).toHaveBeenCalled();
    expect(addToCartAction).toHaveBeenCalledWith("cart-1", "variant-1", 1);
    expect(result.current.cart).toEqual(mockCart);
    expect(result.current.totalQuantity).toBe(2);
  });

  it("persists cart id to localStorage after adding item", async () => {
    vi.mocked(createCartAction).mockResolvedValue(mockCart);
    vi.mocked(addToCartAction).mockResolvedValue(mockCart);

    const { result } = renderHook(() => useCart());

    await act(async () => {
      await result.current.addItem("variant-1", 1);
    });

    expect(localStorage.getItem("shopify-cart-id")).toBe("cart-1");
  });

  it("sets error when addItem fails", async () => {
    vi.mocked(createCartAction).mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useCart());

    await act(async () => {
      await result.current.addItem("variant-1", 1);
    });

    expect(result.current.error).toBe("Network error");
    expect(result.current.isLoading).toBe(false);
  });

  it("removes item from cart", async () => {
    const { result } = await setupCartViaAddItem();

    const updatedCart = {
      ...mockCart,
      totalQuantity: 1,
      lines: [mockCart.lines[0]],
    };
    vi.mocked(removeFromCartAction).mockResolvedValue(updatedCart);

    await act(async () => {
      await result.current.removeItem("line-2");
    });

    expect(removeFromCartAction).toHaveBeenCalledWith("cart-1", "line-2");
    expect(result.current.cart?.totalQuantity).toBe(1);
  });

  it("does nothing when removing from empty cart", async () => {
    const { result } = renderHook(() => useCart());

    await act(async () => {
      await result.current.removeItem("line-1");
    });

    expect(removeFromCartAction).not.toHaveBeenCalled();
  });

  it("updates item quantity", async () => {
    const { result } = await setupCartViaAddItem();

    const updatedCart = {
      ...mockCart,
      totalQuantity: 3,
      lines: [{ ...mockCart.lines[0], quantity: 2 }, mockCart.lines[1]],
    };
    vi.mocked(updateCartAction).mockResolvedValue(updatedCart);

    await act(async () => {
      await result.current.updateQuantity("line-1", 2);
    });

    expect(updateCartAction).toHaveBeenCalledWith("cart-1", "line-1", 2);
    expect(result.current.cart?.totalQuantity).toBe(3);
  });

  it("returns checkoutUrl from cart", async () => {
    const { result } = await setupCartViaAddItem();

    expect(result.current.checkoutUrl).toBe(
      "https://shop.myshopify.com/checkout/cart-1",
    );
  });

  it("clears error on successful operation after failure", async () => {
    vi.mocked(createCartAction).mockRejectedValueOnce(
      new Error("Network error"),
    );

    const { result } = renderHook(() => useCart());

    await act(async () => {
      await result.current.addItem("variant-1", 1);
    });
    expect(result.current.error).toBe("Network error");

    vi.mocked(createCartAction).mockResolvedValue(mockCart);
    vi.mocked(addToCartAction).mockResolvedValue(mockCart);

    await act(async () => {
      await result.current.addItem("variant-1", 1);
    });
    expect(result.current.error).toBeNull();
  });
});
