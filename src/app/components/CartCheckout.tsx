import { useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, Sparkles, Tag, Coins, Check, AlertCircle, ChevronRight } from 'lucide-react';
import { placeOrder, addToCart, removeFromCart } from '../../api';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  quantity: number;
  maxStock: number;
}

interface CartCheckoutProps {
  onClose: () => void;
  availableCoins: number;
  onCoinsUpdate: (change: number) => void;
  cartItems: CartItem[];
  setCartItems: (items: CartItem[] | ((prev: CartItem[]) => CartItem[])) => void;
  onAddToCart: (product: { id: string; name: string; price: number; image: string; category: string }) => void;
}

const recommendedProducts = [
  { id: 'r1', name: 'Pearl Necklace', price: 6890, image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&h=200&fit=crop', category: 'Accessory' },
  { id: 'r2', name: 'Leather Handbag', price: 5490, image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&h=200&fit=crop', category: 'Accessory' },
  { id: 'r3', name: 'Rose Gold Bracelet', price: 7890, image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=300&h=200&fit=crop', category: 'Accessory' }
];

const availableCoupons = [
  { code: 'WELCOME10', discount: 10, type: 'percentage' as const, description: '10% off on first order' },
  { code: 'LUXURY15', discount: 15, type: 'percentage' as const, description: '15% off on orders above ₹10K' },
  { code: 'FLAT500', discount: 500, type: 'fixed' as const, description: '₹500 off on orders above ₹5K' }
];

export function CartCheckout({ onClose, availableCoins, onCoinsUpdate, cartItems, setCartItems, onAddToCart }: CartCheckoutProps) {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<typeof availableCoupons[0] | null>(null);
  const [coinsToUse, setCoinsToUse] = useState(0);
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'address' | 'payment' | 'confirmation'>('address');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [couponError, setCouponError] = useState('');
  const [showCouponSuccess, setShowCouponSuccess] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [address, setAddress] = useState({
    name: '', line1: '', city: '', pin: '', phone: ''
  });

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = appliedCoupon ? appliedCoupon.type === 'percentage' ? (subtotal * appliedCoupon.discount) / 100 : appliedCoupon.discount : 0;
  const maxCoinsUsable = Math.floor(subtotal * 0.3);
  const actualCoinsToUse = Math.min(coinsToUse, maxCoinsUsable, availableCoins);
  const coinValue = actualCoinsToUse * 0.1;
  const deliveryFee = subtotal >= 5000 ? 0 : 100;
  const finalTotal = Math.max(0, subtotal - discountAmount - coinValue + deliveryFee);

  const updateQuantity = (id: string, change: number) => {
    setCartItems(prev =>
      prev.map(item => {
        if (item.id === id) {
          const newQuantity = Math.max(1, Math.min(item.maxStock, item.quantity + change));
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const removeItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const applyCoupon = () => {
    setCouponError('');
    setShowCouponSuccess(false);
    const coupon = availableCoupons.find(c => c.code === couponCode.toUpperCase());
    if (!coupon) { setCouponError('Invalid coupon code'); return; }
    if (coupon.code === 'LUXURY15' && subtotal < 10000) { setCouponError('Minimum order value ₹10,000 required'); return; }
    if (coupon.code === 'FLAT500' && subtotal < 5000) { setCouponError('Minimum order value ₹5,000 required'); return; }
    setAppliedCoupon(coupon);
    setShowCouponSuccess(true);
    setCouponCode('');
    setTimeout(() => setShowCouponSuccess(false), 3000);
  };

  const handleCoinsChange = (value: number) => {
    setCoinsToUse(Math.min(value, maxCoinsUsable, availableCoins));
  };

  const addRecommendedToCart = (product: typeof recommendedProducts[0]) => {
    onAddToCart(product);
  };

  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) return;
    setShowCheckout(true);
    setCheckoutStep('address');
  };

  // Place order — now calls backend
  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    try {
      const userId = localStorage.getItem('daizzy_user_id') || 'guest';
      const fullAddress = `${address.name}, ${address.line1}, ${address.city} - ${address.pin}, Phone: ${address.phone}`;

      const result = await placeOrder({
        user_id: userId,
        items: cartItems.map(item => ({
          product_id: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          category: item.category,
          quantity: item.quantity
        })),
        address: fullAddress,
        payment_method: 'COD'
      });

      if (result.success) {
        setOrderId(result.order.id);
      } else {
        setOrderId(`VLR${Date.now().toString().slice(-8)}`);
      }
    } catch (error) {
      setOrderId(`VLR${Date.now().toString().slice(-8)}`);
    }

    setOrderPlaced(true);
    if (actualCoinsToUse > 0) onCoinsUpdate(-actualCoinsToUse);
    setTimeout(() => {
      setCartItems([]);
      setAppliedCoupon(null);
      setCoinsToUse(0);
    }, 2000);
    setIsPlacingOrder(false);
  };

  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <div className="fixed inset-0 z-50 bg-[#F8F5F0] flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white flex items-center justify-center shadow-lg">
            <ShoppingBag className="w-12 h-12 text-[#7A7A7A]" />
          </div>
          <h2 className="text-3xl font-serif text-[#2C2C2C] mb-3">Your Cart is Empty</h2>
          <p className="text-[#7A7A7A] mb-6">Discover luxury pieces curated just for you</p>
          <button onClick={onClose} className="px-8 py-3 bg-gradient-to-r from-[#D4AF37] to-[#C9A961] text-white rounded-full font-medium hover:shadow-xl transition-all">
            Explore Products
          </button>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="fixed inset-0 z-50 bg-[#F8F5F0] flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#C9A961] flex items-center justify-center shadow-2xl">
            <Check className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-serif text-[#2C2C2C] mb-3">Order Placed Successfully!</h2>
          <p className="text-[#7A7A7A] mb-2">Order ID: <span className="font-medium text-[#2C2C2C]">{orderId}</span></p>
          <p className="text-2xl font-serif text-[#D4AF37] mb-6">₹{finalTotal.toLocaleString('en-IN')}</p>
          <div className="p-4 bg-white rounded-2xl border border-gray-200 mb-6 text-left">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-[#2C2C2C] mb-1">Daizzy says:</p>
                <p className="text-sm text-[#7A7A7A]">Your order is confirmed! Want help styling your next look? I'm here to assist.</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 px-6 py-3 bg-white border-2 border-[#D4AF37] text-[#D4AF37] rounded-full font-medium hover:bg-[#D4AF37] hover:text-white transition-all">
              Continue Shopping
            </button>
            <button onClick={onClose} className="flex-1 px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-[#C9A961] text-white rounded-full font-medium hover:shadow-xl transition-all">
              Track Order
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showCheckout) {
    return (
      <div className="fixed inset-0 z-50 bg-[#F8F5F0] overflow-y-auto">
        <div className="max-w-2xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <button onClick={() => setShowCheckout(false)} className="w-10 h-10 rounded-full hover:bg-white flex items-center justify-center transition-all">
              <X className="w-5 h-5 text-[#2C2C2C]" />
            </button>
            <h1 className="text-2xl font-serif text-[#2C2C2C]">Checkout</h1>
            <div className="w-10" />
          </div>

          <div className="flex items-center justify-between mb-8">
            {['Address', 'Payment', 'Review'].map((step, index) => {
              const stepNumber = index + 1;
              const isActive = (checkoutStep === 'address' && stepNumber === 1) || (checkoutStep === 'payment' && stepNumber === 2) || (checkoutStep === 'confirmation' && stepNumber === 3);
              const isCompleted = (checkoutStep === 'payment' && stepNumber === 1) || (checkoutStep === 'confirmation' && (stepNumber === 1 || stepNumber === 2));
              return (
                <div key={step} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all ${isCompleted ? 'bg-[#D4AF37] text-white' : isActive ? 'bg-[#D4AF37] text-white ring-4 ring-[#D4AF37]/20' : 'bg-gray-200 text-gray-400'}`}>
                      {isCompleted ? <Check className="w-5 h-5" /> : stepNumber}
                    </div>
                    <span className="text-xs text-[#7A7A7A] mt-2">{step}</span>
                  </div>
                  {index < 2 && (<div className={`flex-1 h-1 mx-2 rounded ${isCompleted ? 'bg-[#D4AF37]' : 'bg-gray-200'}`} />)}
                </div>
              );
            })}
          </div>

          {checkoutStep === 'address' && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h3 className="font-medium text-[#2C2C2C] mb-4">Delivery Address</h3>
                <div className="space-y-3">
                  <input type="text" placeholder="Full Name" value={address.name} onChange={e => setAddress({...address, name: e.target.value})} className="w-full px-4 py-3 bg-[#F8F5F0] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30" />
                  <input type="text" placeholder="Address Line 1" value={address.line1} onChange={e => setAddress({...address, line1: e.target.value})} className="w-full px-4 py-3 bg-[#F8F5F0] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30" />
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" placeholder="City" value={address.city} onChange={e => setAddress({...address, city: e.target.value})} className="px-4 py-3 bg-[#F8F5F0] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30" />
                    <input type="text" placeholder="PIN Code" value={address.pin} onChange={e => setAddress({...address, pin: e.target.value})} className="px-4 py-3 bg-[#F8F5F0] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30" />
                  </div>
                  <input type="tel" placeholder="Phone Number" value={address.phone} onChange={e => setAddress({...address, phone: e.target.value})} className="w-full px-4 py-3 bg-[#F8F5F0] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30" />
                </div>
              </div>
              <button onClick={() => setCheckoutStep('payment')} className="w-full px-6 py-4 bg-gradient-to-r from-[#D4AF37] to-[#C9A961] text-white rounded-full font-medium hover:shadow-xl transition-all flex items-center justify-center gap-2">
                Continue to Payment <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {checkoutStep === 'payment' && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h3 className="font-medium text-[#2C2C2C] mb-4">Payment Method</h3>
                <div className="space-y-3">
                  {['Credit/Debit Card', 'UPI', 'Net Banking', 'Cash on Delivery'].map((method) => (
                    <label key={method} className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-[#D4AF37] cursor-pointer transition-all">
                      <input type="radio" name="payment" className="w-4 h-4 text-[#D4AF37]" />
                      <span className="text-[#2C2C2C]">{method}</span>
                    </label>
                  ))}
                </div>
              </div>
              <button onClick={() => setCheckoutStep('confirmation')} className="w-full px-6 py-4 bg-gradient-to-r from-[#D4AF37] to-[#C9A961] text-white rounded-full font-medium hover:shadow-xl transition-all flex items-center justify-center gap-2">
                Review Order <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {checkoutStep === 'confirmation' && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h3 className="font-medium text-[#2C2C2C] mb-4">Order Summary</h3>
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[#2C2C2C]">{item.name}</p>
                        <p className="text-xs text-[#7A7A7A]">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium text-[#2C2C2C]">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-[#7A7A7A]">Subtotal</span><span className="text-[#2C2C2C]">₹{subtotal.toLocaleString('en-IN')}</span></div>
                  {discountAmount > 0 && (<div className="flex justify-between text-sm text-green-600"><span>Discount ({appliedCoupon?.code})</span><span>-₹{discountAmount.toLocaleString('en-IN')}</span></div>)}
                  {coinValue > 0 && (<div className="flex justify-between text-sm text-[#D4AF37]"><span>Coins Used ({actualCoinsToUse})</span><span>-₹{coinValue.toFixed(2)}</span></div>)}
                  <div className="flex justify-between text-sm"><span className="text-[#7A7A7A]">Delivery</span><span className={deliveryFee === 0 ? 'text-green-600' : 'text-[#2C2C2C]'}>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span></div>
                  <div className="flex justify-between text-lg font-serif pt-2 border-t border-gray-200"><span className="text-[#2C2C2C]">Total</span><span className="text-[#D4AF37]">₹{finalTotal.toLocaleString('en-IN')}</span></div>
                </div>
              </div>
              <button onClick={handlePlaceOrder} disabled={isPlacingOrder} className="w-full px-6 py-4 bg-gradient-to-r from-[#D4AF37] to-[#C9A961] text-white rounded-full font-medium hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                {isPlacingOrder ? (<><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>Placing Order...</>) : (<><ShoppingBag className="w-5 h-5" />Place Order - ₹{finalTotal.toLocaleString('en-IN')}</>)}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#F8F5F0] overflow-y-auto">
      <div className="min-h-screen">
        <div className="sticky top-0 z-10 bg-white border-b border-[#D4AF37] px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-all">
              <X className="w-5 h-5 text-[#2C2C2C]" />
            </button>
            <h1 className="text-2xl font-serif text-[#2C2C2C]">Shopping Cart</h1>
            <div className="w-10" />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="bg-white rounded-2xl p-4 border border-gray-200 flex items-center gap-4">
                    <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover" />
                    <div className="flex-1">
                      <h3 className="font-medium text-[#2C2C2C] mb-1">{item.name}</h3>
                      <p className="text-sm text-[#7A7A7A] mb-2">{item.category}</p>
                      <p className="text-lg font-serif text-[#D4AF37]">₹{item.price.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 bg-[#F8F5F0] rounded-full p-1">
                        <button onClick={() => updateQuantity(item.id, -1)} disabled={item.quantity <= 1} className="w-8 h-8 rounded-full bg-white hover:bg-[#D4AF37] hover:text-white flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-medium text-[#2C2C2C]">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} disabled={item.quantity >= item.maxStock} className="w-8 h-8 rounded-full bg-white hover:bg-[#D4AF37] hover:text-white flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="w-10 h-10 rounded-full hover:bg-red-50 flex items-center justify-center transition-all">
                        <Trash2 className="w-5 h-5 text-red-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                  <h3 className="font-medium text-[#2C2C2C]">Daizzy Recommends for You</h3>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {recommendedProducts.map((product) => (
                    <div key={product.id} className="border border-gray-200 rounded-xl overflow-hidden hover:border-[#D4AF37] transition-all">
                      <img src={product.image} alt={product.name} className="w-full h-32 object-cover" />
                      <div className="p-3">
                        <p className="text-sm font-medium text-[#2C2C2C] mb-1 truncate">{product.name}</p>
                        <p className="text-sm font-serif text-[#D4AF37] mb-2">₹{product.price.toLocaleString('en-IN')}</p>
                        <button onClick={() => addRecommendedToCart(product)} className="w-full px-3 py-2 bg-[#F8F5F0] hover:bg-[#D4AF37] hover:text-white rounded-lg text-xs font-medium transition-all">
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                  <h3 className="font-medium text-[#2C2C2C] mb-4">Order Summary</h3>
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm"><span className="text-[#7A7A7A]">Subtotal ({cartItems.length} items)</span><span className="text-[#2C2C2C] font-medium">₹{subtotal.toLocaleString('en-IN')}</span></div>
                    {discountAmount > 0 && (<div className="flex justify-between text-sm text-green-600"><span>Discount ({appliedCoupon?.code})</span><span>-₹{discountAmount.toLocaleString('en-IN')}</span></div>)}
                    {coinValue > 0 && (<div className="flex justify-between text-sm text-[#D4AF37]"><span>Coins Used ({actualCoinsToUse})</span><span>-₹{coinValue.toFixed(2)}</span></div>)}
                    <div className="flex justify-between text-sm"><span className="text-[#7A7A7A]">Delivery Fee</span><span className={deliveryFee === 0 ? 'text-green-600 font-medium' : 'text-[#2C2C2C]'}>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span></div>
                    {subtotal < 5000 && (<p className="text-xs text-[#7A7A7A]">Add ₹{(5000 - subtotal).toLocaleString('en-IN')} more for free delivery</p>)}
                  </div>
                  <div className="pt-4 border-t border-gray-200 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-serif text-[#2C2C2C]">Total</span>
                      <span className="text-2xl font-serif text-[#D4AF37]">₹{finalTotal.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                  <button onClick={handleProceedToCheckout} disabled={cartItems.length === 0} className="w-full px-6 py-4 bg-gradient-to-r from-[#D4AF37] to-[#C9A961] text-white rounded-full font-medium hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                    <ShoppingBag className="w-5 h-5" />Proceed to Checkout
                  </button>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                  <div className="flex items-center gap-2 mb-4">
                    <Tag className="w-5 h-5 text-[#D4AF37]" />
                    <h3 className="font-medium text-[#2C2C2C]">Apply Coupon</h3>
                  </div>
                  <div className="flex gap-2 mb-3">
                    <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} placeholder="Enter coupon code" className="flex-1 px-4 py-2 bg-[#F8F5F0] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 text-sm" />
                    <button onClick={applyCoupon} className="px-4 py-2 bg-[#D4AF37] text-white rounded-lg font-medium hover:bg-[#C9A961] transition-all text-sm">Apply</button>
                  </div>
                  {couponError && (<div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mb-3"><AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" /><p className="text-xs text-red-600">{couponError}</p></div>)}
                  {showCouponSuccess && (<div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg mb-3"><Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" /><p className="text-xs text-green-600">Coupon applied successfully!</p></div>)}
                  <div className="space-y-2">
                    <p className="text-xs text-[#7A7A7A] mb-2">Available coupons:</p>
                    {availableCoupons.map((coupon) => (
                      <button key={coupon.code} onClick={() => { setCouponCode(coupon.code); setTimeout(() => applyCoupon(), 100); }} className="w-full p-3 border border-dashed border-[#D4AF37]/30 rounded-lg hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 transition-all text-left">
                        <p className="text-sm font-medium text-[#D4AF37]">{coupon.code}</p>
                        <p className="text-xs text-[#7A7A7A]">{coupon.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                  <div className="flex items-center gap-2 mb-4">
                    <Coins className="w-5 h-5 text-[#D4AF37]" />
                    <h3 className="font-medium text-[#2C2C2C]">Use Velour Coins</h3>
                  </div>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2"><span className="text-[#7A7A7A]">Available Coins</span><span className="font-medium text-[#2C2C2C]">{availableCoins}</span></div>
                    <div className="flex justify-between text-sm mb-3"><span className="text-[#7A7A7A]">Max Usable (30%)</span><span className="font-medium text-[#D4AF37]">{maxCoinsUsable}</span></div>
                    <input type="range" min="0" max={Math.min(maxCoinsUsable, availableCoins)} value={coinsToUse} onChange={(e) => handleCoinsChange(Number(e.target.value))} className="w-full"
                      style={{ background: `linear-gradient(to right, #D4AF37 0%, #D4AF37 ${(coinsToUse / Math.min(maxCoinsUsable, availableCoins)) * 100}%, #E5E5E5 ${(coinsToUse / Math.min(maxCoinsUsable, availableCoins)) * 100}%, #E5E5E5 100%)` }} />
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-sm text-[#7A7A7A]">Using {actualCoinsToUse} coins</span>
                      <span className="text-lg font-serif text-[#D4AF37]">-₹{coinValue.toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-[#7A7A7A] mt-2">1 Coin = ₹0.10</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}