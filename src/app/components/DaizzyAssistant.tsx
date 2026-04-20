import { useState, useRef, useEffect, useCallback } from 'react';
import {
  X, Mic, MicOff, Palette, Calendar, Star, Shirt, ChevronRight,
  Gift, Sparkles, TrendingUp, DollarSign, Heart, Flame, Wand2,
  Trophy, MessageCircle, ShoppingCart, User, Package, LogOut,
  Coffee, ArrowRight, HelpCircle
} from 'lucide-react';
import { ProductCard } from './ProductCard';
import { SpinWheel } from './SpinWheel';
import { StyleQuiz } from './StyleQuiz';
import { OutfitBuilder } from './OutfitBuilder';
import { OccasionSelector } from './OccasionSelector';
import { AdvancedStylingFlow } from './AdvancedStylingFlow';
import { GamificationRewards } from './GamificationRewards';
import { DaizzyFullChat } from './DaizzyFullChat';
import { CartCheckout } from './CartCheckout';
import { AuthModal } from './AuthModal';
import { OrderTracking } from './OrderTracking';
import { CustomerSupport } from './CustomerSupport';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  products?: Product[];
  component?: 'spin-wheel' | 'style-quiz' | 'outfit-builder' | 'occasion-selector';
}

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  quantity: number;
  maxStock: number;
}

