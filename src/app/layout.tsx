import type { Metadata, Viewport } from "next";

import { ThemeProvider } from "@/components/theme-provider";
import { inter, jetbrainsMono, newsreader, satoshi } from "@/lib/fonts";

import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://uzairvawda.me";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Uzair Vawda — Engineer, MBA candidate",
    template: "%s · Uzair Vawda",
  },
  description:
    "Software engineer and MBA candidate based in NYC. Building tools, shipping ideas, and documenting it publicly.",
  applicationName: "Uzair Vawda",
  authors: [{ name: "Uzair Vawda" }],
  creator: "Uzair Vawda",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Uzair Vawda",
    title: "Uzair Vawda — Engineer, MBA candidate",
    description:
      "Software engineer and MBA candidate based in NYC. Building tools, shipping ideas, and documenting it publicly.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Uzair Vawda — Engineer, MBA candidate",
    description:
      "Software engineer and MBA candidate based in NYC. Building tools, shipping ideas, and documenting it publicly.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0c16" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${satoshi.variable} ${jetbrainsMono.variable} ${newsreader.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
