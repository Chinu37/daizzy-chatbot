import { Sparkles, Crown, Star, ArrowRight, Quote } from 'lucide-react';
import { DaizzyAssistant } from './components/DaizzyAssistant';
import { useEffect, useRef } from 'react';

export default function App() {
  const heroImageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (heroImageRef.current) {
        const scrollY = window.scrollY;
        heroImageRef.current.style.transform = `translateY(${scrollY * 0.15}px)`;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <div className="min-h-screen bg-[var(--velour-ivory)] overflow-x-hidden">

      {/* Thin top bar */}
      <div className="w-full bg-[var(--velour-gold)] py-2 px-4 text-center">
        <p className="text-xs text-white tracking-widest uppercase">Free delivery on orders above ₹5,000 &nbsp;·&nbsp; New arrivals every Friday</p>
      </div>

      {/* Header */}
      <header className="px-6 py-5 md:px-12 border-b border-[var(--velour-champagne)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[var(--velour-gold)] rounded-lg flex items-center justify-center shadow-md">
              <svg width="22" height="22" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 8L26 12L30 14L26 16L24 20L22 16L18 14L22 12L24 8Z" fill="white" fillOpacity="0.9"/>
                <path d="M14 16L18 22L24 38L30 22L34 16" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-serif text-[var(--velour-text)] tracking-tight">Velour</h1>
              <p className="text-[10px] text-[var(--velour-gold)] tracking-widest uppercase">Est. 2024, Mumbai</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {['Collections', 'New Arrivals', 'About'].map(item => (
              <a key={item} href="#" className="text-sm text-[var(--velour-text-soft)] hover:text-[var(--velour-text)] transition-colors border-b border-transparent hover:border-[var(--velour-gold)] pb-0.5">
                {item}
              </a>
            ))}
          </nav>

          <button className="hidden md:block px-5 py-2 border border-[var(--velour-gold)] text-[var(--velour-gold)] text-sm rounded-full hover:bg-[var(--velour-gold)] hover:text-white transition-all">
            Sign In
          </button>
        </div>
      </header>

      {/* Hero — Asymmetric layout */}
      <section className="px-6 md:px-12 pt-16 pb-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
         <div>
  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--velour-champagne)] rounded-full mb-6 slide-in-left delay-100">
              <Sparkles className="w-3.5 h-3.5 text-[var(--velour-gold)]" />
              <span className="text-xs font-medium text-[var(--velour-text)]">Meet Daizzy, Your AI Stylist</span>
            </div>

            <h2 className="text-5xl md:text-6xl font-serif text-[var(--velour-text)] leading-[1.1] mb-6 slide-in-left delay-200">
              Luxury Shopping,
              <br />
              <em className="text-[var(--velour-gold)] not-italic">Reimagined</em>
            </h2>

            <p className="text-base text-[var(--velour-text-soft)] leading-relaxed mb-8 max-w-md slide-in-left delay-300">
              Experience personalized luxury with Daizzy, your AI concierge.
              Discover curated collections, build complete looks, and enjoy
              a shopping journey crafted just for you.
            </p>

            <div className="flex flex-wrap gap-3 slide-in-left delay-400">
              <button className="px-7 py-3.5 bg-[var(--velour-gold)] text-white rounded-full text-sm font-medium hover:bg-[var(--velour-gold-dark)] transition-colors flex items-center gap-2">
                Start Shopping <ArrowRight className="w-4 h-4" />
              </button>
              <button className="px-7 py-3.5 border border-[var(--velour-champagne)] text-[var(--velour-text)] rounded-full text-sm font-medium hover:border-[var(--velour-gold)] transition-colors">
                Explore Collections
              </button>
            </div>

            {/* Social proof */}
            <div className="mt-10 flex items-center gap-4">
              <div className="flex -space-x-2">
                {['1580492', '1502323', '1531746'].map((id, i) => (
                  <img key={i} src={`https://images.unsplash.com/photo-${id}?w=40&h=40&fit=crop&face`}
                    className="w-8 h-8 rounded-full border-2 border-white object-cover" alt="" />
                ))}
              </div>
              <p className="text-xs text-[var(--velour-text-soft)]">
                <span className="font-semibold text-[var(--velour-text)]">2,400+</span> happy customers this month
              </p>
            </div>
          </div>

         {/* Right: Editorial image collage */}
