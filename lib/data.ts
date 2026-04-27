/**
 * Centralized content data for N&D Tax Advisory website.
 * Edit here to update homepage / services / about / etc.
 */

export const VALUES = [
  {
    key: "chinh-xac",
    title: "Chính xác",
    description:
      "Sai sót về thuế là rủi ro lớn nhất. Chúng tôi lấy sự chuẩn xác làm thước đo giá trị cao nhất trong từng báo cáo, từng quyết định.",
  },
  {
    key: "bao-mat",
    title: "Bảo mật",
    description:
      "Dữ liệu của khách hàng là tài sản quý giá nhất, được bảo vệ bởi tiêu chuẩn khắt khe và quy trình kiểm soát truy cập nghiêm ngặt.",
  },
  {
    key: "tan-tam",
    title: "Tận tâm",
    description:
      "Chúng tôi đồng hành cùng doanh nghiệp không chỉ như một đối tác, mà như một người cố vấn tin cẩn cho từng quyết định quan trọng.",
  },
  {
    key: "sac-ben",
    title: "Sắc bén",
    description:
      "Am hiểu luật pháp, nhạy bén với sự thay đổi của thị trường để đưa ra lời khuyên tối ưu cho từng giai đoạn phát triển.",
  },
] as const;

export const SERVICES = [
  {
    slug: "kien-toan-ke-toan",
    title: "Kiện toàn bộ máy kế toán",
    short: "Audit hiện trạng, chuẩn hóa quy trình, training đội kế toán nội bộ.",
    description:
      "Doanh nghiệp đang vận hành nhưng quy trình kế toán rời rạc, báo cáo chậm, rủi ro tuân thủ tiềm ẩn? N&D giúp bạn rà soát toàn bộ hệ thống từ chart of accounts, quy trình ghi nhận, đến quy trình duyệt — biến kế toán từ chi phí thành công cụ ra quyết định.",
    when: [
      "Đội kế toán mới thành lập, chưa có quy trình chuẩn",
      "Doanh nghiệp scale nhanh, hệ thống cũ quá tải",
      "Chuẩn bị gọi vốn / M&A / IPO cần báo cáo minh bạch",
      "Vừa trải qua thanh tra và phát hiện gap quy trình",
    ],
    process: [
      "Audit hiện trạng — phỏng vấn team, review hồ sơ 3 tháng gần nhất",
      "Đánh giá gap so với chuẩn mực kế toán Việt Nam (VAS) & IFRS",
      "Thiết kế quy trình mới: chart of accounts, workflow, kiểm soát nội bộ",
      "Triển khai & đào tạo team kế toán in-house",
      "Theo dõi 3 tháng đầu, fine-tune và bàn giao tài liệu",
    ],
    deliverables: [
      "Báo cáo audit hiện trạng (40-60 trang)",
      "Sổ tay quy trình kế toán hoàn chỉnh",
      "Chart of accounts được customize",
      "Template báo cáo quản trị hàng tháng",
      "Tài liệu đào tạo + 3 buổi workshop nội bộ",
    ],
    pricing: "Từ 80 triệu đồng cho doanh nghiệp dưới 50 nhân sự",
  },
  {
    slug: "tu-van-phap-ly",
    title: "Tư vấn pháp lý & thuế",
    short: "TNDN, TNCN, GTGT, FCT, ưu đãi thuế, tax health check, dispute resolution.",
    description:
      "Mọi quyết định kinh doanh đều có hệ quả thuế. N&D cung cấp tư vấn ad-hoc và thường xuyên về toàn bộ phạm vi thuế tại Việt Nam — từ câu hỏi nhanh hàng ngày đến các vấn đề chiến lược lớn như tái cấu trúc, M&A, hay xử lý tranh chấp với cơ quan thuế.",
    when: [
      "Đang đối mặt với câu hỏi/quyết định thuế phức tạp",
      "Muốn rà soát tổng thể tình hình tuân thủ trước thanh tra",
      "Cần ý kiến chuyên gia trước một giao dịch lớn",
      "Đang tranh chấp / khiếu nại với cơ quan thuế",
    ],
    process: [
      "Tiếp nhận yêu cầu, ký NDA",
      "Phân tích pháp lý + đối chiếu thông tư mới nhất",
      "Soạn ý kiến tư vấn bằng văn bản (legal opinion)",
      "Họp 1-1 thảo luận và trả lời câu hỏi",
      "Hỗ trợ triển khai & follow-up",
    ],
    deliverables: [
      "Tax opinion bằng văn bản, có trích dẫn pháp lý",
      "Risk matrix chi tiết",
      "Phương án triển khai từng bước",
      "Hỗ trợ 30 ngày sau khi bàn giao",
    ],
    pricing: "Theo gói retainer hoặc theo dự án — từ 30 triệu/tháng",
  },
  {
    slug: "cau-truc-kinh-doanh",
    title: "Cấu trúc kinh doanh",
    short: "Chọn loại hình DN, M&A, holding structure, transfer pricing, IP planning.",
    description:
      "Cấu trúc đúng từ đầu giúp doanh nghiệp tiết kiệm hàng tỷ đồng thuế trong dài hạn — và tránh được rất nhiều rủi ro pháp lý khi mở rộng. N&D thiết kế cấu trúc phù hợp với mục tiêu kinh doanh, nguồn vốn, và kế hoạch exit của bạn.",
    when: [
      "Khởi nghiệp, chưa biết chọn loại hình DN nào",
      "Đang chuẩn bị gọi vốn và cần holding structure minh bạch",
      "Mở chi nhánh / công ty con tại nhiều tỉnh thành / quốc gia",
      "Đang/chuẩn bị thực hiện M&A, divestment",
    ],
    process: [
      "Thấu hiểu mục tiêu kinh doanh, dòng tiền, exit plan",
      "Phân tích các phương án cấu trúc (ưu/nhược/thuế)",
      "Đề xuất phương án tối ưu + so sánh số liệu cụ thể",
      "Hỗ trợ thủ tục pháp lý setup",
      "Đào tạo team về vận hành cấu trúc mới",
    ],
    deliverables: [
      "Báo cáo phân tích cấu trúc (50-80 trang)",
      "Sơ đồ pháp lý + dòng tiền minh họa",
      "Mô hình thuế ước tính 3-5 năm",
      "Hỗ trợ setup pháp lý từ A-Z",
    ],
    pricing: "Tùy độ phức tạp — từ 150 triệu đồng cho 1 dự án",
  },
  {
    slug: "dao-tao",
    title: "Đào tạo doanh nghiệp",
    short: "Workshop in-house cho CFO/kế toán, cập nhật luật mới, case study thực tế.",
    description:
      "Luật thuế Việt Nam thay đổi liên tục — đội kế toán giỏi không chỉ là làm đúng hôm nay, mà còn phải chủ động cập nhật để không lỗi thời. N&D tổ chức workshop in-house được thiết kế riêng theo ngành nghề và pain point thực tế của từng doanh nghiệp.",
    when: [
      "Đội kế toán cần update kiến thức sau Luật Thuế mới",
      "Founder/CFO muốn nâng cao tax literacy để ra quyết định nhanh hơn",
      "Doanh nghiệp mở rộng sang ngành mới, cần đào tạo chuyên đề",
      "Trước/sau thanh tra cần hệ thống lại kiến thức cho team",
    ],
    process: [
      "Khảo sát nhu cầu + pain point của team",
      "Thiết kế curriculum 4-8 buổi, tailored với ngành",
      "Triển khai workshop in-house (online/offline)",
      "Bài tập thực hành + case study của chính DN",
      "Đánh giá & follow-up 30 ngày",
    ],
    deliverables: [
      "Curriculum & tài liệu workshop (slide + handout)",
      "Bài tập case study riêng cho DN",
      "Q&A live + recording các buổi",
      "Cheat sheet quick reference",
    ],
    pricing: "Từ 25 triệu đồng / buổi 4 tiếng",
  },
] as const;

