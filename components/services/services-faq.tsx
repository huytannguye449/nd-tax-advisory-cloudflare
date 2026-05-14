"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { FAQ_GENERAL } from "@/lib/data";
import { Eyebrow } from "@/components/shared/eyebrow";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";

export function ServicesFaq() {
  return (
    <Section bg="cream" spacing="md" hairlineTop>
      <Container size="narrow">
        <div className="mb-12">
          <Eyebrow color="gold" className="mb-3">
            CÂU HỎI THƯỜNG GẶP
          </Eyebrow>
          <h2 className="font-heading text-headline-md text-navy mt-2">
            Câu hỏi từ doanh nghiệp
          </h2>
        </div>

        <Accordion.Root type="single" collapsible>
          {FAQ_GENERAL.map((item, idx) => (
            <Accordion.Item
              key={idx}
              value={`item-${idx}`}
              className="border-b border-cream-300 last:border-b-0"
            >
              <Accordion.Trigger className="flex w-full items-start justify-between py-5 text-left group">
                <span className="text-body-lg text-navy font-semibold pr-6 group-data-[state=open]:text-gold-700 transition-colors">
                  {item.q}
                </span>
                <ChevronDown
                  className="size-5 shrink-0 text-gold transition-transform group-data-[state=open]:rotate-180"
                  aria-hidden="true"
                />
              </Accordion.Trigger>
              <Accordion.Content className="pb-5 text-body-md text-navy/80 leading-relaxed data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up overflow-hidden">
                <div className="pt-0 pb-2">{item.a}</div>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </Container>
    </Section>
  );
}
