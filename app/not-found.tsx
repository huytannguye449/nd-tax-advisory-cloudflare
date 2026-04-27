import Link from "next/link";
import { Section } from "@/components/shared/section";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/shared/button";

export default function NotFound() {
  return (
    <Section bg="cream" spacing="lg">
      <Container size="md" className="text-center">
        <p className="text-7xl md:text-9xl font-heading font-bold text-gold/40">404</p>
        <h1 className="mt-4 text-3xl md:text-4xl font-bold">Không tìm thấy trang</h1>
        <p className="mt-4 text-navy/70 text-lg max-w-md mx-auto">
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
