import { CollectionCard } from "@/components/molecules/CollectionCard/CollectionCard";

// Mock data — will be replaced by API calls in Phase 2
const mockCollections = [
  {
    id: "gid://shopify/Collection/1",
    handle: "winter-essentials",
    title: "Winter Essentials",
    description: "Stay warm with our curated winter collection.",
    image: {
      url: "https://cdn.shopify.com/s/files/1/winter-collection.jpg",
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
      url: "https://cdn.shopify.com/s/files/1/basics-collection.jpg",
      altText: "Everyday basics collection",
      width: 1920,
      height: 1080,
    },
    productCount: 8,
  },
];

export default function CollectionsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold text-[var(--color-gray-900,#111827)]">
        Collections
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {mockCollections.map((collection) => (
          <CollectionCard
            key={collection.id}
            collection={collection}
            productCount={collection.productCount}
          />
        ))}
      </div>
    </div>
  );
}
