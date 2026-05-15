import { motion } from 'framer-motion';
import { navigate } from '../App';
import { getArticlesSortedByDate, formatDateShort } from '../lib/articles';

export default function ArticlesPage() {
  const articles = getArticlesSortedByDate();

  return (
    <div className="pb-16 md:pb-24">
      <section className="pt-16 md:pt-24 pb-14 md:pb-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-stone-900">
            Все статьи
          </h1>
          <p className="mt-5 text-stone-400 text-base md:text-lg leading-relaxed max-w-md">
            Авторская подборка материалов об интерьере и вещах, которые влияют на атмосферу и комфорт.
            Идеи, которые способны сделать интерьер визуально дороже и уютнее.
          </p>
        </motion.div>
      </section>

      <div className="h-px bg-stone-200/60" />

      <section>
        {articles.map((article, index) => (
          <motion.div
            key={article.slug}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{
              duration: 0.6,
              delay: index * 0.08,
              ease: 'easeOut',
            }}
          >
            <button
              onClick={() => {
                navigate(`/articles/${article.slug}`);
              }}
              className="w-full group cursor-pointer text-left py-8 md:py-12 border-b border-stone-100"
            >
              <div className="flex items-baseline gap-4 md:gap-8">
                <span className="text-stone-300 text-xl font-mono flex-shrink-0 w-8 md:w-12 group-hover:bg-stone-900 group-hover:text-white transition-all duration-300 text-center">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <div className="flex-1 min-w-0">
                  <h2 className="font-serif text-xl md:text-2xl lg:text-[1.75rem] text-stone-900 leading-snug group-hover:text-stone-500 transition-colors duration-500">
                    {article.title}
                  </h2>
                  <p className="text-stone-400 text-sm mt-1.5 md:mt-2 leading-relaxed">
                    {article.description}
                  </p>
                </div>

                <span className="text-stone-300 text-sm font-mono flex-shrink-0 hidden sm:block">
                  {formatDateShort(article.date)}
                </span>

                <span className="text-stone-300 group-hover:text-stone-500 group-hover:translate-x-1 transition-all duration-500 flex-shrink-0">
                  →
                </span>
              </div>
            </button>
          </motion.div>
        ))}
      </section>
    </div>
  );
}
