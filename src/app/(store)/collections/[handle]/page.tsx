import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/organisms/ProductGrid/ProductGrid";
import { JsonLd } from "@/components/atoms/JsonLd/JsonLd";
import { getCollection } from "@/lib/shopify/queries/collections";
import { generateCollectionMetadata } from "@/lib/seo/metadata";
import {
  generateCollectionJsonLd,
  generateBreadcrumbJsonLd,
} from "@/lib/seo/json-ld";

interface CollectionPageProps {
  params: { handle: string };
}

export async function generateMetadata({
  params,
}: CollectionPageProps): Promise<Metadata> {
  const collection = await getCollection(params.handle);
  if (!collection) return { title: "Collection Not Found" };
  return generateCollectionMetadata(collection);
}

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://shopify-headless-store.vercel.app";

export default async function CollectionPage({ params }: CollectionPageProps) {
  const collection = await getCollection(params.handle);

  if (!collection) {
    notFound();
  }

  const collectionUrl = `${BASE_URL}/collections/${collection.handle}`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd data={generateCollectionJsonLd(collection, collectionUrl)} />
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: "Home", url: BASE_URL },
          { name: "Collections", url: `${BASE_URL}/collections` },
          { name: collection.title, url: collectionUrl },
        ])}
      />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-900">
          {collection.title}
        </h1>
        {collection.description && (
          <p className="mt-2 text-secondary-600">{collection.description}</p>
        )}
      </div>
      <ProductGrid products={collection.products} />
    </div>
  );
}
