import type { Metadata, Viewport } from "next";
import { Space_Mono, Press_Start_2P } from "next/font/google";
import "./globals.css";

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const pressStart = Press_Start_2P({
  variable: "--font-press-start",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "ANIME//SIM",
  description: "Choose a world. Rewrite its story. An original anime life-sim across two branching worlds.",
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#171716",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${spaceMono.variable} ${pressStart.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col overflow-hidden">{children}</body>
    </html>
  );
}
