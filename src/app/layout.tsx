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

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Uzair Vawda",
  url: siteUrl,
  jobTitle: "Software Engineer",
  description:
    "Software engineer and MBA candidate building tools and shipping ideas in NYC.",
  sameAs: [
    "https://www.linkedin.com/in/uzair-vawda/",
    "https://github.com/UzairVawda",
  ],
  alumniOf: [
    {
      "@type": "CollegeOrUniversity",
      name: "Baruch College · Zicklin School of Business",
      sameAs: "https://zicklin.baruch.cuny.edu/",
    },
    {
      "@type": "CollegeOrUniversity",
      name: "Drexel University · College of Computing and Informatics",
      sameAs: "https://drexel.edu/cci/",
    },
  ],
  worksFor: {
    "@type": "Organization",
    name: "Collins Aerospace",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "New York",
    addressRegion: "NY",
    addressCountry: "US",
  },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
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
