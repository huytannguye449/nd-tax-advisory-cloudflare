import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Admin · NHN&D Tax Advisory",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-cream">{children}</div>;
}
