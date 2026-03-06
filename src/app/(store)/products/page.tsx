import { ProductGrid } from "@/components/organisms/ProductGrid/ProductGrid";

// Mock data — will be replaced by API calls in Phase 2
const mockProducts = [
  {
    id: "gid://shopify/Product/1",
    handle: "classic-leather-jacket",
    title: "Classic Leather Jacket",
    description: "Premium full-grain leather jacket with quilted lining.",
    descriptionHtml:
      "<p>Premium full-grain leather jacket with quilted lining.</p>",
    availableForSale: true,
    featuredImage: {
      url: "https://cdn.shopify.com/s/files/1/leather-jacket-front.jpg",
      altText: "Black leather jacket front view",
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
  {
    id: "gid://shopify/Product/2",
    handle: "organic-cotton-tee",
    title: "Organic Cotton Tee",
    description: "Soft organic cotton t-shirt, ethically sourced.",
    descriptionHtml: "<p>Soft organic cotton t-shirt, ethically sourced.</p>",
    availableForSale: true,
    featuredImage: {
      url: "https://cdn.shopify.com/s/files/1/cotton-tee.jpg",
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
    id: "gid://shopify/Product/3",
    handle: "wool-beanie",
    title: "Merino Wool Beanie",
    description: "Warm merino wool beanie for cold weather.",
    descriptionHtml: "<p>Warm merino wool beanie for cold weather.</p>",
    availableForSale: false,
    featuredImage: null,
    images: [],
    variants: [],
    options: [],
    priceRange: {
      minVariantPrice: { amount: "29.99", currencyCode: "USD" },
      maxVariantPrice: { amount: "29.99", currencyCode: "USD" },
    },
  },
];

export default function ProductsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold text-[var(--color-gray-900,#111827)]">
        All Products
      </h1>
      <ProductGrid products={mockProducts} />
    </div>
  );
}
