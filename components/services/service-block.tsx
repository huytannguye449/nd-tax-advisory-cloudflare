import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Phone } from "lucide-react";
import { PersonSocialLinks } from "@/components/about/person-social-links";
import { Button } from "@/components/shared/button";
import { Container } from "@/components/shared/container";
import { cn } from "@/lib/utils";

type Service = {
  id?: string;
  slug: string;
  title: string;
  short_description?: string | null;
  description: string | null;
  when_items?: readonly string[];
  process_items?: readonly string[];
  deliverable_items?: readonly string[];
  pricing: string | null;
  cover_url?: string | null;
  service_people?: Array<{
    role_label: string | null;
    person: {
      id?: string;
      slug?: string;
      name: string;
      title: string | null;
      bio?: string | null;
      avatar_url?: string | null;
      phone?: string | null;
      expertise?: string[] | null;
      credentials?: string[] | null;
      social_links?: Record<string, string> | null;
      status?: "draft" | "published";
      profile_enabled?: boolean;
    } | null;
  }>;
  cta_label?: string | null;
  cta_href?: string | null;
};

interface ServiceBlockProps {
  service: Service;
  idx: number;
}

export function ServiceBlock({ service, idx }: ServiceBlockProps) {
  const when = service.when_items ?? [];
  const process = service.process_items ?? [];
  const deliverables = service.deliverable_items ?? [];
  const experts =
    service.service_people?.filter(
      (rel) =>
        rel.person !== null &&
        (rel.person.status ?? "published") === "published" &&
        rel.person.profile_enabled !== false,
    ) ?? [];
  const bookingHref = getServiceBookingHref(service.cta_href, service.slug);

  return (
    <section
      id={service.slug}
      className={cn(
        "scroll-mt-24 border-t-hairline border-gold py-14 md:py-16",
        idx % 2 === 0 ? "bg-cream" : "bg-cream-100",
      )}
      aria-labelledby={`service-heading-${service.slug}`}
    >
      <Container size="wide">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-8">
            <div className="mb-6 flex items-center gap-3 text-gold-700">
              <span className="text-label-caps">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <span aria-hidden="true" className="h-px w-10 bg-gold" />
            </div>

            <h2
              id={`service-heading-${service.slug}`}
              className="max-w-4xl font-heading text-headline-lg leading-[1.08] text-navy text-balance"
            >
              {service.title}
            </h2>

            {service.short_description ? (
              <p className="mt-4 max-w-3xl text-body-md italic leading-relaxed text-gold-700">
                {service.short_description}
              </p>
            ) : null}

            {service.description ? (
              <p className="mt-5 max-w-4xl text-body-md leading-relaxed text-navy/72">
                {service.description}
              </p>
            ) : null}

            <ServiceCover service={service} priority={idx === 0} />

            <div className="mt-10 grid gap-9 md:grid-cols-2">
              <ChecklistSection title="Khi nào doanh nghiệp cần" items={when} />
              <ProcessSection title="Quy trình triển khai" items={process} />
              <ChecklistSection
                title="Sản phẩm bàn giao"
                items={deliverables}
              />
              <PricingBlock pricing={service.pricing} />
            </div>

            <div className="mt-10 border-t border-data-row pt-6">
              <Button asChild variant="primary" size="lg">
                <Link href={bookingHref}>
                  {service.cta_label || "Đặt lịch tư vấn"}
                </Link>
              </Button>
            </div>
          </div>

          <aside className="lg:col-span-4" aria-label="Chuyên gia phụ trách">
            <div className="lg:sticky lg:top-32">
              <ExpertPanel experts={experts} />
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
}

function getServiceBookingHref(
  ctaHref: string | null | undefined,
  slug: string,
) {
  const serviceParam = encodeURIComponent(slug);
  const href = ctaHref?.trim();

  if (!href || href === "/dat-lich" || href === "/dat-lich/") {
    return `/dat-lich?service=${serviceParam}`;
  }

  if (href.startsWith("/dat-lich?")) {
    const [pathname, query = ""] = href.split("?");
    const params = new URLSearchParams(query);
    if (!params.has("service")) params.set("service", slug);
    return `${pathname}?${params.toString()}`;
  }

  return href;
}

function ServiceCover({
  service,
  priority,
}: {
  service: Service;
  priority?: boolean;
}) {
  return (
    <div className="relative mt-10 aspect-[16/9] overflow-hidden bg-cream-200">
      {service.cover_url ? (
        <Image
          src={service.cover_url}
          alt={service.title}
          fill
          priority={priority}
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 70vw"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-heading text-4xl font-bold text-navy/20">
            NHN&amp;D
          </span>
        </div>
      )}
    </div>
  );
}

function ExpertPanel({
  experts,
}: {
  experts: NonNullable<Service["service_people"]>;
}) {
  if (experts.length === 0) return null;

  return (
    <section>
      <h3 className="border-b border-data-row pb-3 text-label-caps text-gold-700">
        Chuyên gia phụ trách
      </h3>
      <div className="mt-4 space-y-4">
        {experts.map((rel) => {
          const person = rel.person;
          if (!person) return null;
          const credentials = person.credentials ?? [];
          const expertise = person.expertise ?? [];
          const phoneHref = person.phone ? phoneLink(person.phone) : null;
          const hasSocialLinks =
            Object.entries(person.social_links ?? {}).filter(
              ([key, value]) => key.trim() && value.trim(),
            ).length > 0;
          return (
            <article
              key={`${person.slug ?? person.name}-${rel.role_label ?? ""}`}
              className="border border-data-row bg-cream p-5"
            >
              <div className="grid grid-cols-[64px_1fr] items-center gap-4">
                <div className="relative size-16 overflow-hidden rounded-full bg-cream-200">
                  {person.avatar_url ? (
                    <Image
                      src={person.avatar_url}
                      alt={person.name}
                      fill
                      className="object-cover"
                      sizes="72px"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center font-heading text-xl text-navy/30">
                      {person.name.slice(0, 1)}
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-heading text-headline-sm leading-tight text-navy">
                    {person.name}
                  </h4>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-navy/50">
                    {rel.role_label || person.title || "Responsible expert"}
                  </p>
                  {person.title && rel.role_label ? (
                    <p className="mt-1 text-body-sm text-navy/58">
                      {person.title}
                    </p>
                  ) : null}
                </div>
              </div>

              {credentials.length > 0 ? (
                <ul className="mt-4 space-y-1.5 text-body-sm text-navy/70">
                  {credentials.map((credential) => (
                    <li key={credential} className="flex items-start gap-2">
                      <span
                        className="mt-0.5 shrink-0 text-gold-700"
                        aria-hidden="true"
                      >
                        -
                      </span>
                      <span>{credential}</span>
                    </li>
                  ))}
                </ul>
              ) : null}

              {person.bio ? (
                <p className="mt-4 text-body-sm leading-relaxed text-navy/70">
                  {person.bio}
                </p>
              ) : null}

              {expertise.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {expertise.map((item) => (
                    <span
                      key={item}
                      className="border border-cream-300 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-navy/55"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              ) : null}

              {(phoneHref || hasSocialLinks) && (
                <div className="mt-5 border-t border-cream-300 pt-4">
                  {phoneHref && person.phone ? (
                    <a
                      href={phoneHref}
                      className="mb-3 inline-flex items-center gap-2 text-label-caps uppercase text-navy/60 transition-colors hover:text-gold-700"
                    >
                      <Phone className="size-3.5" aria-hidden="true" />
                      {person.phone}
                    </a>
                  ) : null}
                  <PersonSocialLinks links={person.social_links} />
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

function phoneLink(phone: string) {
  const normalized = phone.trim().replace(/[^\d+]/g, "");
  return normalized ? `tel:${normalized}` : null;
}

function ChecklistSection({
  title,
  items,
}: {
  title: string;
  items: readonly string[];
}) {
  if (items.length === 0) return null;
  return (
    <section className="border-t border-data-row pt-4">
      <h3 className="mb-4 text-label-caps text-gold-700">{title}</h3>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-body-md text-navy/72">
            <CheckCircle2
              className="mt-0.5 size-5 shrink-0 text-gold-700"
              aria-hidden="true"
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ProcessSection({
  title,
  items,
}: {
  title: string;
  items: readonly string[];
}) {
  if (items.length === 0) return null;
  return (
    <section className="border-t border-data-row pt-4">
      <h3 className="mb-4 text-label-caps text-gold-700">{title}</h3>
      <ol className="space-y-3">
        {items.map((item, index) => (
          <li key={item} className="flex gap-4 text-body-md text-navy/72">
            <span
              className="flex size-7 shrink-0 items-center justify-center bg-navy text-body-sm font-semibold text-cream"
              aria-hidden="true"
            >
              {index + 1}
            </span>
            <span className="pt-1">{item}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

function PricingBlock({ pricing }: { pricing: string | null }) {
  if (!pricing) return null;
  return (
    <section className="border-t border-data-row pt-4">
      <h3 className="mb-4 text-label-caps text-gold-700">Phí tham khảo</h3>
      <div className="border-l-4 border-gold bg-cream-200/60 p-5">
        <p className="font-heading text-headline-sm leading-snug text-navy">
          {pricing}
        </p>
      </div>
    </section>
  );
}
