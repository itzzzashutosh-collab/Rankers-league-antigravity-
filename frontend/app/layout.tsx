import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { ThemeProvider } from "@/providers/theme-provider";
import { QueryProvider } from "@/providers/query-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Ranker's League — Premium Competitive Examination Platform",
    template: "%s | Ranker's League",
  },
  description:
    "Participate in scheduled national and global championship leagues. Benchmark your caliber against the nation's elite in high-fidelity competitive examination replicas.",
  metadataBase: new URL("https://rankersleague.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Ranker's League — Premium Competitive Examination Platform",
    description:
      "Participate in scheduled national and global championship leagues. Benchmark your caliber against the nation's elite in high-fidelity competitive examination replicas.",
    url: "https://rankersleague.com",
    siteName: "Ranker's League",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ranker's League — Premium Competitive Examination Platform",
    description:
      "Participate in scheduled national and global championship leagues. Benchmark your caliber against the nation's elite in high-fidelity competitive examination replicas.",
    creator: "@RankersLeague",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased min-h-screen w-full`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <QueryProvider>
            <div className="relative min-h-screen flex flex-col w-full overflow-x-hidden">
              {children}
            </div>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
