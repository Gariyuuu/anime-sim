import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Rajdhani } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["500", "700"],
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
    <html lang="en" className={`${jetbrainsMono.variable} ${rajdhani.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col overflow-hidden">{children}</body>
    </html>
  );
}
