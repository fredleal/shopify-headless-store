import Link from "next/link";
import { StoreHeader } from "@/components/organisms/StoreHeader/StoreHeader";
import { StoreFooter } from "@/components/organisms/StoreFooter/StoreFooter";
import { ProductGrid } from "@/components/organisms/ProductGrid/ProductGrid";
import { CollectionCard } from "@/components/molecules/CollectionCard/CollectionCard";

const featuredProducts = [
  {
    id: "gid://shopify/Product/1",
    handle: "classic-leather-jacket",
    title: "Classic Leather Jacket",
    description: "Premium full-grain leather jacket with quilted lining.",
    descriptionHtml:
      "<p>Premium full-grain leather jacket with quilted lining.</p>",
    availableForSale: true,
    featuredImage: {
      url: "https://picsum.photos/seed/leather-jacket/800/1000",
      altText: "Black leather jacket front view",
      width: 800,
      height: 1000,
    },
    images: [],
    variants: [],
    options: [],
    priceRange: {
      minVariantPrice: { amount: "299.00", currencyCode: "USD" },
      maxVariantPrice: { amount: "349.00", currencyCode: "USD" },
    },
  },
  {
    id: "gid://shopify/Product/2",
    handle: "organic-cotton-tee",
    title: "Organic Cotton Tee",
    description: "Soft organic cotton t-shirt, ethically sourced.",
    descriptionHtml: "<p>Soft organic cotton t-shirt, ethically sourced.</p>",
    availableForSale: true,
    featuredImage: {
      url: "https://picsum.photos/seed/cotton-tee/800/1000",
      altText: "White cotton tee",
      width: 800,
      height: 1000,
    },
    images: [],
    variants: [],
    options: [],
    priceRange: {
      minVariantPrice: { amount: "39.00", currencyCode: "USD" },
      maxVariantPrice: { amount: "39.00", currencyCode: "USD" },
    },
  },
  {
    id: "gid://shopify/Product/3",
    handle: "wool-beanie",
    title: "Merino Wool Beanie",
    description: "Warm merino wool beanie for cold weather.",
    descriptionHtml: "<p>Warm merino wool beanie for cold weather.</p>",
    availableForSale: true,
    featuredImage: {
      url: "https://picsum.photos/seed/wool-beanie/800/1000",
      altText: "Merino wool beanie",
      width: 800,
      height: 1000,
    },
    images: [],
    variants: [],
    options: [],
    priceRange: {
      minVariantPrice: { amount: "29.99", currencyCode: "USD" },
      maxVariantPrice: { amount: "29.99", currencyCode: "USD" },
    },
  },
];

const featuredCollections = [
  {
    id: "gid://shopify/Collection/1",
    handle: "winter-essentials",
    title: "Winter Essentials",
    description: "Stay warm with our curated winter collection.",
    image: {
      url: "https://picsum.photos/seed/winter-collection/1920/1080",
      altText: "Winter collection banner",
      width: 1920,
      height: 1080,
    },
    productCount: 12,
  },
  {
    id: "gid://shopify/Collection/2",
    handle: "everyday-basics",
    title: "Everyday Basics",
    description: "Essential pieces for your everyday wardrobe.",
    image: {
      url: "https://picsum.photos/seed/basics-collection/1920/1080",
      altText: "Everyday basics collection",
      width: 1920,
      height: 1080,
    },
    productCount: 8,
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <StoreHeader />
      <main className="flex-1">
        <section className="bg-[var(--color-gray-50,#f9fafb)] py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-[var(--color-gray-900,#111827)] sm:text-5xl">
              Shopify Headless Store
            </h1>
            <p className="mt-4 text-lg text-[var(--color-gray-600,#4b5563)] max-w-2xl mx-auto">
              A modern headless storefront powered by Next.js 14 and Shopify
              Storefront API. Browse products, explore collections, and
              experience seamless e-commerce.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link
                href="/products"
                className="inline-block rounded-md bg-[var(--color-primary-500,#3b82f6)] px-6 py-3 font-medium text-white hover:bg-[var(--color-primary-600,#2563eb)] transition-colors"
              >
                Shop Products
              </Link>
              <Link
                href="/collections"
                className="inline-block rounded-md border border-[var(--color-gray-300,#d1d5db)] bg-white px-6 py-3 font-medium text-[var(--color-gray-700,#374151)] hover:bg-[var(--color-gray-50,#f9fafb)] transition-colors"
              >
                Browse Collections
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-[var(--color-gray-900,#111827)]">
                Featured Products
              </h2>
              <Link
                href="/products"
                className="text-sm font-medium text-[var(--color-primary-500,#3b82f6)] hover:text-[var(--color-primary-600,#2563eb)]"
              >
                View all &rarr;
              </Link>
            </div>
            <ProductGrid products={featuredProducts} columns={3} />
          </div>
        </section>

        <section className="bg-[var(--color-gray-50,#f9fafb)] py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-[var(--color-gray-900,#111827)]">
                Collections
              </h2>
              <Link
                href="/collections"
                className="text-sm font-medium text-[var(--color-primary-500,#3b82f6)] hover:text-[var(--color-primary-600,#2563eb)]"
              >
                View all &rarr;
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              {featuredCollections.map((collection) => (
                <CollectionCard
                  key={collection.id}
                  collection={collection}
                  productCount={collection.productCount}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
      <StoreFooter />
    </div>
  );
}
