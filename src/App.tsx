import { injectArticleJsonLd, injectWebSiteJsonLd } from './utils/jsonld';
import { useState, useEffect, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ArticlesPage from './pages/ArticlesPage';
import ArticlePage from './pages/ArticlePage';
import { getArticleBySlug } from './lib/articles';

// Track whether user navigated internally so back() is safe
let _navigatedInternally = false;

function useRouter() {
  const [path, setPath] = useState(
    typeof window !== 'undefined'
      ? window.location.pathname
      : '/'
  );

  useEffect(() => {
    const handlePopState = () => {
      // Reset flag on browser back/forward so goBack() falls through to '/'
      // when there's no more internal history to go back to
      _navigatedInternally = window.history.state?._internal === true;
      setPath(window.location.pathname);
      window.scrollTo({ top: 0 });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return path;
}

export function navigate(path: string, scrollTop = true) {
  _navigatedInternally = true;
  window.history.pushState({ _internal: true }, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
  if (scrollTop) {
    setTimeout(() => window.scrollTo({ top: 0 }), 0);
  }
}

export function goBack() {
  if (_navigatedInternally) {
    window.history.back();
  } else {
    navigate('/');
  }
}

// Fix 5: Update OG/Twitter meta tags dynamically
export function updatePageMeta(opts: {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
}) {
  const base = 'https://mosych.top';
  const title = opts.title ?? 'Mosych Journal';
  const description = opts.description ?? 'Эстетичные идеи для дома. Вдохновение и стильные решения для интерьера без ремонта.';
  const url = opts.url ? `${base}${opts.url}` : `${base}/`;
  const image = opts.image ? `${base}${opts.image}` : `${base}/images/cover-bathroom.jpg`;

  document.title = title;
  setMeta('name', 'description', description);
  setMeta('property', 'og:title', title);
  setMeta('property', 'og:description', description);
  setMeta('property', 'og:url', url);
  setMeta('property', 'og:image', image);
  setMeta('name', 'twitter:title', title);
  setMeta('name', 'twitter:description', description);
  setMeta('name', 'twitter:image', image);

  const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (canonical) canonical.href = url;
}

function setMeta(attr: string, name: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

interface LinkProps {
  to: string;
  children: ReactNode;
  className?: string;
}

export function Link({ to, children, className }: LinkProps) {
  return (
    <a
      href={to}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        navigate(to);
      }}
    >
      {children}
    </a>
  );
}

function PageTransition({
  children,
  pageKey,
}: {
  children: ReactNode;
  pageKey: string;
}) {
  return (
    <motion.div
      key={pageKey}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}

function App() {
  const path = useRouter();

  let content: ReactNode;

  if (path === '/' || path === '') {
    updatePageMeta({});
    injectWebSiteJsonLd();
    content = (
      <PageTransition pageKey="home">
        <HomePage />
      </PageTransition>
    );
  } else if (path === '/articles') {
    updatePageMeta({
      title: 'Статьи - Mosych Journal',
      description: 'Кураторский список статей о доме, интерьере и вещах, которые меняют пространство.',
      url: '/articles',
    });
    content = (
      <PageTransition pageKey="articles">
        <ArticlesPage />
      </PageTransition>
    );
  } else if (path.startsWith('/articles/')) {
    const slug = path.replace('/articles/', '');
    const article = getArticleBySlug(slug);
    if (article) {
      updatePageMeta({
        title: `${article.title} - Mosych Journal`,
        description: article.description,
        url: `/articles/${article.slug}`,
        image: article.coverImage,
      });
      injectArticleJsonLd({
        title: article.title,
        description: article.description,
        slug: article.slug,
        coverImage: article.coverImage,
        date: article.date,
        readingTime: article.readingTime,
      });
      content = (
        <PageTransition pageKey={`article-${slug}`}>
          <ArticlePage article={article} />
        </PageTransition>
      );
    } else {
      content = (
        <PageTransition pageKey="not-found">
          <NotFound />
        </PageTransition>
      );
    }
  } else {
    content = (
      <PageTransition pageKey="not-found">
        <NotFound />
      </PageTransition>
    );
  }

  return (
    <Layout>
      <AnimatePresence mode="wait">{content}</AnimatePresence>
    </Layout>
  );
}

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <h1 className="font-serif text-6xl font-light text-stone-300">404</h1>
      <p className="text-stone-400 mt-4 text-lg">
        Страница не найдена
      </p>
      <button
        onClick={() => navigate('/')}
        className="mt-8 text-sm text-stone-500 underline underline-offset-4 hover:text-stone-900 transition-colors cursor-pointer"
      >
        Вернуться на главную
      </button>
    </div>
  );
}

export default App;
