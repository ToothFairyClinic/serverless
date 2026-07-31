import { Handler } from "@netlify/functions";
import { api } from "../common/api";

const BASE_URL = "https://toothfairy.clinic";

export const handler: Handler = async () => {
    try {
        const data = await api.GetServicesForSitemap();

        const languages = ["ua", "en"];
        let urls = "";

        // 1. Статичні сторінки (page_metadata)
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

        // 2. Динамічні послуги з фільтрацією гео-сторінок та nofollow
        data.services.forEach((service) => {
            // Захисний фільтр на рівні JS
            const isGeo = service.is_geo_page === true;
            const isNoFollow = service.custom_robots?.toLowerCase().includes("nofollow");
            const isNoIndex = service.custom_robots?.toLowerCase().includes("noindex");

            // Якщо сторінка гео або закрита від роботів — пропускаємо генерацію URL
            if (isGeo || isNoFollow || isNoIndex) {
                return;
            }

            languages.forEach((lang) => {
                const currentSlug = lang === 'ua' ? service.slug : service.slug_en;

                if (!currentSlug) return;

                urls += `
  <url>
    <loc>${BASE_URL}/${lang}/services/${currentSlug}</loc>
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
            headers: {
                "Content-Type": "application/xml",
                "Cache-Control": "public, max-age=0, must-revalidate"
            },
            body: sitemap,
        };
    } catch (e) {
        console.error("Sitemap generation error:", e);
        return { statusCode: 500, body: "Error generating sitemap" };
    }
};