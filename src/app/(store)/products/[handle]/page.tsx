import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetailWithCart } from "@/components/organisms/ProductDetail/ProductDetailWithCart";
import { JsonLd } from "@/components/atoms/JsonLd/JsonLd";
import { getProduct } from "@/lib/shopify/queries/products";
import { generateProductMetadata } from "@/lib/seo/metadata";
import {
  generateProductJsonLd,
  generateBreadcrumbJsonLd,
} from "@/lib/seo/json-ld";

interface ProductPageProps {
  params: { handle: string };
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const product = await getProduct(params.handle);
  if (!product) return { title: "Product Not Found" };
  return generateProductMetadata(product);
}

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://shopify-headless-store.vercel.app";

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.handle);

  if (!product) {
    notFound();
  }

  const productUrl = `${BASE_URL}/products/${product.handle}`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd data={generateProductJsonLd(product, productUrl)} />
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: "Home", url: BASE_URL },
          { name: "Products", url: `${BASE_URL}/products` },
          { name: product.title, url: productUrl },
        ])}
      />
      <ProductDetailWithCart product={product} />
    </div>
  );
}
