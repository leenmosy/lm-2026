const SCRIPT_ID = 'jsonld-schema';
const BASE_URL = 'https://mosych.top';

export function injectArticleJsonLd(opts: {
  title: string;
  description: string;
  slug: string;
  coverImage: string;
  date: string;
  readingTime: number;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: opts.title,
    description: opts.description,
    url: `${BASE_URL}/articles/${opts.slug}`,
    image: `${BASE_URL}${opts.coverImage}`,
    datePublished: opts.date,
    dateModified: opts.date,
    timeRequired: `PT${opts.readingTime}M`,
    inLanguage: 'ru',
    publisher: {
      '@type': 'Organization',
      name: 'Mosych Journal',
      url: BASE_URL,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/articles/${opts.slug}`,
    },
  };

  removeJsonLd();
  const script = document.createElement('script');
  script.id = SCRIPT_ID;
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}

export function injectWebSiteJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Mosych Journal',
    url: BASE_URL,
    description: 'Эстетичные идеи для дома. Вдохновение и стильные решения для интерьера без ремонта.',
    inLanguage: 'ru',
  };

  removeJsonLd();
  const script = document.createElement('script');
  script.id = SCRIPT_ID;
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}

export function removeJsonLd() {
  document.getElementById(SCRIPT_ID)?.remove();
}
