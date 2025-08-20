import type React from "react";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { NextIntlClientProvider } from "next-intl";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "Modern CMS",
  description:
    "A fast, scalable content management system built with Next.js 15+",
  generator: "Next.js",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>
}>) {
    const { locale } = await params
  return (
    <html lang={locale} className={roboto.variable} suppressHydrationWarning>
      <body className="font-sans">
        <NextIntlClientProvider locale={locale}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
