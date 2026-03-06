import { ProductDetail } from "@/components/organisms/ProductDetail/ProductDetail";
import { notFound } from "next/navigation";

// Mock data — will be replaced by API calls in Phase 2
const mockProducts: Record<
  string,
  {
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
    images: {
      url: string;
      altText: string | null;
      width: number;
      height: number;
    }[];
    variants: {
      id: string;
      title: string;
      availableForSale: boolean;
      price: { amount: string; currencyCode: string };
      compareAtPrice: { amount: string; currencyCode: string } | null;
      selectedOptions: { name: string; value: string }[];
      image: null;
    }[];
    options: { id: string; name: string; values: string[] }[];
    priceRange: {
      minVariantPrice: { amount: string; currencyCode: string };
      maxVariantPrice: { amount: string; currencyCode: string };
    };
  }
> = {
  "classic-leather-jacket": {
    id: "gid://shopify/Product/1",
    handle: "classic-leather-jacket",
    title: "Classic Leather Jacket",
    description: "Premium full-grain leather jacket with quilted lining.",
    descriptionHtml:
      "<p>Premium full-grain leather jacket with quilted lining. Crafted from the finest materials for lasting quality.</p>",
    availableForSale: true,
    featuredImage: {
      url: "https://picsum.photos/seed/leather-jacket/1200/1600",
      altText: "Black leather jacket front view",
      width: 1200,
      height: 1600,
    },
    images: [
      {
        url: "https://picsum.photos/seed/leather-jacket/1200/1600",
        altText: "Black leather jacket front view",
        width: 1200,
        height: 1600,
      },
      {
        url: "https://picsum.photos/seed/leather-jacket-back/1200/1600",
        altText: "Black leather jacket back view",
        width: 1200,
        height: 1600,
      },
    ],
    variants: [
      {
        id: "gid://shopify/ProductVariant/101",
        title: "Small / Black",
        availableForSale: true,
        price: { amount: "299.00", currencyCode: "USD" },
        compareAtPrice: { amount: "399.00", currencyCode: "USD" },
        selectedOptions: [
          { name: "Size", value: "Small" },
          { name: "Color", value: "Black" },
        ],
        image: null,
      },
      {
        id: "gid://shopify/ProductVariant/102",
        title: "Medium / Black",
        availableForSale: true,
        price: { amount: "299.00", currencyCode: "USD" },
        compareAtPrice: { amount: "399.00", currencyCode: "USD" },
        selectedOptions: [
          { name: "Size", value: "Medium" },
          { name: "Color", value: "Black" },
        ],
        image: null,
      },
      {
        id: "gid://shopify/ProductVariant/103",
        title: "Large / Black",
        availableForSale: false,
        price: { amount: "349.00", currencyCode: "USD" },
        compareAtPrice: { amount: "399.00", currencyCode: "USD" },
        selectedOptions: [
          { name: "Size", value: "Large" },
          { name: "Color", value: "Black" },
        ],
        image: null,
      },
      {
        id: "gid://shopify/ProductVariant/104",
        title: "Medium / Brown",
        availableForSale: true,
        price: { amount: "319.00", currencyCode: "USD" },
        compareAtPrice: null,
        selectedOptions: [
          { name: "Size", value: "Medium" },
          { name: "Color", value: "Brown" },
        ],
        image: null,
      },
    ],
    options: [
      { id: "opt-1", name: "Size", values: ["Small", "Medium", "Large"] },
      { id: "opt-2", name: "Color", values: ["Black", "Brown"] },
    ],
    priceRange: {
      minVariantPrice: { amount: "299.00", currencyCode: "USD" },
      maxVariantPrice: { amount: "349.00", currencyCode: "USD" },
    },
  },
  "organic-cotton-tee": {
    id: "gid://shopify/Product/2",
    handle: "organic-cotton-tee",
    title: "Organic Cotton Tee",
    description: "Soft organic cotton t-shirt, ethically sourced.",
    descriptionHtml:
      "<p>Soft organic cotton t-shirt, ethically sourced. Available in multiple sizes.</p>",
    availableForSale: true,
    featuredImage: {
      url: "https://picsum.photos/seed/cotton-tee/1200/1600",
      altText: "White cotton tee",
      width: 1200,
      height: 1600,
    },
    images: [
      {
        url: "https://picsum.photos/seed/cotton-tee/1200/1600",
        altText: "White cotton tee front",
        width: 1200,
        height: 1600,
      },
    ],
    variants: [
      {
        id: "gid://shopify/ProductVariant/201",
        title: "S",
        availableForSale: true,
        price: { amount: "39.00", currencyCode: "USD" },
        compareAtPrice: null,
        selectedOptions: [{ name: "Size", value: "S" }],
        image: null,
      },
      {
        id: "gid://shopify/ProductVariant/202",
        title: "M",
        availableForSale: true,
        price: { amount: "39.00", currencyCode: "USD" },
        compareAtPrice: null,
        selectedOptions: [{ name: "Size", value: "M" }],
        image: null,
      },
      {
        id: "gid://shopify/ProductVariant/203",
        title: "L",
        availableForSale: true,
        price: { amount: "39.00", currencyCode: "USD" },
        compareAtPrice: null,
        selectedOptions: [{ name: "Size", value: "L" }],
        image: null,
      },
    ],
    options: [{ id: "opt-1", name: "Size", values: ["S", "M", "L"] }],
    priceRange: {
      minVariantPrice: { amount: "39.00", currencyCode: "USD" },
      maxVariantPrice: { amount: "39.00", currencyCode: "USD" },
    },
  },
  "wool-beanie": {
    id: "gid://shopify/Product/3",
    handle: "wool-beanie",
    title: "Merino Wool Beanie",
    description: "Warm merino wool beanie for cold weather.",
    descriptionHtml:
      "<p>Warm merino wool beanie for cold weather. Made from 100% merino wool.</p>",
    availableForSale: false,
    featuredImage: {
      url: "https://picsum.photos/seed/wool-beanie/1200/1600",
      altText: "Merino wool beanie",
      width: 1200,
      height: 1600,
    },
    images: [
      {
        url: "https://picsum.photos/seed/wool-beanie/1200/1600",
        altText: "Merino wool beanie",
        width: 1200,
        height: 1600,
      },
    ],
    variants: [],
    options: [],
    priceRange: {
      minVariantPrice: { amount: "29.99", currencyCode: "USD" },
      maxVariantPrice: { amount: "29.99", currencyCode: "USD" },
    },
  },
  "denim-jacket": {
    id: "gid://shopify/Product/4",
    handle: "denim-jacket",
    title: "Washed Denim Jacket",
    description: "Classic washed denim jacket with brass buttons.",
    descriptionHtml:
      "<p>Classic washed denim jacket with brass buttons. A timeless wardrobe staple.</p>",
    availableForSale: true,
    featuredImage: {
      url: "https://picsum.photos/seed/denim-jacket/1200/1600",
      altText: "Washed denim jacket",
      width: 1200,
      height: 1600,
    },
    images: [
      {
        url: "https://picsum.photos/seed/denim-jacket/1200/1600",
        altText: "Washed denim jacket front",
        width: 1200,
        height: 1600,
      },
    ],
    variants: [
      {
        id: "gid://shopify/ProductVariant/401",
        title: "S",
        availableForSale: true,
        price: { amount: "149.00", currencyCode: "USD" },
        compareAtPrice: null,
        selectedOptions: [{ name: "Size", value: "S" }],
        image: null,
      },
      {
        id: "gid://shopify/ProductVariant/402",
        title: "M",
        availableForSale: true,
        price: { amount: "149.00", currencyCode: "USD" },
        compareAtPrice: null,
        selectedOptions: [{ name: "Size", value: "M" }],
        image: null,
      },
    ],
    options: [{ id: "opt-1", name: "Size", values: ["S", "M", "L"] }],
    priceRange: {
      minVariantPrice: { amount: "149.00", currencyCode: "USD" },
      maxVariantPrice: { amount: "149.00", currencyCode: "USD" },
    },
  },
  "canvas-sneakers": {
    id: "gid://shopify/Product/5",
    handle: "canvas-sneakers",
    title: "Canvas Sneakers",
    description: "Lightweight canvas sneakers for everyday wear.",
    descriptionHtml:
      "<p>Lightweight canvas sneakers for everyday wear. Comfortable and stylish.</p>",
    availableForSale: true,
    featuredImage: {
      url: "https://picsum.photos/seed/canvas-sneakers/1200/1600",
      altText: "White canvas sneakers",
      width: 1200,
      height: 1600,
    },
    images: [
      {
        url: "https://picsum.photos/seed/canvas-sneakers/1200/1600",
        altText: "White canvas sneakers",
        width: 1200,
        height: 1600,
      },
    ],
    variants: [
      {
        id: "gid://shopify/ProductVariant/501",
        title: "US 8",
        availableForSale: true,
        price: { amount: "79.00", currencyCode: "USD" },
        compareAtPrice: null,
        selectedOptions: [{ name: "Size", value: "US 8" }],
        image: null,
      },
      {
        id: "gid://shopify/ProductVariant/502",
        title: "US 9",
        availableForSale: true,
        price: { amount: "79.00", currencyCode: "USD" },
        compareAtPrice: null,
        selectedOptions: [{ name: "Size", value: "US 9" }],
        image: null,
      },
    ],
    options: [
      { id: "opt-1", name: "Size", values: ["US 8", "US 9", "US 10", "US 11"] },
    ],
    priceRange: {
      minVariantPrice: { amount: "79.00", currencyCode: "USD" },
      maxVariantPrice: { amount: "79.00", currencyCode: "USD" },
    },
  },
  "linen-shirt": {
    id: "gid://shopify/Product/6",
    handle: "linen-shirt",
    title: "Relaxed Linen Shirt",
    description: "Breathable linen shirt perfect for warm weather.",
    descriptionHtml:
      "<p>Breathable linen shirt perfect for warm weather. Relaxed fit for all-day comfort.</p>",
    availableForSale: true,
    featuredImage: {
      url: "https://picsum.photos/seed/linen-shirt/1200/1600",
      altText: "Relaxed linen shirt",
      width: 1200,
      height: 1600,
    },
    images: [
      {
        url: "https://picsum.photos/seed/linen-shirt/1200/1600",
        altText: "Relaxed linen shirt",
        width: 1200,
        height: 1600,
      },
    ],
    variants: [
      {
        id: "gid://shopify/ProductVariant/601",
        title: "S",
        availableForSale: true,
        price: { amount: "89.00", currencyCode: "USD" },
        compareAtPrice: null,
        selectedOptions: [{ name: "Size", value: "S" }],
        image: null,
      },
      {
        id: "gid://shopify/ProductVariant/602",
        title: "M",
        availableForSale: true,
        price: { amount: "89.00", currencyCode: "USD" },
        compareAtPrice: null,
        selectedOptions: [{ name: "Size", value: "M" }],
        image: null,
      },
    ],
    options: [{ id: "opt-1", name: "Size", values: ["S", "M", "L", "XL"] }],
    priceRange: {
      minVariantPrice: { amount: "89.00", currencyCode: "USD" },
      maxVariantPrice: { amount: "89.00", currencyCode: "USD" },
    },
  },
};

interface ProductPageProps {
  params: { handle: string };
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = mockProducts[params.handle];

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <ProductDetail product={product} />
    </div>
  );
}
