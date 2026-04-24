import { useState } from 'react';
import { Check, Sparkles, ChevronRight, RefreshCw, ShoppingBag, User, UserCircle2, Palette, Coins } from 'lucide-react';
import { buildOutfit } from '../../api';

interface OutfitItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  gender: 'male' | 'female';
  color: string;
}

const productCatalog: OutfitItem[] = [
  { id: 'f_top_1', name: 'Ivory Silk Blouse', price: 28990, image: 'https://images.unsplash.com/photo-1564859228273-274232fdb516?w=400&h=600&fit=crop', category: 'Top', gender: 'female', color: 'neutral' },
  { id: 'f_top_2', name: 'Black Satin Shirt', price: 32990, image: 'https://images.unsplash.com/photo-1581338834647-b0fb40704e21?w=400&h=600&fit=crop', category: 'Top', gender: 'female', color: 'dark' },
  { id: 'f_top_3', name: 'Blush Pink Top', price: 24990, image: 'https://images.unsplash.com/photo-1564859227995-d0e8e5baf5b6?w=400&h=600&fit=crop', category: 'Top', gender: 'female', color: 'pastel' },
  { id: 'f_top_4', name: 'Emerald Green Blouse', price: 35990, image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&h=600&fit=crop', category: 'Top', gender: 'female', color: 'vibrant' },
  { id: 'f_bottom_1', name: 'Beige Wide Pants', price: 34990, image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=600&fit=crop', category: 'Bottom', gender: 'female', color: 'neutral' },
  { id: 'f_bottom_2', name: 'Black Pencil Skirt', price: 29990, image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400&h=600&fit=crop', category: 'Bottom', gender: 'female', color: 'dark' },
  { id: 'f_bottom_3', name: 'Lavender Midi Skirt', price: 31990, image: 'https://images.unsplash.com/photo-1560243563-062bfc001d68?w=400&h=600&fit=crop', category: 'Bottom', gender: 'female', color: 'pastel' },
  { id: 'f_bottom_4', name: 'Red Palazzo Pants', price: 38990, image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=600&fit=crop', category: 'Bottom', gender: 'female', color: 'vibrant' },
  { id: 'f_shoes_1', name: 'Nude Pumps', price: 42990, image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=600&fit=crop', category: 'Shoes', gender: 'female', color: 'neutral' },
  { id: 'f_shoes_2', name: 'Black Stilettos', price: 48990, image: 'https://images.unsplash.com/photo-1596702656356-baec4feee61a?w=400&h=600&fit=crop', category: 'Shoes', gender: 'female', color: 'dark' },
  { id: 'f_shoes_3', name: 'Baby Pink Heels', price: 39990, image: 'https://images.unsplash.com/photo-1562183241-b937e95585b6?w=400&h=600&fit=crop', category: 'Shoes', gender: 'female', color: 'pastel' },
  { id: 'f_shoes_4', name: 'Red Velvet Pumps', price: 52990, image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=600&fit=crop', category: 'Shoes', gender: 'female', color: 'vibrant' },
  { id: 'f_acc_1', name: 'Pearl Necklace', price: 68990, image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=600&fit=crop', category: 'Accessories', gender: 'female', color: 'neutral' },
  { id: 'f_acc_2', name: 'Diamond Earrings', price: 125990, image: 'https://images.unsplash.com/photo-1535556116002-6281ff3e9f36?w=400&h=600&fit=crop', category: 'Accessories', gender: 'female', color: 'dark' },
  { id: 'f_acc_3', name: 'Rose Gold Bracelet', price: 78990, image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=600&fit=crop', category: 'Accessories', gender: 'female', color: 'pastel' },
  { id: 'f_acc_4', name: 'Emerald Ring', price: 145990, image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=600&fit=crop', category: 'Accessories', gender: 'female', color: 'vibrant' },
  { id: 'f_watch_1', name: 'Gold Classic Watch', price: 185990, image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&h=600&fit=crop', category: 'Watch', gender: 'female', color: 'neutral' },
  { id: 'f_watch_2', name: 'Black Ceramic Watch', price: 225990, image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=600&fit=crop', category: 'Watch', gender: 'female', color: 'dark' },
  { id: 'f_watch_3', name: 'Rose Gold Watch', price: 195990, image: 'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=400&h=600&fit=crop', category: 'Watch', gender: 'female', color: 'pastel' },
  { id: 'f_watch_4', name: 'Ruby Accent Watch', price: 285990, image: 'https://images.unsplash.com/photo-1594534475470-f3da6f015a31?w=400&h=600&fit=crop', category: 'Watch', gender: 'female', color: 'vibrant' },
  { id: 'f_perf_1', name: 'Vanilla Musk', price: 28990, image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&h=600&fit=crop', category: 'Perfume', gender: 'female', color: 'neutral' },
  { id: 'f_perf_2', name: 'Black Orchid', price: 35990, image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=600&fit=crop', category: 'Perfume', gender: 'female', color: 'dark' },
  { id: 'f_perf_3', name: 'Rose Garden', price: 32990, image: 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=400&h=600&fit=crop', category: 'Perfume', gender: 'female', color: 'pastel' },
  { id: 'f_perf_4', name: 'Citrus Bloom', price: 38990, image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59d75?w=400&h=600&fit=crop', category: 'Perfume', gender: 'female', color: 'vibrant' },
  { id: 'm_top_1', name: 'White Oxford Shirt', price: 24990, image: 'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=400&h=600&fit=crop', category: 'Top', gender: 'male', color: 'neutral' },
  { id: 'm_top_2', name: 'Black Dress Shirt', price: 28990, image: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=400&h=600&fit=crop', category: 'Top', gender: 'male', color: 'dark' },
  { id: 'm_top_3', name: 'Light Blue Shirt', price: 26990, image: 'https://images.unsplash.com/photo-1602810318660-d9f5a796d818?w=400&h=600&fit=crop', category: 'Top', gender: 'male', color: 'pastel' },
  { id: 'm_top_4', name: 'Burgundy Shirt', price: 32990, image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=600&fit=crop', category: 'Top', gender: 'male', color: 'vibrant' },
  { id: 'm_bottom_1', name: 'Khaki Chinos', price: 32990, image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=600&fit=crop', category: 'Bottom', gender: 'male', color: 'neutral' },
  { id: 'm_bottom_2', name: 'Black Trousers', price: 36990, image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=600&fit=crop', category: 'Bottom', gender: 'male', color: 'dark' },
  { id: 'm_bottom_3', name: 'Light Grey Pants', price: 34990, image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400&h=600&fit=crop', category: 'Bottom', gender: 'male', color: 'pastel' },
  { id: 'm_bottom_4', name: 'Navy Blue Pants', price: 38990, image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=600&fit=crop', category: 'Bottom', gender: 'male', color: 'vibrant' },
  { id: 'm_shoes_1', name: 'Tan Leather Brogues', price: 48990, image: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=400&h=600&fit=crop', category: 'Shoes', gender: 'male', color: 'neutral' },
  { id: 'm_shoes_2', name: 'Black Oxfords', price: 52990, image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=400&h=600&fit=crop', category: 'Shoes', gender: 'male', color: 'dark' },
  { id: 'm_shoes_3', name: 'Grey Suede Loafers', price: 45990, image: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400&h=600&fit=crop', category: 'Shoes', gender: 'male', color: 'pastel' },
  { id: 'm_shoes_4', name: 'Brown Derby Shoes', price: 54990, image: 'https://images.unsplash.com/photo-1582897085656-c636d006a246?w=400&h=600&fit=crop', category: 'Shoes', gender: 'male', color: 'vibrant' },
  { id: 'm_acc_1', name: 'Leather Belt', price: 18990, image: 'https://images.unsplash.com/photo-1624222247344-550fb60583b2?w=400&h=600&fit=crop', category: 'Accessories', gender: 'male', color: 'neutral' },
  { id: 'm_acc_2', name: 'Black Tie & Cufflinks', price: 24990, image: 'https://images.unsplash.com/photo-1603252109333-318c8b2e13c4?w=400&h=600&fit=crop', category: 'Accessories', gender: 'male', color: 'dark' },
  { id: 'm_acc_3', name: 'Silver Tie Clip', price: 22990, image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=400&h=600&fit=crop', category: 'Accessories', gender: 'male', color: 'pastel' },
  { id: 'm_acc_4', name: 'Burgundy Pocket Square', price: 12990, image: 'https://images.unsplash.com/photo-1602810319428-019690571b5b?w=400&h=600&fit=crop', category: 'Accessories', gender: 'male', color: 'vibrant' },
  { id: 'm_watch_1', name: 'Silver Chronograph', price: 225990, image: 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=400&h=600&fit=crop', category: 'Watch', gender: 'male', color: 'neutral' },
  { id: 'm_watch_2', name: 'Black Dive Watch', price: 285990, image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=600&fit=crop', category: 'Watch', gender: 'male', color: 'dark' },
  { id: 'm_watch_3', name: 'Blue Dial Watch', price: 245990, image: 'https://images.unsplash.com/photo-1622434641406-a158123450f9?w=400&h=600&fit=crop', category: 'Watch', gender: 'male', color: 'pastel' },
  { id: 'm_watch_4', name: 'Gold Automatic Watch', price: 325990, image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&h=600&fit=crop', category: 'Watch', gender: 'male', color: 'vibrant' },
  { id: 'm_perf_1', name: 'Sandalwood Essence', price: 32990, image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=600&fit=crop', category: 'Perfume', gender: 'male', color: 'neutral' },
  { id: 'm_perf_2', name: 'Noir Intense', price: 42990, image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=600&fit=crop', category: 'Perfume', gender: 'male', color: 'dark' },
  { id: 'm_perf_3', name: 'Ocean Breeze', price: 36990, image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&h=600&fit=crop', category: 'Perfume', gender: 'male', color: 'pastel' },
  { id: 'm_perf_4', name: 'Spice & Wood', price: 45990, image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59d75?w=400&h=600&fit=crop', category: 'Perfume', gender: 'male', color: 'vibrant' },
];

const categories = [
  { id: 'top', label: 'Top', required: true, icon: '👔' },
  { id: 'bottom', label: 'Bottom', required: true, icon: '👖' },
  { id: 'shoes', label: 'Shoes', required: true, icon: '👞' },
  { id: 'accessories', label: 'Accessories', required: false, icon: '💍' },
  { id: 'watch', label: 'Watch', required: false, icon: '⌚' },
  { id: 'perfume', label: 'Perfume', required: false, icon: '🌸' }
];

const colorPalettes = [
  { id: 'neutral', label: 'Neutral Tones', colors: ['#F5F5DC', '#D3C5B0', '#C8B8A0'] },
  { id: 'dark', label: 'Dark & Bold', colors: ['#2C2C2C', '#1A1A1A', '#3D3D3D'] },
  { id: 'pastel', label: 'Soft Pastels', colors: ['#FFE4E1', '#E6E6FA', '#F0E68C'] },
  { id: 'vibrant', label: 'Rich & Vibrant', colors: ['#8B0000', '#006400', '#00008B'] }
];

const OUTFIT_CREATION_COST = 50;

interface OutfitBuilderProps {
  onCoinsUpdate?: (change: number) => void;
  onAddToCart?: (product: { id: string; name: string; price: number; image: string; category: string }) => void;
}

export function OutfitBuilder({ onCoinsUpdate, onAddToCart }: OutfitBuilderProps = {}) {
  const [step, setStep] = useState<'gender' | 'categories' | 'colors' | 'result'>('gender');
  const [gender, setGender] = useState<'male' | 'female' | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [colorPreferences, setColorPreferences] = useState<Record<string, string>>({});
  const [recommendedOutfit, setRecommendedOutfit] = useState<OutfitItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenderSelect = (selectedGender: 'male' | 'female') => {
    setGender(selectedGender);
    setStep('categories');
  };

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId) ? prev.filter(id => id !== categoryId) : [...prev, categoryId]
    );
  };

  const requiredCategories = categories.filter(c => c.required).map(c => c.id);
  const hasRequiredCategories = requiredCategories.every(cat => selectedCategories.includes(cat));

  const handleProceedToColors = () => {
    if (hasRequiredCategories) setStep('colors');
  };

  const handleColorSelect = (category: string, colorId: string) => {
    setColorPreferences(prev => ({ ...prev, [category]: colorId }));
  };

  const handleGenerateOutfit = async () => {
    if (!gender) return;
    setIsGenerating(true);

    try {
      const userId = localStorage.getItem('daizzy_user_id') || 'guest';
      const hasWedding = selectedCategories.includes('accessories');
      const occasion = hasWedding ? 'wedding' : 'casual';
      const dominantColor = Object.values(colorPreferences)[0] || 'neutral';
      const styleMap: Record<string, string> = {
        neutral: 'minimal', dark: 'bold', pastel: 'elegant', vibrant: 'trendy'
      };
      const style = styleMap[dominantColor] || 'elegant';

      const result = await buildOutfit({
        user_id: userId,
        occasion,
        gender,
        style
      });

      if (result.success && result.outfit.items && Object.keys(result.outfit.items).length > 0) {
        const backendOutfit: OutfitItem[] = Object.values(result.outfit.items).map((item: any) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          category: item.category,
          gender: gender,
          color: dominantColor
        }));
        setRecommendedOutfit(backendOutfit);
      } else {
        // Fallback to local logic
        const outfit = selectedCategories.map(categoryId => {
          const categoryLabel = categories.find(c => c.id === categoryId)?.label;
          const preferredColor = colorPreferences[categoryId];
          return productCatalog.find(p => p.category === categoryLabel && p.gender === gender && p.color === preferredColor);
        }).filter(Boolean) as OutfitItem[];
        setRecommendedOutfit(outfit);
      }
    } catch (error) {
      // Fallback to local logic
      const outfit = selectedCategories.map(categoryId => {
        const categoryLabel = categories.find(c => c.id === categoryId)?.label;
        const preferredColor = colorPreferences[categoryId];
        return productCatalog.find(p => p.category === categoryLabel && p.gender === gender && p.color === preferredColor);
      }).filter(Boolean) as OutfitItem[];
      setRecommendedOutfit(outfit);
    }

    // Save outfit to backend
try {
  const userId = localStorage.getItem('daizzy_user_id') || 'guest';
  const hasWedding = selectedCategories.includes('accessories');
  const occasion = hasWedding ? 'wedding' : 'casual';
  const itemsToSave = selectedCategories.map(categoryId => {
    const categoryLabel = categories.find(c => c.id === categoryId)?.label;
    const preferredColor = colorPreferences[categoryId];
    return productCatalog.find(p => p.category === categoryLabel && p.gender === gender && p.color === preferredColor);
  }).filter(Boolean) as OutfitItem[];
  await fetch('http://localhost:8001/outfit/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id: userId,
      name: `${gender === 'female' ? 'Women' : 'Men'} ${occasion} Outfit`,
      occasion: occasion,
      items: itemsToSave.map(item => item.id)
    })
  });
} catch (error) {
  console.error('Save outfit error:', error);
}

setStep('result');
onCoinsUpdate?.(-OUTFIT_CREATION_COST);
setIsGenerating(false);
  };

  const getTotalPrice = () => recommendedOutfit.reduce((total, item) => total + item.price, 0);

  const handleReset = () => {
    setStep('gender');
    setGender(null);
    setSelectedCategories([]);
    setColorPreferences({});
    setRecommendedOutfit([]);
  };

  const handleAddAllToCart = () => {
    if (onAddToCart && recommendedOutfit.length > 0) {
      recommendedOutfit.forEach(item => {
        onAddToCart({ id: item.id, name: item.name, price: item.price, image: item.image, category: item.category });
      });
    }
  };

  const allColorsSelected = selectedCategories.every(cat => colorPreferences[cat]);

  if (step === 'gender') {
    return (
      <div className="bg-gradient-to-br from-white/80 to-[var(--velour-cream)]/80 backdrop-blur-sm rounded-2xl p-8 border border-[var(--border)] fade-in-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[var(--velour-gold)] to-[var(--velour-gold-dark)] mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-serif text-[var(--velour-text)] mb-2">Build Your Perfect Outfit</h3>
          <p className="text-[var(--velour-text-soft)] mb-1">AI-curated luxury styling</p>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--velour-gold)]/10 rounded-full mt-2">
            <Coins className="w-4 h-4 text-[var(--velour-gold)]" />
            <span className="text-xs text-[var(--velour-text)]">Costs {OUTFIT_CREATION_COST} Velour Coins</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          <button onClick={() => handleGenderSelect('female')} className="group p-8 bg-white/60 backdrop-blur-sm border border-[var(--border)] rounded-2xl hover:border-[var(--velour-gold)]/40 hover:-translate-y-2 hover:shadow-xl transition-all">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-pink-200 to-pink-100 flex items-center justify-center group-hover:scale-110 transition-transform">
              <UserCircle2 className="w-8 h-8 text-pink-600" />
            </div>
            <h4 className="text-xl font-serif text-[var(--velour-text)] mb-1">Women</h4>
            <p className="text-xs text-[var(--velour-text-soft)]">Shop Women's Collection</p>
          </button>
          <button onClick={() => handleGenderSelect('male')} className="group p-8 bg-white/60 backdrop-blur-sm border border-[var(--border)] rounded-2xl hover:border-[var(--velour-gold)]/40 hover:-translate-y-2 hover:shadow-xl transition-all">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-200 to-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform">
              <UserCircle2 className="w-8 h-8 text-blue-600" />
            </div>
            <h4 className="text-xl font-serif text-[var(--velour-text)] mb-1">Men</h4>
            <p className="text-xs text-[var(--velour-text-soft)]">Shop Men's Collection</p>
          </button>
        </div>
      </div>
    );
  }

  if (step === 'categories') {
    return (
      <div className="bg-gradient-to-br from-white/80 to-[var(--velour-cream)]/80 backdrop-blur-sm rounded-2xl p-6 border border-[var(--border)]">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-serif text-[var(--velour-text)]">Select Outfit Categories</h3>
            <button onClick={handleReset} className="text-xs text-[var(--velour-gold)] hover:underline">Change Gender</button>
          </div>
          <p className="text-sm text-[var(--velour-text-soft)]">Choose what you need for your outfit</p>
          <p className="text-xs text-[var(--velour-gold)] mt-1">* Required • Others are optional</p>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {categories.map((category) => {
            const isSelected = selectedCategories.includes(category.id);
            return (
              <button key={category.id} onClick={() => handleCategoryToggle(category.id)}
                className={`p-6 rounded-2xl border-2 transition-all ${isSelected ? 'border-[var(--velour-gold)] bg-[var(--velour-gold)]/5 scale-105' : 'border-[var(--border)] bg-white/40 hover:border-[var(--velour-gold)]/40 hover:scale-105'}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-3xl">{category.icon}</div>
                  {isSelected && (<div className="w-6 h-6 rounded-full bg-[var(--velour-gold)] flex items-center justify-center"><Check className="w-4 h-4 text-white" /></div>)}
                </div>
                <h4 className="font-serif text-lg text-[var(--velour-text)] text-left">
                  {category.label}
                  {category.required ? <span className="text-[var(--velour-gold)] ml-1">*</span> : <span className="text-xs text-[var(--velour-text-soft)] ml-2">(optional)</span>}
                </h4>
              </button>
            );
          })}
        </div>
        <button onClick={handleProceedToColors} disabled={!hasRequiredCategories}
          className="w-full px-6 py-4 bg-gradient-to-br from-[var(--velour-gold)] to-[var(--velour-gold-dark)] text-white rounded-full font-medium hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
          <Palette className="w-5 h-5" />Choose Color Preferences<ChevronRight className="w-5 h-5" />
        </button>
        {!hasRequiredCategories && (<p className="text-xs text-center text-[var(--velour-gold)] mt-3">Please select Top, Bottom, and Shoes to continue</p>)}
      </div>
    );
  }

  if (step === 'colors') {
    return (
      <div className="bg-gradient-to-br from-white/80 to-[var(--velour-cream)]/80 backdrop-blur-sm rounded-2xl p-6 border border-[var(--border)]">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-serif text-[var(--velour-text)]">Choose Color Palettes</h3>
            <button onClick={() => setStep('categories')} className="text-xs text-[var(--velour-gold)] hover:underline">Edit Categories</button>
          </div>
          <p className="text-sm text-[var(--velour-text-soft)]">Select your preferred color scheme for each category</p>
        </div>
        <div className="space-y-6 mb-6">
          {selectedCategories.map((catId) => {
            const category = categories.find(c => c.id === catId);
            return (
              <div key={catId}>
                <h4 className="font-medium text-[var(--velour-text)] mb-3 flex items-center gap-2">
                  <span className="text-xl">{category?.icon}</span>{category?.label}
                  {colorPreferences[catId] && (<Check className="w-4 h-4 text-[var(--velour-gold)]" />)}
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {colorPalettes.map((palette) => {
                    const isSelected = colorPreferences[catId] === palette.id;
                    return (
                      <button key={palette.id} onClick={() => handleColorSelect(catId, palette.id)}
                        className={`p-4 rounded-xl border-2 transition-all ${isSelected ? 'border-[var(--velour-gold)] bg-[var(--velour-gold)]/5' : 'border-[var(--border)] bg-white/40 hover:border-[var(--velour-gold)]/40'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-[var(--velour-text)]">{palette.label}</span>
                          {isSelected && (<div className="w-5 h-5 rounded-full bg-[var(--velour-gold)] flex items-center justify-center"><Check className="w-3 h-3 text-white" /></div>)}
                        </div>
                        <div className="flex gap-2">
                          {palette.colors.map((color, idx) => (<div key={idx} className="w-8 h-8 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: color }} />))}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <div className="space-y-3">
          {allColorsSelected && (
            <div className="p-4 bg-[var(--velour-gold)]/10 rounded-xl border border-[var(--velour-gold)]/20 fade-in-up">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-[var(--velour-gold)] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-[var(--velour-text)] font-medium mb-1">AI Ready to Curate!</p>
                  <p className="text-xs text-[var(--velour-text-soft)]">I'll select the perfect {gender === 'female' ? "women's" : "men's"} items matching your preferences.</p>
                </div>
              </div>
            </div>
          )}
          <button onClick={handleGenerateOutfit} disabled={!allColorsSelected || isGenerating}
            className="w-full px-6 py-4 bg-gradient-to-br from-[var(--velour-gold)] to-[var(--velour-gold-dark)] text-white rounded-full font-medium hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
            {isGenerating ? (<><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>Generating...</>) : (<><Sparkles className="w-5 h-5" />Generate My Outfit ({OUTFIT_CREATION_COST} Coins)<ChevronRight className="w-5 h-5" /></>)}
          </button>
          {!allColorsSelected && (<p className="text-xs text-center text-[var(--velour-gold)]">Please select color preferences for all categories</p>)}
        </div>
      </div>
    );
  }

  if (step === 'result') {
    return (
      <div className="bg-gradient-to-br from-white/80 to-[var(--velour-cream)]/80 backdrop-blur-sm rounded-2xl p-6 border border-[var(--border)] fade-in-up">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[var(--velour-gold)] to-[var(--velour-gold-dark)] mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-serif text-[var(--velour-text)] mb-2">Your AI-Curated Outfit</h3>
          <p className="text-[var(--velour-text-soft)]">{recommendedOutfit.length} premium items perfectly matched to your preferences</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          {recommendedOutfit.map((item) => {
            const palette = colorPalettes.find(p => p.id === item.color);
            return (
              <div key={item.id} className="relative rounded-xl overflow-hidden group">
                <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute top-2 right-2 px-2 py-1 bg-[var(--velour-gold)] rounded-full"><Sparkles className="w-3 h-3 text-white" /></div>
                {palette && (
                  <div className="absolute top-2 left-2 flex gap-1">
                    {palette.colors.map((color, idx) => (<div key={idx} className="w-4 h-4 rounded-full border-2 border-white shadow-lg" style={{ backgroundColor: color }} />))}
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-xs text-white/70 uppercase tracking-wide mb-1">{item.category}</p>
                  <p className="text-sm font-medium text-white leading-tight mb-1">{item.name}</p>
                  <p className="text-xs text-white/90 font-semibold">₹{(item.price / 1000).toFixed(1)}K</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mb-6 p-4 bg-white/60 rounded-xl border border-[var(--border)]">
          <h4 className="font-medium text-[var(--velour-text)] mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[var(--velour-gold)]" />AI Recommended Items:
          </h4>
          <div className="space-y-2">
            {recommendedOutfit.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-sm">
                <span className="text-[var(--velour-text)] font-medium">{item.name}</span>
                <span className="font-semibold text-[var(--velour-text)]">₹{item.price.toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-gradient-to-r from-[var(--velour-gold)]/20 to-[var(--velour-gold)]/10 rounded-xl border border-[var(--velour-gold)]/30 mb-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-[var(--velour-text)]">Complete Outfit Total</span>
            <span className="text-2xl font-serif font-semibold text-[var(--velour-text)]">₹{getTotalPrice().toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={handleReset} className="flex-1 px-6 py-3 bg-white/60 backdrop-blur-sm border border-[var(--border)] hover:bg-white rounded-full font-medium text-[var(--velour-text)] transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4" />Create New Look
          </button>
          <button onClick={handleAddAllToCart} className="flex-1 px-6 py-3 bg-gradient-to-br from-[var(--velour-gold)] to-[var(--velour-gold-dark)] text-white rounded-full font-medium hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2">
            <ShoppingBag className="w-4 h-4" />Add to Cart
          </button>
        </div>
      </div>
    );
  }

  return null;
}