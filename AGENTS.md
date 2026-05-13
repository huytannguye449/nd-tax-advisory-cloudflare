# NHN&D Tax Advisory — Workshop

Next.js 16 website thương hiệu chuyên gia cho **anh Ngọc** (Nguyễn Hoài Ngọc — CPA/CPTA, Founder & CEO Công ty TNHH Tư vấn thuế NHN&D). Định vị Big4 (Deloitte/KPMG/PwC). Site LIVE tại https://nd-tax-advisory.pages.dev (Cloudflare Pages, static export + Pages Functions).

> Universal rules cho mọi AI agent (Claude/Cursor/Gemini/Codex). Tool-specific deltas trong `CLAUDE.md`/`GEMINI.md`/`.cursorrules` ở cùng folder — các file đó CHỈ là pointer trỏ về file này.

---

## Brain links (lazy-load khi cần context)

Khi user nhắc về **a Ngọc, NHN&D, Tax Advisory, tư vấn thuế, brand guidelines, logo NHN, ndtax** — hoặc cần lịch sử quyết định strategy — đọc các file dưới:

- **Memory project**: `~/Documents/AI Agents/01-Projects/06-nhn&d-website/memory/`
- **Decisions log**: `~/Documents/AI Agents/01-Projects/06-nhn&d-website/decisions/`
- **Strategy + handoff**: `~/Documents/AI Agents/01-Projects/06-nhn&d-website/00-context.md`
- **Brand Guidelines** (v1+v2+v3 .md/.html/.pdf): `~/Documents/AI Agents/01-Projects/06-nhn&d-website/brand-guidelines*.{md,html,pdf}`
- **Stitch screens** (26 PNG/SVG): `~/Documents/AI Agents/01-Projects/06-nhn&d-website/stitch-screens/`
- **Visual QA screenshots**: `~/Documents/AI Agents/01-Projects/06-nhn&d-website/_review-stitch-v3/`
- **Cross-project memory**: `~/Documents/AI Agents/99-Meta/Auto-Memory/`
- **Entity card anh Ngọc** (nếu có): `~/Documents/AI Agents/03-People/`

**Khi user yêu cầu lưu memory project**: ghi vào brain `01-Projects/06-nhn&d-website/memory/<topic>.md`, KHÔNG trong workshop.

**Khi user yêu cầu lưu daily journal**: chuyển qua brain `05-Daily/`, không phải workshop.

---

## Xưng hô (BẮT BUỘC)

- Bruce xưng "**tao**", gọi "**mày**" — quyền sếp
- AI **CHỈ xưng "em", CHỈ gọi "sếp/anh"** — KHÔNG bao giờ "tao"/"mày"

(Xem `~/Documents/AI Agents/99-Meta/About-Me.md` để biết thêm.)

---

## 🏗️ Architecture

```
Visitor → Cloudflare Pages (static out/) → functions/api/*.ts (Pages Functions)
                                          ↓
                                    Supabase (leads, bookings, subscribers)
                                          ↓
                                    Resend (transactional email)
                                          ↓
                                    Turnstile (captcha)
```

