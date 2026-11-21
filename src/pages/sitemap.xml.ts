// Sitemap para buscadores (SEO, 21 nov 2026). Se arma a mano para no sumar dependencias:
// páginas públicas, textos y el perfil de cada integrante. Las páginas noindex no van.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { integrantes } from '../data/integrantes';

const FIJAS = ['/', '/podcast', '/publicaciones', '/videos', '/documentales', '/textos', '/boletin', '/boletin/1', '/la-red', '/aportar'];

export const GET: APIRoute = async ({ site }) => {
  const textos = await getCollection('textos');
  const urls: { loc: string; lastmod?: string }[] = [
    ...FIJAS.map((r) => ({ loc: new URL(r, site).href })),
    ...textos.map((t) => ({ loc: new URL(`/textos/${t.id}`, site).href, lastmod: t.data.fecha.toISOString().slice(0, 10) })),
    ...integrantes.map((m) => ({ loc: new URL(`/la-red/${m.id}`, site).href })),
  ];
  const cuerpo =
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls.map((u) => `  <url><loc>${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}</url>`).join('\n') +
    '\n</urlset>\n';
  return new Response(cuerpo, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
