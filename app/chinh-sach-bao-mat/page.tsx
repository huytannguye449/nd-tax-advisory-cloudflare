import type { Metadata } from "next";
import { Section } from "@/components/shared/section";
import { Container } from "@/components/shared/container";
import { Eyebrow } from "@/components/shared/eyebrow";
import { SITE } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Chính sách bảo mật",
  description: "Chính sách bảo mật và xử lý dữ liệu cá nhân của NHN&D Tax Advisory.",
};

export default function PrivacyPage() {
  return (
    <Section bg="cream" spacing="md">
      <Container size="narrow">
        <Eyebrow color="gold">PHÁP LÝ</Eyebrow>
        <h1 className="mt-3 font-heading text-headline-lg text-navy mb-2">Chính sách bảo mật</h1>
        <p className="text-label-caps text-navy/60 mb-10">Cập nhật lần cuối: 27/04/2026</p>

        {/* Long-form prose — container-narrow, token typography, no prose modifier */}
        <div className="space-y-6">
          <p className="text-body-lg text-navy/80 leading-relaxed">
            {SITE.name} ("chúng tôi") tôn trọng quyền riêng tư của bạn. Chính sách này mô
            tả cách chúng tôi thu thập, sử dụng, lưu trữ và bảo vệ dữ liệu cá nhân của
            bạn khi sử dụng website {SITE.url}.
          </p>

          <h2 className="font-heading text-headline-sm text-navy mt-8">1. Dữ liệu chúng tôi thu thập</h2>
          <ul className="list-disc ml-6 space-y-1.5 text-body-md text-navy/80">
            <li><strong>Thông tin liên hệ:</strong> họ tên, email, số điện thoại, tên công ty khi bạn điền form hoặc đặt lịch.</li>
            <li><strong>Nội dung yêu cầu:</strong> mô tả nhu cầu tư vấn, dịch vụ quan tâm.</li>
            <li><strong>Thông tin kỹ thuật:</strong> địa chỉ IP, trình duyệt, thiết bị, trang đã xem (qua analytics).</li>
            <li><strong>Email subscription:</strong> địa chỉ email khi bạn đăng ký newsletter.</li>
          </ul>

          <h2 className="font-heading text-headline-sm text-navy mt-8">2. Mục đích sử dụng</h2>
          <ul className="list-disc ml-6 space-y-1.5 text-body-md text-navy/80">
            <li>Phản hồi yêu cầu tư vấn của bạn trong thời gian ngắn nhất.</li>
            <li>Gửi email confirmation, lịch hẹn (.ics), thông tin tư vấn đã đặt.</li>
            <li>Gửi newsletter chuyên môn nếu bạn đã đăng ký (có thể hủy bất cứ lúc nào).</li>
            <li>Cải thiện chất lượng website và dịch vụ thông qua phân tích dữ liệu tổng hợp.</li>
          </ul>

          <h2 className="font-heading text-headline-sm text-navy mt-8">3. Lưu trữ và bảo mật</h2>
          <p className="text-body-md text-navy/80 leading-relaxed">
            Dữ liệu của bạn được lưu trữ trên hạ tầng đám mây bảo mật (Supabase / Cloudflare),
            đặt tại khu vực ASEAN. Truy cập được giới hạn chỉ cho thành viên team được phân
            quyền cho từng dự án. Dữ liệu lead được giữ tối đa 36 tháng kể từ ngày liên hệ
            cuối cùng, sau đó được xóa hoặc anonymize.
          </p>

          <h2 className="font-heading text-headline-sm text-navy mt-8">4. Chia sẻ với bên thứ ba</h2>
          <p className="text-body-md text-navy/80 leading-relaxed">
            Chúng tôi <strong>không bán</strong> dữ liệu của bạn cho bất kỳ bên thứ ba nào.
            Chúng tôi chỉ chia sẻ dữ liệu với các nhà cung cấp dịch vụ kỹ thuật cần thiết
            (email gateway Resend, hosting Cloudflare, database Supabase) — và chỉ trong phạm
            vi cần thiết để vận hành dịch vụ.
          </p>

          <h2 className="font-heading text-headline-sm text-navy mt-8">5. Quyền của bạn</h2>
          <p className="text-body-md text-navy/80 leading-relaxed">Bạn có các quyền sau với dữ liệu cá nhân của mình:</p>
          <ul className="list-disc ml-6 space-y-1.5 text-body-md text-navy/80">
            <li>Quyền truy cập — yêu cầu bản sao dữ liệu chúng tôi đang giữ về bạn.</li>
            <li>Quyền chỉnh sửa — yêu cầu cập nhật thông tin sai/cũ.</li>
            <li>Quyền xóa — yêu cầu xóa dữ liệu (trừ trường hợp giữ lại theo nghĩa vụ pháp lý).</li>
            <li>Quyền hủy đăng ký newsletter — bằng link unsubscribe trong mọi email.</li>
          </ul>
          <p className="text-body-md text-navy/80 leading-relaxed mt-3">
            Để thực hiện các quyền trên, vui lòng email{" "}
            <a href={`mailto:${SITE.email}`} className="text-navy underline decoration-gold underline-offset-4 hover:text-gold-700 transition-colors">
              {SITE.email}
            </a>
            .
          </p>

          <h2 className="font-heading text-headline-sm text-navy mt-8">6. Cookies</h2>
          <p className="text-body-md text-navy/80 leading-relaxed">
            Website sử dụng cookies cần thiết cho vận hành (session, preferences) và cookies
            phân tích (Cloudflare Web Analytics, Google Analytics) để hiểu cách người dùng
            tương tác. Bạn có thể tắt cookies trong cài đặt trình duyệt — tính năng cơ bản
            vẫn hoạt động.
          </p>

          <h2 className="font-heading text-headline-sm text-navy mt-8">7. Liên hệ</h2>
          <p className="text-body-md text-navy/80 leading-relaxed">
            Mọi thắc mắc về chính sách này, vui lòng liên hệ:
          </p>
          <ul className="list-none space-y-1.5 text-body-md text-navy/80">
            <li>Email: <a href={`mailto:${SITE.email}`} className="text-navy underline decoration-gold underline-offset-4 hover:text-gold-700 transition-colors">{SITE.email}</a></li>
            <li>Điện thoại: <a href={`tel:${SITE.phone}`} className="text-navy underline decoration-gold underline-offset-4 hover:text-gold-700 transition-colors">{SITE.phone}</a></li>
            <li>Địa chỉ: {SITE.address}</li>
          </ul>
        </div>
      </Container>
    </Section>
  );
}
