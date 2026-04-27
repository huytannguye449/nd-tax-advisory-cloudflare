"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { FAQ_GENERAL } from "@/lib/data";
import { Eyebrow } from "@/components/shared/eyebrow";
import { Container } from "@/components/shared/container";

export function ServicesFaq() {
  return (
    <section className="bg-cream py-16 md:py-24">
      <Container size="lg">
        <div className="text-center mb-12">
          <Eyebrow color="gold" className="mb-3">
            CÂU HỎI THƯỜNG GẶP
          </Eyebrow>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy mt-2">
            Câu hỏi từ doanh nghiệp
          </h2>
        </div>

        <Accordion.Root type="single" collapsible className="max-w-3xl mx-auto">
          {FAQ_GENERAL.map((item, idx) => (
            <Accordion.Item
              key={idx}
              value={`item-${idx}`}
              className="border-b border-cream-300"
            >
              <Accordion.Trigger className="flex w-full items-start justify-between py-5 text-left font-semibold text-navy hover:text-gold-700 transition group">
                <span className="text-lg pr-6">{item.q}</span>
                <ChevronDown
                  className="size-5 shrink-0 transition-transform group-data-[state=open]:rotate-180"
                  aria-hidden="true"
                />
              </Accordion.Trigger>
              <Accordion.Content className="pb-5 text-navy/80 leading-relaxed data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up overflow-hidden">
                <div className="pt-0 pb-2">{item.a}</div>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </Container>
    </section>
  );
}
