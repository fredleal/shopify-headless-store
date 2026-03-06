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
          url: "https://picsum.photos/seed/leather-jacket/800/1000",
          altText: "Black leather jacket",
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
    ],
  },
  "everyday-basics": {
    title: "Everyday Basics",
    description: "Essential pieces for your everyday wardrobe.",
    products: [
      {
        id: "gid://shopify/Product/2",
        handle: "organic-cotton-tee",
        title: "Organic Cotton Tee",
        description: "Soft organic cotton t-shirt.",
        descriptionHtml: "<p>Soft organic cotton t-shirt.</p>",
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
        id: "gid://shopify/Product/5",
        handle: "canvas-sneakers",
        title: "Canvas Sneakers",
        description: "Lightweight canvas sneakers for everyday wear.",
        descriptionHtml: "<p>Lightweight canvas sneakers.</p>",
        availableForSale: true,
        featuredImage: {
          url: "https://picsum.photos/seed/canvas-sneakers/800/1000",
          altText: "White canvas sneakers",
          width: 800,
          height: 1000,
        },
        images: [],
        variants: [],
        options: [],
        priceRange: {
          minVariantPrice: { amount: "79.00", currencyCode: "USD" },
          maxVariantPrice: { amount: "79.00", currencyCode: "USD" },
        },
      },
    ],
  },
  "summer-vibes": {
    title: "Summer Vibes",
    description: "Light and breezy pieces for the warmer months.",
    products: [
      {
        id: "gid://shopify/Product/6",
        handle: "linen-shirt",
        title: "Relaxed Linen Shirt",
        description: "Breathable linen shirt perfect for warm weather.",
        descriptionHtml: "<p>Breathable linen shirt.</p>",
        availableForSale: true,
        featuredImage: {
          url: "https://picsum.photos/seed/linen-shirt/800/1000",
          altText: "Relaxed linen shirt",
          width: 800,
          height: 1000,
        },
        images: [],
        variants: [],
        options: [],
        priceRange: {
          minVariantPrice: { amount: "89.00", currencyCode: "USD" },
          maxVariantPrice: { amount: "89.00", currencyCode: "USD" },
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
