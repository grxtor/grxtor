import Navbar from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DATA_DEFAULTS } from "@/data/defaults";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteShell } from "@/components/layout-shell";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(DATA_DEFAULTS.url),
  title: {
    default: `Abdullah Hüseyin Efe (GRXTOR) — Web Designer & Music Producer`,
    template: `%s | Abdullah Hüseyin Efe (GRXTOR)`,
  },
  description:
    "Abdullah Hüseyin Efe, also known as GRXTOR — Web Designer & Music Producer based in Turkey. Founder of The Lost Label, specializing in Brazilian Funk & Phonk music production and modern web design.",
  keywords: [
    "Abdullah Hüseyin Efe",
    "Abdullah Huseyin Efe",
    "GRXTOR",
    "grxtor",
    "web designer",
    "music producer",
    "The Lost Label",
    "Brazilian Funk",
    "Phonk",
    "web developer Turkey",
    "music producer Turkey",
  ],
  authors: [{ name: "Abdullah Hüseyin Efe", url: DATA_DEFAULTS.url }],
  creator: "Abdullah Hüseyin Efe",
  publisher: "GRXTOR",
  alternates: {
    canonical: DATA_DEFAULTS.url,
  },
  openGraph: {
    title: "Abdullah Hüseyin Efe (GRXTOR) — Web Designer & Music Producer",
    description:
      "Abdullah Hüseyin Efe, also known as GRXTOR — Web Designer & Music Producer. Founder of The Lost Label, specializing in Brazilian Funk & Phonk.",
    url: DATA_DEFAULTS.url,
    siteName: "GRXTOR — Abdullah Hüseyin Efe",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    title: "Abdullah Hüseyin Efe (GRXTOR) — Web Designer & Music Producer",
    description:
      "Web Designer & Music Producer. Founder of The Lost Label — Brazilian Funk & Phonk.",
    card: "summary_large_image",
    creator: "@grxtor",
  },
  verification: {
    google: "",
    yandex: "",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased relative",
          geist.variable,
          geistMono.variable
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="dark">
          <TooltipProvider delayDuration={0}>
            <SiteShell navbar={<Navbar />}>{children}</SiteShell>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
