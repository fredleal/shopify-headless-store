"use client";

import { useState, useMemo } from "react";
import DOMPurify from "isomorphic-dompurify";
import Image from "next/image";
import { PriceDisplay } from "@/components/atoms/PriceDisplay/PriceDisplay";
import { VariantSelector } from "@/components/molecules/VariantSelector/VariantSelector";
import type { Product, ShopifyProductVariant } from "@/lib/shopify/types";

export interface ProductDetailProps {
  product: Product;
  onAddToCart?: (variantId: string, quantity: number) => void;
  isAddingToCart?: boolean;
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

export function ProductDetail({
  product,
  onAddToCart,
  isAddingToCart = false,
}: ProductDetailProps) {
  const initialOptions: Record<string, string> = {};
  for (const option of product.options) {
    initialOptions[option.name] = option.values[0] ?? "";
  }

  const [selectedOptions, setSelectedOptions] =
    useState<Record<string, string>>(initialOptions);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const sanitizedHtml = useMemo(
    () => DOMPurify.sanitize(product.descriptionHtml),
    [product.descriptionHtml],
  );

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
        <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-secondary-100">
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
            <div className="flex h-full items-center justify-center text-secondary-400">
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
                    ? "border-primary"
                    : "border-transparent hover:border-secondary-300"
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
          <h1 className="text-2xl font-bold text-secondary-900 md:text-3xl">
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
          disabled={
            !product.availableForSale ||
            isAddingToCart ||
            (!activeVariant && product.variants.length > 0)
          }
          onClick={() => {
            if (activeVariant && onAddToCart) {
              onAddToCart(activeVariant.id, 1);
            }
          }}
          className={`w-full rounded-lg px-6 py-3 text-base font-semibold transition-colors ${
            product.availableForSale && !isAddingToCart
              ? "bg-primary text-white hover:bg-primary-600"
              : "cursor-not-allowed bg-secondary-300 text-secondary-500"
          }`}
          aria-label={
            product.availableForSale
              ? `Add ${product.title} to cart`
              : `${product.title} is sold out`
          }
        >
          {isAddingToCart
            ? "Adding..."
            : product.availableForSale
              ? "Add to Cart"
              : "Sold Out"}
        </button>

        <div className="border-t border-secondary-200 pt-6">
          <h2 className="mb-2 text-sm font-semibold text-secondary-900">
            Description
          </h2>
          <div
            className="prose prose-sm text-secondary-600"
            dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
          />
        </div>
      </div>
    </div>
  );
}
