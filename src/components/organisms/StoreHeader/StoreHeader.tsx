import Link from "next/link";

export function StoreHeader() {
  return (
    <header className="border-b border-[var(--color-gray-200,#e5e7eb)] bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-xl font-bold text-[var(--color-gray-900,#111827)] hover:text-[var(--color-primary-600,#2563eb)] transition-colors"
        >
          Shopify Headless Store
        </Link>

        <ul className="flex items-center gap-6">
          <li>
            <Link
              href="/products"
              className="text-sm font-medium text-[var(--color-gray-600,#4b5563)] hover:text-[var(--color-gray-900,#111827)] transition-colors"
            >
              Products
            </Link>
          </li>
          <li>
            <Link
              href="/collections"
              className="text-sm font-medium text-[var(--color-gray-600,#4b5563)] hover:text-[var(--color-gray-900,#111827)] transition-colors"
            >
              Collections
            </Link>
          </li>
          <li>
            <Link
              href="/cart"
              className="text-sm font-medium text-[var(--color-gray-600,#4b5563)] hover:text-[var(--color-gray-900,#111827)] transition-colors"
              aria-label="Shopping cart"
            >
              Cart
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
