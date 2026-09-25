import type { Metadata } from "next";
import { FeatureGrid } from "@/components/content/FeatureGrid";
import { Steps } from "@/components/content/Steps";
import { DirectMailArrangement } from "@/components/mockups/arrangements";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CtaBanner } from "@/components/ui/CtaBanner";
import { PageHero } from "@/components/ui/PageHero";
import { CheckCircleIcon, MailIcon, MapPinIcon, PencilIcon, PrinterIcon, TruckIcon } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Direct Mail for Dental Practices | Dentistry Printing",
  description:
    "New-patient direct mail for dental practices: choose the neighborhoods you want to reach, we design and print the piece, and handle the mailing.",
};

const STEPS = [
  {
    title: "Choose your area",
    detail:
      "Tell us the neighborhoods, ZIP codes or radius around your practice you want to reach. You do not need mailing lists or postal route numbers — describe the area and we work it out.",
  },
  {
    title: "We design the piece",
    detail:
      "Work from your existing branding or start fresh. The offer, the layout and the call to action are built for a household deciding where to book, not for a brochure rack.",
  },
  {
    title: "Approve the proof",
    detail:
      "You see the piece exactly as it will print, and approve it before production starts.",
  },
  {
    title: "We print and mail it",
    detail:
      "Printing and the mailing itself are handled together, so the campaign leaves as one job rather than three vendors and a coordination problem.",
  },
];

const POINTS = [
  {
    icon: MapPinIcon,
    title: "Target by neighborhood",
    detail:
      "Reach the households around your practice, or around a second location you are opening. You describe the area in plain terms and we translate it into the mailing.",
  },
  {
    icon: PencilIcon,
    title: "Design included in the quote",
    detail:
      "Campaign design is quoted alongside the printing and mailing, so there is no separate creative bill to negotiate afterwards.",
  },
  {
    icon: MailIcon,
    title: "Mailing handled for you",
    detail:
      "We take care of getting the pieces into the mail stream. You are not driving anything to the post office.",
  },
  {
    icon: PrinterIcon,
    title: "Built for new patients",
    detail:
      "Postcards, door hangers and new-practice announcements — the formats that work for a household choosing a dentist.",
  },
  {
    icon: CheckCircleIcon,
    title: "Proofed before it prints",
    detail:
      "Nothing goes to press until you have approved it. A mail campaign is the worst place to find a typo.",
  },
  {
    icon: TruckIcon,
    title: "Nationwide",
    detail:
      "Campaigns run wherever your practice is, including for practices opening in a new market.",
  },
];

export default function DirectMailPage() {
  return (
    <>
      <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Direct Mail" }]} />

      <PageHero
        eyebrow="Direct Mail Campaigns"
        title="Reach New Patients in"
        highlight="Your Neighborhood."
        body="Direct mail for dental practices, handled end to end — the design, the printing, and the mailing itself. Tell us the area you want to reach and we will quote the campaign."
        secondary={{ label: "See Postcard Options", href: "/printing-products/direct-mail-postcards" }}
        aside={<DirectMailArrangement className="h-auto w-full" />}
      />

      <Steps
        title="How a campaign runs"
        intro="From the area you want to reach to the pieces landing in mailboxes."
        steps={STEPS}
      />

      <FeatureGrid
        title="What a campaign includes"
        intro="Design, print and mailing quoted as one job, so the whole campaign has a single number."
        features={POINTS}
      />

      <CtaBanner
        title="Ready to Plan a Campaign?"
        body="Tell us the area you want to reach and roughly how many households. We'll come back with options and pricing."
        primary={{ label: "Request a Quote", href: "/request-a-quote?product=direct-mail-campaign" }}
        secondary={{ label: "How It Works", href: "/how-it-works" }}
      />
    </>
  );
}
