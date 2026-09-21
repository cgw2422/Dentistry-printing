import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TextLink } from "@/components/ui/Button";
import { popularProducts } from "@/content/products";
import { ProductCard } from "./ProductCard";

export function PopularProducts() {
  return (
    <section className="bg-white py-14 sm:py-16 lg:py-20">
      <Container>
        <SectionHeading
          title="Popular Products"
          layout="side"
          action={<TextLink href="/printing-products">View All Products</TextLink>}
        >
          The pieces dental practices order most often.
        </SectionHeading>

        <ul className="mt-9 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          {popularProducts.map((product) => (
            <li key={product.slug} className="flex">
              <div className="flex w-full">
                <ProductCard product={product} emphasis="popular" />
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
