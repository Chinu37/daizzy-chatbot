import { useState } from 'react';
import { ChevronRight, Check, Gift, Sparkles, ShoppingBag } from 'lucide-react';
import { Product, filterProducts, shuffleArray } from './ProductDatabase';

const STEPS = {
  STYLE: 0,
  COLOR: 1,
  BUDGET: 2
};

const styleOptions = [
  {
    id: 'minimal',
    label: 'Minimal',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=500&fit=crop',
    desc: 'Clean & Simple'
  },
  {
    id: 'bold',
    label: 'Bold',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=500&fit=crop',
    desc: 'Statement Pieces'
  },
  {
    id: 'elegant',
    label: 'Elegant',
    image: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&h=500&fit=crop',
    desc: 'Timeless Luxury'
  },
  {
    id: 'casual',
    label: 'Casual',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=500&fit=crop',
    desc: 'Relaxed Comfort'
  }
];

const colorOptions = [
  { id: 'neutral', label: 'Neutral', colors: ['#F5F5DC', '#D3C5B0', '#C8B8A0', '#A89F91'] },
  { id: 'dark', label: 'Dark Tones', colors: ['#2C2C2C', '#4A4A4A', '#1A1A1A', '#3D3D3D'] },
  { id: 'pastel', label: 'Pastel', colors: ['#FFE4E1', '#E6E6FA', '#F0E68C', '#FFB6C1'] },
  { id: 'vibrant', label: 'Vibrant', colors: ['#FF6B6B', '#4ECDC4', '#FFD93D', '#95E1D3'] }
];

const budgetOptions = [
  { id: 'under250k', label: 'Under ₹2.5L', range: '₹50K - ₹2.5L' },
  { id: '250k-400k', label: '₹2.5L - ₹4L', range: 'Mid Range' },
  { id: '400k-800k', label: '₹4L - ₹8L', range: 'Premium' },
  { id: 'premium', label: 'Premium ₹8L+', range: 'Luxury Collection' }
];

interface StyleQuizProps {
  onComplete?: () => void;
  onAddToCart?: (product: { id: string; name: string; price: number; image: string; category: string }) => void;
}

