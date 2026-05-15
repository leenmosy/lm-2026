import { useState, useEffect } from 'react';
import { navigate } from '../App';
import { cn } from '../utils/cn';

export default function Navigation() {
  const [currentPath, setCurrentPath] = useState(
    typeof window !== 'undefined' ? window.location.pathname : '/'
  );

  useEffect(() => {
    const handlePop = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, []);

  const navItems = [
    { label: 'Главная', path: '/' },
    { label: 'Статьи', path: '/articles' },
  ];

  return (
    <nav className="w-full border-b border-stone-200/60 sticky top-0 z-50 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-[1160px] px-5 md:px-8 lg:px-10">
        <div className="flex items-center h-16 md:h-20">
          <button
            onClick={() => navigate('/')}
            aria-label="На главную"
            className="text-stone-900 cursor-pointer"
          >
            <svg width="60" height="42" viewBox="0 0 419 295" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M109 295H0L0 36L78 36L158 236.5L97.5 0L201.5 0L419 295L255 295L170 106L233 295H132L51 113L109 295Z" fill="currentColor"/>
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
            <div className="w-[60px]" />
        </div>
      </div>
    </nav>
  );
}
