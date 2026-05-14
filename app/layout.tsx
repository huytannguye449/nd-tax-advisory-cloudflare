import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { SITE } from "@/lib/utils";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-playfair",
});

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s · ${SITE.name}`,
  },
  description:
    "Tư vấn thuế chiến lược cho SME & FDI tại Việt Nam. Chính xác, bảo mật, tận tâm, sắc bén. Giúp chủ doanh nghiệp an tâm với mọi quyết định thuế.",
  keywords: [
    "tư vấn thuế",
    "tư vấn thuế Hà Nội",
    "kế toán thuế SME",
    "cấu trúc kinh doanh",
    "transfer pricing",
    "thuế TNDN",
    "thuế GTGT",
    "NHN&D Tax Advisory",
  ],
  authors: [{ name: SITE.name }],
  creator: SITE.name,
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: "Tư vấn thuế chiến lược cho SME & FDI tại Việt Nam.",
    images: ["/og/default.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.name,
    description: SITE.tagline,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  icons: {
    apple: "/logo/logo-app-icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#0F2B46",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: SITE.name,
  url: SITE.url,
  logo: `${SITE.url}/logo/logo-primary.png`,
  email: SITE.email,
  telephone: SITE.phone,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Hà Nội",
    addressCountry: "VN",
  },
  description: "Tư vấn thuế chiến lược cho doanh nghiệp tại Việt Nam.",
  sameAs: [SITE.social.linkedin, SITE.social.facebook],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col bg-cream text-navy antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-navy focus:px-4 focus:py-2 focus:text-cream"
        >
          Bỏ qua đến nội dung chính
        </a>
        <Nav />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </body>
    </html>
  );
}
