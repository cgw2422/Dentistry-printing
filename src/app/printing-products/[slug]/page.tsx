import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductDetailPage } from "@/components/products/detail/ProductDetailPage";
import { resolveProduct } from "@/content/productDetails";
import { products } from "@/content/products";

/** One static page per catalogue product; unknown slugs 404. */
export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const resolved = resolveProduct(slug);
  if (!resolved) return {};

  return {
    title: resolved.product.name,
    description: resolved.detail.description,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const resolved = resolveProduct(slug);
  if (!resolved || !resolved.detail.active) notFound();

  return <ProductDetailPage resolved={resolved} />;
}
