import { navigate } from '../App';

export default function Footer() {
  return (
    <footer className="w-full border-t border-stone-200/60 mt-24 md:mt-32">
      <div className="mx-auto max-w-[1160px] px-5 md:px-8 lg:px-10 py-12 md:py-16">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <button
              onClick={() => {
                navigate('/');
              }}
              aria-label="На главную"
              className="text-stone-900 hover:opacity-70 transition-opacity duration-300 cursor-pointer"
            >
              <svg width="50" height="35" viewBox="0 0 419 295" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M109 295H0L0 36L78 36L158 236.5L97.5 0L201.5 0L419 295L255 295L170 106L233 295H132L51 113L109 295Z" fill="currentColor"/>
              </svg>
            </button>
          </div>

          <div className="flex flex-col items-start md:items-end gap-3">
            <div className="flex items-center gap-6">
              <button
                onClick={() => {
                  navigate('/');
                }}
                className="text-sm text-stone-400 hover:text-stone-600 transition-colors duration-300 cursor-pointer"
              >
                Главная
              </button>
              <button
                onClick={() => {
                  navigate('/articles');
                }}
                className="text-sm text-stone-400 hover:text-stone-600 transition-colors duration-300 cursor-pointer"
              >
                Статьи
              </button>
            </div>
            <p className="text-stone-300 text-xs">
              © {new Date().getFullYear()} Mosych Journal. Все права защищены.
            </p>
            <p className="text-stone-300 text-xs">
              Материалы содержат партнёрские ссылки. При покупке мы можем получать комиссию.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
