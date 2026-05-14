import Image from "next/image";
import { TEAM } from "@/lib/data";
import { Eyebrow } from "@/components/shared/eyebrow";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";

const AVATARS: Record<string, string> = {
  "anh-ngoc": "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80",
  "chi-trang": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
  "chi-phuong": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
};

export function TeamGrid() {
  return (
    <Section bg="cream-100" spacing="md" hairlineTop aria-labelledby="team-heading">
      <Container size="default">
        <div className="mb-12">
          <Eyebrow color="gold" className="mb-3">
            ĐỘI NGŨ
          </Eyebrow>
          <h2
            id="team-heading"
            className="font-heading text-headline-md text-navy mt-2 mb-4"
          >
            Những chuyên gia đứng sau
          </h2>
          <p className="text-body-md text-navy/65 leading-relaxed max-w-2xl">
            Mỗi thành viên đều là Kiểm toán viên Việt Nam (CPA) và sở hữu Chứng chỉ
            hành nghề thuế (CPTA), với hành trình sự nghiệp xuyên qua các Big4 firm
            và tập đoàn đa ngành lớn nhất Việt Nam.
          </p>
        </div>

        <div className="grid gap-[var(--spacing-gutter)] md:grid-cols-3">
          {TEAM.map((member) => (
            <article
              key={member.slug}
              className="flex flex-col border-t-hairline border-gold pt-6"
            >
              <div className="size-24 overflow-hidden mb-5 border border-cream-300">
                <Image
                  src={AVATARS[member.slug]}
                  alt={`Ảnh đại diện ${member.name}`}
                  width={400}
                  height={400}
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="font-heading text-headline-sm text-navy mb-1">
                {member.name}
              </h3>
              <p className="text-label-caps text-gold-700 uppercase tracking-[0.1em] mb-4">
                {member.title}
              </p>

              <ul className="text-body-sm text-navy/70 space-y-1.5 mb-5">
                {member.credentials.map((cred) => (
                  <li key={cred} className="flex items-start gap-1.5">
                    <span className="text-gold-700 shrink-0 mt-0.5" aria-hidden="true">—</span>
                    <span>{cred}</span>
                  </li>
                ))}
              </ul>

              <p className="text-body-sm text-navy/70 leading-relaxed flex-1">
                {member.bio}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
