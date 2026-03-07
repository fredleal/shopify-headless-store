"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-[var(--color-gray-900,#111827)]">
          Something went wrong
        </h1>
        <p className="mt-2 text-[var(--color-gray-600,#4b5563)]">
          {error.message || "An unexpected error occurred."}
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 inline-block rounded-md bg-[var(--color-primary-500,#3b82f6)] px-6 py-3 font-medium text-white hover:bg-[var(--color-primary-600,#2563eb)] transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
