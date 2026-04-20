import { useState, useEffect } from 'react';
import { X, ChevronLeft, Sparkles, RefreshCw, ShoppingBag, Eye, Replace, AlertCircle } from 'lucide-react';
import { Product, filterProducts, generateOutfit, shuffleArray } from './ProductDatabase';

interface StyleSelection {
  occasion: string | null;
  styles: string[];
  budget: string | null;
  generatedOutfit: {
    top: Product | null;
    bottom: Product | null;
    shoes: Product | null;
    accessory: Product | null;
  };
}

interface AdvancedStylingFlowProps {
  onClose: () => void;
  onAddToCart?: (product: { id: string; name: string; price: number; image: string; category: string }) => void;
}

const occasions = [
  {
    id: 'wedding',
    label: 'Wedding',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop'
  },
  {
    id: 'party',
    label: 'Party',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&h=400&fit=crop'
  },
  {
    id: 'office',
    label: 'Office',
    image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600&h=400&fit=crop'
  },
  {
    id: 'casual',
    label: 'Casual',
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&h=400&fit=crop'
  }
];

const styleOptions = [
  { id: 'minimal', label: 'Minimal', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=300&h=200&fit=crop' },
  { id: 'bold', label: 'Bold', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300&h=200&fit=crop' },
  { id: 'elegant', label: 'Elegant', image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=300&h=200&fit=crop' },
  { id: 'casual', label: 'Casual', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=200&fit=crop' }
];

const budgetOptions = [
  { id: 'under3k', label: 'Under ₹3K', range: '₹500 - ₹3,000', maxPerItem: 3000 },
  { id: '3k-5k', label: '₹3K - ₹5K', range: '₹3,000 - ₹5,000', maxPerItem: 5000 },
  { id: '5k-10k', label: '₹5K - ₹10K', range: '₹5,000 - ₹10,000', maxPerItem: 10000 },
  { id: 'premium', label: 'Premium', range: '₹10,000+', maxPerItem: 50000 }
];

// Gender will be randomly selected or can be made a step
const GENDER: 'female' | 'male' = 'female'; // Can be made dynamic later

export function AdvancedStylingFlow({ onClose, onAddToCart }: AdvancedStylingFlowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selection, setSelection] = useState<StyleSelection>({
    occasion: null,
    styles: [],
    budget: null,
    generatedOutfit: {
      top: null,
      bottom: null,
      shoes: null,
      accessory: null
    }
  });
  const [chatHistory, setChatHistory] = useState<Array<{ type: 'user' | 'ai'; message: string }>>([
    { type: 'ai', message: 'Welcome! Let\'s create your perfect look. First, what\'s the occasion?' }
  ]);
  const [replacingItem, setReplacingItem] = useState<string | null>(null);

  const stepTitles = [
    'Select Occasion',
    'Choose Your Style',
    'Set Your Budget',
    'Creating Your Look',
    'Your Perfect Outfit'
  ];

  const handleNext = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentStep(prev => prev + 1);
      setIsTransitioning(false);
    }, 300);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep(prev => prev - 1);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const handleOccasionSelect = (occasionId: string) => {
    const occasion = occasions.find(o => o.id === occasionId);
    setSelection(prev => ({ ...prev, occasion: occasionId }));
    setChatHistory(prev => [...prev,
      { type: 'user', message: `I'm dressing for a ${occasion?.label}` },
      { type: 'ai', message: `Great choice! Now, what style speaks to you?` }
    ]);
    handleNext();
  };

  const handleStyleToggle = (styleId: string) => {
    setSelection(prev => ({
      ...prev,
      styles: prev.styles.includes(styleId)
        ? prev.styles.filter(s => s !== styleId)
        : [...prev.styles, styleId]
    }));
  };

  const handleStyleContinue = () => {
    const styleLabels = selection.styles.map(s => styleOptions.find(opt => opt.id === s)?.label).join(', ');
    setChatHistory(prev => [...prev,
      { type: 'user', message: `I prefer ${styleLabels} style` },
      { type: 'ai', message: `Perfect! What's your budget for this look?` }
    ]);
    handleNext();
  };

  const handleBudgetSelect = (budgetId: string) => {
    const budget = budgetOptions.find(b => b.id === budgetId);
    setSelection(prev => ({ ...prev, budget: budgetId }));
    setChatHistory(prev => [...prev,
      { type: 'user', message: `My budget is ${budget?.range}` },
      { type: 'ai', message: `Excellent! Let me curate the perfect outfit for you...` }
    ]);
    handleNext();

    // Simulate AI processing — pass values directly to avoid stale closure
    const currentOccasion = selection.occasion;
    setTimeout(() => {
      generateOutfitFromFilters(budgetId, currentOccasion);
    }, 2000);
  };

  const generateOutfitFromFilters = (budgetId?: string, occasionId?: string) => {
    const activeBudget = budgetId || selection.budget;
    const activeOccasion = occasionId !== undefined ? occasionId : selection.occasion;

    if (!activeOccasion || !activeBudget) return;

    const budgetOption = budgetOptions.find(b => b.id === activeBudget);
    if (!budgetOption) return;

    const occasionsList = [activeOccasion];
    const styles = selection.styles;
    const maxBudget = budgetOption.maxPerItem;

    const outfit = generateOutfit(occasionsList, styles, maxBudget, GENDER);

    // Check if we have a complete outfit
    const itemCount = [outfit.top, outfit.bottom, outfit.shoes, outfit.accessory].filter(Boolean).length;

    setSelection(prev => ({ ...prev, generatedOutfit: outfit }));

    if (itemCount === 4) {
      setChatHistory(prev => [...prev,
        { type: 'ai', message: `Perfect! I found ${itemCount} matching items for your ${activeOccasion} look.` }
      ]);
    } else {
      setChatHistory(prev => [...prev,
        { type: 'ai', message: `I found ${itemCount} items. Some categories had limited options for your filters, but here's what matches best!` }
      ]);
    }

    handleNext();
  };

  const getTotalPrice = () => {
    const { top, bottom, shoes, accessory } = selection.generatedOutfit;
    return (top?.price || 0) + (bottom?.price || 0) + (shoes?.price || 0) + (accessory?.price || 0);
  };

  const handleReset = () => {
    setCurrentStep(1);
    setSelection({
      occasion: null,
      styles: [],
      budget: null,
      generatedOutfit: {
        top: null,
        bottom: null,
        shoes: null,
        accessory: null
      }
    });
    setReplacingItem(null);
    setChatHistory([
      { type: 'ai', message: 'Welcome back! Let\'s create another perfect look. What\'s the occasion?' }
    ]);
  };

  const handleRegenerate = () => {
    setCurrentStep(4);
    setChatHistory(prev => [...prev,
      { type: 'user', message: 'Show me different options' },
      { type: 'ai', message: 'Finding new combinations for you...' }
    ]);

    // Simulate AI processing
    setTimeout(() => {
      generateOutfitFromFilters();
    }, 2000);
  };

  const handleReplaceItem = (category: 'top' | 'bottom' | 'shoes' | 'accessory') => {
    if (!selection.occasion || !selection.budget) return [];

    const budgetOption = budgetOptions.find(b => b.id === selection.budget);
    if (!budgetOption) return [];

    const currentItem = selection.generatedOutfit[category];
    const excludeIds = currentItem ? [currentItem.id] : [];

    // Get alternatives for this category
    const alternatives = filterProducts(
      category,
      [selection.occasion],
      selection.styles,
      budgetOption.maxPerItem,
      GENDER,
      excludeIds
    );

    return shuffleArray(alternatives).slice(0, 3);
  };

  const handleSelectAlternative = (category: 'top' | 'bottom' | 'shoes' | 'accessory', product: Product) => {
    setSelection(prev => ({
      ...prev,
      generatedOutfit: {
        ...prev.generatedOutfit,
        [category]: product
      }
    }));
    setReplacingItem(null);
  };

  // Step 1: Occasion Selection
  const renderOccasionSelection = () => (
    <div className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-serif text-[#2C2C2C] mb-2">What's the Occasion?</h2>
        <p className="text-[#7A7A7A]">Choose the event you're dressing for</p>
      </div>
      <div className="grid grid-cols-2 gap-6 max-w-4xl mx-auto">
        {occasions.map((occasion) => (
          <button
            key={occasion.id}
            onClick={() => handleOccasionSelect(occasion.id)}
            className="group relative h-64 rounded-2xl overflow-hidden hover:scale-105 hover:shadow-2xl transition-all duration-300"
          >
            <img
              src={occasion.image}
              alt={occasion.label}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute inset-0 bg-[#D4AF37]/0 group-hover:bg-[#D4AF37]/10 transition-all duration-300" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className="text-2xl font-serif text-white">{occasion.label}</h3>
            </div>
            <div className="absolute inset-0 border-4 border-transparent group-hover:border-[#D4AF37] rounded-2xl transition-all duration-300" />
          </button>
        ))}
      </div>
    </div>
  );

  // Step 2: Style Selection
  const renderStyleSelection = () => (
    <div className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-serif text-[#2C2C2C] mb-2">Choose Your Style</h2>
        <p className="text-[#7A7A7A]">Select one or more styles that match your personality</p>
      </div>
      <div className="grid grid-cols-4 gap-4 max-w-5xl mx-auto mb-8">
        {styleOptions.map((style) => {
          const isSelected = selection.styles.includes(style.id);
          return (
            <button
              key={style.id}
              onClick={() => handleStyleToggle(style.id)}
              className={`relative h-48 rounded-2xl overflow-hidden transition-all duration-300 ${
                isSelected
                  ? 'scale-105 shadow-2xl ring-4 ring-[#D4AF37]'
                  : 'hover:scale-105 hover:shadow-xl'
              }`}
            >
              <img
                src={style.image}
                alt={style.label}
                className="w-full h-full object-cover"
              />
              <div className={`absolute inset-0 ${isSelected ? 'bg-[#D4AF37]/20' : 'bg-black/40'} transition-all`} />
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-xl font-serif text-white">{style.label}</h3>
              </div>
              {isSelected && (
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center shadow-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
              )}
            </button>
          );
        })}
      </div>
      {selection.styles.length > 0 && (
        <div className="text-center fade-in-up">
          <button
            onClick={handleStyleContinue}
            className="px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#C9A961] text-white rounded-full font-medium text-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            Continue to Budget
          </button>
        </div>
      )}
    </div>
  );

  // Step 3: Budget Selection
  const renderBudgetSelection = () => (
    <div className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-serif text-[#2C2C2C] mb-2">Set Your Budget</h2>
        <p className="text-[#7A7A7A]">Choose your preferred price range</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
        {budgetOptions.map((budget) => (
          <button
            key={budget.id}
            onClick={() => handleBudgetSelect(budget.id)}
            className="group p-8 bg-white rounded-2xl border-2 border-[#E5E5E5] hover:border-[#D4AF37] hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            <div className="text-center">
              <h3 className="text-xl font-serif text-[#2C2C2C] mb-2 group-hover:text-[#D4AF37] transition-colors">
                {budget.label}
              </h3>
              <p className="text-sm text-[#7A7A7A]">{budget.range}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  // Step 4: AI Processing
  const renderProcessing = () => (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#C9A961] mb-6 animate-pulse">
        <Sparkles className="w-10 h-10 text-white" />
      </div>
      <h2 className="text-3xl font-serif text-[#2C2C2C] mb-4">Creating Your Perfect Look</h2>
      <p className="text-[#7A7A7A] mb-8">Our AI is curating items just for you...</p>

      <div className="grid grid-cols-4 gap-4 max-w-4xl mx-auto">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-lg">
            <div className="w-full h-64 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse shimmer" />
            <div className="p-4">
              <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse" />
              <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Step 5: Final Outfit
  const renderFinalOutfit = () => {
    const { top, bottom, shoes, accessory } = selection.generatedOutfit;
    const outfitItems = [
      { category: 'top' as const, label: 'Top', product: top },
      { category: 'bottom' as const, label: 'Bottom', product: bottom },
      { category: 'shoes' as const, label: 'Shoes', product: shoes },
      { category: 'accessory' as const, label: 'Accessory', product: accessory }
    ];

    const occasionLabel = occasions.find(o => o.id === selection.occasion)?.label || '';
    const budgetLabel = budgetOptions.find(b => b.id === selection.budget)?.label || '';
    const styleLabels = selection.styles.map(s => styleOptions.find(opt => opt.id === s)?.label).filter(Boolean);

    const hasCompleteOutfit = outfitItems.every(item => item.product !== null);

    return (
      <div className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
        {/* Header */}
        <div className="text-center mb-6 fade-in-up">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#C9A961] mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-serif text-[#2C2C2C] mb-2">Your Personalized Outfit</h2>
          <p className="text-[#7A7A7A] mb-4">Based on your selections</p>

          {/* Filter Chips - CRITICAL: Shows active filters */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <span className="text-sm text-[#7A7A7A]">Showing results for:</span>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full">
              <span className="text-sm font-medium text-[#D4AF37]">{occasionLabel}</span>
            </div>
            {styleLabels.map((style, i) => (
              <div key={i} className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full">
                <span className="text-sm font-medium text-[#D4AF37]">{style}</span>
              </div>
            ))}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full">
              <span className="text-sm font-medium text-[#D4AF37]">{budgetLabel}</span>
            </div>
          </div>
        </div>

        {/* Empty State Warning */}
        {!hasCompleteOutfit && (
          <div className="max-w-2xl mx-auto mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-900 mb-1">Limited Options Available</p>
              <p className="text-xs text-amber-700">
                Some categories have limited products matching all your filters. Showing best available matches.
              </p>
            </div>
          </div>
        )}

        {/* Outfit Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto mb-8">
          {outfitItems.map(({ category, label, product }, index) => (
            <div
              key={category}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {product ? (
                <>
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-80 object-cover hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 px-3 py-1 bg-[#D4AF37] text-white text-xs rounded-full font-medium">
                      {label}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-[#2C2C2C] mb-1 text-sm">{product.name}</h3>
                    <p className="text-lg font-serif text-[#D4AF37] mb-3">₹{product.price.toLocaleString('en-IN')}</p>
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      <button
                        onClick={() => setReplacingItem(replacingItem === category ? null : category)}
                        className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all text-xs flex items-center justify-center gap-1"
                        title="Replace"
                      >
                        <Replace className="w-3 h-3" />
                      </button>
                      <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all text-xs flex items-center justify-center gap-1" title="View">
                        <Eye className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => {
                          if (onAddToCart && product) {
                            onAddToCart({
                              id: product.id,
                              name: product.name,
                              price: product.price,
                              image: product.image,
                              category: product.category
                            });
                          }
                        }}
                        className="p-2 bg-[#D4AF37] hover:bg-[#C9A961] text-white rounded-lg transition-all text-xs flex items-center justify-center gap-1"
                        title="Add"
                      >
                        <ShoppingBag className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Replace Alternatives */}
                    {replacingItem === category && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-[#7A7A7A] mb-2 font-medium">Similar items:</p>
                        <div className="flex gap-2 overflow-x-auto pb-2">
                          {handleReplaceItem(category).map((alt) => (
                            <button
                              key={alt.id}
                              onClick={() => handleSelectAlternative(category, alt)}
                              className="group flex-shrink-0 w-20 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-[#D4AF37] transition-all"
                              title={`${alt.name} - ₹${alt.price.toLocaleString('en-IN')}`}
                            >
                              <img src={alt.image} alt={alt.name} className="w-full h-20 object-cover group-hover:scale-110 transition-transform" />
                              <div className="p-1 bg-white">
                                <p className="text-[10px] text-[#7A7A7A] truncate">₹{(alt.price / 1000).toFixed(1)}K</p>
                              </div>
                            </button>
                          ))}
                          {handleReplaceItem(category).length === 0 && (
                            <p className="text-xs text-[#7A7A7A] py-2">No alternatives available</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="p-4 h-full flex flex-col items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-gray-300 mb-2" />
                  <p className="text-sm text-[#7A7A7A] text-center">No {label.toLowerCase()} found matching your filters</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Total & Actions */}
        <div className="max-w-6xl mx-auto">
          {getTotalPrice() > 0 && (
            <div className="bg-gradient-to-r from-[#D4AF37]/20 to-[#C9A961]/20 rounded-2xl p-6 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-xl font-serif text-[#2C2C2C]">Complete Outfit Total</span>
                <span className="text-3xl font-serif font-semibold text-[#D4AF37]">
                  ₹{getTotalPrice().toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          )}
          <div className="flex gap-4">
            <button
              onClick={handleReset}
              className="flex-1 px-6 py-4 bg-white border-2 border-[#D4AF37] text-[#D4AF37] rounded-full font-medium hover:bg-[#D4AF37] hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Start Over
            </button>
            <button
              onClick={handleRegenerate}
              className="flex-1 px-6 py-4 bg-gray-100 text-[#2C2C2C] rounded-full font-medium hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Regenerate Outfit
            </button>
            {getTotalPrice() > 0 && (
              <button
                onClick={() => {
                  if (onAddToCart) {
                    const { top, bottom, shoes, accessory } = selection.generatedOutfit;
                    [top, bottom, shoes, accessory].forEach(item => {
                      if (item) {
                        onAddToCart({
                          id: item.id,
                          name: item.name,
                          price: item.price,
                          image: item.image,
                          category: item.category
                        });
                      }
                    });
                  }
                }}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-[#D4AF37] to-[#C9A961] text-white rounded-full font-medium hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" />
                Add Full Outfit to Cart
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-[#F8F5F0] z-50 overflow-hidden flex">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-[#D4AF37] px-6 py-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className="p-2 hover:bg-gray-100 rounded-full transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-6 h-6 text-[#2C2C2C]" />
            </button>
            <h1 className="text-2xl font-serif text-[#2C2C2C]">{stepTitles[currentStep - 1]}</h1>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-all"
            >
              <X className="w-6 h-6 text-[#2C2C2C]" />
            </button>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="bg-white px-6 py-4 border-b border-gray-200">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              {[1, 2, 3, 4, 5].map((step) => (
                <div key={step} className="flex items-center flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all ${
                    step < currentStep
                      ? 'bg-[#D4AF37] text-white'
                      : step === currentStep
                      ? 'bg-[#D4AF37] text-white ring-4 ring-[#D4AF37]/20'
                      : 'bg-gray-200 text-gray-400'
                  }`}>
                    {step}
                  </div>
                  {step < 5 && (
                    <div className={`flex-1 h-1 mx-2 rounded transition-all ${
                      step < currentStep ? 'bg-[#D4AF37]' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-6 py-8">
          <div className="max-w-7xl mx-auto">
            {currentStep === 1 && renderOccasionSelection()}
            {currentStep === 2 && renderStyleSelection()}
            {currentStep === 3 && renderBudgetSelection()}
            {currentStep === 4 && renderProcessing()}
            {currentStep === 5 && renderFinalOutfit()}
          </div>
        </div>
      </div>

      {/* Chat Memory Panel */}
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-serif text-lg text-[#2C2C2C]">Conversation</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {chatHistory.map((chat, index) => (
            <div
              key={index}
              className={`p-3 rounded-2xl ${
                chat.type === 'ai'
                  ? 'bg-[#D4AF37]/10 text-[#2C2C2C]'
                  : 'bg-gray-100 text-[#2C2C2C] ml-8'
              }`}
            >
              <p className="text-sm">{chat.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
