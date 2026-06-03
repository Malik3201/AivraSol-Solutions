import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { AppProviders } from "@/components/providers/app-providers";
import { JsonLd } from "@/components/seo/JsonLd";
import { NoiseOverlay } from "@/components/site/NoiseOverlay";
import { ScrollProgress } from "@/components/site/ScrollProgress";
import {
  defaultMetadata,
  organizationJsonLd,
  websiteJsonLd,
} from "@/lib/services/seo";
import { themeColor } from "@/lib/seo";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  ...defaultMetadata,
  themeColor,
};

export const viewport: Viewport = {
  themeColor,
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${plusJakarta.variable} ${jetbrainsMono.variable} h-full font-sans`}
      suppressHydrationWarning
    >
      <body className="min-h-full">
        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={websiteJsonLd()} />
        <ScrollProgress />
        <NoiseOverlay />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
