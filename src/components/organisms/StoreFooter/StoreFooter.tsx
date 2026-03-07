export function StoreFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--color-gray-200,#e5e7eb)] bg-[var(--color-gray-50,#f9fafb)]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-[var(--color-gray-500,#6b7280)]">
            &copy; {currentYear} Shopify Headless Store. All rights reserved.
          </p>

          <ul className="flex items-center gap-6">
            <li>
              <a
                href="https://shopify.dev/docs/api/storefront"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[var(--color-gray-500,#6b7280)] hover:text-[var(--color-gray-700,#374151)] transition-colors"
              >
                Storefront API
              </a>
            </li>
            <li>
              <a
                href="https://github.com/fredleal/shopify-headless-store"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[var(--color-gray-500,#6b7280)] hover:text-[var(--color-gray-700,#374151)] transition-colors"
              >
                GitHub
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
