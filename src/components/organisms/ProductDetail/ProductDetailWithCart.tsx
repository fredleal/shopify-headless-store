"use client";

import { useCart } from "@/hooks/useCart";
import { ProductDetail } from "./ProductDetail";
import type { Product } from "@/lib/shopify/types";

export interface ProductDetailWithCartProps {
  product: Product;
}

export function ProductDetailWithCart({ product }: ProductDetailWithCartProps) {
  const { addItem, isLoading } = useCart();

  return (
    <ProductDetail
      product={product}
      onAddToCart={addItem}
      isAddingToCart={isLoading}
    />
  );
}
