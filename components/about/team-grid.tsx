import Image from "next/image";
import { Linkedin } from "lucide-react";
import { Eyebrow } from "@/components/shared/eyebrow";
import { Container } from "@/components/shared/container";

const TEAM = [
  {
    name: "Anh Ngọc",
    title: "Founder & CEO",
    bio: "Hơn 20 năm kinh nghiệm tư vấn thuế và tài chính chiến lược tại Việt Nam. Cựu chuyên gia Big4, CFO tập đoàn cấp Vingroup-tier. Thành lập N&D năm 2026 để đưa tư vấn thuế chiến lược đến gần hơn với doanh nghiệp SME và FDI.",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80",
    linkedin: "https://www.linkedin.com/company/nd-tax-advisory",
  },
  {
    name: "Trang",
    title: "Senior Manager",
    bio: "10 năm kinh nghiệm tax compliance & audit, ACCA member. Chuyên thuế GTGT/TNCN cho doanh nghiệp SME và F&B. Trang dẫn dắt team thực thi với phương châm: chính xác đến từng dòng, đúng hạn đến từng giờ.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    linkedin: null,
  },
  {
    name: "Phương",
    title: "Senior Consultant",
    bio: "8 năm kinh nghiệm tư vấn M&A tax và cross-border. MBA, chuyên cấu trúc thuế cho công ty FDI từ Hàn Quốc, Nhật Bản, Singapore. Phương phụ trách các dự án transfer pricing và tái cấu trúc tập đoàn.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
    linkedin: null,
  },
];

export function TeamGrid() {
  return (
    <section className="bg-cream-100 py-16 md:py-24" aria-labelledby="team-heading">
      <Container size="xl">
        <div className="text-center mb-12">
          <Eyebrow color="gold" className="mb-3">
            ĐỘI NGŨ
          </Eyebrow>
          <h2
            id="team-heading"
            className="font-heading text-3xl md:text-4xl font-bold text-navy mt-2"
          >
            Những người đứng sau
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {TEAM.map((member) => (
            <article
              key={member.name}
              className="bg-white rounded-xl p-8 border border-cream-300 flex flex-col items-center text-center shadow-sm"
            >
              <div className="size-28 rounded-full overflow-hidden mb-5 border-2 border-cream-300">
                <Image
                  src={member.avatar}
                  alt={`Ảnh đại diện ${member.name}`}
                  width={400}
                  height={400}
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="font-heading text-xl font-bold text-navy mb-1">
                {member.name}
              </h3>
              <p className="text-gold-700 font-semibold text-sm mb-4">{member.title}</p>
              <p className="text-navy/70 text-sm leading-relaxed flex-1">{member.bio}</p>
              {member.linkedin && (
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`LinkedIn của ${member.name}`}
                  className="mt-5 text-navy/40 hover:text-navy transition-colors min-h-[44px] flex items-center"
                >
                  <Linkedin className="size-5" aria-hidden="true" />
                </a>
              )}
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
