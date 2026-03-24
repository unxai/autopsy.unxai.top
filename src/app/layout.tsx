import type { Metadata } from "next";
import { Footer, Header } from "@/components/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://autopsy.unxai.top"),
  title: {
    default: "AI 产品尸检馆",
    template: "%s · AI 产品尸检馆",
  },
  description: "记录 AI 产品如何失败、停更、转型与消失。一个结构化归档 AI 产品失败案例的研究库。",
  openGraph: {
    title: "AI 产品尸检馆",
    description: "记录 AI 产品如何失败、停更、转型与消失。",
    url: "https://autopsy.unxai.top",
    siteName: "AI 产品尸检馆",
    locale: "zh_CN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI 产品尸检馆",
    description: "记录 AI 产品如何失败、停更、转型与消失。",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="noise min-h-full bg-[var(--background)] text-[var(--foreground)]">
        <div className="flex min-h-screen flex-col">
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
