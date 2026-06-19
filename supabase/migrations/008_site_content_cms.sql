-- Site content CMS for homepage and about page.
-- Keeps existing public design while moving page copy, repeated blocks, and media refs into Supabase.

create table if not exists public.page_sections (
  id uuid primary key default gen_random_uuid(),
  page_slug text not null,
  section_key text not null,
  eyebrow text,
  title text,
  subtitle text,
  body text,
  image_url text,
  image_alt text,
  cta_label text,
  cta_href text,
  secondary_cta_label text,
  secondary_cta_href text,
  display_order integer not null default 0,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (page_slug, section_key)
);

create table if not exists public.client_logos (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  logo_url text,
  website_url text,
  display_order integer not null default 0,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_values (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  title text not null,
  description text,
  icon_key text,
  display_order integer not null default 0,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_stats (
  id uuid primary key default gen_random_uuid(),
  value text not null,
  label text not null,
  display_order integer not null default 0,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  quote text not null,
  author text not null,
  title text,
  industry text,
  display_order integer not null default 0,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.timeline_items (
  id uuid primary key default gen_random_uuid(),
  person_id uuid references public.people(id) on delete set null,
  page_slug text,
  period text not null,
  title text not null,
  organization text,
  description text,
  display_order integer not null default 0,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.page_sections enable row level security;
alter table public.client_logos enable row level security;
alter table public.site_values enable row level security;
alter table public.site_stats enable row level security;
alter table public.testimonials enable row level security;
alter table public.timeline_items enable row level security;

create index if not exists idx_page_sections_page_status_order
  on public.page_sections(page_slug, status, display_order);
create index if not exists idx_client_logos_status_order
  on public.client_logos(status, display_order);
create index if not exists idx_site_values_status_order
  on public.site_values(status, display_order);
create index if not exists idx_site_stats_status_order
  on public.site_stats(status, display_order);
create index if not exists idx_testimonials_status_order
  on public.testimonials(status, display_order);
create index if not exists idx_timeline_items_status_order
  on public.timeline_items(status, display_order);

insert into public.page_sections (
  page_slug, section_key, eyebrow, title, subtitle, body, image_url, image_alt,
  cta_label, cta_href, secondary_cta_label, secondary_cta_href, display_order, status
)
values
  (
    'home',
    'hero',
    'Tư vấn thuế chiến lược',
    'Giúp chủ doanh nghiệp an tâm với mọi quyết định thuế.',
    'Tư vấn thuế chiến lược cho SME & FDI tại Việt Nam, dẫn dắt bởi đội ngũ CPA/CPTA với 20 năm kinh nghiệm tại Vingroup & MIK Group.',
    'Buổi tư vấn đầu tiên 45 phút miễn phí',
    'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200&q=80',
    'Văn phòng tư vấn chuyên nghiệp - NHN&D Tax Advisory',
    'Đặt lịch tư vấn',
    '/dat-lich',
    'Xem dịch vụ',
    '/dich-vu',
    1,
    'published'
  ),
  (
    'home',
    'brand_story',
    'Về NHN&D',
    'Đối tác cố vấn cho doanh nghiệp Việt',
    null,
    'NHN&D Tax Advisory ra đời từ một nhận định đơn giản: rủi ro thuế là rào cản lớn nhất khiến nhiều doanh nghiệp Việt không dám mở rộng. Sau 20 năm trong ngành - từ Big4 đến vai trò CFO tại các tập đoàn lớn - chúng tôi tin rằng tư vấn thuế tốt không chỉ là tránh sai sót, mà là chiến lược tài chính giúp chủ doanh nghiệp ra quyết định nhanh, đúng, và an tâm.

Mỗi khách hàng của NHN&D nhận được không chỉ một đối tác kế toán, mà một cố vấn đồng hành dài hạn - am hiểu luật, sắc bén với thị trường, và tận tâm với từng chi tiết.',
    null,
    null,
    null,
    null,
    null,
    null,
    2,
    'published'
  ),
  (
    'home',
    'final_cta',
    'Bắt đầu ngay',
    'Sẵn sàng bắt đầu?',
    'Buổi tư vấn đầu tiên 45 phút hoàn toàn miễn phí. Đặt lịch ngay hôm nay.',
    null,
    null,
    null,
    'Đặt lịch tư vấn',
    '/dat-lich',
    'Liên hệ trực tiếp',
    '/lien-he',
    99,
    'published'
  ),
  (
    'about',
    'hero',
    'Về chúng tôi',
    'Cố vấn thuế bạn có thể tin cậy',
    'NHN&D Tax Advisory là advisory boutique chuyên tư vấn thuế chiến lược cho SME và FDI tại Việt Nam. Chúng tôi không chỉ đảm bảo tuân thủ - chúng tôi đồng hành cùng doanh nghiệp trong mọi quyết định thuế quan trọng, từ giai đoạn khởi nghiệp đến tái cấu trúc và M&A.',
    null,
    'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1600&q=80',
    'Đội ngũ NHN&D Tax Advisory',
    null,
    null,
    null,
    null,
    1,
    'published'
  ),
  (
    'about',
    'story',
    'Câu chuyện',
    'Tại sao chúng tôi thành lập NHN&D',
    null,
    'NHN&D Tax Advisory được thành lập năm 2026 từ một nhận thức đơn giản - sau hơn 20 năm trong nghề tư vấn thuế tại Việt Nam, chúng tôi nhận ra: phần lớn doanh nghiệp Việt không thiếu kế toán giỏi. Họ thiếu một cố vấn thuế chiến lược ở vai trò ngang hàng với CEO - người vừa hiểu sâu luật pháp, vừa hiểu kinh doanh, và có thể đồng hành lâu dài qua từng quyết định lớn.

NHN&D ra đời để lấp khoảng trống đó. Chúng tôi không cạnh tranh với Big4 ở quy mô. Chúng tôi cạnh tranh ở chiều sâu - cam kết phục vụ một số lượng giới hạn khách hàng để đảm bảo mỗi doanh nghiệp đều nhận được sự chú ý xứng đáng từ những chuyên gia hàng đầu của chúng tôi.

Mỗi engagement bắt đầu từ việc lắng nghe - thực sự lắng nghe về mục tiêu kinh doanh, không chỉ về vấn đề thuế. Bởi vì tư vấn thuế tốt không bao giờ tách rời khỏi chiến lược kinh doanh.',
    null,
    null,
    null,
    null,
    null,
    null,
    2,
    'published'
  ),
  (
    'about',
    'final_cta',
    'Hợp tác cùng chúng tôi',
    'Sẵn sàng đồng hành?',
    'Buổi tư vấn đầu tiên 45 phút hoàn toàn miễn phí. Hãy để chúng tôi lắng nghe và cùng bạn xác định rõ những gì cần làm.',
    null,
    null,
    null,
    'Đặt lịch tư vấn miễn phí',
    '/dat-lich',
    'Liên hệ',
    '/lien-he',
    99,
    'published'
  )
on conflict (page_slug, section_key) do update set
  eyebrow = excluded.eyebrow,
  title = excluded.title,
  subtitle = excluded.subtitle,
  body = excluded.body,
  image_url = excluded.image_url,
  image_alt = excluded.image_alt,
  cta_label = excluded.cta_label,
  cta_href = excluded.cta_href,
  secondary_cta_label = excluded.secondary_cta_label,
  secondary_cta_href = excluded.secondary_cta_href,
  display_order = excluded.display_order,
  status = excluded.status,
  updated_at = now();

insert into public.site_values (key, title, description, icon_key, display_order, status)
values
  ('chinh-xac', 'Chính xác', 'Sai sót về thuế là rủi ro lớn nhất. Chúng tôi lấy sự chuẩn xác làm thước đo giá trị cao nhất trong từng báo cáo, từng quyết định.', 'target', 1, 'published'),
  ('bao-mat', 'Bảo mật', 'Dữ liệu của khách hàng là tài sản quý giá nhất, được bảo vệ bởi tiêu chuẩn khắt khe và quy trình kiểm soát truy cập nghiêm ngặt.', 'shield', 2, 'published'),
  ('tan-tam', 'Tận tâm', 'Chúng tôi đồng hành cùng doanh nghiệp không chỉ như một đối tác, mà như một người cố vấn tin cẩn cho từng quyết định quan trọng.', 'heart', 3, 'published'),
  ('sac-ben', 'Sắc bén', 'Am hiểu luật pháp, nhạy bén với sự thay đổi của thị trường để đưa ra lời khuyên tối ưu cho từng giai đoạn phát triển.', 'zap', 4, 'published')
on conflict (key) do update set
  title = excluded.title,
  description = excluded.description,
  icon_key = excluded.icon_key,
  display_order = excluded.display_order,
  status = excluded.status,
  updated_at = now();

insert into public.site_stats (value, label, display_order, status)
values
  ('20+', 'Năm kinh nghiệm trong ngành', 1, 'published'),
  ('200+', 'Khách hàng đã đồng hành', 2, 'published'),
  ('50+', 'Doanh nghiệp FDI đã tư vấn', 3, 'published'),
  ('100%', 'Tuân thủ chuẩn pháp lý', 4, 'published')
on conflict do nothing;

insert into public.client_logos (name, display_order, status)
values
  ('Vingroup', 1, 'published'),
  ('Vinhomes', 2, 'published'),
  ('Vinpearl', 3, 'published'),
  ('Vincom Retail', 4, 'published'),
  ('VinMec', 5, 'published'),
  ('VinShop', 6, 'published'),
  ('VinID', 7, 'published'),
  ('One Mount', 8, 'published'),
  ('MIK Group', 9, 'published'),
  ('DOJI Land', 10, 'published'),
  ('Empire Group', 11, 'published'),
  ('TASECO', 12, 'published'),
  ('Sun Group', 13, 'published'),
  ('Gami Group', 14, 'published'),
  ('1369', 15, 'published'),
  ('VietinBank', 16, 'published'),
  ('Mitsubishi Motors', 17, 'published'),
  ('Casper', 18, 'published'),
  ('Vimaflour', 19, 'published'),
  ('Japfa', 20, 'published'),
  ('Vaquarius', 21, 'published'),
  ('Garco 10', 22, 'published'),
  ('CPC1HN', 23, 'published'),
  ('VietDigital', 24, 'published'),
  ('Printway.io', 25, 'published'),
  ('3S Media', 26, 'published'),
  ('SNB Distribution', 27, 'published'),
  ('Mekong LLC', 28, 'published'),
  ('IAC Hà Nội', 29, 'published'),
  ('Construction Army Engineering', 30, 'published'),
  ('Đại học Thương mại', 31, 'published'),
  ('Học viện Ngân hàng', 32, 'published')
on conflict (name) do update set
  display_order = excluded.display_order,
  status = excluded.status,
  updated_at = now();

insert into public.timeline_items (page_slug, period, title, organization, description, display_order, status)
values
  ('about', '11/2006 - 10/2011', 'Kiểm toán viên -> Phó Trưởng phòng Tư vấn', 'Mekong LLC', 'Khởi đầu sự nghiệp với 5 năm thực chiến audit và advisory tại một trong những công ty kiểm toán hàng đầu Việt Nam.', 1, 'published'),
  ('about', '11/2011 - 4/2015', 'Thành viên sáng lập, Trưởng phòng Tư vấn-Kiểm toán', 'IAC Hà Nội', 'Đồng sáng lập IAC Hà Nội - một công ty kiểm toán độc lập, dẫn dắt phòng Tư vấn-Kiểm toán phục vụ doanh nghiệp tư nhân.', 2, 'published'),
  ('about', '5/2015 - 6/2017', 'Trưởng nhóm Thuế - Ban Tài chính', 'Tập đoàn Vingroup', 'Trực tiếp xử lý các vấn đề thuế phức tạp xuyên suốt hệ sinh thái Vinhomes, Vinpearl, Vincom Retail, VinMec.', 3, 'published'),
  ('about', '7/2017 - 3/2019', 'Trưởng Bộ phận Thuế - Ban Tài chính', 'Tập đoàn MIK Group', 'Phụ trách toàn bộ chiến lược thuế cho một trong những tập đoàn bất động sản hàng đầu.', 4, 'published'),
  ('about', '4/2019 - 10/2025', 'Kế toán Trưởng', 'Tập đoàn MIK Group', 'Chịu trách nhiệm toàn bộ hệ thống kế toán-thuế của tập đoàn trong 6.5 năm - qua mọi giai đoạn từ M&A, tái cấu trúc đến thanh tra.', 5, 'published'),
  ('about', '5/2015 - nay', 'Giảng viên chính', 'Khóa đào tạo thuế tại doanh nghiệp', 'Hơn 10 năm liên tục giảng dạy in-house cho team kế toán và CFO của các doanh nghiệp khắp Việt Nam.', 6, 'published'),
  ('about', '6/2025 - nay', 'Giảng viên cao cấp', 'Xleaders Academy', 'Giảng viên chương trình đào tạo CEO và quản lý cấp cao tại học viện hàng đầu Việt Nam.', 7, 'published'),
  ('about', '2026 - nay', 'Sáng lập & Giám đốc điều hành', 'Công ty TNHH Tư vấn thuế NHN&D', 'Mang chuyên môn corporate tier 1 đến với cộng đồng SME và doanh nghiệp tư nhân Việt Nam.', 8, 'published')
on conflict do nothing;

insert into public.testimonials (quote, author, title, industry, display_order, status)
values
  ('Sau khi NHN&D kiện toàn quy trình kế toán, chúng tôi cắt được 40% thời gian báo cáo và tránh được khoản phạt 800 triệu trong đợt thanh tra. Đầu tư xứng đáng nhất trong năm.', 'Anh M.', 'CEO chuỗi F&B 30 outlet', 'F&B', 1, 'published'),
  ('NHN&D giúp chúng tôi cấu trúc lại holding để gọi vốn series A - minh bạch và tối ưu thuế cùng lúc. Investor đặc biệt ấn tượng với due diligence prep.', 'Chị L.', 'Founder startup tech', 'Technology', 2, 'published'),
  ('Transfer pricing report của NHN&D đạt chuẩn quốc tế - chúng tôi pass kiểm toán Big4 không có observation. Anh Ngọc thực sự hiểu cả góc độ tax authority và investor.', 'Ms. K.', 'CFO công ty FDI 200 nhân sự', 'Manufacturing FDI', 3, 'published'),
  ('Trước khi gặp anh Ngọc, tôi nghĩ mình tuân thủ tốt. Sau audit của NHN&D, mới biết đang ngồi trên 2 tỷ rủi ro tiềm ẩn. May là phát hiện sớm.', 'Anh T.', 'Chủ chuỗi spa 15 chi nhánh', 'Beauty & Wellness', 4, 'published'),
  ('Workshop thuế cho team kế toán nội bộ rất thực chiến - không phải lý thuyết suông. Team tôi áp dụng được ngay từ ngày đầu sau khóa.', 'Anh H.', 'Founder e-commerce', 'E-commerce', 5, 'published'),
  ('M&A của chúng tôi tiết kiệm 5 tỷ thuế nhờ tư vấn cấu trúc đúng từ đầu của NHN&D. Khoản tiết kiệm này gấp 30 lần phí tư vấn.', 'Anh D.', 'CEO real estate SME', 'Real Estate', 6, 'published')
on conflict do nothing;
