import Link from "next/link";
import Image from "next/image";
import { PriceDisplay } from "@/components/atoms/PriceDisplay/PriceDisplay";

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

export interface ProductCardProps {
  product: Product;
  variant?: "default" | "compact" | "featured";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const variantClasses: Record<string, string> = {
  default: "",
  compact: "max-w-sm",
  featured: "border-2 border-[var(--color-primary-500,#3b82f6)] shadow-md",
};

const sizeClasses: Record<string, string> = {
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
};

const imageHeightClasses: Record<string, string> = {
  sm: "h-40",
  md: "h-48",
  lg: "h-64",
};

export function ProductCard({
  product,
  variant = "default",
  size = "md",
  className = "",
}: ProductCardProps) {
  const baseClasses =
    "bg-white rounded-lg overflow-hidden transition-all duration-200 border border-[var(--color-gray-200,#e5e7eb)] hover:shadow-lg group";

  return (
    <Link
      href={`/products/${product.handle}`}
      className={`block ${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      <div
        className={`relative ${imageHeightClasses[size]} w-full overflow-hidden bg-[var(--color-gray-100,#f3f4f6)]`}
      >
        {product.featuredImage ? (
          <Image
            src={product.featuredImage.url}
            alt={product.featuredImage.altText || product.title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[var(--color-gray-400,#9ca3af)]">
            No image
          </div>
        )}
        {!product.availableForSale && (
          <span className="absolute left-2 top-2 rounded bg-[var(--color-gray-900,#111827)] px-2 py-1 text-xs font-medium text-white">
            Sold out
          </span>
        )}
      </div>

      <div className={sizeClasses[size]}>
        <h3 className="mb-1 text-sm font-medium text-[var(--color-gray-900,#111827)] line-clamp-2">
          {product.title}
        </h3>
        <PriceDisplay
          amount={product.priceRange.minVariantPrice.amount}
          currencyCode={product.priceRange.minVariantPrice.currencyCode}
          size="sm"
        />
      </div>
    </Link>
  );
}
