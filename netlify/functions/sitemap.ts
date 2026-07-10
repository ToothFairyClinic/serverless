import { Handler } from "@netlify/functions";
import { api } from "../common/api";

const BASE_URL = "https://toothfairy.clinic";

export const handler: Handler = async () => {
    try {

        const data = await api.GetServicesForSitemap();

        const languages = ["ua", "en"];
        let urls = "";

        // 1. Додаємо статичні сторінки (можна взяти з page_metadata)
        data.page_metadata.forEach((page) => {
            languages.forEach((lang) => {

                const cleanPath = page.page_route.startsWith('/') ? page.page_route : `/${page.page_route}`;
                const finalPath = cleanPath === '/' ? '' : cleanPath;

                urls += `
  <url>
    <loc>${BASE_URL}/${lang}${finalPath}</loc>
    <lastmod>${new Date(page.updated_at).toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
            });
        });

        // 2. Додаємо динамічні послуги
        data.services.forEach((service) => {
            languages.forEach((lang) => {
                urls += `
  <url>
    <loc>${BASE_URL}/${lang}/services/${lang === 'ua' ? service.slug : service.slug_en}</loc>
    <lastmod>${new Date(service.updated_at).toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
            });
        });

        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls}
</urlset>`;

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/xml" },
            body: sitemap,
        };
    } catch (e) {
        console.error(e);
        return { statusCode: 500, body: "Error generating sitemap" };
    }
};