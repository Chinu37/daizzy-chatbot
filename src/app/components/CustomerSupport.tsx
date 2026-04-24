import { X, ChevronRight, ChevronDown, MessageCircle, Mail, Phone, Package, RefreshCw, CreditCard, Shirt, HelpCircle, Send, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';


interface CustomerSupportProps {
  onClose: () => void;
  userEmail?: string;
}

const faqs = [
  {
    category: 'Orders',
    icon: Package,
    questions: [
      { q: 'How do I track my order?', a: 'Go to the Daizzy menu and click "Track Orders". Enter your order ID or email to see real-time delivery status.' },
      { q: 'Can I cancel my order?', a: 'Orders can be cancelled within 24 hours of placement. Contact our support team immediately via chat or email.' },
      { q: 'What is the delivery time?', a: 'Standard delivery takes 5-7 business days. Express delivery (2-3 days) is available for select pin codes.' }
    ]
  },
  {
    category: 'Returns & Refunds',
    icon: RefreshCw,
    questions: [
      { q: 'What is the return policy?', a: 'We offer a 14-day return policy on all items. Products must be unused and in original packaging.' },
      { q: 'How long does a refund take?', a: 'Refunds are processed within 5-7 business days after we receive the returned item.' },
      { q: 'Can I exchange a product?', a: 'Yes! Exchanges are available for size or color changes. Contact support to initiate an exchange.' }
    ]
  },
  {
    category: 'Payments',
    icon: CreditCard,
    questions: [
      { q: 'What payment methods are accepted?', a: 'We accept Credit/Debit cards, UPI, Net Banking, and Cash on Delivery (COD).' },
      { q: 'Is my payment information secure?', a: 'Yes, all transactions are encrypted and secured with industry-standard SSL technology.' },
      { q: 'Why was my payment declined?', a: 'This could be due to insufficient funds, incorrect card details, or bank restrictions. Try a different payment method.' }
    ]
  },
  {
    category: 'Products',
    icon: Shirt,
    questions: [
      { q: 'Are the products authentic?', a: 'Yes, all products on Velour are 100% authentic and sourced directly from verified luxury brands.' },
      { q: 'How do I find my size?', a: 'Each product page has a detailed size guide. Ask Daizzy for personalized size recommendations.' },
      { q: 'What if the product looks different?', a: 'Minor color variations may occur due to screen differences. Contact support with photos for assistance.' }
    ]
  }
];

export function CustomerSupport({ onClose, userEmail }: CustomerSupportProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: userEmail || '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
  if (!formData.name || !formData.email || !formData.message) return;
  try {
    const userId = localStorage.getItem('daizzy_user_id') || 'guest';
    await fetch('http://localhost:8001/support/ticket', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId,
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message
      })
    });
  } catch (error) {
    console.error('Support ticket error:', error);
  }
  setSubmitted(true);
  setTimeout(() => {
    setSubmitted(false);
    setShowContactForm(false);
    setFormData({ name: '', email: userEmail || '', subject: '', message: '' });
  }, 3000);
};

  return (
    <div className="fixed inset-0 z-50 bg-[var(--velour-ivory)] flex flex-col">
      {/* Header */}
      <header className="flex-shrink-0 px-6 py-4 bg-white border-b border-[var(--velour-champagne)] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[var(--velour-gold)] flex items-center justify-center">
            <HelpCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-serif text-[var(--velour-text)]">Customer Support</h1>
            <p className="text-[10px] text-[var(--velour-gold)] tracking-widest uppercase">Velour Help Center</p>
          </div>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-[var(--velour-champagne)] flex items-center justify-center transition-all">
          <X className="w-4 h-4 text-[var(--velour-text-soft)]" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-8">

          {/* Contact options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
            <button
              onClick={() => setShowContactForm(true)}
              className="flex items-center gap-3 p-4 bg-white border border-[var(--velour-champagne)] rounded-2xl hover:border-[var(--velour-gold)] transition-all group text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--velour-text)]">Email Support</p>
                <p className="text-xs text-[var(--velour-text-soft)]">Reply in 24 hours</p>
              </div>
              <ChevronRight className="w-4 h-4 text-[var(--velour-text-soft)] ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <a href="tel:+918800001234" className="flex items-center gap-3 p-4 bg-white border border-[var(--velour-champagne)] rounded-2xl hover:border-[var(--velour-gold)] transition-all group text-left">
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--velour-text)]">Call Us</p>
                <p className="text-xs text-[var(--velour-text-soft)]">Mon–Sat, 10am–7pm</p>
              </div>
              <ChevronRight className="w-4 h-4 text-[var(--velour-text-soft)] ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>

            <button
              onClick={onClose}
              className="flex items-center gap-3 p-4 bg-white border border-[var(--velour-champagne)] rounded-2xl hover:border-[var(--velour-gold)] transition-all group text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--velour-text)]">Chat with Daizzy</p>
                <p className="text-xs text-[var(--velour-text-soft)]">Instant AI assistance</p>
              </div>
              <ChevronRight className="w-4 h-4 text-[var(--velour-text-soft)] ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>

          {/* Contact Form */}
          {showContactForm && (
            <div className="mb-8 p-6 bg-white border border-[var(--velour-champagne)] rounded-2xl">
              {submitted ? (
                <div className="text-center py-6">
                  <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-7 h-7 text-green-500" />
                  </div>
                  <h3 className="text-lg font-serif text-[var(--velour-text)] mb-2">Message Sent!</h3>
                  <p className="text-sm text-[var(--velour-text-soft)]">Our team will get back to you within 24 hours.</p>
                </div>
              ) : (
                <>
                  <h3 className="text-base font-serif text-[var(--velour-text)] mb-4">Send us a message</h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <input type="text" placeholder="Your name" value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="px-4 py-2.5 bg-[var(--velour-cream)] border border-[var(--velour-champagne)] rounded-xl text-sm focus:outline-none focus:border-[var(--velour-gold)] transition-all" />
                      <input type="email" placeholder="Email address" value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className="px-4 py-2.5 bg-[var(--velour-cream)] border border-[var(--velour-champagne)] rounded-xl text-sm focus:outline-none focus:border-[var(--velour-gold)] transition-all" />
                    </div>
                    <input type="text" placeholder="Subject (e.g. Order issue, Return request)"
                      value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[var(--velour-cream)] border border-[var(--velour-champagne)] rounded-xl text-sm focus:outline-none focus:border-[var(--velour-gold)] transition-all" />
                    <textarea placeholder="Describe your issue in detail..." value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      rows={4} className="w-full px-4 py-2.5 bg-[var(--velour-cream)] border border-[var(--velour-champagne)] rounded-xl text-sm focus:outline-none focus:border-[var(--velour-gold)] transition-all resize-none" />
                    <div className="flex gap-3">
                      <button onClick={() => setShowContactForm(false)}
                        className="flex-1 px-4 py-2.5 border border-[var(--velour-champagne)] text-[var(--velour-text-soft)] rounded-xl text-sm hover:border-[var(--velour-gold)] transition-all">
                        Cancel
                      </button>
                      <button onClick={handleSubmit}
                        className="flex-1 px-4 py-2.5 bg-[var(--velour-gold)] text-white rounded-xl text-sm font-medium hover:bg-[var(--velour-gold-dark)] transition-all flex items-center justify-center gap-2">
                        <Send className="w-4 h-4" /> Send Message
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* FAQs */}
          <div>
            <p className="text-xs text-[var(--velour-gold)] tracking-widest uppercase mb-4">Frequently Asked Questions</p>
            <div className="space-y-3">
              {faqs.map((category) => (
                <div key={category.category} className="bg-white border border-[var(--velour-champagne)] rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setActiveCategory(activeCategory === category.category ? null : category.category)}
                    className="w-full flex items-center justify-between p-5 hover:bg-[var(--velour-cream)] transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[var(--velour-gold)]/10 flex items-center justify-center">
                        <category.icon className="w-4 h-4 text-[var(--velour-gold)]" />
                      </div>
                      <span className="text-sm font-medium text-[var(--velour-text)]">{category.category}</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-[var(--velour-text-soft)] transition-transform ${activeCategory === category.category ? 'rotate-180' : ''}`} />
                  </button>

                  {activeCategory === category.category && (
                    <div className="px-5 pb-4 space-y-2 border-t border-[var(--velour-champagne)]">
                      {category.questions.map((item) => (
                        <div key={item.q} className="border border-[var(--velour-champagne)] rounded-xl overflow-hidden mt-2">
                          <button
                            onClick={() => setActiveQuestion(activeQuestion === item.q ? null : item.q)}
                            className="w-full flex items-center justify-between p-4 text-left hover:bg-[var(--velour-cream)] transition-all"
                          >
                            <span className="text-sm text-[var(--velour-text)] pr-4">{item.q}</span>
                            <ChevronDown className={`w-4 h-4 text-[var(--velour-text-soft)] flex-shrink-0 transition-transform ${activeQuestion === item.q ? 'rotate-180' : ''}`} />
                          </button>
                          {activeQuestion === item.q && (
                            <div className="px-4 pb-4 border-t border-[var(--velour-champagne)]">
                              <p className="text-sm text-[var(--velour-text-soft)] leading-relaxed pt-3">{item.a}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}