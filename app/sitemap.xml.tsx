import { GetServerSideProps } from "next";

const generateSitemap = async (): Promise<string> => {
  return `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Homepage -->
  <url>
      <loc>https://martin-pathfinding-visualizer.vercel.app/</loc>
      <lastmod>2025-02-17</lastmod>
      <changefreq>yearly</changefreq>
      <priority>1.0</priority>
  </url>
  </urlset>`;
};

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export const getServerSideProps: GetServerSideProps<{}> = async (ctx) => {
  ctx.res.setHeader("Content-Type", "xml");
  const xml = await generateSitemap();
  ctx.res.write(xml);
  ctx.res.end();

  return {
    props: {},
  };
};

const sitemap = () => {
  return null;
};

export default sitemap;