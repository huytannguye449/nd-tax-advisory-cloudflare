import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { TEAM } from "@/lib/data";
import { Eyebrow } from "@/components/shared/eyebrow";
import { Container } from "@/components/shared/container";

const AVATARS: Record<string, string> = {
  "anh-ngoc": "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80",
  "chi-trang": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
  "chi-phuong": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
};

export function TeamGrid() {
  return (
    <section className="bg-cream-100 py-16 md:py-24" aria-labelledby="team-heading">
      <Container size="xl">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <Eyebrow color="gold" className="mb-3">
            ĐỘI NGŨ
          </Eyebrow>
          <h2
            id="team-heading"
            className="font-heading text-3xl md:text-4xl font-bold text-navy mt-2 mb-4"
          >
            Những chuyên gia đứng sau
          </h2>
          <p className="text-navy/65 leading-relaxed">
            Mỗi thành viên đều là Kiểm toán viên Việt Nam (CPA) và sở hữu Chứng chỉ
            hành nghề thuế (CPTA), với hành trình sự nghiệp xuyên qua các Big4 firm
            và tập đoàn đa ngành lớn nhất Việt Nam.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {TEAM.map((member) => (
            <article
              key={member.slug}
              className="bg-white rounded-xl p-7 border border-cream-300 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="size-32 rounded-full overflow-hidden mb-5 border-2 border-cream-300 ring-4 ring-cream-100">
                <Image
                  src={AVATARS[member.slug]}
                  alt={`Ảnh đại diện ${member.name}`}
                  width={400}
                  height={400}
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="font-heading text-xl font-bold text-navy mb-1">
                {member.name}
              </h3>
              <p className="text-gold-700 font-semibold text-sm mb-4">
                {member.title}
              </p>

              <ul className="text-xs text-navy/70 space-y-1.5 mb-5 self-stretch">
                {member.credentials.map((cred) => (
                  <li
                    key={cred}
                    className="flex items-start gap-1.5 justify-center"
                  >
                    <CheckCircle2
                      className="size-3.5 text-gold-700 shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <span className="text-left">{cred}</span>
                  </li>
                ))}
              </ul>

              <p className="text-navy/70 text-sm leading-relaxed flex-1">
                {member.bio}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
