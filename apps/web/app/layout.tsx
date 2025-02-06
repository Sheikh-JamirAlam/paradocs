import type { Metadata } from "next";
import { Della_Respira, Open_Sans } from "next/font/google";
import "./globals.css";

const dellarespira = Della_Respira({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif",
  weight: "400",
});

const opensans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Paradocs",
  description: "Write Text Documents in a collaborative manner",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${opensans.variable} ${dellarespira.variable}`}>{children}</body>
    </html>
  );
}
