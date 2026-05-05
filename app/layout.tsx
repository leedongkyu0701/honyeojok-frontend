import type { Metadata } from "next";
import "./globals.css";

import Navbar from "@/shared/layout/Navbar";
import Footer from "@/shared/layout/Footer";
import QCProvider from "./providers/QueryClientProviders";
import AuthProvider from "./providers/AuthProvider";
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
    type: "website",
    locale: "ko_KR",
    title: "혼여족",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: "혼여족",
    description: "홀로 떠나는 여행의 시작, 혼여족",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "혼여족 - 홀로 떠나는 여행의 시작",
      },
    ],
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
          <Toaster
            position="top-right"
            richColors
            closeButton
            toastOptions={{
              classNames: {
                closeButton:
                  "!left-auto !right-2 !top-3 rounded-md p-1 text-neutral-500 hover:text-neutral-800 hover:bg-black/5",
              },
            }}
          />
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
