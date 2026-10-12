import type { Metadata } from "next";
import { Cinzel, Montserrat } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://modernrelic.com"),
  title: {
    default: "Modern Relic | Retro Clothing, Mugs & Gifts",
    template: "%s | Modern Relic",
  },
  description:
    "Original retro clothing, mugs, prints, accessories, and gifts with an old-school spirit.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${cinzel.variable} ${montserrat.variable}`}>
        {children}
      </body>
    </html>
  );
}
