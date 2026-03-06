export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { ProductGrid } from "@/components/organisms/ProductGrid/ProductGrid";
import { getProducts } from "@/lib/shopify/queries/products";

export const metadata: Metadata = {
  title: "All Products",
  description: "Browse our complete product catalog",
};

export default async function ProductsPage() {
  const products = await getProducts(50);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold text-[var(--color-gray-900,#111827)]">
        All Products
      </h1>
      <ProductGrid products={products} />
    </div>
  );
}
