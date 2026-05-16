import { useState, useEffect, useRef } from 'react';
import { navigate } from '../App';
import { cn } from '../utils/cn';
import { getAllArticles } from '../lib/articles';
import type { Article } from '../lib/articles';

function scoreArticle(article: Article, query: string): number {
  const q = query.toLowerCase();
  if (article.title.toLowerCase().includes(q)) return 4;
  if (article.category.toLowerCase().includes(q)) return 3;
  if (article.tags.some((t) => t.toLowerCase().includes(q))) return 2;
  if (article.description.toLowerCase().includes(q)) return 1;
  return 0;
}

const SearchIcon = () => (
  <svg
    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
    width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
  </svg>
);

function highlight(text: string, query: string) {
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-stone-200 text-stone-900 rounded-sm px-0.5">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

export default function Navigation() {
  const [currentPath, setCurrentPath] = useState(
    typeof window !== 'undefined' ? window.location.pathname : '/'
  );
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Article[]>([]);
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mobileContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePop = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, []);

  useEffect(() => {
    if (query.trim().length < 3) {
      setResults([]);
      setOpen(false);
      return;
    }
    const scored = getAllArticles()
      .map((a) => ({ article: a, score: scoreArticle(a, query) }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((x) => x.article);
    setResults(scored);
    setOpen(true);
  }, [query]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const inDesktop = containerRef.current?.contains(e.target as Node);
      const inMobile = mobileContainerRef.current?.contains(e.target as Node);
      if (!inDesktop && !inMobile) {
        setOpen(false);
        setMobileOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      setTimeout(() => mobileInputRef.current?.focus(), 50);
    }
  }, [mobileOpen]);

  const handleSelect = (slug: string) => {
    navigate(`/articles/${slug}`);
    setQuery('');
    setOpen(false);
    setMobileOpen(false);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setOpen(false);
      setMobileOpen(false);
      setQuery('');
    }
  };

  const inputClass = 'bg-stone-100 text-stone-900 placeholder-stone-400 text-sm rounded-sm px-3 py-1.5 pr-8 outline-none focus:bg-stone-200 transition-colors duration-200';

  const navItems = [
    { label: 'Главная', path: '/' },
    { label: 'Статьи', path: '/articles' },
  ];

  const dropdownJsx = open ? (
    <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-stone-200 rounded-sm shadow-lg z-[100] overflow-hidden">
      {results.length > 0 ? results.map((a) => (
        <button
          key={a.slug}
          onMouseDown={(e) => { e.preventDefault(); handleSelect(a.slug); }}
          className="w-full text-left px-4 py-3 hover:bg-stone-50 transition-colors duration-150 border-b border-stone-100 last:border-0 cursor-pointer"
        >
          <p className="text-sm text-stone-900 font-medium leading-snug">{highlight(a.title, query)}</p>
          <p className="text-xs text-stone-500 mt-0.5">{a.category}</p>
        </button>
      )) : (
        <p className="px-4 py-3 text-sm text-stone-400">Ничего не найдено</p>
      )}
    </div>
  ) : null;

  return (
    <>
      <nav className="w-full border-b border-stone-200/60 sticky top-0 z-50 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-[1160px] px-5 md:px-8 lg:px-10">
          <div className="flex items-center h-16 md:h-20 gap-4">

            <button
              onClick={() => navigate('/')}
              aria-label="На главную"
              className="text-stone-900 cursor-pointer flex-shrink-0"
            >
              <svg width="60" height="42" viewBox="0 0 419 295" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M109 295H0L0 36L78 36L158 236.5L97.5 0L201.5 0L419 295L255 295L170 106L233 295H132L51 113L109 295Z" fill="currentColor" />
              </svg>
            </button>

            <div className="flex items-center gap-6 md:gap-10 mx-auto">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    'text-sm tracking-wide transition-all duration-300 cursor-pointer hover:text-stone-900',
                    currentPath === item.path
                      ? 'text-stone-900 font-medium'
                      : 'text-stone-600 font-normal'
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div ref={containerRef} className="relative flex-shrink-0 flex items-center">

              <div className="hidden lg:block relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Поиск"
                  className={cn(inputClass, 'w-48 xl:w-64')}
                />
                <SearchIcon />
                {dropdownJsx}
              </div>

              <div className="hidden md:block lg:hidden relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Поиск"
                  className={cn(inputClass, 'w-32')}
                />
                <SearchIcon />
                {dropdownJsx}
              </div>

              <button
                className="md:hidden text-stone-600 hover:text-stone-900 transition-colors cursor-pointer p-1"
                onClick={() => setMobileOpen((v) => !v)}
                aria-label="Поиск"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
              </button>

            </div>
          </div>
        </div>
      </nav>

      {mobileOpen && (
        <div
          ref={mobileContainerRef}
          className="md:hidden sticky top-16 z-40 bg-white border-b border-stone-200/60 px-5 py-3"
        >
          <div className="relative">
            <input
              ref={mobileInputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Поиск"
              className="w-full bg-stone-100 text-stone-900 placeholder-stone-400 text-sm rounded-sm px-3 py-2 pr-8 outline-none focus:bg-stone-200 transition-colors duration-200"
            />
            <SearchIcon />
          </div>
          {open && (
            <div className="mt-2 bg-white border border-stone-200 rounded-sm overflow-hidden">
              {results.length > 0 ? results.map((a) => (
                <button
                  key={a.slug}
                  onMouseDown={(e) => { e.preventDefault(); handleSelect(a.slug); }}
                  className="w-full text-left px-4 py-3 hover:bg-stone-50 transition-colors duration-150 border-b border-stone-100 last:border-0 cursor-pointer"
                >
                  <p className="text-sm text-stone-900 font-medium leading-snug">{highlight(a.title, query)}</p>
                  <p className="text-xs text-stone-500 mt-0.5">{a.category}</p>
                </button>
              )) : (
                <p className="px-4 py-3 text-sm text-stone-400">Ничего не найдено</p>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}