export function DaizzyAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [velourCoins, setVelourCoins] = useState(850);
  const [showAdvancedFlow, setShowAdvancedFlow] = useState(false);
  const [showGamification, setShowGamification] = useState(false);
  const [showFullChat, setShowFullChat] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showOrderTracking, setShowOrderTracking] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [user, setUser] = useState<{ name: string; email: string; phone: string } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const handleCoinsUpdate = (change: number) => setVelourCoins(prev => prev + change);

  const addToCart = (product: { id: string; name: string; price: number; image: string; category: string }) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id && item.quantity < item.maxStock
            ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1, maxStock: 10 }];
    });
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const luxuryProducts: Product[] = [
    { id: 'l1', name: 'Diamond Pendant Necklace', price: 425990, image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=600&fit=crop', category: 'Fine Jewelry' },
    { id: 'l2', name: 'Italian Leather Jacket', price: 385990, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=600&fit=crop', category: 'Premium Outerwear' },
    { id: 'l3', name: 'Silk Designer Gown', price: 295990, image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=600&fit=crop', category: 'Haute Couture' },
    { id: 'l4', name: 'Gold Bracelet Set', price: 525990, image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=600&fit=crop', category: 'Fine Jewelry' }
  ];

  const handleCardClick = (cardType: string) => {
    if (cardType === 'track') { setShowOrderTracking(true); return; }
    if (cardType === 'account') {
      if (user) {
        setShowWelcome(false);
        setMessages([{ id: Date.now().toString(), type: 'ai', content: `Welcome back, ${user.name}! Your account is active.\n\nVelour Coins: ${velourCoins}\nCart Items: ${cartCount}\n\nHow can I assist you today?` }]);
      } else { setShowAuth(true); }
      return;
    }
    setShowWelcome(false);
    const responses: Record<string, Message> = {
      style: { id: Date.now().toString(), type: 'ai', content: "Let's discover your unique style! Take our quick personalization quiz to earn rewards and get tailored recommendations.", component: 'style-quiz' },
      occasion: { id: Date.now().toString(), type: 'ai', content: "Tell me what occasion you're shopping for, and I'll show you the perfect collection.", component: 'occasion-selector' },
      luxury: { id: Date.now().toString(), type: 'ai', content: "Here are today's exclusive luxury pieces from our premium collection. Each item is handpicked by our stylists.", products: luxuryProducts },
      outfit: { id: Date.now().toString(), type: 'ai', content: "Let's build your complete outfit together! Select items from each category to create a coordinated look.", component: 'outfit-builder' }
    };
    setMessages([responses[cardType]]);
    setVelourCoins(prev => prev + 10);
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const userMessage: Message = { id: Date.now().toString(), type: 'user', content: inputValue };
    const aiMessage: Message = { id: (Date.now() + 1).toString(), type: 'ai', content: "I've found some exquisite pieces that match your preferences. These luxury items are currently trending.", products: luxuryProducts.slice(0, 3) };
    setShowWelcome(false);
    setMessages(prev => [...prev, userMessage, aiMessage]);
    setInputValue('');
    setVelourCoins(prev => prev + 5);
  };

  const handleQuickAction = (action: string) => {
    setShowWelcome(false);
    const actionLabels: Record<string, string> = { under250k: 'under ₹2,50,000', wedding: 'weddings', casual: 'casual occasions', trending: 'trending now' };
    const aiMessage: Message = {
      id: Date.now().toString(), type: 'ai',
      content: `Here are luxury pieces ${actionLabels[action]}.`,
      products: luxuryProducts.slice(0, 3)
    };
    setMessages(prev => [...prev, aiMessage]);
    setVelourCoins(prev => prev + 5);
  };

  const handleVoiceInput = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) { alert('Voice input not supported. Please use Chrome.'); return; }
    if (isListening && recognitionRef.current) { recognitionRef.current.stop(); setIsListening(false); return; }
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = 'en-IN'; recognition.interimResults = true; recognition.continuous = false;
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results).map((result: any) => result[0].transcript).join('');
      setInputValue(transcript);
      if (event.results[event.results.length - 1].isFinal) setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => { setIsListening(false); recognitionRef.current = null; };
    recognition.start();
  }, [isListening]);

  useEffect(() => { return () => { if (recognitionRef.current) recognitionRef.current.stop(); }; }, []);

  return (
    <>
      {/* Floating Daizzy Button */}
      {!isOpen && (
        <button onClick={() => setIsOpen(true)} className="fixed bottom-8 right-8 group z-50">
          <div className="relative">
            <div
              className="w-16 h-16 rounded-2xl bg-[var(--velour-gold)] shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
              style={{ boxShadow: '0 8px 32px rgba(201, 169, 97, 0.45)' }}
            >
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full border-2 border-white" />
          </div>
          <div className="absolute bottom-full right-0 mb-3 px-3 py-1.5 bg-[var(--velour-text)] text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Chat with Daizzy
          </div>
        </button>
      )}

      {/* Full Screen Interface */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-[var(--velour-ivory)]">

          {/* Header */}
          <header className="flex-shrink-0 px-6 md:px-10 py-4 bg-white border-b border-[var(--velour-champagne)] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[var(--velour-gold)] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-base font-serif text-[var(--velour-text)] leading-none">Daizzy</h1>
                <p className="text-[10px] text-[var(--velour-gold)] tracking-widest uppercase mt-0.5">AI Stylist · Velour</p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-2">
              <button onClick={() => setShowFullChat(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[var(--velour-champagne)] text-[var(--velour-text)] text-sm hover:bg-[var(--velour-gold)] hover:text-white transition-all">
                <MessageCircle className="w-3.5 h-3.5" />Full Chat
              </button>
              <button onClick={() => setShowCart(true)} className="relative flex items-center gap-1.5 px-4 py-2 rounded-full bg-[var(--velour-champagne)] text-[var(--velour-text)] text-sm hover:bg-[var(--velour-gold)] hover:text-white transition-all">
                <ShoppingCart className="w-3.5 h-3.5" />Cart
                {cartCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--velour-gold)] text-white text-[10px] rounded-full flex items-center justify-center font-bold">{cartCount}</span>}
              </button>
              <button onClick={() => setShowGamification(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[var(--velour-champagne)] text-[var(--velour-text)] text-sm hover:bg-[var(--velour-gold)] hover:text-white transition-all">
                <Trophy className="w-3.5 h-3.5" />{velourCoins} Coins
              </button>
              <button onClick={() => setShowOrderTracking(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[var(--velour-champagne)] text-[var(--velour-text)] text-sm hover:bg-[var(--velour-gold)] hover:text-white transition-all">
                <Package className="w-3.5 h-3.5" />Orders
              </button>
              <button onClick={() => setShowSupport(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[var(--velour-champagne)] text-[var(--velour-text)] text-sm hover:bg-[var(--velour-gold)] hover:text-white transition-all">
                <HelpCircle className="w-3.5 h-3.5" />Support
              </button>
            </div>

            <div className="flex items-center gap-2">
              {user ? (
                <div className="hidden md:flex items-center gap-2">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--velour-champagne)] rounded-full">
                    <User className="w-3.5 h-3.5 text-[var(--velour-gold)]" />
                    <span className="text-sm text-[var(--velour-text)]">{user.name.split(' ')[0]}</span>
                  </div>
                  <button onClick={() => setUser(null)} className="p-1.5 hover:bg-red-50 rounded-full transition-all">
                    <LogOut className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              ) : (
                <button onClick={() => setShowAuth(true)} className="hidden md:flex items-center gap-1.5 px-4 py-2 bg-[var(--velour-gold)] text-white rounded-full text-sm hover:bg-[var(--velour-gold-dark)] transition-all">
                  <User className="w-3.5 h-3.5" />Login
                </button>
              )}
              <button
                onClick={() => { setIsOpen(false); setShowWelcome(true); setMessages([]); }}
                className="w-8 h-8 rounded-full hover:bg-[var(--velour-champagne)] flex items-center justify-center transition-all"
              >
                <X className="w-4 h-4 text-[var(--velour-text-soft)]" />
              </button>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto">
            {showWelcome ? (
              <div className="max-w-5xl mx-auto px-6 py-10">

                <div className="mb-8 slide-in-up">
                  <p className="text-xs text-[var(--velour-gold)] tracking-widest uppercase mb-2">Velour · Powered by Daizzy AI</p>
                  <h2 className="text-3xl md:text-4xl font-serif text-[var(--velour-text)]">How can I help you today?</h2>
                </div>

                {/* Primary actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <button
                    onClick={() => setShowFullChat(true)}
                    className="group relative p-7 bg-[#1C1C1C] rounded-2xl text-left overflow-hidden hover:scale-[1.02] transition-all slide-in-up delay-100"
                    style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}
                  >
                    <div className="absolute top-0 right-0 w-40 h-40 bg-[var(--velour-gold)]/8 rounded-full blur-2xl" />
                    <div className="relative">
                      <div className="w-11 h-11 rounded-xl bg-[var(--velour-gold)]/15 flex items-center justify-center mb-4">
                        <MessageCircle className="w-5 h-5 text-[var(--velour-gold)]" />
                      </div>
                      <h3 className="text-xl font-serif text-white mb-1.5">Chat with Daizzy</h3>
                      <p className="text-sm text-white/50 mb-4">Ask anything — outfits, trends, styling advice</p>
                      <div className="flex items-center gap-2 text-[var(--velour-gold)] text-sm">
                        <span>Start chatting</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setShowAdvancedFlow(true)}
                    className="group relative p-7 bg-[var(--velour-gold)] rounded-2xl text-left overflow-hidden hover:scale-[1.02] transition-all slide-in-up delay-200"
                    style={{ boxShadow: '0 8px 32px rgba(201,169,97,0.3)' }}
                  >
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                    <div className="relative">
                      <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                        <Wand2 className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-serif text-white mb-1.5">AI Styling Journey</h3>
                      <p className="text-sm text-white/70 mb-4">Step-by-step guided outfit curation</p>
                      <div className="flex items-center gap-2 text-white text-sm">
                        <span>Get started</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </button>
                </div>

                {/* Secondary actions */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  {[
                    { id: 'style', icon: Palette, label: 'Style Quiz', sub: 'Earn 100 coins' },
                    { id: 'occasion', icon: Calendar, label: 'By Occasion', sub: 'Browse by event' },
                    { id: 'outfit', icon: Shirt, label: 'Build Outfit', sub: 'Full coordinated look' },
                    { id: 'luxury', icon: Star, label: 'Luxury Picks', sub: 'Premium collection' },
                  ].map((card, i) => (
                    <button
                      key={card.id}
                      onClick={() => handleCardClick(card.id)}
                      className="group p-5 bg-white border border-[var(--velour-champagne)] rounded-2xl text-left hover:border-[var(--velour-gold)] hover:-translate-y-1 transition-all slide-in-up"
                      style={{ animationDelay: `${0.3 + i * 0.05}s` }}
                    >
                      <div className="w-9 h-9 rounded-lg bg-[var(--velour-gold)]/10 flex items-center justify-center mb-3 group-hover:bg-[var(--velour-gold)]/20 transition-all">
                        <card.icon className="text-[var(--velour-gold)]" style={{ width: 18, height: 18 }} />
                      </div>
                      <p className="text-sm font-medium text-[var(--velour-text)] mb-0.5">{card.label}</p>
                      <p className="text-xs text-[var(--velour-text-soft)]">{card.sub}</p>
                    </button>
                  ))}
                </div>

                {/* Bottom strip — 4 cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 slide-in-up delay-400">
                  <button
                    onClick={() => setShowGamification(true)}
                    className="flex items-center gap-3 p-4 bg-white border border-[var(--velour-champagne)] rounded-2xl hover:border-[var(--velour-gold)] transition-all group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                      <Trophy className="text-amber-500" style={{ width: 18, height: 18 }} />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-[var(--velour-text)]">Rewards</p>
                      <p className="text-xs text-[var(--velour-text-soft)]">{velourCoins} coins</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[var(--velour-text-soft)] ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>

                  <button
                    onClick={() => setShowOrderTracking(true)}
                    className="flex items-center gap-3 p-4 bg-white border border-[var(--velour-champagne)] rounded-2xl hover:border-[var(--velour-gold)] transition-all group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <Package className="text-blue-500" style={{ width: 18, height: 18 }} />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-[var(--velour-text)]">Track Orders</p>
                      <p className="text-xs text-[var(--velour-text-soft)]">Monitor deliveries</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[var(--velour-text-soft)] ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>

                  <button
                    onClick={() => setShowSupport(true)}
                    className="flex items-center gap-3 p-4 bg-white border border-[var(--velour-champagne)] rounded-2xl hover:border-[var(--velour-gold)] transition-all group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                      <HelpCircle className="text-orange-500" style={{ width: 18, height: 18 }} />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-[var(--velour-text)]">Support</p>
                      <p className="text-xs text-[var(--velour-text-soft)]">FAQs & contact</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[var(--velour-text-soft)] ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>

                  <button
                    onClick={() => handleCardClick('account')}
                    className="flex items-center gap-3 p-4 bg-white border border-[var(--velour-champagne)] rounded-2xl hover:border-[var(--velour-gold)] transition-all group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                      <User className="text-green-500" style={{ width: 18, height: 18 }} />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-[var(--velour-text)]">{user ? `Hi, ${user.name.split(' ')[0]}` : 'Login / Sign Up'}</p>
                      <p className="text-xs text-[var(--velour-text-soft)]">{user ? 'View account' : 'Access features'}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[var(--velour-text-soft)] ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="max-w-3xl mx-auto px-6 py-8 space-y-5">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} slide-in-up`}>
                    <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                      {message.type === 'ai' && (
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 rounded-lg bg-[var(--velour-gold)] flex items-center justify-center">
                            <Sparkles className="w-3.5 h-3.5 text-white" />
                          </div>
                          <span className="text-xs text-[var(--velour-text-soft)] font-medium">Daizzy</span>
                        </div>
                      )}
                      <div className={`rounded-2xl px-5 py-3.5 ${message.type === 'user'
                        ? 'bg-[var(--velour-gold)] text-white'
                        : 'bg-white border border-[var(--velour-champagne)] text-[var(--velour-text)]'
                      }`}>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                      </div>
                      {message.products && (
                        <div className="mt-3 space-y-3">
                          {message.products.map(product => <ProductCard key={product.id} product={product} />)}
                        </div>
                      )}
                      {message.component === 'spin-wheel' && <div className="mt-3"><SpinWheel /></div>}
                      {message.component === 'style-quiz' && <div className="mt-3"><StyleQuiz onComplete={() => handleCoinsUpdate(100)} onAddToCart={addToCart} /></div>}
                      {message.component === 'outfit-builder' && <div className="mt-3"><OutfitBuilder onCoinsUpdate={handleCoinsUpdate} onAddToCart={addToCart} /></div>}
                      {message.component === 'occasion-selector' && <div className="mt-3"><OccasionSelector onAddToCart={addToCart} /></div>}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </main>

          {/* Footer */}
          <footer className="flex-shrink-0 px-6 md:px-10 py-4 bg-white border-t border-[var(--velour-champagne)]">
            <div className="max-w-5xl mx-auto">
              <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
                <button onClick={() => setShowCart(true)} className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-[var(--velour-gold)] text-white rounded-full text-xs font-medium hover:bg-[var(--velour-gold-dark)] transition-all">
                  <ShoppingCart className="w-3.5 h-3.5" />
                  Cart {cartCount > 0 && `(${cartCount})`}
                </button>
                <button onClick={() => setShowFullChat(true)} className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-[#1C1C1C] text-white rounded-full text-xs font-medium hover:bg-black transition-all">
                  <MessageCircle className="w-3.5 h-3.5" />Full Chat
                </button>
                <button onClick={() => setShowGamification(true)} className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-700 rounded-full text-xs font-medium hover:bg-amber-200 transition-all">
                  <Trophy className="w-3.5 h-3.5" />Rewards
                </button>
                <button onClick={() => setShowSupport(true)} className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-orange-100 text-orange-700 rounded-full text-xs font-medium hover:bg-orange-200 transition-all">
                  <HelpCircle className="w-3.5 h-3.5" />Support
                </button>
                {[
                  { id: 'under250k', label: 'Under ₹2.5L', icon: DollarSign },
                  { id: 'wedding', label: 'Wedding', icon: Heart },
                  { id: 'casual', label: 'Casual', icon: Coffee },
                  { id: 'trending', label: 'Trending', icon: Flame },
                ].map(chip => (
                  <button key={chip.id} onClick={() => handleQuickAction(chip.id)}
                    className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-[var(--velour-cream)] text-[var(--velour-text)] rounded-full text-xs font-medium hover:bg-[var(--velour-champagne)] transition-all border border-[var(--velour-champagne)]">
                    <chip.icon className="w-3.5 h-3.5 text-[var(--velour-gold)]" />
                    {chip.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask Daizzy anything..."
                    className="w-full px-5 py-3 bg-[var(--velour-cream)] border border-[var(--velour-champagne)] rounded-full text-sm focus:outline-none focus:border-[var(--velour-gold)] transition-all placeholder:text-[var(--velour-text-soft)]"
                  />
                </div>
                <button
                  onClick={handleVoiceInput}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${isListening ? 'bg-red-500' : 'bg-[var(--velour-cream)] border border-[var(--velour-champagne)] hover:border-[var(--velour-gold)]'}`}
                >
                  {isListening ? <MicOff className="w-4 h-4 text-white" /> : <Mic className="w-4 h-4 text-[var(--velour-gold)]" />}
                </button>
                <button
                  onClick={handleSend}
                  className="w-10 h-10 rounded-full bg-[var(--velour-gold)] flex items-center justify-center hover:bg-[var(--velour-gold-dark)] transition-all flex-shrink-0"
                >
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </footer>
        </div>
      )}

      {/* Overlays */}
      {showAdvancedFlow && <AdvancedStylingFlow onClose={() => setShowAdvancedFlow(false)} onAddToCart={addToCart} />}
      {showGamification && <GamificationRewards onClose={() => setShowGamification(false)} currentCoins={velourCoins} onCoinsUpdate={handleCoinsUpdate} />}
      {showFullChat && <DaizzyFullChat onClose={() => setShowFullChat(false)} onAddToCart={addToCart} />}
      {showCart && <CartCheckout onClose={() => setShowCart(false)} availableCoins={velourCoins} onCoinsUpdate={handleCoinsUpdate} cartItems={cartItems} setCartItems={setCartItems} onAddToCart={addToCart} />}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onLoginSuccess={(userData) => { setUser(userData); setShowAuth(false); }} />}
      {showOrderTracking && <OrderTracking onClose={() => setShowOrderTracking(false)} userEmail={user?.email} />}
      {showSupport && <CustomerSupport onClose={() => setShowSupport(false)} userEmail={user?.email} />}
    </>
  );
}