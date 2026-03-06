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
      url: "https://cdn.shopify.com/s/files/1/leather-jacket-front.jpg",
      altText: "Black leather jacket front view",
      width: 1200,
      height: 1600,
    },
    images: [
      {
        url: "https://cdn.shopify.com/s/files/1/leather-jacket-front.jpg",
        altText: "Black leather jacket front view",
        width: 1200,
        height: 1600,
      },
      {
        url: "https://cdn.shopify.com/s/files/1/leather-jacket-back.jpg",
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
