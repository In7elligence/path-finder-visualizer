import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const inter = localFont({
  src: [
    {
      path: "./fonts/Inter-Regular.woff",
    },
    {
      path: "./fonts/Inter-Regular.woff2",
    },
  ],
  display: "swap",
  style: "normal",
  weight: "normal",
  fallback: ["sans-serif"],
  preload: true,
});

export const metadata: Metadata = {
  title: "Pathfinding Visualizer",
  description:
    "An algorithmic pathfinding visualizer made by Martin Beck Andersen in Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
