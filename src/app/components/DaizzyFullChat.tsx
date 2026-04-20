import { useState, useRef, useEffect, useCallback } from 'react';
import { X, ChevronLeft, Send, Mic, MicOff, ShoppingBag, Heart, Sparkles, Check, Search, Filter, Tag, Zap, TrendingUp, DollarSign } from 'lucide-react';
import { Product, productDatabase, filterProducts, filterProductsAllCategories, generateOutfit, getTrendingProducts, getNewArrivals, getBestsellers, getLuxuryProducts, ALL_CATEGORIES, PRICE_RANGES, scoreProduct, getOccasionExclusiveProducts } from './ProductDatabase';
import { sendChatMessage } from '../../api';

interface Message {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  products?: Product[];
  quickActions?: QuickAction[];
  isStreaming?: boolean;
}

interface QuickAction {
  id: string;
  label: string;
  action: string;
}

interface DaizzyFullChatProps {
  onClose: () => void;
  onAddToCart?: (product: { id: string; name: string; price: number; image: string; category: string }) => void;
}

const KEYWORDS = {
  occasions: ['office', 'wedding', 'party', 'casual', 'date', 'formal', 'brunch', 'meeting', 'event', 'festive', 'gym', 'travel'],
  styles: ['minimal', 'bold', 'elegant', 'casual', 'modern', 'classic', 'trendy', 'sophisticated', 'chic', 'bohemian', 'streetwear', 'romantic', 'sporty'],
  colors: ['neutral', 'dark', 'pastel', 'vibrant', 'black', 'white', 'beige', 'gold', 'silver', 'red', 'blue', 'pink', 'green', 'navy', 'brown', 'ivory', 'cream', 'champagne', 'rose-gold', 'purple', 'maroon', 'emerald'],
  categories: ['top', 'bottom', 'shoes', 'accessory', 'watch', 'perfume', 'dress', 'shirt', 'pants', 'heels', 'bag', 'bags', 'fragrance', 'cologne', 'sneakers', 'boots', 'jewelry', 'jewellery', 'earrings', 'necklace', 'bracelet', 'ring', 'saree', 'lehenga', 'suit', 'blazer', 'jacket', 'jeans', 'skirt', 'kurta', 'skincare', 'serum', 'sunscreen', 'face wash', 'moisturizer', 'cream'],
  price: ['cheap', 'affordable', 'budget', 'expensive', 'luxury', 'premium', 'under 1k', 'under 2k', 'under 3k', 'under 5k', 'under 10k', 'under 15k', 'under 25k', 'above 5k', 'above 10k', 'above 15k', 'above 25k'],
  tags: ['trending', 'bestseller', 'new-arrival', 'limited-edition', 'sustainable', 'handcrafted', 'new', 'best seller', 'best-seller', 'limited'],
  actions: ['show', 'find', 'recommend', 'suggest', 'build', 'create', 'help', 'need', 'compare', 'match']
};

const ALL_KEYWORDS = Object.values(KEYWORDS).flat();

