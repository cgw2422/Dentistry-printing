import type { Metadata } from "next";
import { FeatureGrid } from "@/components/content/FeatureGrid";
import { StationerySet } from "@/components/mockups/arrangements";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { CtaBanner } from "@/components/ui/CtaBanner";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CheckCircleIcon, MailIcon, PencilIcon, PrinterIcon, TruckIcon } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "About | Dentistry Printing",
  description:
    "Dentistry Printing is a printing and direct mail company for dental practices — everyday practice essentials through to new-patient campaigns.",
};

const POINTS = [
  {
    icon: PrinterIcon,
    title: "Dental practices only",
    detail:
      "We are not a general print shop with a dental section. The catalogue is the pieces a practice actually uses, which means fewer decisions and no wading through products that do not apply to you.",
  },
  {
    icon: PencilIcon,
    title: "Design and print together",
    detail:
      "Artwork and printing are quoted as one job. You are not briefing a designer, then finding a printer, then explaining the file format to both.",
  },
  {
    icon: MailIcon,
    title: "Campaigns, not just print runs",
    detail:
      "For direct mail we handle the design, the print and the mailing, so a new-patient campaign is one conversation rather than three vendors.",
  },
  {
    icon: CheckCircleIcon,
    title: "Quoted per job",
    detail:
      "Every job is priced on its actual specification. You get a real number for what you need, rather than a headline price that changes once quantity and finish are settled.",
  },
  {
    icon: TruckIcon,
    title: "Nationwide",
    detail:
      "We print and ship across the country, including for multi-location practices that need work split between sites.",
  },
  {
    icon: CheckCircleIcon,
    title: "One point of contact",
    detail:
      "Your quote is answered by a person, not a ticket queue, and the same person sees the job through to delivery.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "About" }]} />

      <PageHero
        eyebrow="About Dentistry Printing"
        title="Printing for Dental Practices,"
        highlight="Done Properly."
        body="From the appointment cards at your front desk to the postcards that bring new patients through the door — professional printing and direct mail, built around how a dental practice actually runs."
        secondary={{ label: "How It Works", href: "/how-it-works" }}
        aside={<StationerySet className="h-auto w-full" />}
      />

      <section className="bg-white py-10 sm:py-14 lg:py-20">
        <Container>
          <div className="max-w-2xl">
            <SectionHeading title="What we do">
              Dentistry Printing supplies the printed materials a dental practice runs on, and the
              direct mail that brings new patients in.
            </SectionHeading>

            <div className="mt-6 flex flex-col gap-4 text-[0.9375rem] leading-relaxed text-muted sm:text-base">
              <p>
                That covers the everyday pieces — business cards, appointment cards, referral
                cards, letterhead and envelopes, brochures and patient education materials — and
                the marketing side, from new-patient postcards and door hangers to complete
                campaigns for a practice that is opening or relocating.
              </p>
              <p>
                We work by quote rather than by catalogue price. Printing costs genuinely depend on
                quantity, size, stock and finish, and a number on a web page that moves once you
                specify the job is not a price, it is a lead magnet. Tell us what you need and you
                get a figure for that job.
              </p>
              <p>
                Design is part of the same conversation. Whether you have brand files ready or a
                rough idea, the artwork and the printing are quoted together so you know what the
                finished piece costs before anything starts.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <FeatureGrid
        title="How we work"
        intro="The things that shape every quote we send."
        features={POINTS}
      />

      <CtaBanner
        title="Let's Talk About Your Practice."
        body="Tell us what you need printed and we'll come back with options and pricing."
        primary={{ label: "Request a Quote", href: "/request-a-quote" }}
        secondary={{ label: "Contact Us", href: "/contact" }}
      />
    </>
  );
}
