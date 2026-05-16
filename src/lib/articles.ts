export interface Product {
  id: number;
  title: string;
  description: string;
  image: string;
  price: string;
  affiliateUrl: string;
  why: string;
  marketplace: string;
}

export interface Article {
  slug: string;
  title: string;
  description: string;
  coverImage: string;
  date: string;
  tags: string[];
  category: string;
  featured: boolean;
  popular: boolean;
  readingTime: number;
  order: number;
  intro: string;
  products: Product[];
  conclusion: string;
}

const modules = import.meta.glob<Article>('../content/*.json', { eager: true });

function calcReadingTime(a: Article): number {
  const productText = a.products
    .map((p) => `${p.description} ${p.why}`)
    .join(' ');
  const fullText = [a.intro, a.conclusion, productText].join(' ');
  const words = fullText.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

const articles: Article[] = Object.values(modules).map((a) => ({
  ...a,
  readingTime: calcReadingTime(a),
}));

export function getAllArticles(): Article[] {
  return [...articles].sort((a, b) => a.order - b.order);
}

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug);
}

export function getFeaturedArticle(): Article | undefined {
  return articles.find((article) => article.featured);
}

export function getArticlesSortedByDate(): Article[] {
  return [...articles].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function formatDateShort(dateString: string): string {
  const date = new Date(dateString);
  return date.getFullYear().toString();
}

export function getPopularArticles(): Article[] {
  return articles.filter((a) => a.popular);
}