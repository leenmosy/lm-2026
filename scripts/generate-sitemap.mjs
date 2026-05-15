import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const BASE_URL = 'https://mosych.top';

const src = readFileSync(resolve(ROOT, 'src/lib/articles.ts'), 'utf-8');

const slugs = [...src.matchAll(/slug:\s*['"`]([^'"`]+)['"`]/g)].map(m => m[1]);
const dates = [...src.matchAll(/date:\s*['"`](\d{4}-\d{2}-\d{2})['"`]/g)].map(m => m[1]);

const articles = slugs.map((slug, i) => ({ slug, date: dates[i] ?? '' }));

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
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/articles', priority: '0.8', changefreq: 'weekly' },
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