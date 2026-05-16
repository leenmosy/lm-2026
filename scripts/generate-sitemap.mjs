import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const BASE_URL = 'https://mosych.top';

const contentDir = resolve(ROOT, 'src/content');
const jsonFiles = readdirSync(contentDir).filter(f => f.endsWith('.json'));

const articles = jsonFiles.map(f => {
  const data = JSON.parse(readFileSync(resolve(contentDir, f), 'utf-8'));
  return { slug: data.slug, date: data.date };
});

function urlEntry({ path, lastmod, priority = '0.9', changefreq = 'monthly' }) {
  return [
    '  <url>',
    `    <loc>${BASE_URL}${path}</loc>`,
    lastmod ? `    <lastmod>${lastmod}</lastmod>` : '',
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    '  </url>',
  ].filter(Boolean).join('\n');
}

const staticPages = [
  { path: '/', priority: '1.0', changefreq: 'weekly', lastmod: new Date().toISOString().split('T')[0] },
  { path: '/articles', priority: '0.8', changefreq: 'weekly', lastmod: new Date().toISOString().split('T')[0] },
];

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...staticPages.map(p => urlEntry(p)),
  ...articles.map(a => urlEntry({ path: `/articles/${a.slug}`, lastmod: a.date })),
  '</urlset>',
].join('\n');

writeFileSync(resolve(ROOT, 'public/sitemap.xml'), xml, 'utf-8');
if (existsSync(resolve(ROOT, 'dist'))) {
  writeFileSync(resolve(ROOT, 'dist/sitemap.xml'), xml, 'utf-8');
}
console.log(`sitemap.xml — ${articles.length} статей`);
