import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Investor Portal - Kosseris Synergy",
  description: "Access exclusive investment opportunities",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB">
      <head>
        <link
          rel="icon"
          href="/kosseris_synergy_logo_gold_ico.ico"
          type="image/x-icon"
        />
      </head>
      <body
        className={`${dmSans.variable} antialiased`}
        style={{ fontFamily: 'var(--font-dm-sans)' }}
      >
        {children}
      </body>
    </html>
  );
}
