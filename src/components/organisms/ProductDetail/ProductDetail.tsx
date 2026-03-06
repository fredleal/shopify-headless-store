"use client";

import { useState } from "react";
import Image from "next/image";
import { PriceDisplay } from "@/components/atoms/PriceDisplay/PriceDisplay";
import { VariantSelector } from "@/components/molecules/VariantSelector/VariantSelector";

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

interface ShopifyProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  price: ShopifyMoneyV2;
  compareAtPrice: ShopifyMoneyV2 | null;
  selectedOptions: { name: string; value: string }[];
  image: ShopifyImage | null;
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
  variants: ShopifyProductVariant[];
  options: { id: string; name: string; values: string[] }[];
  priceRange: {
    minVariantPrice: ShopifyMoneyV2;
    maxVariantPrice: ShopifyMoneyV2;
  };
}

export interface ProductDetailProps {
  product: Product;
}

function findVariant(
  variants: ShopifyProductVariant[],
  selectedOptions: Record<string, string>,
): ShopifyProductVariant | undefined {
  return variants.find((variant) =>
    variant.selectedOptions.every(
      (opt) => selectedOptions[opt.name] === opt.value,
    ),
  );
}

export function ProductDetail({ product }: ProductDetailProps) {
  const initialOptions: Record<string, string> = {};
  for (const option of product.options) {
    initialOptions[option.name] = option.values[0] ?? "";
  }

  const [selectedOptions, setSelectedOptions] =
    useState<Record<string, string>>(initialOptions);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const activeVariant = findVariant(product.variants, selectedOptions);
  const displayPrice = activeVariant
    ? activeVariant.price
    : product.priceRange.minVariantPrice;
  const compareAtPrice = activeVariant?.compareAtPrice ?? undefined;
  const currentImage = product.images[selectedImageIndex] ?? null;

  const handleOptionChange = (name: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {/* Image Gallery */}
      <div className="flex flex-col gap-4">
        <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-[var(--color-gray-100,#f3f4f6)]">
          {currentImage ? (
            <Image
              src={currentImage.url}
              alt={currentImage.altText || product.title}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center text-[var(--color-gray-400,#9ca3af)]">
              No image available
            </div>
          )}
        </div>

        {product.images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto">
            {product.images.map((image, index) => (
              <button
                key={image.url}
                type="button"
                onClick={() => setSelectedImageIndex(index)}
                className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border-2 transition-all ${
                  index === selectedImageIndex
                    ? "border-[var(--color-primary-500,#3b82f6)]"
                    : "border-transparent hover:border-[var(--color-gray-300,#d1d5db)]"
                }`}
                aria-label={`View image ${index + 1}`}
              >
                <Image
                  src={image.url}
                  alt={image.altText || `${product.title} - image ${index + 1}`}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-gray-900,#111827)] md:text-3xl">
            {product.title}
          </h1>
          <div className="mt-2">
            <PriceDisplay
              amount={displayPrice.amount}
              currencyCode={displayPrice.currencyCode}
              compareAtAmount={compareAtPrice?.amount}
              size="lg"
            />
          </div>
        </div>

        {product.options.length > 0 &&
          !(
            product.options.length === 1 &&
            product.options[0].values.length === 1
          ) && (
            <VariantSelector
              options={product.options}
              selectedOptions={selectedOptions}
              onOptionChange={handleOptionChange}
            />
          )}

        <button
          type="button"
          disabled={!product.availableForSale}
          className={`w-full rounded-lg px-6 py-3 text-base font-semibold transition-colors ${
            product.availableForSale
              ? "bg-[var(--color-primary-500,#3b82f6)] text-white hover:bg-[var(--color-primary-600,#2563eb)]"
              : "cursor-not-allowed bg-[var(--color-gray-300,#d1d5db)] text-[var(--color-gray-500,#6b7280)]"
          }`}
          aria-label={
            product.availableForSale
              ? `Add ${product.title} to cart`
              : `${product.title} is sold out`
          }
        >
          {product.availableForSale ? "Add to Cart" : "Sold Out"}
        </button>

        <div className="border-t border-[var(--color-gray-200,#e5e7eb)] pt-6">
          <h2 className="mb-2 text-sm font-semibold text-[var(--color-gray-900,#111827)]">
            Description
          </h2>
          <div
            className="prose prose-sm text-[var(--color-gray-600,#4b5563)]"
            dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
          />
        </div>
      </div>
    </div>
  );
}
