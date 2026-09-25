import type { Metadata } from "next";
import { Steps } from "@/components/content/Steps";
import { FeatureGrid } from "@/components/content/FeatureGrid";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CtaBanner } from "@/components/ui/CtaBanner";
import { PageHero } from "@/components/ui/PageHero";
import {
  CheckCircleIcon,
  MailIcon,
  PencilIcon,
  PrinterIcon,
  TruckIcon,
} from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "How It Works | Dentistry Printing",
  description:
    "How printing and direct mail works with Dentistry Printing: request a quote, approve your proof, and we handle printing and nationwide fulfillment.",
};

const STEPS = [
  {
    title: "Tell us what you need",
    detail:
      "Send a quote request with the product, roughly how many you need, and anything you already know about the specification. If you are not sure yet, say so — that is what the conversation is for.",
  },
  {
    title: "We quote it",
    detail:
      "We confirm what is available for the job, then come back with pricing and options. You are quoting against a real specification, not a starting price that moves later.",
  },
  {
    title: "Artwork and proof",
    detail:
      "Send print-ready files, or have our design team prepare them. Either way you review a proof and approve the artwork before anything goes to press.",
  },
  {
    title: "Print and deliver",
    detail:
      "We coordinate printing and fulfillment, and ship to your practice. For direct mail, we handle the mailing itself so the pieces go straight to households.",
  },
];

const POINTS = [
  {
    icon: PencilIcon,
    title: "Design help when you need it",
    detail:
      "Have a logo and brand already? We work from it. Starting from scratch? Our design team can build the piece. Design is quoted alongside the printing, so you see what it costs before committing.",
  },
  {
    icon: CheckCircleIcon,
    title: "A proof before production",
    detail:
      "Nothing prints until you have seen it and approved it. Proofing is part of every job, not an upgrade.",
  },
  {
    icon: PrinterIcon,
    title: "Printing built for practices",
    detail:
      "We print the things a dental office actually uses — appointment cards, referral cards, brochures, letterhead, new-patient mailers — rather than a general catalogue you have to navigate.",
  },
  {
    icon: TruckIcon,
    title: "Nationwide fulfillment",
    detail:
      "Orders ship to your practice wherever you are. Multi-location practices can have work split across sites.",
  },
  {
    icon: MailIcon,
    title: "Direct mail, handled end to end",
    detail:
      "For mail campaigns we take it from design through printing to the mailing itself, so you are not coordinating three vendors.",
  },
  {
    icon: CheckCircleIcon,
    title: "One point of contact",
    detail:
      "You deal with the same person from quote to delivery. Questions get answered by someone who knows your job.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "How It Works" }]} />

      <PageHero
        eyebrow="How It Works"
        title="Printing Without the"
        highlight="Guesswork."
        body="Every job is quoted individually, proofed before it prints, and delivered to your practice. Here is what that looks like from your side."
        secondary={{ label: "Browse Printing Products", href: "/printing-products" }}
      />

      <Steps
        title="Four steps, start to finish"
        intro="No account to create, no cart to configure. You describe the job, we price it, and we take it from there."
        steps={STEPS}
      />

      <FeatureGrid
        title="What's included"
        intro="The parts of the process that are simply how we work, rather than add-ons."
        features={POINTS}
      />

      <CtaBanner
        title="Ready to Get a Price?"
        body="Tell us what you need printed. We'll confirm the options and come back with pricing."
        primary={{ label: "Request a Quote", href: "/request-a-quote" }}
        secondary={{ label: "Browse Printing Products", href: "/printing-products" }}
      />
    </>
  );
}
