import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "USDT Watchdog — Real-time Ethereum Monitor",
  description:
    "Monitor latest USDT transfers on Ethereum in real-time. Built with Next.js, viem, and Tailwind CSS.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