export function StyleQuiz({ onComplete, onAddToCart }: StyleQuizProps = {}) {
  const [currentStep, setCurrentStep] = useState(STEPS.STYLE);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedBudget, setSelectedBudget] = useState<string>('');
  const [isComplete, setIsComplete] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);

  const totalSteps = 3;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const handleStyleToggle = (styleId: string) => {
    setSelectedStyles(prev =>
      prev.includes(styleId)
        ? prev.filter(id => id !== styleId)
        : [...prev, styleId]
    );
  };

  const handleContinue = () => {
    if (currentStep === STEPS.STYLE && selectedStyles.length === 0) return;
    if (currentStep === STEPS.COLOR && !selectedColor) return;
    if (currentStep === STEPS.BUDGET && !selectedBudget) return;

    if (currentStep < STEPS.BUDGET) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final step - complete
      setIsProcessing(true);
      setTimeout(() => {
        // Generate personalized recommendations based on quiz answers
        const budgetMap: Record<string, number> = {
          'under250k': 250000,
          '250k-400k': 400000,
          '400k-800k': 800000,
          'premium': 1000000
        };

        const maxBudget = budgetMap[selectedBudget] || 1000000;

        // Get products matching all preferences - random gender for variety
        const gender = Math.random() > 0.5 ? 'female' : 'male';
        const allProducts: Product[] = [];

        // Get products from different categories
        const categories: Product['category'][] = ['Top', 'Bottom', 'Shoes', 'Accessories'];
        categories.forEach(category => {
          const products = filterProducts(
            category,
            ['casual', 'party', 'office', 'wedding'], // All occasions
            selectedStyles,
            maxBudget,
            gender
          );
          allProducts.push(...products);
        });

        // Filter by color preference if selected
        let filtered = allProducts;
        if (selectedColor) {
          filtered = allProducts.filter(p => p.color === selectedColor);
        }

        // Take 6 random products
        const shuffled = shuffleArray(filtered);
        setRecommendedProducts(shuffled.slice(0, 6));

        setIsProcessing(false);
        setIsComplete(true);
        onComplete?.();
      }, 2000);
    }
  };

  const handleSkip = () => {
    if (currentStep < STEPS.BUDGET) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsComplete(true);
    }
  };

  const canContinue = () => {
    if (currentStep === STEPS.STYLE) return selectedStyles.length > 0;
    if (currentStep === STEPS.COLOR) return selectedColor !== '';
    if (currentStep === STEPS.BUDGET) return selectedBudget !== '';
    return false;
  };

  const reset = () => {
    setCurrentStep(STEPS.STYLE);
    setSelectedStyles([]);
    setSelectedColor('');
    setSelectedBudget('');
    setIsComplete(false);
    setIsProcessing(false);
    setRecommendedProducts([]);
  };

  if (isComplete) {
    const styleLabels = selectedStyles.map(s => styleOptions.find(opt => opt.id === s)?.label).join(', ');
    const colorLabel = colorOptions.find(c => c.id === selectedColor)?.label || 'All Colors';
    const budgetLabel = budgetOptions.find(b => b.id === selectedBudget)?.label || '';

    return (
      <div className="space-y-6 fade-in-up">
        <div className="bg-gradient-to-br from-white/80 to-[var(--velour-cream)]/80 backdrop-blur-sm rounded-3xl p-8 border border-[var(--border)] text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[var(--velour-gold)] to-[var(--velour-gold-dark)] rounded-full flex items-center justify-center">
            <Check className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-3xl font-serif text-[var(--velour-text)] mb-3">Style Profile Complete!</h3>
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-[var(--velour-text-soft)]">You've earned</span>
            <div className="inline-flex items-center gap-1 px-4 py-2 bg-[var(--velour-gold)]/10 rounded-full">
              <Gift className="w-5 h-5 text-[var(--velour-gold)]" />
              <span className="font-semibold text-[var(--velour-gold)]">100 Velour Coins</span>
            </div>
          </div>
          <p className="text-[var(--velour-text-soft)] mb-6 max-w-md mx-auto">
            Based on your preferences, here are some personalized picks for you
          </p>

          {/* Style Summary */}
          <div className="flex items-center justify-center gap-2 flex-wrap mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full">
              <span className="text-sm font-medium text-[#D4AF37]">{styleLabels}</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full">
              <span className="text-sm font-medium text-[#D4AF37]">{colorLabel}</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full">
              <span className="text-sm font-medium text-[#D4AF37]">{budgetLabel}</span>
            </div>
          </div>

          <button
            onClick={reset}
            className="px-8 py-3 bg-white border-2 border-[var(--velour-gold)] text-[var(--velour-gold)] rounded-full font-medium hover:bg-[var(--velour-gold)] hover:text-white transition-all"
          >
            Take Quiz Again
          </button>
        </div>

        {/* Recommended Products */}
        {recommendedProducts.length > 0 && (
          <div className="bg-gradient-to-br from-white/80 to-[var(--velour-cream)]/80 backdrop-blur-sm rounded-3xl p-6 border border-[var(--border)]">
            <h4 className="text-xl font-serif text-[var(--velour-text)] mb-4">Picked Just For You</h4>
            <div className="grid grid-cols-2 gap-4">
              {recommendedProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl overflow-hidden border border-[var(--border)] hover:border-[var(--velour-gold)]/40 hover:shadow-lg transition-all group"
                >
                  <div className="relative h-48">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-[var(--velour-gold)] font-medium mb-1 uppercase">
                      {product.category}
                    </p>
                    <h5 className="text-sm font-medium text-[var(--velour-text)] mb-2 line-clamp-1">
                      {product.name}
                    </h5>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-serif font-semibold text-[var(--velour-text)]">
                        ₹{product.price.toLocaleString('en-IN')}
                      </p>
                      <button
                        onClick={() => {
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
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white/80 to-[var(--velour-cream)]/80 backdrop-blur-sm rounded-3xl p-8 border border-[var(--border)]">
      {/* Header */}
      <div className="text-center mb-8">
        <h3 className="text-3xl font-serif text-[var(--velour-text)] mb-2">
          Find Your Style
        </h3>
        <p className="text-[var(--velour-text-soft)]">
          Let Daizzy understand your taste
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-xs text-[var(--velour-text-soft)] mb-3">
          <span>Step {currentStep + 1} of {totalSteps}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-[var(--velour-champagne)] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[var(--velour-gold)] to-[var(--velour-gold-dark)] transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="min-h-[400px] mb-8">
        {/* Step 1: Style Selection */}
        {currentStep === STEPS.STYLE && (
          <div className="fade-in-up">
            <h4 className="text-xl font-serif text-[var(--velour-text)] mb-6 text-center">
              Choose your style preferences
            </h4>
            <div className="grid grid-cols-2 gap-4">
              {styleOptions.map((style) => (
                <button
                  key={style.id}
                  onClick={() => handleStyleToggle(style.id)}
                  className={`group relative h-48 rounded-2xl overflow-hidden transition-all ${
                    selectedStyles.includes(style.id)
                      ? 'ring-4 ring-[var(--velour-gold)] scale-105'
                      : 'hover:scale-105'
                  }`}
                >
                  <img
                    src={style.image}
                    alt={style.label}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                  {/* Selection Check */}
                  {selectedStyles.includes(style.id) && (
                    <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[var(--velour-gold)] flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  )}

                  {/* Text */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h5 className="text-lg font-serif text-white mb-1">{style.label}</h5>
                    <p className="text-xs text-white/80">{style.desc}</p>
                  </div>
                </button>
              ))}
            </div>
            <p className="text-xs text-[var(--velour-text-soft)] text-center mt-4">
              Select one or more styles
            </p>
          </div>
        )}

        {/* Step 2: Color Preference */}
        {currentStep === STEPS.COLOR && (
          <div className="fade-in-up">
            <h4 className="text-xl font-serif text-[var(--velour-text)] mb-6 text-center">
              What colors speak to you?
            </h4>
            <div className="grid grid-cols-1 gap-4 max-w-md mx-auto">
              {colorOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSelectedColor(option.id)}
                  className={`relative p-6 rounded-2xl border-2 transition-all text-left ${
                    selectedColor === option.id
                      ? 'border-[var(--velour-gold)] bg-[var(--velour-gold)]/5 scale-105'
                      : 'border-[var(--border)] bg-white/40 hover:border-[var(--velour-gold)]/40 hover:scale-105'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-serif text-lg text-[var(--velour-text)]">
                      {option.label}
                    </span>
                    {selectedColor === option.id && (
                      <div className="w-6 h-6 rounded-full bg-[var(--velour-gold)] flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {option.colors.map((color, idx) => (
                      <div
                        key={idx}
                        className="w-10 h-10 rounded-full border-2 border-white shadow-md"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Budget Selection */}
        {currentStep === STEPS.BUDGET && (
          <div className="fade-in-up">
            <h4 className="text-xl font-serif text-[var(--velour-text)] mb-6 text-center">
              What's your ideal budget range?
            </h4>
            <div className="grid grid-cols-1 gap-3 max-w-md mx-auto">
              {budgetOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSelectedBudget(option.id)}
                  className={`relative p-5 rounded-2xl border-2 transition-all text-left ${
                    selectedBudget === option.id
                      ? 'border-[var(--velour-gold)] bg-[var(--velour-gold)]/5 scale-105'
                      : 'border-[var(--border)] bg-white/40 hover:border-[var(--velour-gold)]/40 hover:scale-105'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-serif text-lg text-[var(--velour-text)] mb-1">
                        {option.label}
                      </h5>
                      <p className="text-sm text-[var(--velour-text-soft)]">
                        {option.range}
                      </p>
                    </div>
                    {selectedBudget === option.id && (
                      <div className="w-6 h-6 rounded-full bg-[var(--velour-gold)] flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* AI Feedback Area */}
      {isProcessing && (
        <div className="mb-6 p-4 bg-[var(--velour-gold)]/10 rounded-xl border border-[var(--velour-gold)]/20 fade-in-up">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--velour-gold)] to-[var(--velour-gold-dark)] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white animate-pulse" />
            </div>
            <p className="text-[var(--velour-text)] font-medium">
              Got it, building your style profile...
            </p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleSkip}
          className="flex-1 px-6 py-3 bg-white/60 backdrop-blur-sm border border-[var(--border)] hover:bg-white rounded-full font-medium text-[var(--velour-text)] transition-all hover:scale-105 active:scale-95"
        >
          Skip
        </button>
        <button
          onClick={handleContinue}
          disabled={!canContinue()}
          className="flex-1 px-6 py-3 bg-gradient-to-br from-[var(--velour-gold)] to-[var(--velour-gold-dark)] text-white rounded-full font-medium shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
        >
          {currentStep === STEPS.BUDGET ? 'Complete' : 'Continue'}
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
