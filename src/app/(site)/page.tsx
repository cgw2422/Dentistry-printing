import { CustomDesign } from "@/components/home/CustomDesign";
import { DirectMail } from "@/components/home/DirectMail";
import { Faq } from "@/components/home/Faq";
import { FinalCta } from "@/components/home/FinalCta";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { NewPracticePackages } from "@/components/home/NewPracticePackages";
import { PopularProducts } from "@/components/home/PopularProducts";
import { ProductCategories } from "@/components/home/ProductCategories";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProductCategories />
      <DirectMail />
      <PopularProducts />
      <NewPracticePackages />
      <HowItWorks />
      <CustomDesign />
      <Faq />
      <FinalCta />
    </>
  );
}
