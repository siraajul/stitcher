import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MobileNav from "@/components/MobileNav";
import DesktopNav from "@/components/DesktopNav";
import PWARegister from "@/components/PWARegister";
import { auth } from "@/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#000000",
};

export const metadata: Metadata = {
  title: "Stitcher | Premium Fashion Catalog",
  description: "Explore our exclusive collection of premium dresses and fashion items. Stitcher offers the finest quality clothing with seamless ordering.",
  keywords: ["fashion", "catalog", "clothing", "dresses", "stitcher", "premium fashion"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Stitcher",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const isAdmin = session?.user?.role === 'ADMIN';

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="font-sans min-h-full flex flex-col pb-[calc(64px+env(safe-area-inset-bottom))] md:pb-0 bg-zinc-50">
        <DesktopNav isAdmin={isAdmin} />
        <div className="flex-1 flex flex-col md:pt-24">
          {children}
        </div>
        <MobileNav isAdmin={isAdmin} />
        <PWARegister />
      </body>
    </html>
  );
}