export function DaizzyFullChat({ onClose, onAddToCart }: DaizzyFullChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m Daizzy, your luxury AI styling assistant. I can help you find products by keywords, build outfits, or recommend items based on your preferences. Try typing "minimal tops" or "wedding outfits"!',
      timestamp: new Date(),
      quickActions: [
        { id: '1_qa_0', label: 'Build complete outfit', action: 'build-outfit' },
        { id: '1_qa_1', label: 'Show trending items', action: 'trending' },
        { id: '1_qa_2', label: 'Under ₹5K products', action: 'budget-5k' }
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isNearBottom, setIsNearBottom] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    category: null as Product['category'] | null,
    priceRange: null as string | null,
    occasion: null as string | null,
    style: null as string | null
  });
  const [chatHistory, setChatHistory] = useState<{ role: string; content: string }[]>([]);

  const chatBodyRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageIdCounter = useRef(1);
  const inputRef = useRef<HTMLInputElement>(null);

  const generateMessageId = () => {
    messageIdCounter.current += 1;
    return `msg_${Date.now()}_${messageIdCounter.current}_${Math.random().toString(36).substr(2, 9)}`;
  };

  useEffect(() => {
    if (isNearBottom && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isNearBottom]);

  const handleScroll = () => {
    if (chatBodyRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatBodyRef.current;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
      setIsNearBottom(distanceFromBottom < 100);
    }
  };

  useEffect(() => {
    if (inputValue.trim().length >= 2) {
      const query = inputValue.toLowerCase();
      const matches = ALL_KEYWORDS.filter(keyword => keyword.toLowerCase().includes(query)).slice(0, 5);
      setSuggestions(matches);
      setShowSuggestions(matches.length > 0);
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
    }
  }, [inputValue]);

  const streamAIResponse = (fullText: string, products?: Product[], quickActions?: QuickAction[]) => {
    let currentIndex = 0;
    const messageId = generateMessageId();
    const uniqueQuickActions = quickActions?.map((action, index) => ({ ...action, id: `${messageId}_${index}` }));
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const newMessage: Message = {
        id: messageId, type: 'ai', content: '', timestamp: new Date(),
        products, quickActions: uniqueQuickActions, isStreaming: true
      };
      setMessages(prev => [...prev, newMessage]);
      const interval = setInterval(() => {
        if (currentIndex < fullText.length) {
          const chunk = fullText.slice(0, currentIndex + 1);
          setMessages(prev => prev.map(msg => msg.id === messageId ? { ...msg, content: chunk } : msg));
          currentIndex++;
        } else {
          clearInterval(interval);
          setMessages(prev => prev.map(msg => msg.id === messageId ? { ...msg, isStreaming: false } : msg));
        }
      }, 15);
    }, 800);
  };

  const seededShuffle = <T,>(array: T[], seed: string): T[] => {
    const shuffled = [...array];
    let hash = 0;
    for (let i = 0; i < seed.length; i++) { hash = ((hash << 5) - hash) + seed.charCodeAt(i); hash |= 0; }
    for (let i = shuffled.length - 1; i > 0; i--) {
      hash = ((hash << 5) - hash + i) | 0;
      const j = Math.abs(hash) % (i + 1);
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const occasionStyleDefaults: Record<string, string[]> = {
    wedding: ['elegant', 'bold'], party: ['bold', 'elegant', 'trendy'], office: ['minimal', 'elegant', 'classic'],
    casual: ['casual', 'minimal', 'bohemian'], date: ['elegant', 'romantic', 'bold'], formal: ['elegant', 'minimal', 'classic'],
    brunch: ['casual', 'elegant', 'bohemian'], meeting: ['minimal', 'elegant', 'classic'], event: ['bold', 'elegant', 'trendy'],
    festive: ['bold', 'elegant'], gym: ['sporty', 'casual'], travel: ['casual', 'bohemian', 'streetwear']
  };

  const categoryMap: Record<string, Product['category'] | Product['category'][]> = {
    'top': 'top', 'tops': 'top', 'shirt': 'top', 'shirts': 'top', 'blouse': 'top', 'blazer': 'top', 'jacket': 'top', 'hoodie': 'top', 'sweater': 'top', 'kurta': 'top',
    'bottom': 'bottom', 'bottoms': 'bottom', 'pants': 'bottom', 'jeans': 'bottom', 'trousers': 'bottom', 'skirt': 'bottom', 'shorts': 'bottom', 'leggings': 'bottom',
    'shoes': 'shoes', 'heels': 'shoes', 'sneakers': 'shoes', 'boots': 'shoes', 'sandals': 'shoes', 'loafers': 'shoes', 'flats': 'shoes', 'footwear': 'shoes',
    'accessory': 'accessory', 'accessories': 'accessory', 'jewelry': 'accessory', 'jewellery': 'accessory', 'earrings': 'accessory', 'necklace': 'accessory', 'bracelet': 'accessory', 'ring': 'accessory', 'cufflinks': 'accessory',
    'perfume': 'perfume', 'perfumes': 'perfume', 'fragrance': 'perfume', 'cologne': 'perfume', 'scent': 'perfume', 'deodorant': 'perfume', 'eau de parfum': 'perfume', 'spray': 'perfume', 'body mist': 'perfume',
    'watch': 'watch', 'watches': 'watch', 'timepiece': 'watch',
    'bag': 'bag', 'bags': 'bag', 'handbag': 'bag', 'purse': 'bag', 'clutch': 'bag', 'tote': 'bag', 'backpack': 'bag', 'briefcase': 'bag', 'messenger': 'bag',
    'dress': 'dress', 'dresses': 'dress', 'gown': 'dress', 'saree': 'dress', 'lehenga': 'dress', 'anarkali': 'dress', 'suit': ['top', 'bottom'],
    'skincare': 'skincare', 'skin care': 'skincare', 'serum': 'skincare', 'sunscreen': 'skincare', 'face wash': 'skincare', 'moisturizer': 'skincare', 'cream': 'skincare', 'face mist': 'skincare', 'glow kit': 'skincare',
  };

  const processUserInput = (input: string) => {
    const lower = input.toLowerCase();
    const detectedOccasions = KEYWORDS.occasions.filter(k => lower.includes(k));
    const detectedStyles = KEYWORDS.styles.filter(k => lower.includes(k));
    const detectedCategories = KEYWORDS.categories.filter(k => lower.includes(k));
    const detectedColors = KEYWORDS.colors.filter(k => lower.includes(k));

    let detectedTags: string[] = [];
    if (lower.includes('trending') || lower.includes('trend')) detectedTags.push('trending');
    if (lower.includes('bestseller') || lower.includes('best seller') || lower.includes('popular')) detectedTags.push('bestseller');
    if (lower.includes('new arrival') || lower.includes('new-arrival') || lower.includes('latest')) detectedTags.push('new-arrival');
    if (lower.includes('limited') || lower.includes('exclusive')) detectedTags.push('limited-edition');
    if (lower.includes('sustainable') || lower.includes('eco')) detectedTags.push('sustainable');
    if (lower.includes('handcrafted') || lower.includes('handmade')) detectedTags.push('handcrafted');

    const extraOccasionMap: Record<string, string> = {
      'marriage': 'wedding', 'reception': 'wedding', 'shaadi': 'wedding', 'sangeet': 'festive',
      'night out': 'party', 'club': 'party', 'celebration': 'party',
      'work': 'office', 'professional': 'office', 'corporate': 'office',
      'everyday': 'casual', 'relaxed': 'casual', 'weekend': 'casual',
      'dinner': 'date', 'romantic': 'date', 'anniversary': 'date',
      'festival': 'festive', 'diwali': 'festive', 'eid': 'festive', 'navratri': 'festive',
      'workout': 'gym', 'exercise': 'gym', 'fitness': 'gym',
      'trip': 'travel', 'vacation': 'travel', 'holiday': 'travel'
    };
    for (const [phrase, occasion] of Object.entries(extraOccasionMap)) {
      if (lower.includes(phrase) && occasion && !detectedOccasions.includes(occasion)) detectedOccasions.push(occasion);
    }

    let filteredProducts: Product[] = [];
    let responseText = '';
    let quickActions: QuickAction[] = [];
    const isMale = lower.includes('men') || lower.includes('male') || lower.includes('guys') || lower.includes('him') || lower.includes('boyfriend') || lower.includes('husband') || lower.includes('groom');
    const gender: 'female' | 'male' = isMale ? 'male' : 'female';

    let maxPrice = 999999;
    let minPrice = 0;
    const rangeMatch = lower.match(/(?:₹?\s*)(\d+)\s*k?\s*(?:to|-|–)\s*(?:₹?\s*)(\d+)\s*k/i);
    const priceMatchK = lower.match(/(?:under|below|less than|within|upto|up to|max)\s*(?:₹?\s*)(\d+)\s*k/i);
    const priceMatchExact = lower.match(/(?:under|below|less than|within|upto|up to|max)\s*(?:₹?\s*)(\d{3,})/i);
    const aboveMatchK = lower.match(/(?:above|over|more than|min|starting)\s*(?:₹?\s*)(\d+)\s*k/i);
    const aboveMatchExact = lower.match(/(?:above|over|more than|min|starting)\s*(?:₹?\s*)(\d{3,})/i);
    const shorthandK = lower.match(/(?:₹)(\d+)\s*k/i);

    if (rangeMatch) { minPrice = parseInt(rangeMatch[1]) < 100 ? parseInt(rangeMatch[1]) * 1000 : parseInt(rangeMatch[1]); maxPrice = parseInt(rangeMatch[2]) * 1000; }
    else if (priceMatchK) maxPrice = parseInt(priceMatchK[1]) * 1000;
    else if (priceMatchExact) maxPrice = parseInt(priceMatchExact[1].replace(/,/g, ''));
    else if (aboveMatchK) minPrice = parseInt(aboveMatchK[1]) * 1000;
    else if (aboveMatchExact) minPrice = parseInt(aboveMatchExact[1].replace(/,/g, ''));
    else if (shorthandK) maxPrice = parseInt(shorthandK[1]) * 1000;

    if (lower.includes('cheap') || lower.includes('affordable') || lower.includes('budget')) { if (maxPrice === 999999) maxPrice = 3000; }
    if (lower.includes('luxury') || lower.includes('premium') || lower.includes('expensive')) { if (minPrice === 0) minPrice = 8000; if (!detectedTags.includes('luxury')) detectedTags.push('luxury'); }

    const getDefaultStyles = (occasion: string): string[] => occasionStyleDefaults[occasion] || ['minimal', 'elegant'];

    const resolvedCategories: Product['category'][] = [];
    for (const cat of detectedCategories) {
      const mapped = categoryMap[cat];
      if (mapped) {
        if (Array.isArray(mapped)) mapped.forEach(c => { if (!resolvedCategories.includes(c)) resolvedCategories.push(c); });
        else { if (!resolvedCategories.includes(mapped)) resolvedCategories.push(mapped); }
      }
    }

    const filterOptions = { minBudget: minPrice, tags: detectedTags.length > 0 ? detectedTags : undefined, colors: detectedColors.length > 0 ? detectedColors : undefined };

    if (lower.includes('build') || lower.includes('create outfit') || lower.includes('complete outfit') || lower.includes('full outfit') || lower.includes('style me')) {
      const occasion = detectedOccasions[0] || 'casual';
      const style = detectedStyles[0] || getDefaultStyles(occasion)[0];
      const outfit = generateOutfit([occasion], [style], maxPrice === 999999 ? 50000 : maxPrice, gender);
      filteredProducts = [outfit.top, outfit.bottom, outfit.shoes, outfit.accessory, outfit.perfume, outfit.bag].filter((p): p is Product => p !== null);
      responseText = `✨ Here's a curated ${occasion} outfit in ${style} style! ${filteredProducts.length} perfectly coordinated pieces.`;
      quickActions = [
        { id: 'a1', label: '🔄 Regenerate outfit', action: `build ${occasion} outfit` },
        { id: 'a2', label: `Try ${getDefaultStyles(occasion)[1] || 'bold'} style`, action: `build ${getDefaultStyles(occasion)[1] || 'bold'} ${occasion} outfit` },
        { id: 'a3', label: '💰 Set budget', action: `build ${occasion} outfit under 5k` },
        { id: 'a4', label: '🌸 Add perfume', action: `show perfumes for ${occasion}` }
      ];
    } else if (detectedTags.length > 0 && resolvedCategories.length === 0 && detectedOccasions.length === 0 && detectedStyles.length === 0) {
      if (detectedTags.includes('trending')) { filteredProducts = getTrendingProducts(gender, 8); responseText = `🔥 Here are our trending items right now!`; }
      else if (detectedTags.includes('new-arrival')) { filteredProducts = getNewArrivals(gender, 8); responseText = `✨ Just in! ${filteredProducts.length} new arrivals.`; }
      else if (detectedTags.includes('bestseller')) { filteredProducts = getBestsellers(gender, 8); responseText = `⭐ Our customers' favorites!`; }
      else if (detectedTags.includes('luxury')) { filteredProducts = getLuxuryProducts(gender, 8); responseText = `💎 Indulge in luxury.`; }
      filteredProducts = seededShuffle(filteredProducts, lower).slice(0, 8);
      quickActions = [
        { id: 'a1', label: '🔥 Trending', action: 'show trending' },
        { id: 'a2', label: '✨ New Arrivals', action: 'show new arrivals' },
        { id: 'a3', label: '⭐ Bestsellers', action: 'show bestsellers' },
        { id: 'a4', label: '💎 Luxury', action: 'show luxury items' }
      ];
    } else if (resolvedCategories.length > 0) {
      const occasions = detectedOccasions.length > 0 ? detectedOccasions : [];
      const styles = detectedStyles.length > 0 ? detectedStyles : (detectedOccasions.length > 0 ? getDefaultStyles(detectedOccasions[0]) : []);
      filteredProducts = filterProducts(resolvedCategories, occasions, styles, maxPrice === 999999 ? 999999 : maxPrice, gender, [], filterOptions);
      filteredProducts = seededShuffle(filteredProducts, lower).slice(0, 8);
      const categoryLabel = detectedCategories[0] || resolvedCategories[0];
      responseText = `Found ${filteredProducts.length} ${categoryLabel} options. Each piece is curated from our luxury collection.`;
      quickActions = [
        { id: 'a1', label: `More ${categoryLabel}`, action: `show more ${categoryLabel}` },
        { id: 'a2', label: '💍 For wedding', action: `${categoryLabel} for wedding` },
        { id: 'a3', label: '🎉 For party', action: `${categoryLabel} for party` },
        { id: 'a4', label: '🌸 Match perfume', action: `perfume for ${detectedOccasions[0] || 'casual'}` }
      ];
    } else if (detectedOccasions.length > 0) {
      const occasion = detectedOccasions[0];
      const styles = detectedStyles.length > 0 ? detectedStyles : getDefaultStyles(occasion);
      const exclusiveProducts = getOccasionExclusiveProducts(occasion, gender, 12);
      const searchCategories: Product['category'][] = ['dress', 'top', 'bottom', 'shoes', 'accessory', 'perfume', 'bag', 'watch', 'skincare'];
      const seenIds = new Set<string>();
      searchCategories.forEach(cat => {
        const catExclusives = exclusiveProducts.filter(p => p.category === cat && p.price >= minPrice && p.price <= (maxPrice === 999999 ? 999999 : maxPrice));
        if (catExclusives.length > 0) { const pick = seededShuffle(catExclusives, `${lower}_exc_${cat}`)[0]; if (pick && !seenIds.has(pick.id)) { filteredProducts.push(pick); seenIds.add(pick.id); } }
      });
      searchCategories.forEach(cat => {
        if (filteredProducts.filter(p => p.category === cat).length > 0) return;
        const items = filterProducts(cat, [occasion], styles, maxPrice === 999999 ? 999999 : maxPrice, gender, [...seenIds], filterOptions);
        if (items.length > 0) { filteredProducts.push(items[0]); seenIds.add(items[0].id); }
      });
      filteredProducts = filteredProducts.slice(0, 10);
      const occasionEmojis: Record<string, string> = { wedding: '💍', party: '🎉', office: '💼', casual: '☀️', date: '❤️', formal: '🎩', brunch: '🥂', meeting: '📋', event: '✨', festive: '🎊', gym: '💪', travel: '✈️' };
      const priceDesc = maxPrice < 999999 ? ` under ₹${(maxPrice / 1000).toFixed(0)}K` : (minPrice > 0 ? ` above ₹${(minPrice / 1000).toFixed(0)}K` : '');
      responseText = `${occasionEmojis[occasion] || '✨'} Here are ${filteredProducts.length} curated ${occasion} pieces${priceDesc}!`;
      quickActions = [
        { id: 'a1', label: `Build ${occasion} outfit`, action: `build ${occasion} outfit` },
        { id: 'a2', label: `${occasion} perfumes`, action: `perfume for ${occasion}` },
        { id: 'a3', label: `${occasion} watches`, action: `watch for ${occasion}` },
        { id: 'a4', label: '💰 Set budget', action: `${occasion} under 5k` }
      ];
    } else if (detectedStyles.length > 0) {
      const style = detectedStyles[0];
      const allCats: Product['category'][] = ['top', 'bottom', 'shoes', 'accessory', 'dress', 'perfume', 'bag', 'watch'];
      allCats.forEach(cat => {
        const items = filterProducts(cat, [], [style], maxPrice === 999999 ? 999999 : maxPrice, gender, [], filterOptions);
        filteredProducts.push(...seededShuffle(items, `${lower}_${cat}`).slice(0, 1));
      });
      filteredProducts = filteredProducts.slice(0, 8);
      responseText = `🎨 Explore our ${style} collection! ${filteredProducts.length} pieces across all categories.`;
      quickActions = [
        { id: 'a1', label: `${style} outfit`, action: `build ${style} outfit` },
        { id: 'a2', label: `${style} for wedding`, action: `${style} wedding options` },
        { id: 'a3', label: '🔄 Try another style', action: 'show elegant options' }
      ];
    } else if (maxPrice < 999999 || minPrice > 0) {
      const actualMax = maxPrice === 999999 ? 5000 : maxPrice;
      filteredProducts = filterProductsAllCategories([], [], actualMax, gender, { minBudget: minPrice });
      filteredProducts = seededShuffle(filteredProducts, lower).slice(0, 8);
      const priceLabel = minPrice > 0 && maxPrice < 999999 ? `between ₹${(minPrice / 1000).toFixed(0)}K and ₹${(actualMax / 1000).toFixed(0)}K` : minPrice > 0 ? `above ₹${(minPrice / 1000).toFixed(0)}K` : `under ₹${(actualMax / 1000).toFixed(0)}K`;
      responseText = `💰 Found ${filteredProducts.length} beautiful pieces ${priceLabel}.`;
      quickActions = [
        { id: 'a1', label: 'Under ₹2K', action: 'products under 2k' },
        { id: 'a2', label: '₹3K-₹5K', action: 'products 3k to 5k' },
        { id: 'a3', label: 'Premium ₹10K+', action: 'premium products above 10k' }
      ];
    } else if (detectedColors.length > 0) {
      filteredProducts = filterProductsAllCategories([], [], maxPrice === 999999 ? 999999 : maxPrice, gender, { minBudget: minPrice, colors: detectedColors });
      filteredProducts = seededShuffle(filteredProducts, lower).slice(0, 8);
      responseText = `🎨 Found ${filteredProducts.length} pieces in ${detectedColors.join(', ')}.`;
      quickActions = [
        { id: 'a1', label: 'Black collection', action: 'show black items' },
        { id: 'a2', label: 'Gold collection', action: 'show gold items' },
        { id: 'a3', label: 'Build outfit', action: `build outfit with ${detectedColors[0]}` }
      ];
    } else {
      const allProducts = productDatabase.filter(p => p.gender === gender || p.gender === 'unisex');
      filteredProducts = seededShuffle(allProducts, lower).slice(0, 6);
      responseText = `Here are some recommendations! Try: "wedding perfumes", "party dresses", "minimal watches", "trending items", "build festive outfit"`;
      quickActions = [
        { id: 'a1', label: '💍 Wedding', action: 'wedding outfits' },
        { id: 'a2', label: '🌸 Perfumes', action: 'show perfumes' },
        { id: 'a3', label: '⌚ Watches', action: 'show watches' },
        { id: 'a4', label: '🔥 Trending', action: 'show trending items' }
      ];
    }

    return { responseText, filteredProducts, quickActions };
  };

  // Handle sending message — now calls backend AI
  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: generateMessageId(), type: 'user', content: inputValue, timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    const query = inputValue;
    setInputValue('');
    setShowSuggestions(false);

    // Get product results from local logic
    const { responseText, filteredProducts, quickActions } = processUserInput(query);

    // Call backend AI for conversational response
    setIsTyping(true);
    try {
      const userId = localStorage.getItem('daizzy_user_id') || 'guest';
      const aiResult = await sendChatMessage({
        user_id: userId,
        message: query,
        history: chatHistory
      });

      // Update chat history
      const newHistory = [
        ...chatHistory,
        { role: 'user', content: query },
        { role: 'assistant', content: aiResult.response || responseText }
      ];
      setChatHistory(newHistory);

      // Use AI response if available, else fallback to local
      const finalText = aiResult.success ? aiResult.response : responseText;
      streamAIResponse(finalText, filteredProducts, quickActions);
    } catch (error) {
      // Fallback to local response if backend is down
      streamAIResponse(responseText, filteredProducts, quickActions);
    }
  };

  const handleQuickAction = (action: string, label: string) => {
    setInputValue(label);
    setTimeout(() => handleSend(), 100);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleAddToCart = (product: Product) => {
    if (onAddToCart) {
      onAddToCart({ id: product.id, name: product.name, price: product.price, image: product.image, category: product.category });
    }
    setToastMessage(`${product.name} added to cart!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleLikeProduct = (product: Product) => {
    setToastMessage(`${product.name} added to favorites!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleVoiceInput = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) { setToastMessage('Voice input not supported. Please use Chrome.'); setTimeout(() => setToastMessage(null), 3000); return; }
    if (isListening && recognitionRef.current) { recognitionRef.current.stop(); setIsListening(false); return; }
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = 'en-IN'; recognition.interimResults = true; recognition.continuous = false;
    recognition.onstart = () => { setIsListening(true); setToastMessage('🎙️ Listening... Speak now'); };
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results).map((result: any) => result[0].transcript).join('');
      setInputValue(transcript);
      if (event.results[event.results.length - 1].isFinal) { setIsListening(false); setToastMessage(`✅ Got: "${transcript}"`); setTimeout(() => setToastMessage(null), 2000); }
    };
    recognition.onerror = (event: any) => { setIsListening(false); setToastMessage(`Voice error: ${event.error}`); setTimeout(() => setToastMessage(null), 3000); };
    recognition.onend = () => { setIsListening(false); recognitionRef.current = null; };
    recognition.start();
  }, [isListening]);

  useEffect(() => { return () => { if (recognitionRef.current) recognitionRef.current.stop(); }; }, []);

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      <header className="h-16 flex-shrink-0 bg-gradient-to-r from-white via-[#F8F5F0] to-white border-b border-[#D4AF37] px-6 flex items-center justify-between shadow-sm">
        <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-all">
          <ChevronLeft className="w-5 h-5 text-[#2C2C2C]" />
        </button>
        <div className="text-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#C9A961] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-serif text-[#2C2C2C]">Daizzy AI</h1>
              <p className="text-xs text-[#7A7A7A]">Luxury Styling Assistant</p>
            </div>
          </div>
        </div>
        <button onClick={() => setShowFilters(!showFilters)} className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-all relative">
          <Filter className="w-5 h-5 text-[#2C2C2C]" />
          {Object.values(activeFilters).some(f => f !== null) && (<div className="absolute top-1 right-1 w-2 h-2 bg-[#D4AF37] rounded-full"></div>)}
        </button>
      </header>

      {showFilters && (
        <div className="bg-gradient-to-br from-[#F8F5F0] to-white border-b border-gray-200 p-4 shadow-sm">
          <div className="max-w-4xl mx-auto space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-[#2C2C2C] flex items-center gap-2"><Tag className="w-4 h-4 text-[#D4AF37]" />Quick Filters</h3>
              <button onClick={() => setActiveFilters({ category: null, priceRange: null, occasion: null, style: null })} className="text-xs text-[#D4AF37] hover:underline">Clear all</button>
            </div>
            <div>
              <p className="text-xs text-[#7A7A7A] mb-2">Category</p>
              <div className="flex gap-2 flex-wrap">
                {([
  { id: 'top' as const, label: 'Tops' },
  { id: 'bottom' as const, label: 'Bottoms' },
  { id: 'dress' as const, label: 'Dresses' },
  { id: 'shoes' as const, label: 'Shoes' },
  { id: 'accessory' as const, label: 'Jewelry' },
  { id: 'perfume' as const, label: 'Perfumes' },
  { id: 'watch' as const, label: 'Watches' },
  { id: 'bag' as const, label: 'Bags' },
  { id: 'skincare' as const, label: 'Skincare' }
]).map(cat => (
                  <button key={cat.id} onClick={() => { setActiveFilters(prev => ({ ...prev, category: prev.category === cat.id ? null : cat.id })); setInputValue(`show ${cat.id}`); setTimeout(() => handleSend(), 150); }}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${activeFilters.category === cat.id ? 'bg-gradient-to-r from-[#D4AF37] to-[#C9A961] text-white' : 'bg-white border border-gray-200 text-[#2C2C2C] hover:border-[#D4AF37]/40'}`}>
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-[#7A7A7A] mb-2">Price Range</p>
              <div className="flex gap-2 flex-wrap">
                {PRICE_RANGES.map(range => (
                  <button key={range.label} onClick={() => { setActiveFilters(prev => ({ ...prev, priceRange: prev.priceRange === range.label ? null : range.label })); const query = range.max === Infinity ? `products above ${range.min / 1000}k` : range.min === 0 ? `products under ${range.max / 1000}k` : `products ${range.min / 1000}k to ${range.max / 1000}k`; setInputValue(query); setTimeout(() => handleSend(), 150); }}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${activeFilters.priceRange === range.label ? 'bg-gradient-to-r from-[#D4AF37] to-[#C9A961] text-white' : 'bg-white border border-gray-200 text-[#2C2C2C] hover:border-[#D4AF37]/40'}`}>
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-[#7A7A7A] mb-2">Occasion</p>
              <div className="flex gap-2 flex-wrap">
                {['💍 Wedding', '🎉 Party', '💼 Office', '☀️ Casual', '❤️ Date', '🎊 Festive', '💪 Gym', '✈️ Travel'].map(occ => {
                  const occasion = occ.split(' ')[1].toLowerCase();
                  return (
                    <button key={occasion} onClick={() => { setActiveFilters(prev => ({ ...prev, occasion: prev.occasion === occasion ? null : occasion })); setInputValue(`${occasion} outfits`); setTimeout(() => handleSend(), 150); }}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${activeFilters.occasion === occasion ? 'bg-gradient-to-r from-[#D4AF37] to-[#C9A961] text-white' : 'bg-white border border-gray-200 text-[#2C2C2C] hover:border-[#D4AF37]/40'}`}>
                      {occ}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      <div ref={chatBodyRef} onScroll={handleScroll} className="flex-1 overflow-y-auto px-4 py-6 bg-gradient-to-b from-[#F8F5F0] to-white" style={{ scrollBehavior: 'smooth' }}>
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} fade-in-up`}>
              <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                <div className={`rounded-2xl px-5 py-3 ${message.type === 'user' ? 'bg-gradient-to-br from-[#D4AF37] to-[#C9A961] text-white shadow-lg' : 'bg-white border border-gray-200 text-[#2C2C2C] shadow-sm'}`}>
                  <p className="text-base leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  {message.isStreaming && (<span className="inline-block w-1 h-4 bg-current animate-pulse ml-1" />)}
                </div>
                {message.products && message.products.length > 0 && (
                  <div className="mt-4">
                    <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory">
                      {message.products.map((product, productIndex) => (
                        <div key={`${message.id}_product_${product.id}_${productIndex}`} className="flex-shrink-0 w-64 bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all border border-gray-100 snap-start group">
                          <div className="relative overflow-hidden">
                            <img src={product.image} alt={product.name} className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" />
                            <button onClick={() => handleLikeProduct(product)} className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all shadow-lg hover:scale-110">
                              <Heart className="w-5 h-5 text-[#D4AF37]" />
                            </button>
                            <div className="absolute bottom-3 left-3 px-3 py-1 bg-black/70 backdrop-blur-sm text-white text-xs rounded-full font-medium">{product.category}</div>
                            <div className="absolute top-3 left-3 px-2 py-1 bg-[#D4AF37]/90 backdrop-blur-sm text-white text-xs rounded-full">{product.color}</div>
                          </div>
                          <div className="p-4">
                            <h3 className="font-medium text-[#2C2C2C] mb-1 text-sm line-clamp-2">{product.name}</h3>
                            <div className="flex items-center gap-2 mb-3">
                              <p className="text-lg font-serif font-semibold text-[#D4AF37]">₹{product.price.toLocaleString('en-IN')}</p>
                              <div className="flex-1"></div>
                              <div className="flex gap-1">{product.occasions.slice(0, 2).map((occ, i) => (<span key={i} className="text-[10px] px-2 py-0.5 bg-gray-100 rounded-full text-[#7A7A7A]">{occ}</span>))}</div>
                            </div>
                            <button onClick={() => handleAddToCart(product)} className="w-full px-4 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#C9A961] text-white rounded-full text-sm font-medium hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2">
                              <ShoppingBag className="w-4 h-4" />Add to Cart
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {message.quickActions && message.quickActions.length > 0 && !message.isStreaming && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {message.quickActions.map((action) => (
                      <button key={action.id} onClick={() => handleQuickAction(action.action, action.label)} className="px-4 py-2 bg-white border-2 border-[#D4AF37]/30 text-[#D4AF37] rounded-full text-sm font-medium hover:bg-[#D4AF37]/10 hover:border-[#D4AF37] hover:scale-105 active:scale-95 transition-all shadow-sm">
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
                <p className={`text-xs text-[#7A7A7A] mt-2 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                  {message.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start fade-in-up">
              <div className="bg-white border border-gray-200 rounded-2xl px-5 py-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-sm text-[#7A7A7A] font-medium">Daizzy is analyzing...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="flex-shrink-0 bg-white border-t border-gray-200 px-4 py-4 shadow-lg">
        <div className="max-w-4xl mx-auto">
          {showSuggestions && suggestions.length > 0 && (
            <div className="mb-3 flex gap-2 overflow-x-auto pb-2">
              {suggestions.map((suggestion, index) => (
                <button key={index} onClick={() => handleSuggestionClick(suggestion)} className="flex-shrink-0 px-3 py-1.5 bg-gradient-to-r from-[#D4AF37]/10 to-[#C9A961]/10 border border-[#D4AF37]/30 text-[#D4AF37] rounded-full text-sm font-medium hover:bg-[#D4AF37]/20 transition-all flex items-center gap-2">
                  <Zap className="w-3 h-3" />{suggestion}
                </button>
              ))}
            </div>
          )}
          <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
            <button onClick={() => { setInputValue('build complete outfit'); setTimeout(handleSend, 100); }} className="flex-shrink-0 px-4 py-2 bg-gradient-to-r from-[#D4AF37]/10 to-[#C9A961]/10 border border-[#D4AF37]/30 text-[#D4AF37] rounded-full text-sm font-medium hover:bg-[#D4AF37]/20 transition-all flex items-center gap-2"><Sparkles className="w-4 h-4" />Build Outfit</button>
            <button onClick={() => { setInputValue('show trending items'); setTimeout(handleSend, 100); }} className="flex-shrink-0 px-4 py-2 bg-[#F8F5F0] hover:bg-[#D4AF37]/10 border border-gray-200 hover:border-[#D4AF37]/30 text-[#2C2C2C] rounded-full text-sm font-medium transition-all flex items-center gap-2"><TrendingUp className="w-4 h-4" />Trending</button>
            <button onClick={() => { setInputValue('show perfumes'); setTimeout(handleSend, 100); }} className="flex-shrink-0 px-4 py-2 bg-[#F8F5F0] hover:bg-[#D4AF37]/10 border border-gray-200 hover:border-[#D4AF37]/30 text-[#2C2C2C] rounded-full text-sm font-medium transition-all flex items-center gap-2">🌸 Perfumes</button>
            <button onClick={() => { setInputValue('products under 5k'); setTimeout(handleSend, 100); }} className="flex-shrink-0 px-4 py-2 bg-[#F8F5F0] hover:bg-[#D4AF37]/10 border border-gray-200 hover:border-[#D4AF37]/30 text-[#2C2C2C] rounded-full text-sm font-medium transition-all flex items-center gap-2"><DollarSign className="w-4 h-4" />Budget Picks</button>
            <button onClick={() => { setInputValue('show watches'); setTimeout(handleSend, 100); }} className="flex-shrink-0 px-4 py-2 bg-[#F8F5F0] hover:bg-[#D4AF37]/10 border border-gray-200 hover:border-[#D4AF37]/30 text-[#2C2C2C] rounded-full text-sm font-medium transition-all flex items-center gap-2">⌚ Watches</button>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleVoiceInput} className={`w-12 h-12 rounded-full flex items-center justify-center transition-all border ${isListening ? 'bg-red-500 border-red-400 animate-pulse shadow-lg shadow-red-500/30' : 'bg-gradient-to-br from-[#D4AF37]/10 to-[#C9A961]/10 hover:from-[#D4AF37]/20 hover:to-[#C9A961]/20 border-[#D4AF37]/30'}`}>
              {isListening ? <MicOff className="w-5 h-5 text-white" /> : <Mic className="w-5 h-5 text-[#D4AF37]" />}
            </button>
            <div className="flex-1 relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7A7A7A]" />
              <input ref={inputRef} type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} placeholder="Try: 'minimal tops', 'wedding outfits', 'under 5k'..."
                className="w-full pl-12 pr-6 py-3.5 bg-[#F8F5F0] border-2 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37] transition-all placeholder:text-[#7A7A7A] text-[#2C2C2C] font-medium" />
            </div>
            <button onClick={handleSend} disabled={!inputValue.trim()} className="w-12 h-12 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#C9A961] flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
              <Send className="w-5 h-5 text-white" />
            </button>
          </div>
          <div className="mt-2 text-center">
            <p className="text-xs text-[#7A7A7A]">💡 Try: <span className="text-[#D4AF37] font-medium">wedding perfumes, trending watches, casual dress under 3k, elegant bags, build party outfit</span></p>
          </div>
        </div>
      </div>

      {toastMessage && (
        <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-60 animate-slide-up">
          <div className="bg-[#2C2C2C] text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center"><Check className="w-4 h-4 text-white" /></div>
            <span className="text-sm font-medium">{toastMessage}</span>
          </div>
        </div>
      )}

      {!isNearBottom && (
        <button onClick={() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); setIsNearBottom(true); }} className="fixed bottom-32 right-8 w-12 h-12 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#C9A961] shadow-xl flex items-center justify-center hover:scale-110 transition-all z-50">
          <ChevronLeft className="w-5 h-5 text-white rotate-[-90deg]" />
        </button>
      )}

      <style>{`
        @keyframes slide-up { from { opacity: 0; transform: translate(-50%, 20px); } to { opacity: 1; transform: translate(-50%, 0); } }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
        .overflow-y-auto::-webkit-scrollbar { width: 8px; }
        .overflow-y-auto::-webkit-scrollbar-track { background: #F8F5F0; }
        .overflow-y-auto::-webkit-scrollbar-thumb { background: linear-gradient(to bottom, #D4AF37, #C9A961); border-radius: 4px; }
        .overflow-x-auto::-webkit-scrollbar { height: 6px; }
        .overflow-x-auto::-webkit-scrollbar-track { background: transparent; }
        .overflow-x-auto::-webkit-scrollbar-thumb { background: #D4AF37; border-radius: 3px; }
        .snap-x { scroll-snap-type: x mandatory; }
        .snap-start { scroll-snap-align: start; }
      `}</style>
    </div>
  );
}