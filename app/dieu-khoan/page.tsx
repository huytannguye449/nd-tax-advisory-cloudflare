import type { Metadata } from "next";
import { Section } from "@/components/shared/section";
import { Container } from "@/components/shared/container";
import { Eyebrow } from "@/components/shared/eyebrow";
import { SITE } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Điều khoản sử dụng",
  description: "Điều khoản sử dụng website và dịch vụ của N&D Tax Advisory.",
};

export default function TermsPage() {
  return (
    <Section bg="cream" spacing="md">
      <Container size="md">
        <Eyebrow>PHÁP LÝ</Eyebrow>
        <h1 className="mt-3 text-3xl md:text-4xl font-bold mb-2">Điều khoản sử dụng</h1>
        <p className="text-sm text-navy/60 mb-10">Cập nhật lần cuối: 27/04/2026</p>

        <div className="prose prose-navy max-w-none space-y-6">
          <p className="text-lg">
            Bằng việc sử dụng website {SITE.url}, bạn đồng ý với các điều khoản dưới đây.
            Vui lòng đọc kỹ trước khi sử dụng.
          </p>

          <h2 className="text-xl font-bold mt-8">1. Quyền sở hữu trí tuệ</h2>
          <p>
            Toàn bộ nội dung trên website (bao gồm bài viết, hình ảnh, logo, tên thương
            hiệu, mã nguồn) thuộc sở hữu của {SITE.name}, được bảo vệ bởi luật sở hữu trí tuệ
            Việt Nam và quốc tế. Bạn được phép đọc, chia sẻ link, và in cá nhân — nhưng
            không được sao chép, phân phối lại, hoặc sử dụng cho mục đích thương mại nếu
            không có sự đồng ý bằng văn bản.
          </p>

          <h2 className="text-xl font-bold mt-8">2. Nội dung tư vấn trên blog</h2>
          <p>
            Các bài viết kiến thức trên blog {SITE.url}/kien-thuc mang tính chất tham khảo,
            phản ánh quan điểm và kinh nghiệm của tác giả tại thời điểm xuất bản. Luật
            thuế Việt Nam thay đổi liên tục — chúng tôi không cam kết nội dung blog là cập
            nhật pháp lý mới nhất hoặc phù hợp với tình huống cụ thể của doanh nghiệp bạn.
          </p>
          <p>
            <strong>
              Vui lòng tham khảo ý kiến chuyên gia (qua dịch vụ tư vấn của chúng tôi hoặc
              cố vấn pháp lý độc lập) trước khi ra quyết định thuế quan trọng.
            </strong>{" "}
            {SITE.name} không chịu trách nhiệm về tổn thất phát sinh từ việc áp dụng nội
            dung blog mà không có sự tư vấn cá nhân hóa.
          </p>

          <h2 className="text-xl font-bold mt-8">3. Form liên hệ và đặt lịch</h2>
          <p>
            Khi bạn điền form liên hệ hoặc đặt lịch, bạn xác nhận:
          </p>
          <ul className="list-disc ml-6 space-y-1 text-navy/80">
            <li>Thông tin cung cấp là chính xác và thuộc về bạn.</li>
            <li>Bạn đồng ý nhận email phản hồi và xác nhận từ chúng tôi.</li>
            <li>Việc gửi yêu cầu không tạo ra nghĩa vụ tư vấn ràng buộc — engagement chính thức bắt đầu khi cả hai bên ký hợp đồng dịch vụ.</li>
          </ul>

          <h2 className="text-xl font-bold mt-8">4. Hành vi không được phép</h2>
          <p>Khi sử dụng website, bạn không được:</p>
          <ul className="list-disc ml-6 space-y-1 text-navy/80">
            <li>Tấn công, dò quét, hoặc tìm cách truy cập trái phép vào hệ thống.</li>
            <li>Sử dụng bot tự động để spam form.</li>
            <li>Đăng tải nội dung vi phạm pháp luật, xúc phạm, hoặc lừa đảo.</li>
            <li>Sao chép cấu trúc/nội dung website cho mục đích cạnh tranh.</li>
          </ul>

          <h2 className="text-xl font-bold mt-8">5. Giới hạn trách nhiệm</h2>
          <p>
            Website được cung cấp "như hiện trạng". Chúng tôi cố gắng duy trì uptime và
            tính chính xác cao, nhưng không cam kết tuyệt đối. Trong phạm vi pháp luật cho
            phép, {SITE.name} không chịu trách nhiệm về tổn thất gián tiếp, mất doanh thu,
            hoặc thiệt hại đặc biệt phát sinh từ việc sử dụng website (không bao gồm dịch
            vụ tư vấn được ký hợp đồng — phạm vi đó tuân theo điều khoản hợp đồng riêng).
          </p>

          <h2 className="text-xl font-bold mt-8">6. Luật áp dụng</h2>
          <p>
            Điều khoản này được điều chỉnh bởi pháp luật Việt Nam. Mọi tranh chấp phát sinh
            sẽ được giải quyết tại Tòa án có thẩm quyền tại Hà Nội.
          </p>

          <h2 className="text-xl font-bold mt-8">7. Thay đổi điều khoản</h2>
          <p>
            Chúng tôi có thể cập nhật điều khoản này theo thời gian. Phiên bản mới có hiệu
            lực từ ngày được công bố trên trang này. Việc bạn tiếp tục sử dụng website sau
            khi cập nhật được coi là chấp thuận điều khoản mới.
          </p>

          <h2 className="text-xl font-bold mt-8">8. Liên hệ</h2>
          <p>
            Câu hỏi về điều khoản này, vui lòng liên hệ:{" "}
            <a href={`mailto:${SITE.email}`} className="text-gold-700 underline">
              {SITE.email}
            </a>
          </p>
        </div>
      </Container>
    </Section>
  );
}
