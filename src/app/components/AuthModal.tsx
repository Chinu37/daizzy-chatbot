import { useState } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, Phone, MapPin, Check } from 'lucide-react';
import { loginUser, registerUser } from '../../api';

interface AuthModalProps {
  onClose: () => void;
  onLoginSuccess: (user: { name: string; email: string; phone: string }) => void;
}

export function AuthModal({ onClose, onLoginSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: '', address: ''
  });

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone: string) => /^[6-9]\d{9}$/.test(phone);

  const validateLogin = () => {
    const newErrors: Record<string, string> = {};
    if (!loginData.email) newErrors.email = 'Email is required';
    else if (!validateEmail(loginData.email)) newErrors.email = 'Invalid email format';
    if (!loginData.password) newErrors.password = 'Password is required';
    else if (loginData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSignup = () => {
    const newErrors: Record<string, string> = {};
    if (!signupData.name) newErrors.name = 'Name is required';
    if (!signupData.email) newErrors.email = 'Email is required';
    else if (!validateEmail(signupData.email)) newErrors.email = 'Invalid email format';
    if (!signupData.phone) newErrors.phone = 'Phone number is required';
    else if (!validatePhone(signupData.phone)) newErrors.phone = 'Invalid Indian phone number';
    if (!signupData.password) newErrors.password = 'Password is required';
    else if (signupData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (signupData.password !== signupData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!signupData.address) newErrors.address = 'Address is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateLogin()) return;
    setIsLoading(true);
    const result = await loginUser({ email: loginData.email, password: loginData.password });
    setIsLoading(false);
    if (result.success) {
  localStorage.setItem('daizzy_user_id', result.user.id);
  onLoginSuccess(result.user);
  onClose();
    } else {
      setErrors({ general: result.message });
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSignup()) return;
    setIsLoading(true);
    const result = await registerUser({
      name: signupData.name,
      email: signupData.email,
      phone: signupData.phone,
      password: signupData.password,
      address: signupData.address
    });
    setIsLoading(false);
    if (result.success) {
  localStorage.setItem('daizzy_user_id', result.user.id);
  onLoginSuccess(result.user);
  onClose();
    } else {
      setErrors({ general: result.message });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md mx-4 bg-white rounded-3xl shadow-2xl overflow-hidden">
        <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-all z-10">
          <X className="w-5 h-5 text-[#2C2C2C]" />
        </button>

        <div className="bg-gradient-to-br from-[#D4AF37] to-[#C9A961] px-8 pt-12 pb-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-serif text-white mb-2">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-sm text-white/80">
            {mode === 'login' ? 'Sign in to access your Velour account' : 'Join Velour for exclusive luxury shopping'}
          </p>
        </div>

        <div className="p-8">
          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
              {errors.general}
            </div>
          )}

          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#2C2C2C] mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7A7A7A]" />
                  <input type="email" value={loginData.email}
                    onChange={(e) => { setLoginData({ ...loginData, email: e.target.value }); setErrors({ ...errors, email: '' }); }}
                    placeholder="your@email.com"
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 transition-all ${errors.email ? 'border-red-500' : 'border-gray-200 focus:border-[#D4AF37]'}`}
                  />
                </div>
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2C2C2C] mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7A7A7A]" />
                  <input type={showPassword ? 'text' : 'password'} value={loginData.password}
                    onChange={(e) => { setLoginData({ ...loginData, password: e.target.value }); setErrors({ ...errors, password: '' }); }}
                    placeholder="••••••••"
                    className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 transition-all ${errors.password ? 'border-red-500' : 'border-gray-200 focus:border-[#D4AF37]'}`}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7A7A7A] hover:text-[#2C2C2C]">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
              </div>

              <button type="submit" disabled={isLoading}
                className="w-full py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#C9A961] text-white rounded-xl font-medium hover:shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2">
                {isLoading ? (<><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>Signing in...</>) : 'Sign In'}
              </button>

              <p className="text-center text-sm text-[#7A7A7A]">
                Don't have an account?{' '}
                <button type="button" onClick={() => { setMode('signup'); setErrors({}); }} className="text-[#D4AF37] font-medium hover:underline">
                  Create Account
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              <div>
                <label className="block text-sm font-medium text-[#2C2C2C] mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7A7A7A]" />
                  <input type="text" value={signupData.name}
                    onChange={(e) => { setSignupData({ ...signupData, name: e.target.value }); setErrors({ ...errors, name: '' }); }}
                    placeholder="John Doe"
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 transition-all ${errors.name ? 'border-red-500' : 'border-gray-200 focus:border-[#D4AF37]'}`}
                  />
                </div>
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2C2C2C] mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7A7A7A]" />
                  <input type="email" value={signupData.email}
                    onChange={(e) => { setSignupData({ ...signupData, email: e.target.value }); setErrors({ ...errors, email: '' }); }}
                    placeholder="your@email.com"
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 transition-all ${errors.email ? 'border-red-500' : 'border-gray-200 focus:border-[#D4AF37]'}`}
                  />
                </div>
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2C2C2C] mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7A7A7A]" />
                  <input type="tel" value={signupData.phone}
                    onChange={(e) => { setSignupData({ ...signupData, phone: e.target.value }); setErrors({ ...errors, phone: '' }); }}
                    placeholder="9876543210"
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 transition-all ${errors.phone ? 'border-red-500' : 'border-gray-200 focus:border-[#D4AF37]'}`}
                  />
                </div>
                {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2C2C2C] mb-2">Delivery Address</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-4 w-5 h-5 text-[#7A7A7A]" />
                  <textarea value={signupData.address}
                    onChange={(e) => { setSignupData({ ...signupData, address: e.target.value }); setErrors({ ...errors, address: '' }); }}
                    placeholder="Complete address with city and pincode" rows={2}
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 transition-all resize-none ${errors.address ? 'border-red-500' : 'border-gray-200 focus:border-[#D4AF37]'}`}
                  />
                </div>
                {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2C2C2C] mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7A7A7A]" />
                  <input type={showPassword ? 'text' : 'password'} value={signupData.password}
                    onChange={(e) => { setSignupData({ ...signupData, password: e.target.value }); setErrors({ ...errors, password: '' }); }}
                    placeholder="••••••••"
                    className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 transition-all ${errors.password ? 'border-red-500' : 'border-gray-200 focus:border-[#D4AF37]'}`}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7A7A7A] hover:text-[#2C2C2C]">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2C2C2C] mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7A7A7A]" />
                  <input type={showPassword ? 'text' : 'password'} value={signupData.confirmPassword}
                    onChange={(e) => { setSignupData({ ...signupData, confirmPassword: e.target.value }); setErrors({ ...errors, confirmPassword: '' }); }}
                    placeholder="••••••••"
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 transition-all ${errors.confirmPassword ? 'border-red-500' : 'border-gray-200 focus:border-[#D4AF37]'}`}
                  />
                </div>
                {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
              </div>

              <button type="submit" disabled={isLoading}
                className="w-full py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#C9A961] text-white rounded-xl font-medium hover:shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2">
                {isLoading ? (<><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>Creating account...</>) : (<><Check className="w-5 h-5" />Create Account</>)}
              </button>

              <p className="text-center text-sm text-[#7A7A7A]">
                Already have an account?{' '}
                <button type="button" onClick={() => { setMode('login'); setErrors({}); }} className="text-[#D4AF37] font-medium hover:underline">
                  Sign In
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}