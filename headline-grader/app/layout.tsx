import type { Metadata } from "next";
import { Oswald, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { SearchBar } from "@/components/SearchBar";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HEADLINE.GRADER",
  description:
    "Evaluate headlines for political bias, clickbait, and emotional manipulation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${oswald.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-mono bg-background text-ink">
        <header className="sticky top-0 z-50 bg-background border-b border-ink/20 px-4 md:px-8 py-4 flex flex-col md:flex-row items-center gap-4 justify-between">
          <Link
            href="/"
            className="font-sans text-3xl font-bold uppercase tracking-tight text-accent whitespace-nowrap"
          >
            Headline Grader
          </Link>
          <div className="flex-1 w-full max-w-2xl mx-4">
            <SearchBar />
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
