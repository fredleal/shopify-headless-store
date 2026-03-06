import { CollectionCard } from "@/components/molecules/CollectionCard/CollectionCard";

// Mock data — will be replaced by API calls in Phase 2
const mockCollections = [
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
  {
    id: "gid://shopify/Collection/3",
    handle: "summer-vibes",
    title: "Summer Vibes",
    description: "Light and breezy pieces for the warmer months.",
    image: {
      url: "https://picsum.photos/seed/summer-vibes/1920/1080",
      altText: "Summer vibes collection",
      width: 1920,
      height: 1080,
    },
    productCount: 6,
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
