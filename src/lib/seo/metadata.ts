import type { Metadata } from "next";
import type { Product, Collection } from "@/lib/shopify/types";

type ProductSeoInput = Pick<
  Product,
  "title" | "description" | "handle" | "featuredImage" | "priceRange" | "seo"
>;
type CollectionSeoInput = Pick<
  Collection,
  "title" | "description" | "handle" | "image"
>;

const SITE_NAME = "Shopify Headless Store";
const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://shopify-headless-store.vercel.app";

export function generateProductMetadata(product: ProductSeoInput): Metadata {
  const title = product.seo.title || product.title;
  const description = product.seo.description || product.description;

  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `${BASE_URL}/products/${product.handle}`,
      images: product.featuredImage
        ? [
            {
              url: product.featuredImage.url,
              width: product.featuredImage.width,
              height: product.featuredImage.height,
              alt: product.featuredImage.altText || title,
            },
          ]
        : [],
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: product.featuredImage ? [product.featuredImage.url] : [],
    },
  };
}

export function generateCollectionMetadata(
  collection: CollectionSeoInput,
): Metadata {
  return {
    title: `${collection.title} | ${SITE_NAME}`,
    description:
      collection.description || `Browse ${collection.title} collection`,
    openGraph: {
      title: collection.title,
      description: collection.description,
      type: "website",
      url: `${BASE_URL}/collections/${collection.handle}`,
      images: collection.image
        ? [
            {
              url: collection.image.url,
              width: collection.image.width,
              height: collection.image.height,
              alt: collection.image.altText || collection.title,
            },
          ]
        : [],
      siteName: SITE_NAME,
    },
  };
}

export function generateBaseMetadata(): Metadata {
  return {
    title: {
      default: SITE_NAME,
      template: `%s | ${SITE_NAME}`,
    },
    description: "Premium headless storefront powered by Next.js and Shopify",
    metadataBase: new URL(BASE_URL),
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "en_US",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
