import type { Metadata } from "next";
import "./globals.css";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import QCProvider from "./providers/queryClientProviders";
import AuthProvider from "./providers/authProvider";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "혼여족",
    template: "%s | 혼여족",
  },
  description: "혼자 여행하는 사람들을 위한 여행 정보 커뮤니티",
  openGraph: {
    title: "혼여족",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: "혼여족",
    description: "홀로 어디론가 떠나고 싶을때, 혼여족",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="bg-neutral-50 text-neutral-900 antialiased">
        <QCProvider>
          <Toaster richColors position="top-right" />
          <AuthProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
          </AuthProvider>
        </QCProvider>
      </body>
    </html>
  );
}
