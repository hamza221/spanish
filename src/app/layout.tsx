import type { Metadata, Viewport } from "next";
import { DM_Sans, Fraunces, Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["500", "700", "800", "900"],
  variable: "--font-nunito",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lumi — Spanish, daily.",
  description:
    "Learn Spanish with frequency-ranked flashcards, AI conversation partners, and graded reading.",
};

export const viewport: Viewport = {
  themeColor: "#FBFAF6",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-direction="a"
      className={`${nunito.variable} ${dmSans.variable} ${fraunces.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
