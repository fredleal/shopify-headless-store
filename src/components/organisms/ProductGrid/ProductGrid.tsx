import { ProductCard } from "@/components/molecules/ProductCard/ProductCard";

// Stub types — will be replaced by imports from @/lib/shopify/types in Phase 2
interface ShopifyMoneyV2 {
  amount: string;
  currencyCode: string;
}

interface ShopifyImage {
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

interface Product {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  availableForSale: boolean;
  featuredImage: ShopifyImage | null;
  images: ShopifyImage[];
  variants: {
    id: string;
    title: string;
    availableForSale: boolean;
    price: ShopifyMoneyV2;
    compareAtPrice: ShopifyMoneyV2 | null;
    selectedOptions: { name: string; value: string }[];
    image: ShopifyImage | null;
  }[];
  options: { id: string; name: string; values: string[] }[];
  priceRange: {
    minVariantPrice: ShopifyMoneyV2;
    maxVariantPrice: ShopifyMoneyV2;
  };
}

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
      <p className="py-12 text-center text-[var(--color-gray-500,#6b7280)]">
        No products found.
      </p>
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
