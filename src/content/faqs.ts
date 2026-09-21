/**
 * Homepage FAQ copy.
 *
 * Answers describe how the service works and deliberately avoid quoting
 * prices, production times, delivery dates or outcome guarantees.
 */
export type Faq = { question: string; answer: string };

export const faqs: Faq[] = [
  {
    question: "Can I order printing without an existing design?",
    answer:
      "Yes. You can upload print-ready artwork if you already have it, or ask our design team to create it for you. We can work from your existing practice branding — logo, colors and fonts — or design something from scratch if you are starting fresh.",
  },
  {
    question: "Do you ship to dental practices nationwide?",
    answer:
      "Yes. We print and fulfill orders for dental practices across the United States, and your order ships directly to the practice address you provide. If you manage more than one location, orders can be shipped to each location separately.",
  },
  {
    question: "Can I reorder a previous product?",
    answer:
      "Reordering is part of the customer account system we are building. Once accounts are live, your practice will be able to see previous purchases and reorder a past product with the same artwork. In the meantime, tell us what you ordered before and we will match it.",
  },
  {
    question: "How does the direct-mail process work?",
    answer:
      "You tell us the area around your practice you want to reach and we help you define the mailing. We then produce your postcard design, and once you approve the artwork we coordinate printing, mailing preparation, postage and delivery into the mail stream. You do not need to handle a mailing list or a trip to the post office.",
  },
  {
    question: "Will I receive a proof before printing?",
    answer:
      "Yes. Nothing goes to press until you have reviewed a proof and approved it. If something needs to change, send it back with your notes and we will revise the artwork and send an updated proof.",
  },
  {
    question: "Can multiple employees manage our practice's orders?",
    answer:
      "That is how practice accounts are designed to work. A practice will be able to add authorized staff members to a single account, so an office manager and front-desk team can order and approve artwork together. Practices with more than one location will be able to manage those locations under the same account.",
  },
];
