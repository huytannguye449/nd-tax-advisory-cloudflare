-- Business CMS core: people, services, events, and CMS assets.
-- Apply this in Supabase SQL editor before using the new admin CMS screens.

create table if not exists public.people (
  id uuid primary key default gen_random_uuid(),
  legacy_author_id uuid references public.authors(id) on delete set null,
  slug text not null unique,
  name text not null,
  title text,
  bio text,
  avatar_url text,
  expertise text[] not null default '{}',
  credentials text[] not null default '{}',
  social_links jsonb not null default '{}'::jsonb,
  status text not null default 'draft' check (status in ('draft', 'published')),
  display_order integer not null default 0,
  is_featured boolean not null default false,
  profile_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.posts
  add column if not exists people_id uuid references public.people(id) on delete set null;

insert into public.people (
  legacy_author_id,
  slug,
  name,
  title,
  bio,
  avatar_url,
  status,
  display_order,
  is_featured,
  profile_enabled
)
select
  a.id,
  a.slug,
  a.name,
  a.title,
  a.bio,
  a.avatar_url,
  'published',
  0,
  false,
  true
from public.authors a
where not exists (
  select 1 from public.people p where p.legacy_author_id = a.id or p.slug = a.slug
);

insert into public.people (
  slug,
  name,
  title,
  bio,
  avatar_url,
  credentials,
  expertise,
  status,
  display_order,
  is_featured,
  profile_enabled
)
values
  (
    'anh-ngoc',
    'Nguyen Hoai Ngoc',
    'Founder & CEO',
    '20 nam kinh nghiem tu audit va advisory den vai tro ke toan truong tap doan. Chuyen sau ve quan tri thue chien luoc, kien toan ke toan va tu van mo hinh kinh doanh.',
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=900&q=80',
    array['CPA - Kiem toan vien Viet Nam', 'CPTA - Chung chi hanh nghe thue'],
    array['Tax governance', 'Accounting transformation', 'Cross-border structure'],
    'published',
    1,
    true,
    true
  ),
  (
    'chi-trang',
    'Phan Thi Trang',
    'Senior Manager',
    'Phu trach tax compliance, audit va dam bao chat luong deliverable cho khach hang SME.',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80',
    array['CPA - Kiem toan vien Viet Nam', 'CPTA - Chung chi hanh nghe thue'],
    array['Tax compliance', 'Accounting process', 'Quality control'],
    'published',
    2,
    false,
    true
  ),
  (
    'chi-phuong',
    'Nguyen Thi Thu Phuong',
    'Senior Consultant',
    'Chuyen mon ve tax health check, ho so phap ly-thue va tu van cau truc kinh doanh cross-border.',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&q=80',
    array['CPA - Kiem toan vien Viet Nam', 'CPTA - Chung chi hanh nghe thue'],
    array['Tax health check', 'M&A support', 'Transfer pricing'],
    'published',
    3,
    false,
    true
  )
on conflict (slug) do update set
  title = excluded.title,
  bio = coalesce(public.people.bio, excluded.bio),
  avatar_url = coalesce(public.people.avatar_url, excluded.avatar_url),
  credentials = case when public.people.credentials = '{}' then excluded.credentials else public.people.credentials end,
  expertise = case when public.people.expertise = '{}' then excluded.expertise else public.people.expertise end,
  status = case when public.people.status = 'draft' then excluded.status else public.people.status end,
  display_order = case when public.people.display_order = 0 then excluded.display_order else public.people.display_order end,
  is_featured = public.people.is_featured or excluded.is_featured,
  updated_at = now();

update public.posts p
set people_id = pe.id
from public.people pe
where p.people_id is null
  and p.author_id is not null
  and pe.legacy_author_id = p.author_id;

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  short_description text,
  description text,
  cover_url text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  display_order integer not null default 0,
  pricing text,
  cta_label text,
  cta_href text,
  seo_title text,
  seo_description text,
  when_items jsonb not null default '[]'::jsonb,
  process_items jsonb not null default '[]'::jsonb,
  deliverable_items jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.service_people (
  service_id uuid not null references public.services(id) on delete cascade,
  person_id uuid not null references public.people(id) on delete restrict,
  role_label text,
  display_order integer not null default 0,
  primary key (service_id, person_id)
);

insert into public.services (
  slug,
  title,
  short_description,
  description,
  cover_url,
  status,
  display_order,
  pricing,
  cta_label,
  cta_href,
  when_items,
  process_items,
  deliverable_items
)
values
  (
    'kien-toan-ke-toan',
    'Kien toan bo may ke toan',
    'Co cau nhan su, quy che noi bo, nang cao nghiep vu chuyen mon.',
    'Ra soat va chuan hoa he thong ke toan, quy trinh bao cao, kiem soat noi bo va nang luc doi ngu ke toan.',
    'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=900&q=80',
    'published',
    1,
    'Tron goi 3 thang tu 60 trieu - 6 thang tu 120 trieu',
    'Dat lich tu van',
    '/dat-lich',
    '["Doi ke toan moi thanh lap, chua co quy trinh chuan", "Doanh nghiep scale nhanh, he thong cu qua tai", "Chuan bi goi von, M&A hoac IPO can bao cao minh bach"]'::jsonb,
    '["Audit hien trang", "Danh gia gap so voi chuan muc", "Thiet ke quy trinh moi", "Trien khai va dao tao doi ngu"]'::jsonb,
    '["Bao cao audit hien trang", "So tay quy trinh ke toan", "Template bao cao quan tri", "Tai lieu dao tao"]'::jsonb
  ),
  (
    'tu-van-phap-ly',
    'Tu van phap ly & thue',
    'TNDN, TNCN, GTGT, FCT, uu dai thue, tax health check, dispute resolution.',
    'Tu van thue ad-hoc va thuong xuyen cho cac quyet dinh kinh doanh co rui ro thue, phap ly hoac giao dich phuc tap.',
    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=900&q=80',
    'published',
    2,
    'Theo du an tu 30 trieu',
    'Dat lich tu van',
    '/dat-lich',
    '["Can y kien chuyen gia truoc giao dich lon", "Muon ra soat tuan thu truoc thanh tra", "Dang tranh chap hoac khieu nai voi co quan thue"]'::jsonb,
    '["Tiep nhan yeu cau va ky NDA", "Phan tich phap ly va rui ro", "Soan tax opinion", "Hop thao luan va follow-up"]'::jsonb,
    '["Tax opinion bang van ban", "Risk matrix", "Phuong an trien khai", "Ho tro follow-up"]'::jsonb
  ),
  (
    'cau-truc-kinh-doanh',
    'Cau truc kinh doanh & Cross-border',
    'Chon mo hinh kinh doanh khi dich chuyen doanh thu nuoc ngoai ve Viet Nam.',
    'Phan tich va thiet ke cau truc kinh doanh, dong tien, holding va rui ro thue cho mo hinh trong nuoc hoac cross-border.',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&q=80',
    'published',
    3,
    'Theo du an tu 80 trieu',
    'Dat lich tu van',
    '/dat-lich',
    '["Khoi nghiep va can chon loai hinh doanh nghiep", "Chuan bi goi von", "Mo chi nhanh hoac cong ty con", "Thuc hien M&A hoac divestment"]'::jsonb,
    '["Hieu muc tieu kinh doanh", "Phan tich phuong an cau truc", "De xuat mo hinh toi uu", "Ho tro setup phap ly"]'::jsonb,
    '["Bao cao phan tich cau truc", "So do phap ly va dong tien", "Mo hinh thue 3-5 nam", "Checklist trien khai"]'::jsonb
  ),
  (
    'dao-tao',
    'Dao tao doanh nghiep',
    'Workshop in-house thue-ke toan va chuong trinh dao tao theo nhu cau.',
    'Thiet ke va trien khai workshop thue, ke toan, quan tri rui ro cho founder, CFO va doi ngu ke toan noi bo.',
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=900&q=80',
    'published',
    4,
    'Tu 25 trieu / buoi 4 tieng',
    'Dat lich tu van',
    '/dat-lich',
    '["Doi ke toan can cap nhat kien thuc", "Founder/CFO muon nang cao tax literacy", "Doanh nghiep mo rong sang nganh moi"]'::jsonb,
    '["Khao sat nhu cau", "Thiet ke curriculum", "Trien khai workshop", "Danh gia va follow-up"]'::jsonb,
    '["Curriculum va slide", "Case study rieng", "Recording va Q&A", "Cheat sheet"]'::jsonb
  )
on conflict (slug) do nothing;

insert into public.service_people (service_id, person_id, role_label, display_order)
select s.id, p.id, 'Responsible expert', 1
from public.services s
join public.people p on p.slug = 'anh-ngoc'
where not exists (
  select 1 from public.service_people sp where sp.service_id = s.id and sp.person_id = p.id
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text,
  cover_url text,
  event_date timestamptz,
  location text,
  format text,
  status text not null default 'draft' check (status in ('draft', 'published', 'upcoming', 'past')),
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.event_people (
  event_id uuid not null references public.events(id) on delete cascade,
  person_id uuid not null references public.people(id) on delete restrict,
  role_label text,
  display_order integer not null default 0,
  primary key (event_id, person_id)
);

insert into public.events (
  slug,
  title,
  excerpt,
  cover_url,
  event_date,
  location,
  format,
  status,
  display_order
)
values
  (
    'tax-governance-briefing',
    'Tax Governance Briefing',
    'Phien trao doi danh cho founder va CFO ve chuan hoa chung tu, kiem soat rui ro va chuan bi truoc cac ky ra soat thue.',
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1400&q=80',
    '2026-06-15 09:00:00+07',
    'TP. Ho Chi Minh',
    'Private briefing',
    'published',
    1
  ),
  (
    'founder-tax-clinic',
    'Founder Tax Clinic',
    'Toa dam nhom nho ve chi phi hop le, hop dong dich vu va cac quyet dinh thue thuong gap o doanh nghiep dang scale.',
    'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1400&q=80',
    '2026-07-15 09:00:00+07',
    'Online',
    'Roundtable',
    'published',
    2
  ),
  (
    'cfo-notes',
    'CFO Notes',
    'Phien thuc hanh ve he thong bao cao noi bo, phan quyen phe duyet va tin hieu canh bao som cho rui ro thue.',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80',
    '2026-08-15 09:00:00+07',
    'Ha Noi',
    'Workshop',
    'published',
    3
  )
on conflict (slug) do nothing;

create index if not exists idx_people_status_order on public.people(status, display_order, name);
create index if not exists idx_services_status_order on public.services(status, display_order, title);
create index if not exists idx_events_status_order on public.events(status, display_order, event_date);
create index if not exists idx_posts_people_id on public.posts(people_id);

insert into storage.buckets (id, name, public)
values ('cms-assets', 'cms-assets', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Public read cms assets" on storage.objects;
create policy "Public read cms assets"
on storage.objects for select
using (bucket_id = 'cms-assets');

drop policy if exists "Service role manage cms assets" on storage.objects;
create policy "Service role manage cms assets"
on storage.objects for all
using (bucket_id = 'cms-assets')
with check (bucket_id = 'cms-assets');
