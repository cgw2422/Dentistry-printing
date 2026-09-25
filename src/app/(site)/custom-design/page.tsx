import type { Metadata } from "next";
import { FeatureGrid } from "@/components/content/FeatureGrid";
import { Steps } from "@/components/content/Steps";
import { DesignSample } from "@/components/mockups/arrangements";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CtaBanner } from "@/components/ui/CtaBanner";
import { PageHero } from "@/components/ui/PageHero";
import { CheckCircleIcon, MailIcon, PencilIcon, PrinterIcon } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Custom Graphic Design | Dentistry Printing",
  description:
    "Graphic design for dental practices — work from your existing branding or start from scratch. Design is quoted alongside your printing.",
};

const STEPS = [
  {
    title: "Share what you have",
    detail:
      "A logo, an old brochure, brand colors, or nothing at all. Tell us where you are starting from when you request a quote.",
  },
  {
    title: "We quote the design",
    detail:
      "Design is priced with the printing so you see one number for the finished piece. You know the cost before any work begins.",
  },
  {
    title: "We design the piece",
    detail:
      "Our design team builds artwork for the format it will actually print at — the right dimensions, the right bleed, laid out to be read.",
  },
  {
    title: "You approve it",
    detail:
      "Review the proof and approve the artwork before it goes to press. Changes happen at this stage, not after.",
  },
];

const POINTS = [
  {
    icon: PencilIcon,
    title: "Work from your branding",
    detail:
      "If your practice already has a logo and a look, we keep to it. New pieces should sit alongside what you already hand to patients.",
  },
  {
    icon: CheckCircleIcon,
    title: "Or start from scratch",
    detail:
      "No branding yet? We can build the piece from the ground up — useful for a practice that is opening or rebranding.",
  },
  {
    icon: PrinterIcon,
    title: "Designed for print, not screen",
    detail:
      "Artwork is prepared for the press: correct dimensions, safe margins, and type that stays legible at the size it prints.",
  },
  {
    icon: MailIcon,
    title: "Campaign creative too",
    detail:
      "Direct mail pieces are designed around the offer and the call to action, not just made to look tidy.",
  },
];

/** The same before/after pair the homepage uses, at hero scale. */
function BeforeAfter() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-5">
      {(["before", "after"] as const).map((state) => (
        <figure
          key={state}
          className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-line"
        >
          <figcaption
            className={`px-4 py-2 text-[0.6875rem] font-bold uppercase tracking-[0.14em] ${
              state === "before" ? "bg-mist text-muted" : "bg-teal text-white"
            }`}
          >
            {state === "before" ? "Before" : "After"}
          </figcaption>
          <div className="bg-linear-to-br from-mist to-sky-50 p-1">
            <DesignSample state={state} className="h-auto w-full" />
          </div>
        </figure>
      ))}
    </div>
  );
}

export default function CustomDesignPage() {
  return (
    <>
      <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Custom Design" }]} />

      <PageHero
        eyebrow="Custom Graphic Design"
        title="Design That Prints"
        highlight="Properly."
        body="Our design team can work from your existing branding or start from scratch. Design services are quoted alongside your printing, so you see the full cost of the finished piece."
        primary={{ label: "Request a Quote", href: "/request-a-quote?product=custom-graphic-design" }}
        secondary={{ label: "Browse Printing Products", href: "/printing-products" }}
        aside={<BeforeAfter />}
      />

      <Steps
        title="How design works"
        intro="Quoted up front, proofed before it prints."
        steps={STEPS}
      />

      <FeatureGrid
        title="What we can design"
        intro="Anything in the printing catalogue, plus the campaign creative that goes with it."
        features={POINTS}
        columns={2}
      />

      <CtaBanner
        title="Need Something Designed?"
        body="Tell us what you're printing and what you already have. We'll quote the design and the printing together."
        primary={{ label: "Request a Quote", href: "/request-a-quote?product=custom-graphic-design" }}
        secondary={{ label: "How It Works", href: "/how-it-works" }}
      />
    </>
  );
}
