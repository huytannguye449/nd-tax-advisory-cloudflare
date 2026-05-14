"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Section } from "@/components/shared/section";
import { Container } from "@/components/shared/container";
import { Eyebrow } from "@/components/shared/eyebrow";
import { Button } from "@/components/shared/button";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Section bg="cream" spacing="lg">
      <Container size="md" className="text-center">
        {/* Label-caps eyebrow */}
        <Eyebrow color="gold" className="mb-4">Lỗi hệ thống</Eyebrow>
        <h1 className="font-heading text-headline-lg text-navy">Đã có lỗi xảy ra</h1>
        <p className="mt-4 text-body-lg text-navy/70 max-w-md mx-auto">
          Xin lỗi vì sự bất tiện. Vui lòng thử lại hoặc liên hệ trực tiếp với chúng tôi.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset}>Thử lại</Button>
          <Button asChild variant="outline">
            <Link href="/lien-he">Liên hệ</Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
}
