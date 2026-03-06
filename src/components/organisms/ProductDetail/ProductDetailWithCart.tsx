"use client";

import { useCart } from "@/hooks/useCart";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ProductDetail } from "./ProductDetail";
import type { Product } from "@/lib/shopify/types";

export interface ProductDetailWithCartProps {
  product: Product;
}

export function ProductDetailWithCart({ product }: ProductDetailWithCartProps) {
  const { addItem, isLoading } = useCart();
  const router = useRouter();

  const handleAddToCart = async (variantId: string, quantity: number) => {
    try {
      await addItem(variantId, quantity);
      toast.success("Added to cart", {
        description: `${quantity}x ${product.title}`,
        action: {
          label: "View Cart",
          onClick: () => router.push("/cart"),
        },
      });
    } catch {
      toast.error("Failed to add to cart");
    }
  };

  return (
    <ProductDetail
      product={product}
      onAddToCart={handleAddToCart}
      isAddingToCart={isLoading}
    />
  );
}
