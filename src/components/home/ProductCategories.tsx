import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { productCategories } from "@/content/products";
import { ProductCard } from "./ProductCard";

export function ProductCategories() {
  return (
    <section className="bg-white py-14 sm:py-16 lg:py-20">
      <Container>
        <SectionHeading title="Everything Your Practice Needs in Print" layout="side">
          From the front desk to the mailbox, find professional printing designed for dental
          practices.
        </SectionHeading>

        <ul className="mt-9 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          {productCategories.map((product) => (
            <li key={product.slug} className="flex">
              <div className="flex w-full">
                <ProductCard product={product} />
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex sm:justify-center">
          <Button
            href="/printing-products"
            variant="secondary"
            size="lg"
            withArrow
            className="w-full sm:w-auto"
          >
            View All Printing Products
          </Button>
        </div>
      </Container>
    </section>
  );
}