export const STATS = [
  { value: "20+", label: "Năm kinh nghiệm trong ngành" },
  { value: "200+", label: "Khách hàng đã đồng hành" },
  { value: "50+", label: "Doanh nghiệp FDI đã tư vấn" },
  { value: "100%", label: "Tuân thủ chuẩn pháp lý" },
];

export const TESTIMONIALS = [
  {
    quote:
      "Sau khi N&D kiện toàn quy trình kế toán, chúng tôi cắt được 40% thời gian báo cáo và tránh được khoản phạt 800 triệu trong đợt thanh tra. Đầu tư xứng đáng nhất trong năm.",
    author: "Anh M.",
    title: "CEO chuỗi F&B 30 outlet",
    industry: "F&B",
  },
  {
    quote:
      "N&D giúp chúng tôi cấu trúc lại holding để gọi vốn series A — minh bạch và tối ưu thuế cùng lúc. Investor đặc biệt ấn tượng với due diligence prep.",
    author: "Chị L.",
    title: "Founder startup tech",
    industry: "Technology",
  },
  {
    quote:
      "Transfer pricing report của N&D đạt chuẩn quốc tế — chúng tôi pass kiểm toán Big4 không có observation. Anh Ngọc thực sự hiểu cả góc độ tax authority và investor.",
    author: "Ms. K.",
    title: "CFO công ty FDI 200 nhân sự",
    industry: "Manufacturing FDI",
  },
  {
    quote:
      "Trước khi gặp anh Ngọc, tôi nghĩ mình tuân thủ tốt. Sau audit của N&D, mới biết đang ngồi trên 2 tỷ rủi ro tiềm ẩn. May là phát hiện sớm.",
    author: "Anh T.",
    title: "Chủ chuỗi spa 15 chi nhánh",
    industry: "Beauty & Wellness",
  },
  {
    quote:
      "Workshop thuế cho team kế toán nội bộ rất thực chiến — không phải lý thuyết suông. Team tôi áp dụng được ngay từ ngày đầu sau khóa.",
    author: "Anh H.",
    title: "Founder e-commerce",
    industry: "E-commerce",
  },
  {
    quote:
      "M&A của chúng tôi tiết kiệm 5 tỷ thuế nhờ tư vấn cấu trúc đúng từ đầu của N&D. Khoản tiết kiệm này gấp 30 lần phí tư vấn.",
    author: "Anh D.",
    title: "CEO real estate SME",
    industry: "Real Estate",
  },
  {
    quote:
      "N&D không chỉ làm thuế — họ giải thích từng quyết định để tôi hiểu và tự tin. Đó là điều khác biệt lớn nhất so với những đối tác trước đây.",
    author: "Chị N.",
    title: "Founder DN sản xuất xuất khẩu",
    industry: "Manufacturing Export",
  },
];

