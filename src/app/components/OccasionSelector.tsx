import { useState, useMemo } from 'react';
import { Heart, PartyPopper, Briefcase, Coffee, Plane, Dumbbell, Sparkles, Calendar } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { getOccasionShowcase, Product } from './ProductDatabase';

interface OccasionConfig {
  id: string;
  label: string;
  icon: typeof Heart;
  color: string;
  description: string;
}

const occasions: OccasionConfig[] = [
  {
    id: 'wedding',
    label: 'Wedding',
    icon: Heart,
    color: '#FFB6C1',
    description: 'Bridal & ceremony essentials'
  },
  {
    id: 'party',
    label: 'Party',
    icon: PartyPopper,
    color: '#C9A961',
    description: 'Night out & club looks'
  },
  {
    id: 'office',
    label: 'Office',
    icon: Briefcase,
    color: '#4A4A4A',
    description: 'Professional & corporate'
  },
  {
    id: 'casual',
    label: 'Casual',
    icon: Coffee,
    color: '#D4C4A8',
    description: 'Everyday relaxed styles'
  },
  {
    id: 'date',
    label: 'Date Night',
    icon: Heart,
    color: '#E85D75',
    description: 'Romantic evening picks'
  },
  {
    id: 'festive',
    label: 'Festive',
    icon: Sparkles,
    color: '#FF6B35',
    description: 'Festival & celebration'
  },
  {
    id: 'brunch',
    label: 'Brunch',
    icon: Coffee,
    color: '#F0C27F',
    description: 'Weekend brunch vibes'
  },
  {
    id: 'travel',
    label: 'Travel',
    icon: Plane,
    color: '#4ECDC4',
    description: 'Vacation & adventure'
  },
  {
    id: 'gym',
    label: 'Gym',
    icon: Dumbbell,
    color: '#45B7D1',
    description: 'Workout & activewear'
  }
];

interface OccasionSelectorProps {
  onAddToCart?: (product: { id: string; name: string; price: number; image: string; category: string }) => void;
}

export function OccasionSelector({ onAddToCart }: OccasionSelectorProps) {
  const [selectedOccasion, setSelectedOccasion] = useState<string | null>(null);

  const selected = occasions.find(o => o.id === selectedOccasion);

  // Dynamically fetch products from the database based on selected occasion
  const products = useMemo(() => {
    if (!selectedOccasion) return [];
    return getOccasionShowcase(selectedOccasion, 'female', 8);
  }, [selectedOccasion]);

  if (selected && products.length > 0) {
    return (
      <div className="space-y-4 fade-in-up">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-serif text-[var(--velour-text)] mb-1">
              {selected.label} Collection
            </h3>
            <p className="text-sm text-[var(--velour-text-soft)]">
              {selected.description} — {products.length} curated pieces
            </p>
          </div>
          <button
            onClick={() => setSelectedOccasion(null)}
            className="text-sm text-[var(--velour-gold)] hover:underline"
          >
            Change
          </button>
        </div>
        <div className="space-y-3">
          {products.map(product => (
            <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white/80 to-[var(--velour-cream)]/80 backdrop-blur-sm rounded-2xl p-6 border border-[var(--border)]">
      <div className="mb-6">
        <h3 className="text-xl font-serif text-[var(--velour-text)] mb-2">
          What's the Occasion?
        </h3>
        <p className="text-sm text-[var(--velour-text-soft)]">
          Tell me where you're headed, and I'll curate the perfect look
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {occasions.map((occasion) => {
          const Icon = occasion.icon;
          return (
            <button
              key={occasion.id}
              onClick={() => setSelectedOccasion(occasion.id)}
              className="p-4 bg-white/60 backdrop-blur-sm border border-[var(--border)] rounded-2xl hover:border-[var(--velour-gold)]/40 hover:-translate-y-1 hover:shadow-lg transition-all text-left group"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"
                style={{ backgroundColor: `${occasion.color}20` }}
              >
                <Icon className="w-5 h-5" style={{ color: occasion.color }} />
              </div>
              <h4 className="font-serif text-sm text-[var(--velour-text)]">
                {occasion.label}
              </h4>
              <p className="text-[10px] text-[var(--velour-text-soft)] mt-0.5">
                {occasion.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
