"use client";

import { useCart } from "@/hooks/useCart";
import { useRouter } from "next/navigation";
import { ProductDetail } from "./ProductDetail";
import type { Product } from "@/lib/shopify/types";

export interface ProductDetailWithCartProps {
  product: Product;
}

export function ProductDetailWithCart({ product }: ProductDetailWithCartProps) {
  const { addItem, isLoading } = useCart();
  const router = useRouter();

  const handleAddToCart = async (variantId: string, quantity: number) => {
    await addItem(variantId, quantity);
    router.push("/cart");
  };

  return (
    <ProductDetail
      product={product}
      onAddToCart={handleAddToCart}
      isAddingToCart={isLoading}
    />
  );
}
