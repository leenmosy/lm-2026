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
  readingTime: number;
  order: number;
  intro: string;
  products: Product[];
  conclusion: string;
  popular: boolean;
}

const articles: Article[] = [

  {
  popular: true,
  slug: 'uyutnaya-spalnya-bez-remonta',
  title: '5 вещей, которые делают спальню визуально дороже',
  description: 'Никакого ремонта — только детали, которые создают ощущение дорогого и спокойного интерьера.',
  coverImage: '/images/uyutnaya-spalnya-bez-remonta/cover-bedroom.jpg',
  date: '2026-03-05',
  tags: ['спальня', 'уют', 'декор', 'без ремонта'],
  category: 'Спальня',
  featured: true,
  readingTime: 6,
  order: 3,
  intro: `Спальня — место, где интерьер ощущается особенно сильно.
  Даже дорогой ремонт не спасает комнату, если в ней нет атмосферы.
  И наоборот: несколько правильных деталей способны полностью изменить восприятие пространства.
  Самое интересное — большинство таких изменений стоят недорого. Они работают не за счёт цены, а за счёт текстур, света и ощущения порядка.`,
  products: [
    {
      id: 1,
      title: 'Декоративная наволочка с текстурой',
      description: 'Однотонное сатиновое бельё делает кровать визуальным центром комнаты и сразу создаёт ощущение отеля.',
      image: '/images/uyutnaya-spalnya-bez-remonta/postelnoe-belyo-iz-satina.webp',
      price: 'от 3 500 ₽',
      affiliateUrl: '#',
      why: 'Матовая ткань без пёстрых принтов выглядит дорого и спокойно. Особенно хорошо работают белые, бежевые и серые оттенки.',
      marketplace: 'Yandex',
    },
    {
      id: 2,
      title: 'Мягкий плед крупной вязки',
      description: 'Плед добавляет спальне объём и многослойность — интерьер сразу выглядит более продуманным.',
      image: '/images/uyutnaya-spalnya-bez-remonta/myagkiy-pled-krupnoy-vyazki.webp',
      price: 'от 2 000 ₽',
      affiliateUrl: '#',
      why: 'Текстуры делают комнату визуально «теплее». Даже просто небрежно брошенный плед меняет ощущение пространства.',
      marketplace: 'Yandex',
    },
    {
      id: 3,
      title: 'Настольная лампа с тёплым светом',
      description: 'Мягкий локальный свет возле кровати делает спальню уютнее, чем яркий потолочный.',
      image: '/images/uyutnaya-spalnya-bez-remonta/nastolnaya-lampa-s-tyoplym-svetom.webp',
      price: 'от 2 800 ₽',
      affiliateUrl: '#',
      why: 'Тёплый свет создаёт расслабленную атмосферу и визуально смягчает интерьер.',
      marketplace: 'Yandex',
    },
  ],
  conclusion: `Дорогой интерьер — это редко про цену мебели.
  Чаще — про ощущение спокойствия, чистоты и продуманности.
  Иногда достаточно заменить текстиль и свет, чтобы спальня начала восприниматься совершенно иначе.`,
  },

];

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
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateShort(dateString: string): string {
  const date = new Date(dateString);
  return date.getFullYear().toString();
}

export function getPopularArticles(): Article[] {
  return articles.filter(a => a.popular);
}