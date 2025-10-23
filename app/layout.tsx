import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

import AuthProvider from "./components/AuthProvider";
import AnimatedHeader from "./components/AnimatedHeader";

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
        <AuthProvider>
          <AnimatedHeader />
          {children}
          {/* Copyright Footer */}
          <footer className={`w-full flex justify-end px-4 pb-4 pt-8 sm:pt-0 sm:pb-2 sm:fixed sm:bottom-2 sm:right-4 sm:w-auto z-[101] items-center gap-2 text-xs sm:text-sm transition-opacity duration-500`} style={{ color: '#bb964c' }}>
            <span className="material-icons" style={{ fontSize: '1.1em', verticalAlign: 'middle' }}>&copy;</span>
            Kosseris Synergy © 2025
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
