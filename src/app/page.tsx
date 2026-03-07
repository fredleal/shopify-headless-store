export const revalidate = 3600;

import Link from "next/link";
import { StoreHeader } from "@/components/organisms/StoreHeader/StoreHeader";
import { StoreFooter } from "@/components/organisms/StoreFooter/StoreFooter";
import { ProductGrid } from "@/components/organisms/ProductGrid/ProductGrid";
import { CollectionCard } from "@/components/molecules/CollectionCard/CollectionCard";
import { getProducts } from "@/lib/shopify/queries/products";
import { getCollections } from "@/lib/shopify/queries/collections";

export default async function HomePage() {
  const [products, collections] = await Promise.all([
    getProducts(6).catch(() => []),
    getCollections(4).catch(() => []),
  ]);

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

        {products.length > 0 && (
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
              <ProductGrid products={products} columns={3} />
            </div>
          </section>
        )}

        {collections.length > 0 && (
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
                {collections.map((collection) => (
                  <CollectionCard key={collection.id} collection={collection} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <StoreFooter />
    </div>
  );
}