- **Stack**: Next.js 16 + Turbopack, TailwindCSS 4, Radix UI, TipTap (rich editor cho CMS admin)
- **Auth admin**: bcryptjs + cookie session (`/admin`)
- **Static export**: `next.config.ts` dùng `output: "export"` + `images.unoptimized` → folder `out/`
- **API**: 4 Pages Functions tại `functions/api/{lead,subscribe,booking,unsubscribe}.ts`
- **External services**: Supabase, Resend, Cloudflare Turnstile
- **GitHub repo**: [github.com/nguyenquangdung/nd-tax-advisory](https://github.com/nguyenquangdung/nd-tax-advisory)
- **Branch dev**: `claude/nd-tax-website`
- **Deploy live**: https://nd-tax-advisory.pages.dev

## 📂 Key resources

| Var | ID / Path | Mục đích |
|---|---|---|
| Cloudflare Account | `5b57235351bd59cfb2bea531003b9c37` | Wrangler authed với `dungnq164@gmail.com` |
| Cloudflare Pages project | `nd-tax-advisory` | Slug Pages — KHÔNG đổi (mất domain `.pages.dev`) |
| Custom domain | `ndtax.vn` (a Ngọc sở hữu) | ⏳ Chờ Bruce add DNS CNAME vào Pages project |
| Stitch project | [`1930340481011959365`](https://stitch.withgoogle.com/projects/1930340481011959365) | "NHN&D Editorial Identity" — source logo v3 |
| NotebookLM meeting | [`bb5a2cc4-...-571fb8f5602e`](https://notebooklm.google.com/notebook/bb5a2cc4-831d-4536-a311-571fb8f5602e) | TOPAS MEETING — 4 audio file họp a Ngọc 6/5/2026 |

⚠️ **Wrangler scripts STALE**: `package.json` còn lệnh `deploy/preview/upload` reference `@opennextjs/cloudflare` đã remove từ commit `cd7a32f` (27/4/2026). **KHÔNG dùng** `pnpm run deploy`. Dùng `npx wrangler pages deploy out` trực tiếp (xem Common operations).

## 🛠️ Scripts / structure

```
app/                  Next.js App Router (static pages + admin shell)
components/           Radix UI + shadcn primitives + brand components
  shared/logo.tsx     4 SVG logo inline (pure typography, no PNG)
lib/                  Supabase clients, utils, email templates
public/               Static assets, logo SVG fallbacks, og-default.svg
functions/api/        Cloudflare Pages Functions (lead, subscribe, booking, unsubscribe)
DESIGN.md             Stitch design system synthesis
```

## ⚙️ Common operations

### Dev local

```bash
cd "/Users/aries/Documents/Antigravity/N&D Tax Advisory"
pnpm install         # nếu chưa có node_modules
pnpm run dev         # http://localhost:3000
```

### Build + typecheck

```bash
cd "/Users/aries/Documents/Antigravity/N&D Tax Advisory"
pnpm run typecheck   # tsc --noEmit
pnpm run build       # tạo out/
```

### Deploy production (KHÔNG dùng `pnpm run deploy`)

```bash
cd "/Users/aries/Documents/Antigravity/N&D Tax Advisory"
pnpm run build
npx wrangler pages deploy out \
  --project-name=nd-tax-advisory \
  --branch=main \
  --commit-dirty=true
```

Preview deploys auto-create tại `https://<hash>.nd-tax-advisory.pages.dev`.

### Visual QA

```bash
# Playwright MCP — screenshot tất cả route sau khi rebrand/redesign
cd "/Users/aries/Documents/Antigravity/N&D Tax Advisory"
# Dùng playwright MCP tools, lưu vào _review-<feature>/
```

## 🔐 Credentials & resources

Project secrets trong `.env.local` (gitignored — copy từ `.env.example` và fill):

- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` — server-side only
- `RESEND_API_KEY` — transactional email
- `TURNSTILE_SECRET_KEY` — captcha verify
- `ADMIN_PASSWORD_HASH` — bcrypt hash cho `/admin` login

Wrangler auth: `~/.config/.wrangler/` (system-wide cho account `dungnq164@gmail.com`).

## 🧠 Project skills

Hiện chưa có project-specific skill. Khi build CMS blog auto-publish hoặc deploy automation, sẽ thêm vào `.claude/skills/nhnd-*` và symlink ra brain `99-Meta/claude-skills/`.

Cross-project skills (`lark-*`, `brain-*`, `markitdown`, `nb-*`, `stitch-*`) sống ở brain `~/Documents/AI Agents/99-Meta/claude-skills/`.

## 🔄 Cadence / Cron

Hiện chưa có cron. Future: nếu CMS blog cần auto-publish theo schedule, sẽ tạo LaunchAgent template ở brain `99-Meta/cron/com.bruce.nhnd-*.plist.tpl`.

## ⚠️ Critical gotchas

1. **`pnpm run deploy` BỊ STALE** — Reference `@opennextjs/cloudflare` đã remove. Memory: `~/Documents/AI Agents/01-Projects/06-nhn&d-website/memory/project_nd_tax_advisory.md`.
2. **Cloudflare Pages slug `nd-tax-advisory` KHÔNG đổi** — Đổi sẽ mất domain `.pages.dev` + DNS pointer.
3. **Brand display "NHN&D Tax Advisory"** — Sync với legal name `Công ty TNHH Tư vấn thuế NHN&D`. KHÔNG dùng "N&D" hoặc "NHN" lẻ. Rebrand đã hoàn tất 12/5/2026 (commit `d9b79fb`).
4. **Logo v3 pure typography** (commit `92e174d`) — BỎ corner brackets + checkmark. Source SVG ở `components/shared/logo.tsx` + `public/logo/*.svg` + `app/icon.svg`. PNG `public/logo/*.png` còn STALE (legacy bracketed) — chờ design team regen từ SVG.
5. **Brand Guidelines v3 PDF (gửi a Ngọc)** giữ phong cách bracket cũ — print/web 2 surface khác nhau, sync ở v4 print refresh sau.
6. **Tone**: Tinh tế, học thuật. **KHÔNG "xôi thịt"** (không phong cách ép bán). Reference Deloitte/Big4.
7. **Footer**: Chỉ logo đối tác, KHÔNG chữ.
8. **Nút Đăng nhập**: Thu nhỏ, tinh tế (tránh "lù lù").
9. **Custom domain `ndtax.vn`**: A Ngọc đã sở hữu, chờ Bruce add DNS CNAME → Pages project. Domain decision finale (`ndtax.vn` vs `nhndtax.vn`) chưa chốt.

---

## Setup (new machine)

```bash
git clone git@github.com:nguyenquangdung/nd-tax-advisory.git \
  "$HOME/Documents/Antigravity/N&D Tax Advisory"
cd "$HOME/Documents/Antigravity/N&D Tax Advisory"

cp .env.example .env.local   # fill secrets từ 1Password / Bruce
pnpm install
pnpm run dev                  # verify localhost:3000
```

Brain repo (`bruce-brain`) phải có sẵn ở `~/Documents/AI Agents/` để memory/decisions/brand-guidelines truy cập được.

Wrangler auth (1 lần per machine):
```bash
npx wrangler login   # đăng nhập dungnq164@gmail.com
```
