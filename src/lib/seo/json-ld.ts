import type { Product, Collection } from "@/lib/shopify/types";

type ProductJsonLdInput = Pick<
  Product,
  "title" | "description" | "featuredImage" | "priceRange"
>;
type CollectionJsonLdInput = Pick<Collection, "title" | "description">;

export function generateProductJsonLd(
  product: ProductJsonLdInput,
  url: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.featuredImage?.url,
    url,
    offers: {
      "@type": "AggregateOffer",
      lowPrice: product.priceRange.minVariantPrice.amount,
      highPrice: product.priceRange.maxVariantPrice.amount,
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      availability: "https://schema.org/InStock",
    },
  };
}

export function generateBreadcrumbJsonLd(
  items: { name: string; url: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateCollectionJsonLd(
  collection: CollectionJsonLdInput,
  url: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: collection.title,
    description: collection.description,
    url,
  };
}
