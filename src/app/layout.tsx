import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ConditionalHeader } from "@/components/ConditionalHeader";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ViewTransition } from "react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Rate That AI — Independent AI Tool Reviews",
    template: "%s | Rate That AI",
  },
  description:
    "We test AI tools against their marketing claims and deliver clear ratings: SLOP, FLAWED, PASSABLE, or APPROVED.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#e9e7df] text-gray-900">
        <ViewTransition enter={{ default: "page-swipe-right" }} exit={{ default: "page-swipe-right" }}>
          <div className="site-shell flex min-h-screen flex-col">
            <ConditionalHeader><Header /></ConditionalHeader>
            <main className="site-main flex-1">{children}</main>
            <Footer />
          </div>
        </ViewTransition>
      </body>
    </html>
  );
}
