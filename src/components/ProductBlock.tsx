import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Product } from '../lib/articles';

interface ProductBlockProps {
  product: Product;
  index: number;
  isLast: boolean;
}

export default function ProductBlock({ product, index, isLast }: ProductBlockProps) {
  const isEven = index % 2 === 0;
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = (e.clientX - centerX) / rect.width;
    const y = (e.clientY - centerY) / rect.height;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{
        duration: 0.7,
        delay: 0.1,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className="py-12 md:py-16 first:pt-0"
    >
      <div
        className={`flex flex-col ${
          isEven ? 'md:flex-row' : 'md:flex-row-reverse'
        } gap-8 md:gap-14 items-start`}
      >
        <div className="w-full md:w-1/2 flex-shrink-0">
          <div 
            className="aspect-[4/3] rounded-sm overflow-hidden bg-stone-100"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <picture>
              <source
                srcSet={product.image.endsWith('.webp') ? product.image : product.image.replace(/\.[^.]+$/, '.webp')}
                type="image/webp"
              />
              <img
                src={product.image.replace(/\.webp$/, '.jpg')}
                alt={product.title}
                width={580}
                height={435}
                className="w-full h-full object-cover"
                style={{
                  transform: `translate(${position.x * 8}px, ${position.y * 8}px) scale(1.08)`,
                  transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                  willChange: 'transform',
                }}
                loading="lazy"
              />
            </picture>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-stone-400 text-lg font-mono font-medium">
              {String(index + 1).padStart(2, '0')}
            </span>
            <div className="h-px flex-1 bg-stone-200" />
            <span className="text-stone-500 text-lg font-semibold">
              {product.price}
            </span>
          </div>

          <h3 className="font-serif text-2xl md:text-3xl leading-snug text-stone-900 mb-4">
            {product.title}
          </h3>

          <p className="text-stone-500 text-base leading-relaxed mb-6">
            {product.description}
          </p>

          <div className="border-l-2 border-stone-300 pl-5 mb-6">
            <p className="text-xs text-stone-600 uppercase tracking-wider mb-2 font-medium">
              ✦ Почему это меняет пространство
            </p>
            <p className="text-stone-600 text-sm leading-relaxed">
              {product.why}
            </p>
          </div>

          <a
            href={product.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-row items-center gap-3 self-start group"
          >
            <span className="inline-flex items-center gap-2 text-sm font-medium text-stone-900 border-b border-stone-900 pb-0.5 group-hover:text-stone-500 group-hover:border-stone-500 transition-colors duration-300">
              Посмотреть на маркетплейсе
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                />
              </svg>
            </span>
            <span className="text-xs font-medium border px-2 py-0.5 rounded-sm tracking-wider uppercase transition-colors duration-300 border-stone-300 text-stone-400 group-hover:text-[#F7E000] group-hover:border-[#F7E000]">
              {product.marketplace}
            </span>
          </a>
        </div>
      </div>

      {!isLast && (
        <div className="mt-12 md:mt-16 h-px bg-stone-100 w-full" />
      )}
    </motion.div>
  );
}
