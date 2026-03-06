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
      url: "https://picsum.photos/seed/leather-jacket/800/1000",
      altText: "Black leather jacket front view",
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
    id: "gid://shopify/Product/2",
    handle: "organic-cotton-tee",
    title: "Organic Cotton Tee",
    description: "Soft organic cotton t-shirt, ethically sourced.",
    descriptionHtml: "<p>Soft organic cotton t-shirt, ethically sourced.</p>",
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
    id: "gid://shopify/Product/3",
    handle: "wool-beanie",
    title: "Merino Wool Beanie",
    description: "Warm merino wool beanie for cold weather.",
    descriptionHtml: "<p>Warm merino wool beanie for cold weather.</p>",
    availableForSale: false,
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
  {
    id: "gid://shopify/Product/4",
    handle: "denim-jacket",
    title: "Washed Denim Jacket",
    description: "Classic washed denim jacket with brass buttons.",
    descriptionHtml: "<p>Classic washed denim jacket with brass buttons.</p>",
    availableForSale: true,
    featuredImage: {
      url: "https://picsum.photos/seed/denim-jacket/800/1000",
      altText: "Washed denim jacket",
      width: 800,
      height: 1000,
    },
    images: [],
    variants: [],
    options: [],
    priceRange: {
      minVariantPrice: { amount: "149.00", currencyCode: "USD" },
      maxVariantPrice: { amount: "149.00", currencyCode: "USD" },
    },
  },
  {
    id: "gid://shopify/Product/5",
    handle: "canvas-sneakers",
    title: "Canvas Sneakers",
    description: "Lightweight canvas sneakers for everyday wear.",
    descriptionHtml: "<p>Lightweight canvas sneakers for everyday wear.</p>",
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
  {
    id: "gid://shopify/Product/6",
    handle: "linen-shirt",
    title: "Relaxed Linen Shirt",
    description: "Breathable linen shirt perfect for warm weather.",
    descriptionHtml: "<p>Breathable linen shirt perfect for warm weather.</p>",
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
