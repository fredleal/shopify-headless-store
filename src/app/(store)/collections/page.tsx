export const revalidate = 3600;

import type { Metadata } from "next";
import { CollectionCard } from "@/components/molecules/CollectionCard/CollectionCard";
import { getCollections } from "@/lib/shopify/queries/collections";

export const metadata: Metadata = {
  title: "Collections",
  description: "Browse our curated collections",
};

export default async function CollectionsPage() {
  const collections = await getCollections(20);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold text-secondary-900">
        Collections
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((collection) => (
          <CollectionCard key={collection.id} collection={collection} />
        ))}
      </div>
    </div>
  );
}
