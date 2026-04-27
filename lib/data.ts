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

export const SERVICE_BUNDLE = {
  title: "Gói đồng hành 6 tháng — Trọn gói",
  price: "120.000.000 VND",
  priceNote: "Chưa bao gồm thuế GTGT/TNCN. Hai bên có thể thoả thuận thời gian phù hợp, tối thiểu 3 tháng.",
  description:
    "Phù hợp với doanh nghiệp cần đồng hành toàn diện cả 3 mảng: kiện toàn bộ máy kế toán, tư vấn pháp lý-thuế, và lựa chọn mô hình kinh doanh. Bao gồm giải đáp vướng mắc phát sinh không giới hạn trong thời gian dịch vụ.",
} as const;

export const SERVICES = [
  {
    slug: "kien-toan-ke-toan",
    title: "Kiện toàn bộ máy kế toán",
    short: "Cơ cấu nhân sự, quy chế nội bộ, nâng cao nghiệp vụ chuyên môn.",
    description:
      "Doanh nghiệp đang vận hành nhưng quy trình kế toán rời rạc, báo cáo chậm, rủi ro tuân thủ tiềm ẩn? Với 8 năm kinh nghiệm vai trò Kế toán Trưởng tập đoàn MIK Group, anh Ngọc trực tiếp dẫn dắt quá trình rà soát toàn bộ hệ thống — từ cơ cấu nhân sự, sơ đồ tổ chức, đến chart of accounts và quy chế chi tiêu tài chính. Mục tiêu: biến kế toán từ chi phí vận hành thành công cụ ra quyết định cho ban lãnh đạo.",
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
    pricing: "Trọn gói 3 tháng từ 60 triệu — 6 tháng từ 120 triệu",
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
    pricing: "Bundle với gói đồng hành 120tr/6 tháng — hoặc theo dự án từ 30 triệu",
  },
  {
    slug: "cau-truc-kinh-doanh",
    title: "Cấu trúc kinh doanh & Cross-border",
    short: "Chọn mô hình kinh doanh khi dịch chuyển doanh thu nước ngoài về Việt Nam.",
    description:
      "Khi doanh nghiệp có hoạt động cross-border — từ e-commerce nhận thanh toán quốc tế, dịch vụ digital cho khách FDI, đến dịch chuyển doanh thu từ thị trường nước ngoài về Việt Nam — việc lựa chọn mô hình kinh doanh đúng từ đầu có thể tiết kiệm hàng tỷ đồng thuế dài hạn và tránh rủi ro pháp lý. N&D cung cấp báo cáo phân tích các mô hình kinh doanh kèm cảnh báo rủi ro pháp lý, rủi ro thuế, đồng thời đồng hành lựa chọn và vận hành mô hình tối ưu.",
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
    pricing: "Theo dự án — từ 80 triệu đồng",
  },
  {
    slug: "dao-tao",
    title: "Đào tạo doanh nghiệp",
    short: "Workshop in-house thuế-kế toán + khóa học tại Xleaders Academy.",
    description:
      "Luật thuế Việt Nam thay đổi liên tục — đội kế toán giỏi không chỉ là làm đúng hôm nay, mà còn phải chủ động cập nhật để không lỗi thời. Anh Ngọc đã có hơn 10 năm liên tục giảng dạy thuế tại doanh nghiệp (từ 2015) và là Giảng viên cao cấp tại Xleaders Academy. N&D tổ chức workshop in-house thiết kế riêng theo ngành nghề và pain point thực tế. Khách hàng của gói tư vấn được giảm giá hoặc miễn phí các khóa học do N&D tổ chức (kể cả sau khi dịch vụ kết thúc).",
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

/**
 * Khách hàng tiêu biểu — danh sách thực từ proposal NHN&D 2026.
 * Anh Ngọc đã trực tiếp tư vấn / đảm nhiệm vai trò tại các đơn vị này.
 */
export const CLIENTS = [
  // Vingroup ecosystem (anh Ngọc làm Trưởng nhóm Thuế tại Vingroup 2015-2017)
  "Vingroup",
  "Vinhomes",
  "Vinpearl",
  "Vincom Retail",
  "VinMec",
  "VinShop",
  "VinID",
  "One Mount",
  // MIK Group (Kế toán Trưởng 2019-2025)
  "MIK Group",
  // Real estate
  "DOJI Land",
  "Empire Group",
  "TASECO",
  "Sun Group",
  "Gami Group",
  "1369",
  // Banking & Finance
  "VietinBank",
  // Manufacturing
  "Mitsubishi Motors",
  "Casper",
  "Vimaflour",
  "Japfa",
  "Vaquarius",
  "Garco 10",
  "CPC1HN",
  // Tech / Digital
  "VietDigital",
  "Printway.io",
  "3S Media",
  // Distribution
  "SNB Distribution",
  // Audit (anh Ngọc xuất thân)
  "Mekong LLC",
  "IAC Hà Nội",
  // Engineering
  "Construction Army Engineering",
  // Education (anh Ngọc giảng dạy)
  "Đại học Thương mại",
  "Học viện Ngân hàng",
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

export const FOUNDER_BIO = `Anh Nguyễn Hoài Ngọc là người sáng lập và Giám đốc điều hành Công ty TNHH Tư vấn thuế NHN&D, sở hữu chứng chỉ Kiểm toán viên Việt Nam (CPA) và Chứng chỉ hành nghề thuế (CPTA). Anh tốt nghiệp Cử nhân kinh tế Đại học Thương mại.

Hai mươi năm sự nghiệp của anh được chia thành bốn giai đoạn rõ rệt — mỗi giai đoạn mang lại một tầng chuyên môn khác nhau, hợp lại thành góc nhìn 360 độ về thuế và kế toán doanh nghiệp Việt Nam.

GIAI ĐOẠN KIỂM TOÁN (2006 – 2015)

Khởi đầu sự nghiệp tại Mekong LLC từ tháng 11/2006 với vai trò Kiểm toán viên, anh thăng tiến lên Phó Trưởng phòng Tư vấn vào năm 2011. Cùng năm đó, anh trở thành thành viên sáng lập và Trưởng phòng Tư vấn-Kiểm toán tại IAC Hà Nội. Chín năm Big4-style audit và advisory rèn cho anh kỹ năng đánh giá rủi ro thuế và kế toán theo chuẩn mực quốc tế.

GIAI ĐOẠN VINGROUP (2015 – 2017)

Tháng 5/2015, anh gia nhập Tập đoàn Vingroup với vai trò Trưởng nhóm Thuế — Ban Tài chính. Hai năm tại đây, anh trực tiếp xử lý các vấn đề thuế phức tạp xuyên suốt hệ sinh thái: Vinhomes, Vinpearl, Vincom Retail, VinMec — quy mô và độ phức tạp đặc trưng của tập đoàn đa ngành lớn nhất Việt Nam.

GIAI ĐOẠN MIK GROUP (2017 – 2025)

Tháng 7/2017, anh chuyển sang MIK Group — một trong những tập đoàn bất động sản hàng đầu — với vai trò Trưởng Bộ phận Thuế. Đến tháng 4/2019, anh được bổ nhiệm Kế toán Trưởng Tập đoàn, chịu trách nhiệm toàn bộ hệ thống kế toán-thuế trong sáu năm rưỡi. Đây là giai đoạn anh đối diện với mọi loại thử thách của một CFO/Kế toán Trưởng cấp tập đoàn: M&A, tái cấu trúc, kiểm toán độc lập, thanh tra thuế, transfer pricing, và quan trọng nhất — kiện toàn bộ máy kế toán trong môi trường tăng trưởng nhanh.

GIAI ĐOẠN HIỆN TẠI (2026 – nay)

Năm 2026, anh sáng lập NHN&D với mục tiêu mang chuyên môn corporate tier 1 đến với SME và doanh nghiệp tư nhân Việt Nam. Cùng đội ngũ chuyên gia CPA/CPTA giàu kinh nghiệm, anh tin rằng nhiều doanh nghiệp Việt không thiếu kế toán giỏi — họ thiếu một cố vấn thuế chiến lược ở vai trò ngang hàng với CEO, người vừa hiểu sâu luật, vừa hiểu kinh doanh và có thể đồng hành lâu dài.

Song song với điều hành NHN&D, anh là Giảng viên chính các khóa đào tạo thuế tại doanh nghiệp (từ 2015) và Giảng viên cao cấp tại Xleaders Academy (từ 6/2025) — học viện đào tạo CEO và quản lý doanh nghiệp hàng đầu Việt Nam.

Chuyên môn lõi của anh tập trung vào: kiện toàn bộ máy kế toán cấp tập đoàn, quản trị thuế chiến lược, tư vấn mô hình kinh doanh cross-border, và đào tạo đội ngũ kế toán in-house.`;

export const TIMELINE = [
  {
    period: "11/2006 – 10/2011",
    title: "Kiểm toán viên → Phó Trưởng phòng Tư vấn",
    org: "Mekong LLC",
    description:
      "Khởi đầu sự nghiệp với 5 năm thực chiến audit và advisory tại một trong những công ty kiểm toán hàng đầu Việt Nam.",
  },
  {
    period: "11/2011 – 4/2015",
    title: "Thành viên sáng lập, Trưởng phòng Tư vấn-Kiểm toán",
    org: "IAC Hà Nội",
    description:
      "Đồng sáng lập IAC Hà Nội — một công ty kiểm toán độc lập, dẫn dắt phòng Tư vấn-Kiểm toán phục vụ doanh nghiệp tư nhân.",
  },
  {
    period: "5/2015 – 6/2017",
    title: "Trưởng nhóm Thuế — Ban Tài chính",
    org: "Tập đoàn Vingroup",
    description:
      "Trực tiếp xử lý các vấn đề thuế phức tạp xuyên suốt hệ sinh thái Vinhomes, Vinpearl, Vincom Retail, VinMec.",
  },
  {
    period: "7/2017 – 3/2019",
    title: "Trưởng Bộ phận Thuế — Ban Tài chính",
    org: "Tập đoàn MIK Group",
    description:
      "Phụ trách toàn bộ chiến lược thuế cho một trong những tập đoàn bất động sản hàng đầu.",
  },
  {
    period: "4/2019 – 10/2025",
    title: "Kế toán Trưởng",
    org: "Tập đoàn MIK Group",
    description:
      "Chịu trách nhiệm toàn bộ hệ thống kế toán-thuế của tập đoàn trong 6.5 năm — qua mọi giai đoạn từ M&A, tái cấu trúc đến thanh tra.",
  },
  {
    period: "5/2015 – nay",
    title: "Giảng viên chính",
    org: "Khóa đào tạo thuế tại doanh nghiệp",
    description:
      "Hơn 10 năm liên tục giảng dạy in-house cho team kế toán và CFO của các doanh nghiệp khắp Việt Nam.",
  },
  {
    period: "6/2025 – nay",
    title: "Giảng viên cao cấp",
    org: "Xleaders Academy",
    description:
      "Giảng viên chương trình đào tạo CEO và quản lý cấp cao tại học viện hàng đầu Việt Nam.",
  },
  {
    period: "2026 – nay",
    title: "Sáng lập & Giám đốc điều hành",
    org: "Công ty TNHH Tư vấn thuế NHN&D",
    description:
      "Mang chuyên môn corporate tier 1 đến với cộng đồng SME và doanh nghiệp tư nhân Việt Nam.",
  },
] as const;

export const TEAM = [
  {
    slug: "anh-ngoc",
    name: "Nguyễn Hoài Ngọc",
    title: "Founder & CEO",
    credentials: ["CPA — Kiểm toán viên Việt Nam", "CPTA — Chứng chỉ hành nghề thuế", "Cử nhân kinh tế ĐH Thương mại"],
    bio: "20 năm kinh nghiệm xuyên suốt từ Big4-style audit (Mekong, IAC) đến vai trò Kế toán Trưởng tại Vingroup và MIK Group. Đồng thời là giảng viên cao cấp tại Xleaders Academy.",
  },
  {
    slug: "chi-trang",
    name: "Phan Thị Trang",
    title: "Senior Manager",
    credentials: ["CPA — Kiểm toán viên Việt Nam", "CPTA — Chứng chỉ hành nghề thuế", "Thạc sỹ kinh tế ĐH Kinh tế Quốc dân"],
    bio: "Hơn 15 năm kinh nghiệm tax compliance và audit. Trang phụ trách quy trình kiện toàn kế toán và đảm bảo chất lượng deliverable cho khách hàng SME — phương châm: chính xác đến từng dòng, đúng hạn đến từng giờ.",
  },
  {
    slug: "chi-phuong",
    name: "Nguyễn Thị Thu Phương",
    title: "Senior Consultant",
    credentials: ["CPA — Kiểm toán viên Việt Nam", "CPTA — Chứng chỉ hành nghề thuế", "Cử nhân kinh tế ĐH Kinh tế Quốc dân"],
    bio: "Chuyên môn về tax health check, đánh giá hồ sơ pháp lý-thuế, và tư vấn cấu trúc kinh doanh cross-border. Phương đồng hành nhiều dự án M&A và transfer pricing cho doanh nghiệp FDI.",
  },
] as const;
