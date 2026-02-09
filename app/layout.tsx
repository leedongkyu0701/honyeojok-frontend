import type { Metadata } from "next";
import "./globals.css";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import QCProvider from "./providers/queryClientProviders";
import AuthProvider from "./providers/authProvider";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: {
    default: 'Honyeo',
    template: '%s | Honyeo',
  },
  description: '혼자 여행하는 사람들을 위한 여행 정보 커뮤니티',
  openGraph: {
    title: 'Honyeo',
    description: '혼자 떠날 여행지와 여행 정보를 공유받으세요 !',
    images: ['/og.png'],
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
