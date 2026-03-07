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
      <h1 className="text-2xl font-bold text-secondary-900">
        Failed to load product
      </h1>
      <p className="mt-2 text-secondary-600">
        {error.message || "We couldn't load this product. Please try again."}
      </p>
      <div className="mt-6 flex justify-center gap-4">
        <button
          type="button"
          onClick={reset}
          className="inline-block rounded-md bg-primary px-6 py-3 font-medium text-white hover:bg-primary-600 transition-colors"
        >
          Try again
        </button>
        <Link
          href="/products"
          className="inline-block rounded-md border border-secondary-300 bg-white px-6 py-3 font-medium text-secondary-700 hover:bg-secondary-50 transition-colors"
        >
          Browse products
        </Link>
      </div>
    </div>
  );
}
