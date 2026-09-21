"use client";

import { useId, useState } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MinusIcon, PlusIcon } from "@/components/ui/icons";
import { faqs } from "@/content/faqs";

export function Faq() {
  // Items toggle independently so answers can be compared side by side.
  const [open, setOpen] = useState<number[]>([]);
  const baseId = useId();

  const toggle = (index: number) =>
    setOpen((current) =>
      current.includes(index) ? current.filter((i) => i !== index) : [...current, index],
    );

  return (
    <section className="bg-white py-10 sm:py-14 lg:py-20">
      <Container>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.5fr)] lg:gap-14">
          <SectionHeading title="Frequently Asked Questions">
            Answers to what dental practices ask us most.
          </SectionHeading>

          <ul className="flex flex-col">
            {faqs.map((faq, index) => {
              const isOpen = open.includes(index);
              const panelId = `${baseId}-panel-${index}`;
              const buttonId = `${baseId}-button-${index}`;

              return (
                <li key={faq.question} className="border-b border-line first:border-t">
                  <h3>
                    <button
                      id={buttonId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => toggle(index)}
                      className="flex w-full items-start justify-between gap-4 py-4 text-left transition-colors hover:text-teal sm:py-5"
                    >
                      <span className="text-[0.9375rem] font-semibold leading-snug text-navy sm:text-base lg:text-[1.0625rem]">
                        {faq.question}
                      </span>
                      <span
                        aria-hidden="true"
                        className={`mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors ${
                          isOpen ? "bg-teal text-white" : "bg-mist text-navy"
                        }`}
                      >
                        {isOpen ? (
                          <MinusIcon className="h-3.5 w-3.5" />
                        ) : (
                          <PlusIcon className="h-3.5 w-3.5" />
                        )}
                      </span>
                    </button>
                  </h3>

                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    hidden={!isOpen}
                    className="pb-5 pr-9"
                  >
                    <p className="text-sm leading-relaxed text-muted lg:text-[0.9375rem]">{faq.answer}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </Container>
    </section>
  );
}
