import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ✅ Add metadata for favicon + dynamic title
export const metadata = {
  title: {
    default: "RankU Dashboard",
    template: "%s | RankU", // This allows dynamic titles
  },
  icons: {
    icon: "/ranku.ico", // Place this icon file in the public/ directory
  },
  description: "AI-powered SEO and social media automation platform by RankU",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
