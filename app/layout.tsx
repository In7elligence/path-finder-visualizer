import type { Metadata } from "next";
import localFont from "next/font/local";
import "./styles/globals.css";
import { Analytics } from "@vercel/analytics/react";

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
  description: `Visualize popular pathfinding algorithms including Dijkstra's,
    A* Search, Bellman-Ford, Greedy BFS, BFS, Bidirectional Swarm Algorithm and DFS in an interactive web app.
    Built with Next.js 15 by Martin Beck Andersen to demonstrate algorithmic concepts.`.trim(),
  keywords: [
    "pathfinding visualizer",
    "Dijkstra's Algorithm",
    "A* Search",
    "Bellman-Ford",
    "Greedy Best-First Search",
    "Swarm Algorithm",
    "Bidirectional Swarm Algorithm",
    "Breadth-First Search",
    "Depth-First Search",
    "algorithm visualization",
    "Next.js project",
    "Martin Beck Andersen",
    "pathfinding algorithms",
    "interactive learning",
    "web development",
    "React visualization",
    "algorithm simulation",
    "coding tutorial",
  ].join(", "),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
