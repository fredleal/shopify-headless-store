import Link from "next/link";
import Image from "next/image";
import type { Collection } from "@/lib/shopify/types";

export interface CollectionCardProps {
  collection: Omit<Collection, "products"> | Collection;
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
      className={`group block overflow-hidden rounded-lg border border-secondary-200 bg-white transition-all duration-200 hover:shadow-lg ${className}`}
    >
      <div className="relative h-48 w-full overflow-hidden bg-secondary-100">
        {collection.image ? (
          <Image
            src={collection.image.url}
            alt={collection.image.altText || collection.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-secondary-400">
            No image
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-secondary-900">
          {collection.title}
        </h3>
        {collection.description && (
          <p className="mt-1 text-sm text-secondary-500 line-clamp-2">
            {collection.description}
          </p>
        )}
        {productCount !== undefined && (
          <p className="mt-2 text-xs text-secondary-400">
            {productCount} {productCount === 1 ? "product" : "products"}
          </p>
        )}
      </div>
    </Link>
  );
}