export const CLIENTS = [
  "Vingroup",
  "MIK Group",
  "FPT",
  "Masan",
  "VietJet",
  "Deloitte",
  "EY",
  "KPMG",
  "Sun Group",
  "Techcombank",
  "VPBank",
  "Lotte",
];

export const FAQ_GENERAL = [
  {
    q: "N&D phù hợp với quy mô doanh nghiệp nào?",
    a: "Khách hàng chính của chúng tôi là SME (10-500 nhân sự) và doanh nghiệp FDI mid-size. Chúng tôi cũng nhận tư vấn cho startup giai đoạn pre-Series A khi có vấn đề thuế chiến lược cần giải quyết.",
  },
  {
    q: "Phí tư vấn ban đầu là bao nhiêu?",
    a: "Buổi tư vấn đầu tiên (45 phút) miễn phí — chúng tôi nghe về tình hình của bạn và đề xuất gói phù hợp. Phí dịch vụ được báo theo dự án hoặc retainer hàng tháng, tùy phạm vi.",
  },
  {
    q: "Có ký NDA bảo mật không?",
    a: "Có, mọi engagement đều bắt đầu với việc ký NDA. Dữ liệu khách hàng được lưu trữ và xử lý theo quy chuẩn nội bộ chặt chẽ; truy cập chỉ được cấp cho thành viên team được phân công cho dự án.",
  },
  {
    q: "Có làm cho công ty FDI không?",
    a: "Có. Khoảng 25% khách hàng của N&D là công ty FDI (Hàn Quốc, Nhật Bản, Singapore, EU). Chúng tôi am hiểu transfer pricing, FCT, và các vấn đề cross-border đặc thù của FDI.",
  },
  {
    q: "Có làm bằng tiếng Anh không?",
    a: "Có. Tất cả senior consultant của N&D giao tiếp được tiếng Anh. Tài liệu tư vấn có thể được phát hành song ngữ Anh-Việt theo yêu cầu.",
  },
  {
    q: "Bao lâu nhận được đề xuất sau buổi tư vấn?",
    a: "Đề xuất chính thức (scope + timeline + phí) được gửi trong vòng 3-5 ngày làm việc sau buổi tư vấn ban đầu. Với trường hợp khẩn (thanh tra đang diễn ra), chúng tôi phản hồi trong 24 giờ.",
  },
  {
    q: "Có hỗ trợ đại diện làm việc trực tiếp với cơ quan thuế?",
    a: "Có — đây là một trong những thế mạnh của N&D. Chúng tôi hỗ trợ chuẩn bị hồ sơ, cử người đại diện tham gia các buổi giải trình, và hỗ trợ khiếu nại / khiếu kiện hành chính khi cần thiết.",
  },
];

