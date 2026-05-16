import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import ProductBlock from '../components/ProductBlock';
import { navigate, goBack } from '../App';
import type { Article } from '../lib/articles';
import { formatDate } from '../lib/articles';
import { getAllArticles } from '../lib/articles';
import { supabase } from '../lib/supabase';

interface ArticlePageProps {
  article: Article;
}

export default function ArticlePage({ article }: ArticlePageProps) {
  const related = getAllArticles()
    .filter(a => a.slug !== article.slug)
    .slice(0, 3);
  const [progress, setProgress] = useState(0);
  const [views, setViews] = useState<number | null>(null);
  const articleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fix 3: localStorage сохраняется между вкладками и сессиями
    const storageKey = `viewed_${article.slug}`;

    const fetchViews = async () => {
      if (!supabase) return;
      const { data, error } = await supabase
        .from('article_views')
        .select('views')
        .eq('slug', article.slug)
        .single();
      if (error) {
        console.error('Supabase fetchViews:', error.message);
        return;
      }
      if (data) setViews(data.views);
    };

    const incrementAndFetch = async () => {
      if (!supabase) return;
      const { error: rpcError } = await supabase.rpc('increment_views', { article_slug: article.slug });
      if (rpcError) {
        console.error('Supabase increment_views:', rpcError.message);
        return;
      }
      localStorage.setItem(storageKey, '1');
      const { data, error } = await supabase
        .from('article_views')
        .select('views')
        .eq('slug', article.slug)
        .single();
      if (error) {
        console.error('Supabase fetchViews after increment:', error.message);
        return;
      }
      if (data) setViews(data.views);
    };

    if (localStorage.getItem(storageKey)) {
      fetchViews();
    } else {
      incrementAndFetch();
    }
  }, [article.slug]);


  useEffect(() => {
    const handleScroll = () => {
      if (!articleRef.current) return;
      const el = articleRef.current;
      const top = el.getBoundingClientRect().top + window.scrollY;
      const height = el.offsetHeight - window.innerHeight;
      if (height <= 0) {
        setProgress(1);
        return;
      }
      const scrolled = window.scrollY - top;
      const pct = Math.min(Math.max(scrolled / height, 0), 1);
      setProgress(pct);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="pb-4">
      <div className="fixed left-[max(12px,calc(50vw-750px))] top-1/3 h-1/3 w-0.5 bg-stone-200 z-50 hidden xl:block">
        <div
          className="w-full bg-stone-600 transition-none origin-top"
          style={{ height: `${progress * 100}%` }}
        />
      </div>

      <div ref={articleRef}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0 }}
          className="pt-8 md:pt-10"
        >
          <button
            onClick={goBack}
            className="inline-flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900 transition-colors duration-300 cursor-pointer group"
          >
            <span className="inline-block transition-transform duration-300 group-hover:-translate-x-1">
              ←
            </span>
            Назад
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-8 md:mt-10 rounded-sm overflow-hidden bg-stone-100"
        >
          <div className="aspect-[16/8] md:aspect-[16/7] group overflow-hidden">
            <picture>
              <source
                srcSet={article.coverImage.replace(/\.jpg$/, '.webp')}
                type="image/webp"
              />
              <img
                src={article.coverImage}
                alt={article.title}
                width={1160}
                height={508}
                loading="eager"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
            </picture>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-10 md:mt-14 max-w-2xl"
        >
          <div className="flex items-center gap-3 mb-5">
            <span className="text-xs text-stone-600 uppercase tracking-[0.15em] font-medium">
              {article.category}
            </span>
            <span className="text-stone-600">·</span>
            <span className="text-xs text-stone-600">
              {article.readingTime} мин. чтения
            </span>
            <span className="text-stone-600">·</span>
            <span className="text-xs text-stone-600">
              {formatDate(article.date)}
            </span>
            {views !== null && (
              <>
                <span className="text-stone-600">·</span>
                <span className="text-xs text-stone-600 flex items-center gap-1">
                  {views}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                </span>
              </>
            )}
          </div>

          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light leading-[1.15] tracking-tight text-stone-900">
            {article.title}
          </h1>

          <p className="mt-3 text-stone-900 text-base">
            {article.description}
          </p>
        </motion.div>

        <div className="h-px bg-stone-300/60 mt-10 md:mt-14 mb-8 md:mb-10" />

        <div className="max-w-2xl mb-12 md:mb-16">
          {article.intro.split('\n\n').map((paragraph, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-stone-900 text-base md:text-lg leading-relaxed mb-5 last:mb-0"
            >
              {paragraph}
            </motion.p>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-4"
        >
          <p className="text-xs text-stone-600 uppercase tracking-[0.15em] font-medium">
            Подборка
          </p>
        </motion.div>

        <div>
          {article.products.map((product, index) => (
            <ProductBlock
              key={product.id}
              product={product}
              index={index}
              isLast={index === article.products.length - 1}
            />
          ))}
        </div>


         <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative overflow-hidden bg-stone-900 rounded-sm px-8 md:px-12 py-10 md:py-14 mt-16 md:mt-20"
        >
          <div className="absolute -right-0 -bottom-0 w-80 md:w-[420px] opacity-[1] pointer-events-none select-none">
            <svg width="415" height="355" viewBox="0 0 415 325" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M208.87 246.139C196.249 281.553 173.729 333.937 130.602 338.44C101.294 341.294 78.7635 320.552 88.6039 288.853C92.5609 277.425 101.285 268.169 108.959 259.523C126.937 240.703 147.575 225.271 168.522 210.37C173.495 206.795 168.926 198.883 163.953 202.457C134.12 223.901 22.5709 307.289 100.014 342.743C161.187 370.715 200.834 294.381 217.188 248.37C219.583 242.767 210.428 240.316 208.865 246.142L208.87 246.139Z" fill="#201E1C"/>
              <path d="M161.683 200.955C147.601 211.899 119.146 219.887 101.632 223.669C79.2823 228.835 54.4229 228.423 33.6825 219.303C6.20263 207.041 0.553213 176.547 30.5494 157.822C44.267 149.902 61.8051 151.03 76.4547 149.6C97.3789 148.07 118.808 141.319 139.513 140.618C137.767 138.813 136.549 136.703 134.803 134.897C134.58 135.73 134.356 136.562 134.661 137.089C133.626 142.61 142.254 145.366 143.816 139.54C144.039 138.708 144.263 137.876 143.958 137.348C144.628 134.852 142.8 131.687 139.248 131.628C118.019 132.631 97.6456 138.772 76.1898 140.61C59.3453 141.895 41.2821 141.076 25.4531 150.215C6.45804 161.182 -7.48211 188.216 4.39296 208.784C17.7911 231.99 54.081 236.354 78.3336 235.715C105.832 234.603 146.442 224.52 167.527 207.424C172.496 203.852 166.127 197.687 161.682 200.957L161.683 200.955Z" fill="#201E1C"/>
              <path d="M137.211 134.212C113.994 129.334 89.9385 124.234 69.0353 112.394C57.139 105.195 46.2192 96.0318 39.2167 83.9032C28.7827 64.612 35.7642 53.5479 55.1655 49.3799C94.1916 40.2116 132.192 73.1219 165.8 87.4681C171.403 89.86 175.827 81.679 170.224 79.2871C145.322 69.0529 122.81 53.2185 97.4623 44.6484C77.9397 37.6378 43.3128 33.7172 27.5265 52.6772C14.2975 68.7551 32.8502 96.0133 46.1227 108.044C69.7918 129.539 103.301 137.618 134.231 143.669C140.804 144.094 143.037 135.772 137.211 134.212Z" fill="#201E1C"/>
              <path d="M172.662 81.83C171.606 64.1575 173.301 39.5415 180.793 23.2657C186.637 11.4511 200.66 -14.2232 217.847 -5.16143C237.536 4.56559 234.312 46.5127 233.788 65.097C233.586 70.8404 242.883 71.0996 243.085 65.3559C243.369 42.6907 245.775 -12.8446 213.117 -15.793C197.47 -17.3095 185.292 -1.83864 178.091 10.0559C166.161 29.6035 161.233 59.5975 163.146 82.4017C163.995 87.5381 173.292 87.7963 172.662 81.83Z" fill="#201E1C"/>
              <path d="M246.354 69.8027C266.181 59.0587 304.982 14.1559 329.824 27.9416C355.802 42.4775 336.569 85.9304 324.475 102.755C310.353 122.162 290.768 136.98 272.849 152.249C268.708 156.046 275.083 162.212 279.223 158.415C302.643 139.267 328.697 118.598 342.332 91.0374C351.846 72.1812 356.026 41.6391 340.234 24.0359C312.831 -5.14577 265.306 49.0132 242.313 61.5851C237.035 64.632 241.604 72.545 246.354 69.8027Z" fill="#201E1C"/>
              <path d="M313.317 126.069C324.969 129.188 336.756 130.114 348.328 131.874C356.874 133.27 365.944 134.363 374.264 136.587C396.507 143.433 412.281 174.411 383.101 188.446C348.643 205.526 303.767 189.949 269.122 181.12C263.295 179.56 260.84 188.714 266.666 190.274C296.319 197.766 324.387 206.172 355.36 203.764C374.62 201.788 401.429 198.261 410.34 178.351C433.692 126.191 341.042 124.129 314.72 117.528C309.421 115.664 307.491 124.509 313.317 126.069Z" fill="#201E1C"/>
              <path d="M295.485 197.541C312.758 207.959 330.639 219.439 343.854 235.014C361.474 255.783 350.743 272.53 324.962 270.534C293.443 268.34 260.36 253.685 233.548 238.927C228.473 236.23 223.744 243.884 229.124 247.108C246.621 256.693 265.395 264.845 284.313 270.798C302.698 277.058 328.581 285.325 347.513 277.905C398.129 257.122 318.924 201.586 300.213 189.887C294.834 186.663 290.105 194.317 295.485 197.541Z" fill="#201E1C"/>
              <path d="M190.779 191.524C231.251 220.194 269.219 156.787 230.487 129.921C190.929 102.833 150.956 173.728 190.779 191.524C196.382 193.916 200.805 185.736 195.202 183.344C165.753 170.108 196.657 116.402 225.762 137.572C254.563 158.216 225.973 204.961 195.202 183.344C190.653 180.349 185.927 187.996 190.779 191.524Z" fill="#201E1C"/>
              <path d="M201.613 156.214C203.386 161.107 202.118 166.192 203.032 171.017C203.686 173.662 205.732 175.119 208.377 174.464C210.558 174.204 212.944 171.367 211.826 169.119C210.122 163.367 211.458 157.423 209.292 152.07C208.638 149.425 205.202 149.154 203.416 149.877C201.558 151.456 200.89 154.428 201.613 156.214Z" fill="#201E1C"/>
              <path d="M214.96 156.839C215.083 160.737 215.206 164.636 216.188 168.602C216.843 171.247 218.888 172.704 221.533 172.049C223.715 171.789 226.101 168.952 224.983 166.704C224.001 162.737 223.878 158.839 223.755 154.94C223.305 149.719 214.118 151.158 214.96 156.839Z" fill="#201E1C"/>
              <path d="M227.893 244.976C227.507 243.089 227.67 245.808 227.284 243.921C225.903 239.091 218.575 239.806 218.068 245.022C218.231 266.022 212.656 286.825 214.482 308.272C216.31 329.718 222.221 350.917 229.936 370.372C243.759 405.283 270.881 438.853 267.495 478.074C266.765 484.122 275.757 483.854 276.792 478.333C279.445 445.156 261.034 415.706 247.311 387.061C236.715 365.051 228.229 341.821 224.347 318.045C220.692 293.433 226.94 270.138 226.834 245.588C223.586 246.056 220.866 246.22 217.618 246.688C218.004 248.576 218.694 250.99 219.08 252.878C221.298 257.928 223.384 246.908 227.893 244.976Z" fill="#201E1C"/>
              <path d="M233.107 238.747L228.944 246.243L228.845 246.249C223.488 246.572 218.237 247.893 213.365 250.145L209.421 244.784C215.404 238.25 224.736 235.852 233.107 238.747Z" fill="#201E1C"/>
            </svg>
          </div>

          <div className="relative z-10">
            <h2 className="font-serif text-2xl md:text-3xl text-stone-100 mb-4 leading-snug">
              Итог
            </h2>
            {article.conclusion.split('\n\n').map((paragraph, i) => (
              <p key={i} className="text-stone-400 text-base leading-relaxed max-w-lg mb-3 last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>
        </motion.div>

        {related.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mt-16 md:mt-20 pt-10 md:pt-12"
          >
            <p className="text-sm text-stone-700 uppercase tracking-[0.15em] font-medium mb-8">
              Читать также
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {related.map((a) => (
                <div
                  key={a.slug}
                  className="group cursor-pointer"
                  onClick={() => navigate(`/articles/${a.slug}`)}
                >
                  <div className="aspect-[4/3] rounded-sm overflow-hidden bg-stone-100 mb-4">
                    <picture>
                      <source srcSet={a.coverImage.replace(/\.jpg$/, '.webp')} type="image/webp" />
                      <img
                        src={a.coverImage}
                        alt={a.title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                        loading="lazy"
                      />
                    </picture>
                  </div>
                  <span className="text-xs text-stone-500 uppercase tracking-wider font-medium">
                    {a.category}
                  </span>
                  <h3 className="font-serif text-lg md:text-xl text-stone-900 leading-snug mt-1 group-hover:text-stone-500 transition-colors duration-300">
                    {a.title}
                  </h3>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
