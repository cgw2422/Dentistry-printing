import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TextLink } from "@/components/ui/Button";
import { homePopular } from "@/content/products";
import { ProductCard } from "./ProductCard";

export function PopularProducts() {
  return (
    <section className="bg-white py-10 sm:py-14 lg:py-20">
      <Container>
        <SectionHeading
          title="Popular Products"
          layout="side"
          action={<TextLink href="/printing-products">View All Products</TextLink>}
        >
          The pieces dental practices order most often.
        </SectionHeading>

        <ul className="mt-7 grid grid-cols-2 gap-3 sm:mt-9 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          {homePopular.map((product) => (
            <li key={product.slug} className="flex">
              <ProductCard product={product} emphasis="popular" />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
