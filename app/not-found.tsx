import Link from "next/link";
import { Section } from "@/components/shared/section";
import { Container } from "@/components/shared/container";
import { Eyebrow } from "@/components/shared/eyebrow";
import { Button } from "@/components/shared/button";

export default function NotFound() {
  return (
    <Section bg="cream" spacing="lg">
      <Container size="md" className="text-center">
        {/* Label-caps eyebrow */}
        <Eyebrow color="gold" className="mb-4">404</Eyebrow>
        <h1 className="font-heading text-headline-lg text-navy">Không tìm thấy trang</h1>
        <p className="mt-4 text-body-lg text-navy/70 max-w-md mx-auto">
          Xin lỗi, trang bạn đang tìm không tồn tại hoặc đã được di chuyển.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link href="/">Về trang chủ</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/kien-thuc">Đọc blog</Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
}