export const FAQ_CONTACT = [
  {
    q: "Bao lâu thì N&D phản hồi sau khi tôi điền form?",
    a: "Trong giờ làm việc (T2-T6, 9h-18h), team N&D phản hồi trong vòng 4 tiếng. Ngoài giờ, chúng tôi sẽ liên hệ vào sáng ngày làm việc tiếp theo.",
  },
  {
    q: "Tư vấn ban đầu có tính phí không?",
    a: "Buổi tư vấn đầu tiên 45 phút hoàn toàn miễn phí. Đây là cơ hội để chúng ta cùng đánh giá liệu N&D có phù hợp với nhu cầu của bạn hay không.",
  },
  {
    q: "Tôi có thể đặt lịch online qua Zoom/Google Meet được không?",
    a: "Hoàn toàn có thể. Khi đặt lịch qua trang Đặt lịch, bạn chọn 'Online' và sẽ nhận được link Zoom/Meet trong email confirmation.",
  },
  {
    q: "Văn phòng N&D ở đâu?",
    a: "Văn phòng chính tại Hà Nội. Chúng tôi cũng phục vụ khách hàng tại TP.HCM, Đà Nẵng, và các tỉnh thành khác qua kênh online + di chuyển on-site khi cần.",
  },
  {
    q: "Tôi có cần chuẩn bị tài liệu trước buổi tư vấn?",
    a: "Không bắt buộc cho buổi đầu. Nếu có sẵn, hãy mang theo: BCTC năm gần nhất, sơ đồ tổ chức, và bản mô tả vấn đề bạn muốn giải quyết. Càng cụ thể, tư vấn càng chính xác.",
  },
];

export const FOUNDER_BIO = `Anh Ngọc là người sáng lập và CEO của N&D Tax Advisory, mang theo hơn 20 năm kinh nghiệm tư vấn thuế và tài chính chiến lược tại Việt Nam.

Sự nghiệp của anh bắt đầu tại Big4 (Deloitte / EY) trong 6 năm, nơi anh phụ trách audit và tax cho các tập đoàn niêm yết và FDI lớn. Sau đó, anh chuyển sang vai trò CFO tại các tập đoàn corporate cấp Vingroup-tier, trực tiếp dẫn dắt các dự án M&A, IPO, và tái cấu trúc đa hệ với tổng giá trị giao dịch trên 500 triệu USD.

Bốn năm cuối trước khi sáng lập N&D, anh hoạt động độc lập với vai trò strategic tax advisor cho hơn 50 SME và founder. Trải nghiệm này cho anh nhận thấy: phần lớn doanh nghiệp Việt không thiếu kế toán giỏi — họ thiếu một cố vấn thuế chiến lược ở vai trò ngang hàng với CEO, người vừa hiểu sâu luật, vừa hiểu kinh doanh.

Đó là lý do N&D ra đời năm 2026 — một advisory boutique tập trung không phải vào việc làm tax compliance đơn thuần, mà vào việc giúp founder và CFO ra quyết định thuế đúng đắn ngay từ đầu.

Chuyên môn của anh tập trung vào: thuế TNDN cho mid-market, M&A tax, transfer pricing, FDI structuring, và resolution các vụ tranh chấp với cơ quan thuế. Anh thường xuyên là speaker tại các workshop CFO summit, mentor cho cộng đồng founder SME Việt Nam.

Triết lý của anh: "Sai sót thuế là rủi ro lớn nhất với CEO Việt — vì luật phức tạp, thay đổi nhanh, và hậu quả tài chính nặng nề. Cố vấn tốt phải dự đoán được những rủi ro đó trước khi chúng phát sinh."`;
