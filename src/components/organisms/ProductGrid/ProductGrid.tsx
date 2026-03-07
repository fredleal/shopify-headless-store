import { ProductCard } from "@/components/molecules/ProductCard/ProductCard";
import type { Product } from "@/lib/shopify/types";

export interface ProductGridProps {
  products: Product[];
  columns?: 2 | 3 | 4;
}

const columnClasses: Record<number, string> = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
};

export function ProductGrid({ products, columns = 4 }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <p className="py-12 text-center text-secondary-500">No products found.</p>
    );
  }

  return (
    <div className={`grid gap-6 ${columnClasses[columns]}`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
