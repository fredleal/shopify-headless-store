import { ProductGrid } from "@/components/organisms/ProductGrid/ProductGrid";
import { notFound } from "next/navigation";

// Mock data — will be replaced by API calls in Phase 2
const mockCollections: Record<
  string,
  {
    title: string;
    description: string;
    products: {
      id: string;
      handle: string;
      title: string;
      description: string;
      descriptionHtml: string;
      availableForSale: boolean;
      featuredImage: {
        url: string;
        altText: string | null;
        width: number;
        height: number;
      } | null;
      images: never[];
      variants: never[];
      options: never[];
      priceRange: {
        minVariantPrice: { amount: string; currencyCode: string };
        maxVariantPrice: { amount: string; currencyCode: string };
      };
    }[];
  }
> = {
  "winter-essentials": {
    title: "Winter Essentials",
    description: "Stay warm with our curated winter collection.",
    products: [
      {
        id: "gid://shopify/Product/1",
        handle: "classic-leather-jacket",
        title: "Classic Leather Jacket",
        description: "Premium full-grain leather jacket.",
        descriptionHtml: "<p>Premium full-grain leather jacket.</p>",
        availableForSale: true,
        featuredImage: {
          url: "https://cdn.shopify.com/s/files/1/leather-jacket-front.jpg",
          altText: "Black leather jacket",
          width: 1200,
          height: 1600,
        },
        images: [],
        variants: [],
        options: [],
        priceRange: {
          minVariantPrice: { amount: "299.00", currencyCode: "USD" },
          maxVariantPrice: { amount: "349.00", currencyCode: "USD" },
        },
      },
    ],
  },
};

interface CollectionPageProps {
  params: { handle: string };
}

export default function CollectionPage({ params }: CollectionPageProps) {
  const collection = mockCollections[params.handle];

  if (!collection) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-gray-900,#111827)]">
          {collection.title}
        </h1>
        {collection.description && (
          <p className="mt-2 text-[var(--color-gray-600,#4b5563)]">
            {collection.description}
          </p>
        )}
      </div>
      <ProductGrid products={collection.products} />
    </div>
  );
}
