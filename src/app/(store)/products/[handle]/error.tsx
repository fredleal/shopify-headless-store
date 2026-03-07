"use client";

import Link from "next/link";

export default function ProductError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-[var(--color-gray-900,#111827)]">
        Failed to load product
      </h1>
      <p className="mt-2 text-[var(--color-gray-600,#4b5563)]">
        {error.message || "We couldn't load this product. Please try again."}
      </p>
      <div className="mt-6 flex justify-center gap-4">
        <button
          type="button"
          onClick={reset}
          className="inline-block rounded-md bg-[var(--color-primary-500,#3b82f6)] px-6 py-3 font-medium text-white hover:bg-[var(--color-primary-600,#2563eb)] transition-colors"
        >
          Try again
        </button>
        <Link
          href="/products"
          className="inline-block rounded-md border border-[var(--color-gray-300,#d1d5db)] bg-white px-6 py-3 font-medium text-[var(--color-gray-700,#374151)] hover:bg-[var(--color-gray-50,#f9fafb)] transition-colors"
        >
          Browse products
        </Link>
      </div>
    </div>
  );
}
