import Link from "next/link";
import Image from "next/image";

// Stub types — will be replaced by imports from @/lib/shopify/types in Phase 2
interface ShopifyImage {
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

interface Collection {
  id: string;
  handle: string;
  title: string;
  description: string;
  image: ShopifyImage | null;
}

export interface CollectionCardProps {
  collection: Collection;
  productCount?: number;
  className?: string;
}

export function CollectionCard({
  collection,
  productCount,
  className = "",
}: CollectionCardProps) {
  return (
    <Link
      href={`/collections/${collection.handle}`}
      className={`group block overflow-hidden rounded-lg border border-[var(--color-gray-200,#e5e7eb)] bg-white transition-all duration-200 hover:shadow-lg ${className}`}
    >
      <div className="relative h-48 w-full overflow-hidden bg-[var(--color-gray-100,#f3f4f6)]">
        {collection.image ? (
          <Image
            src={collection.image.url}
            alt={collection.image.altText || collection.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[var(--color-gray-400,#9ca3af)]">
            No image
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-[var(--color-gray-900,#111827)]">
          {collection.title}
        </h3>
        {collection.description && (
          <p className="mt-1 text-sm text-[var(--color-gray-500,#6b7280)] line-clamp-2">
            {collection.description}
          </p>
        )}
        {productCount !== undefined && (
          <p className="mt-2 text-xs text-[var(--color-gray-400,#9ca3af)]">
            {productCount} {productCount === 1 ? "product" : "products"}
          </p>
        )}
      </div>
    </Link>
  );
}
