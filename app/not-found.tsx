import Link from "next/link";
import { Button } from "@/components/shared/button";
import { Container } from "@/components/shared/container";
import { Eyebrow } from "@/components/shared/eyebrow";
import { Section } from "@/components/shared/section";

export default function NotFound() {
  return (
    <Section bg="cream" spacing="lg">
      <Container size="md" className="text-center">
        <Eyebrow color="gold" className="mb-4">
          404
        </Eyebrow>
        <h1 className="font-heading text-headline-lg text-navy">Không tìm thấy trang</h1>
        <p className="mx-auto mt-4 max-w-md text-body-lg text-navy/70">
          Xin lỗi, trang bạn đang tìm không tồn tại hoặc đã được di chuyển.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/">Về trang chủ</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/an-pham">Xem ấn phẩm</Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
}
