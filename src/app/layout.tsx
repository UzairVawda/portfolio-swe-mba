import type { Metadata } from "next";

import { ThemeProvider } from "@/components/theme-provider";
import { inter, jetbrainsMono, newsreader, satoshi } from "@/lib/fonts";

import "./globals.css";

export const metadata: Metadata = {
  title: "Uzair Vawda",
  description:
    "Software engineer and MBA candidate. Building tools and shipping ideas.",
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
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