<div className="relative h-[500px] hidden md:block overflow-hidden" ref={heroImageRef}>
            <img
              src="https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400&h=550&fit=crop"
              className="absolute right-0 top-0 w-64 h-80 object-cover rounded-2xl shadow-xl"
              alt="Evening Elegance"
            />
            <img
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300&h=400&fit=crop"
              className="absolute left-0 bottom-0 w-52 h-64 object-cover rounded-2xl shadow-lg"
              alt="Casual Luxury"
            />
            <div className="absolute right-16 bottom-12 bg-white rounded-2xl shadow-lg px-4 py-3 flex items-center gap-3">
              <div className="w-8 h-8 bg-[var(--velour-gold)]/10 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[var(--velour-gold)]" />
              </div>
              <div>
                <p className="text-xs font-medium text-[var(--velour-text)]">Daizzy styled this</p>
                <p className="text-[10px] text-[var(--velour-text-soft)]">Wedding look · ₹32,870</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features — Horizontal cards, not equal grid */}
      <section className="px-6 md:px-12 py-16 bg-[var(--velour-cream)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Big feature card */}
            <div className="md:w-1/2 p-8 bg-[var(--velour-gold)] rounded-2xl text-white">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-5">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-serif mb-3">AI-Powered Styling</h3>
              <p className="text-white/80 leading-relaxed text-sm mb-6">
                Daizzy learns your preferences and curates personalized looks for every occasion — from office wear to wedding outfits.
              </p>
              <button className="flex items-center gap-2 text-sm font-medium text-white border-b border-white/40 pb-0.5 hover:border-white transition-colors">
                Try Daizzy <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Two small cards stacked */}
            <div className="md:w-1/2 flex flex-col gap-6">
              <div className="p-6 bg-white rounded-2xl border border-[var(--velour-champagne)]">
                <div className="w-10 h-10 bg-[var(--velour-gold)]/10 rounded-xl flex items-center justify-center mb-4">
                  <Crown className="w-5 h-5 text-[var(--velour-gold)]" />
                </div>
                <h3 className="text-lg font-serif text-[var(--velour-text)] mb-2">Exclusive Rewards</h3>
                <p className="text-sm text-[var(--velour-text-soft)] leading-relaxed">
                  Earn Velour Coins with every purchase and unlock premium benefits.
                </p>
              </div>
              <div className="p-6 bg-white rounded-2xl border border-[var(--velour-champagne)]">
                <div className="w-10 h-10 bg-[var(--velour-gold)]/10 rounded-xl flex items-center justify-center mb-4">
                  <Star className="w-5 h-5 text-[var(--velour-gold)]" />
                </div>
                <h3 className="text-lg font-serif text-[var(--velour-text)] mb-2">Occasion-Based Shopping</h3>
                <p className="text-sm text-[var(--velour-text-soft)] leading-relaxed">
                  Find the perfect outfit for any event with smart recommendations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Collections — Editorial layout */}
      <section className="px-6 md:px-12 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs text-[var(--velour-gold)] tracking-widest uppercase mb-2">Handpicked for you</p>
              <h2 className="text-3xl md:text-4xl font-serif text-[var(--velour-text)]">Featured Collections</h2>
            </div>
            <a href="#" className="hidden md:flex items-center gap-2 text-sm text-[var(--velour-text-soft)] hover:text-[var(--velour-gold)] transition-colors">
              View all <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Asymmetric grid: 1 tall + 2 short */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:row-span-2 group relative h-64 md:h-auto rounded-2xl overflow-hidden cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent z-10" />
              <img src="https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&h=900&fit=crop"
                alt="Evening Elegance" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
                <p className="text-xs text-white/70 mb-1">24 pieces</p>
                <h3 className="text-xl font-serif text-white mb-2">Evening Elegance</h3>
                <span className="text-xs text-white/80 flex items-center gap-1">Explore <ArrowRight className="w-3 h-3" /></span>
              </div>
            </div>
            <div className="group relative h-56 rounded-2xl overflow-hidden cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent z-10" />
              <img src="https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=600&h=400&fit=crop"
                alt="Modern Office" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                <p className="text-xs text-white/70 mb-1">18 pieces</p>
                <h3 className="text-lg font-serif text-white">Modern Office</h3>
              </div>
            </div>
            <div className="group relative h-56 rounded-2xl overflow-hidden cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent z-10" />
              <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=400&fit=crop"
                alt="Casual Luxury" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                <p className="text-xs text-white/70 mb-1">32 pieces</p>
                <h3 className="text-lg font-serif text-white">Casual Luxury</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 md:px-12 py-16 bg-[var(--velour-cream)]">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs text-[var(--velour-gold)] tracking-widest uppercase mb-2 text-center">What our customers say</p>
          <h2 className="text-3xl font-serif text-[var(--velour-text)] text-center mb-10">Real people, real style</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Priya Mehta",
                location: "Mumbai",
                text: "Daizzy helped me build my entire wedding guest outfit in under 5 minutes. The recommendations were spot on — got so many compliments!",
                rating: 5
              },
              {
                name: "Arjun Sharma",
                location: "Delhi",
                text: "I usually hate shopping but this actually made it fun. Asked Daizzy for office looks under ₹5K and she delivered. No fluff, just great picks.",
                rating: 5
              },
              {
                name: "Sneha Kulkarni",
                location: "Pune",
                text: "The outfit builder is genuinely impressive. I picked my colors, it gave me a full look with accessories and perfume. Ordered everything same day.",
                rating: 5
              }
            ].map((review, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-[var(--velour-champagne)]">
                <Quote className="w-6 h-6 text-[var(--velour-gold)]/40 mb-4" />
                <p className="text-sm text-[var(--velour-text-soft)] leading-relaxed mb-5">"{review.text}"</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[var(--velour-text)]">{review.name}</p>
                    <p className="text-xs text-[var(--velour-text-soft)]">{review.location}</p>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({length: review.rating}).map((_, j) => (
                      <Star key={j} className="w-3.5 h-3.5 fill-[var(--velour-gold)] text-[var(--velour-gold)]" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — Simpler, less dramatic */}
      <section className="px-6 md:px-12 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-14 h-14 bg-[var(--velour-gold)]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-7 h-7 text-[var(--velour-gold)]" />
          </div>
          <h2 className="text-3xl md:text-4xl font-serif text-[var(--velour-text)] mb-4">
            Ready to Elevate Your Style?
          </h2>
          <p className="text-base text-[var(--velour-text-soft)] mb-8 leading-relaxed">
            Click the Daizzy icon to start your personalized luxury shopping experience.
            Get instant styling advice, curated recommendations, and exclusive rewards.
          </p>
          <div className="flex items-center justify-center gap-6 text-xs text-[var(--velour-text-soft)]">
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-[var(--velour-gold)] rounded-full inline-block"></span>AI-Powered</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-[var(--velour-gold)] rounded-full inline-block"></span>Personalized</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-[var(--velour-gold)] rounded-full inline-block"></span>Rewarding</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 md:px-12 py-8 border-t border-[var(--velour-champagne)]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--velour-text-soft)]">© 2024 Velour. Made with ♥ in Mumbai.</p>
          <div className="flex gap-6">
            {['Privacy', 'Terms', 'Contact'].map(item => (
              <a key={item} href="#" className="text-xs text-[var(--velour-text-soft)] hover:text-[var(--velour-gold)] transition-colors">{item}</a>
            ))}
          </div>
        </div>
      </footer>

      {/* Daizzy AI Assistant */}
      <DaizzyAssistant />
    </div>
  );
}