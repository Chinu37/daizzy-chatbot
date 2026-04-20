import { ShoppingBag, Heart, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: { id: string; name: string; price: number; image: string; category: string }) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div
      className="group relative bg-white/60 backdrop-blur-sm rounded-2xl overflow-hidden border border-[var(--border)] hover:border-[var(--velour-gold)]/30 hover:-translate-y-1 transition-all cursor-pointer"
      style={{
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)'
      }}
    >
      <div className="flex gap-4 p-3">
        {/* Image */}
        <div className="relative w-24 h-32 rounded-xl overflow-hidden bg-[var(--velour-champagne)]/30 flex-shrink-0">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Like Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform"
          >
            <Heart
              className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-[var(--velour-text-soft)]'}`}
            />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between py-1">
          <div>
            <p className="text-xs text-[var(--velour-gold)] font-medium tracking-wide uppercase">
              {product.category}
            </p>
            <h4 className="text-base font-medium text-[var(--velour-text)] mt-1 leading-snug">
              {product.name}
            </h4>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-lg font-serif font-semibold text-[var(--velour-text)]">
              ₹{product.price.toLocaleString('en-IN')}
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onAddToCart) {
                  onAddToCart({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    category: product.category
                  });
                }
              }}
              className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--velour-gold)] to-[var(--velour-gold-dark)] flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-transform"
            >
              <ShoppingBag className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick View on Hover */}
      <div className="px-3 pb-3 hidden group-hover:block">
        <button className="w-full py-2.5 bg-[var(--velour-gold)]/10 hover:bg-[var(--velour-gold)]/20 rounded-xl text-sm font-medium text-[var(--velour-gold)] transition-colors flex items-center justify-center gap-2">
          View Details
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
