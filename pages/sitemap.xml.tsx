import { GetServerSideProps } from "next";

const generateSitemap = async (): Promise<string> => {
  return `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>https://martin-pathfinding-visualizer.vercel.app/</loc>
      <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
      <changefreq>yearly</changefreq>
      <priority>1.0</priority>
    </url>
  </urlset>`;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  ctx.res.setHeader("Content-Type", "text/xml");
  const xml = await generateSitemap();
  ctx.res.write(xml);
  ctx.res.end();

  return { props: {} };
};

// Default export required (no JSX needed)
export default function Sitemap() {
  return null;
}
