import Link from "next/link";
import Image from "next/image";
import { PriceDisplay } from "@/components/atoms/PriceDisplay/PriceDisplay";
import type { Product } from "@/lib/shopify/types";

export interface ProductCardProps {
  product: Product;
  variant?: "default" | "compact" | "featured";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const variantClasses: Record<string, string> = {
  default: "",
  compact: "max-w-sm",
  featured: "border-2 border-primary shadow-md",
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
    "bg-white rounded-lg overflow-hidden transition-all duration-300 border border-secondary-200 hover:shadow-xl group";

  const hasSecondImage = product.images && product.images.length > 1;

  return (
    <Link
      href={`/products/${product.handle}`}
      className={`block ${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      <div
        className={`relative ${imageHeightClasses[size]} w-full overflow-hidden bg-secondary-100`}
      >
        {product.featuredImage ? (
          <>
            <Image
              src={product.featuredImage.url}
              alt={product.featuredImage.altText || product.title}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
              className={`object-cover transition-opacity duration-500 ease-in-out group-hover:scale-105 ${hasSecondImage ? "group-hover:opacity-0" : ""}`}
            />
            {hasSecondImage && (
              <Image
                src={product.images[1].url}
                alt={
                  product.images[1].altText || `${product.title} alternate view`
                }
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                className="absolute inset-0 object-cover opacity-0 transition-all duration-500 ease-in-out group-hover:scale-105 group-hover:opacity-100"
              />
            )}
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-secondary-400">
            No image
          </div>
        )}
        {!product.availableForSale && (
          <span className="absolute left-3 top-3 rounded-full bg-secondary-900 px-3 py-1 text-xs font-semibold tracking-wider text-white shadow-sm">
            SOLD OUT
          </span>
        )}
      </div>

      <div className={sizeClasses[size]}>
        <h3 className="mb-1 text-sm font-medium text-secondary-900 line-clamp-2 transition-colors group-hover:text-primary-600">
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
