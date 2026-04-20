import { useState, useEffect } from 'react';
import { X, Gift, Sparkles, Trophy, Clock, Calendar, TrendingUp, Coins, ChevronRight, Star, Zap, Award } from 'lucide-react';

interface GamificationRewardsProps {
  onClose: () => void;
  currentCoins: number;
  onCoinsUpdate: (change: number) => void;
}

interface Reward {
  id: string;
  label: string;
  value: string;
  type: 'discount' | 'coins' | 'shipping';
  color: string;
  textColor: string;
}

interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  reward: number;
  progress: number;
  total: number;
  icon: any;
}

const wheelRewards: Reward[] = [
  { id: 'r1', label: '5% OFF', value: '5', type: 'discount', color: '#D4AF37', textColor: '#FFFFFF' },
  { id: 'r2', label: '50 Coins', value: '50', type: 'coins', color: '#F8F5F0', textColor: '#2C2C2C' },
  { id: 'r3', label: '10% OFF', value: '10', type: 'discount', color: '#E6C200', textColor: '#FFFFFF' },
  { id: 'r4', label: '100 Coins', value: '100', type: 'coins', color: '#F8F5F0', textColor: '#2C2C2C' },
  { id: 'r5', label: 'Free Ship', value: 'free', type: 'shipping', color: '#CFAF5A', textColor: '#FFFFFF' },
  { id: 'r6', label: '15% OFF', value: '15', type: 'discount', color: '#D4AF37', textColor: '#FFFFFF' },
  { id: 'r7', label: '200 Coins', value: '200', type: 'coins', color: '#F8F5F0', textColor: '#2C2C2C' },
  { id: 'r8', label: '20% OFF', value: '20', type: 'discount', color: '#E6C200', textColor: '#FFFFFF' }
];

const dailyChallenges: DailyChallenge[] = [
  { id: 'c1', title: 'Complete Your Outfit', description: 'Build a full outfit using AI', reward: 100, progress: 0, total: 1, icon: Sparkles },
  { id: 'c2', title: 'Browse 3 Collections', description: 'Explore our curated collections', reward: 50, progress: 1, total: 3, icon: Star },
  { id: 'c3', title: 'Take Style Quiz', description: 'Discover your perfect style', reward: 100, progress: 0, total: 1, icon: Trophy }
];

export function GamificationRewards({ onClose, currentCoins, onCoinsUpdate }: GamificationRewardsProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonReward, setWonReward] = useState<Reward | null>(null);
  const [showRewardPopup, setShowRewardPopup] = useState(false);
  const [hasSpunToday, setHasSpunToday] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [activeTab, setActiveTab] = useState<'spin' | 'challenges' | 'coins'>('spin');

  const spinWheel = () => {
    if (isSpinning || hasSpunToday) return;

    setIsSpinning(true);
    setWonReward(null);
    setShowConfetti(false);

    // Calculate random winning segment
    const winningIndex = Math.floor(Math.random() * wheelRewards.length);
    const segmentAngle = 360 / wheelRewards.length;

    // Calculate rotation to land on winning segment
    const spins = 5; // Full rotations
    const targetAngle = 360 - (winningIndex * segmentAngle + segmentAngle / 2);
    const totalRotation = rotation + spins * 360 + targetAngle;

    setRotation(totalRotation);

    // Show result after spin animation
    setTimeout(() => {
      const reward = wheelRewards[winningIndex];
      setWonReward(reward);
      setShowRewardPopup(true);
      setShowConfetti(true);
      setIsSpinning(false);
      setHasSpunToday(true);

      // Award coins if reward is coins
      if (reward.type === 'coins') {
        onCoinsUpdate(parseInt(reward.value));
      }

      // Hide confetti after 3 seconds
      setTimeout(() => setShowConfetti(false), 3000);
    }, 3000);
  };

  const handleClaimReward = () => {
    setShowRewardPopup(false);
    // You could trigger additional actions here like applying discount code
  };

  const renderSpinWheel = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#CFAF5A] mb-4">
          <Gift className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-serif text-[#2C2C2C] mb-2">Spin & Win</h2>
        <p className="text-[#7A7A7A]">Try your luck for exclusive rewards</p>
        {hasSpunToday && (
          <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-[#D4AF37]/10 rounded-full border border-[#D4AF37]/20">
            <Clock className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-sm text-[#2C2C2C]">Next spin available in 23h 45m</span>
          </div>
        )}
      </div>

      {/* Wheel Container */}
      <div className="relative flex flex-col items-center">
        <div className="relative w-80 h-80">
          {/* Decorative Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/20 to-[#CFAF5A]/20 rounded-full blur-3xl" />

          {/* Pointer */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20">
            <div className="relative">
              <div className="w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-t-[28px] border-t-[#D4AF37]"
                style={{ filter: 'drop-shadow(0 4px 12px rgba(212, 175, 55, 0.4))' }}
              />
            </div>
          </div>

          {/* Wheel */}
          <div
            className="relative w-full h-full rounded-full overflow-hidden transition-transform"
            style={{
              transform: `rotate(${rotation}deg)`,
              transitionDuration: isSpinning ? '3000ms' : '0ms',
              transitionTimingFunction: 'cubic-bezier(0.17, 0.67, 0.12, 0.99)',
              boxShadow: '0 12px 48px rgba(212, 175, 55, 0.25), inset 0 0 0 12px rgba(212, 175, 55, 0.15)',
              border: '4px solid white'
            }}
          >
            {wheelRewards.map((reward, index) => {
              const angle = (360 / wheelRewards.length) * index;
              return (
                <div
                  key={reward.id}
                  className="absolute w-full h-full"
                  style={{ transform: `rotate(${angle}deg)` }}
                >
                  <div
                    className="absolute top-0 left-1/2 w-1/2 h-1/2 origin-bottom-left flex items-start justify-end pr-6 pt-8"
                    style={{
                      backgroundColor: reward.color,
                      clipPath: 'polygon(0 0, 100% 0, 0 100%)',
                      transform: `rotate(${360 / wheelRewards.length}deg)`,
                      borderRight: '2px solid rgba(255, 255, 255, 0.2)'
                    }}
                  >
                    <div className="transform -rotate-45 flex flex-col items-center">
                      <span className="text-sm font-bold" style={{ color: reward.textColor }}>
                        {reward.label}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Center Button */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-gradient-to-br from-[#E6C200] to-[#D4AF37] flex items-center justify-center border-6 border-white shadow-2xl">
              <div className="text-center">
                <Sparkles className="w-10 h-10 text-white mx-auto" />
              </div>
            </div>
          </div>
        </div>

        {/* Spin Button */}
        <button
          onClick={spinWheel}
          disabled={isSpinning || hasSpunToday}
          className="mt-8 px-12 py-4 bg-gradient-to-r from-[#E6C200] to-[#D4AF37] text-white rounded-full font-medium text-lg shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          style={{ boxShadow: '0 8px 32px rgba(230, 194, 0, 0.3)' }}
        >
          {isSpinning ? (
            <span className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Spinning...
            </span>
          ) : hasSpunToday ? (
            'Come Back Tomorrow'
          ) : (
            'SPIN NOW'
          )}
        </button>
      </div>

      {/* Recent Spins */}
      <div className="mt-8 p-4 bg-white/60 rounded-2xl border border-gray-200">
        <h3 className="font-medium text-[#2C2C2C] mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
          Recent Winners
        </h3>
        <div className="space-y-2">
          {['Sarah won 20% OFF', 'Michael won 100 Coins', 'Emma won Free Shipping'].map((winner, i) => (
            <div key={i} className="flex items-center gap-3 text-sm text-[#7A7A7A]">
              <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />
              {winner}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderChallenges = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#CFAF5A] mb-4">
          <Trophy className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-serif text-[#2C2C2C] mb-2">Daily Challenges</h2>
        <p className="text-[#7A7A7A]">Complete tasks to earn bonus coins</p>
      </div>

      {/* Challenges List */}
      <div className="space-y-4">
        {dailyChallenges.map((challenge) => {
          const Icon = challenge.icon;
          const isCompleted = challenge.progress >= challenge.total;
          const progressPercent = (challenge.progress / challenge.total) * 100;

          return (
            <div
              key={challenge.id}
              className={`p-6 rounded-2xl border-2 transition-all ${
                isCompleted
                  ? 'bg-gradient-to-br from-[#D4AF37]/10 to-[#CFAF5A]/10 border-[#D4AF37]'
                  : 'bg-white border-gray-200 hover:border-[#D4AF37]/30'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  isCompleted ? 'bg-gradient-to-br from-[#D4AF37] to-[#CFAF5A]' : 'bg-gray-100'
                }`}>
                  <Icon className={`w-6 h-6 ${isCompleted ? 'text-white' : 'text-gray-400'}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-medium text-[#2C2C2C] mb-1">{challenge.title}</h3>
                      <p className="text-sm text-[#7A7A7A]">{challenge.description}</p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-[#D4AF37]/10 rounded-full">
                      <Coins className="w-4 h-4 text-[#D4AF37]" />
                      <span className="text-sm font-medium text-[#2C2C2C]">+{challenge.reward}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-[#7A7A7A]">
                      <span>Progress: {challenge.progress}/{challenge.total}</span>
                      <span>{Math.round(progressPercent)}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#E6C200] to-[#D4AF37] transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Action Button */}
                  {!isCompleted && (
                    <button className="mt-3 px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#CFAF5A] text-white text-sm rounded-full hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2">
                      Start Challenge
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                  {isCompleted && (
                    <div className="mt-3 flex items-center gap-2 text-sm text-[#D4AF37]">
                      <Award className="w-4 h-4" />
                      <span className="font-medium">Completed!</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Daily Streak */}
      <div className="p-6 bg-gradient-to-br from-[#D4AF37]/10 to-[#CFAF5A]/10 rounded-2xl border border-[#D4AF37]/30">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-medium text-[#2C2C2C] mb-1">Daily Login Streak</h3>
            <p className="text-sm text-[#7A7A7A]">Come back every day for bonus rewards</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-serif text-[#D4AF37]">7</div>
            <div className="text-xs text-[#7A7A7A]">Days</div>
          </div>
        </div>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5, 6, 7].map((day) => (
            <div
              key={day}
              className={`flex-1 h-2 rounded-full ${
                day <= 7 ? 'bg-gradient-to-r from-[#E6C200] to-[#D4AF37]' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );

  const renderCoins = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#E6C200] to-[#D4AF37] mb-4 shadow-xl">
          <Coins className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-4xl font-serif text-[#2C2C2C] mb-2">{currentCoins} Coins</h2>
        <p className="text-[#7A7A7A]">Your Velour Coin Balance</p>
      </div>

      {/* Coin Value */}
      <div className="p-6 bg-gradient-to-br from-[#D4AF37]/10 to-[#CFAF5A]/10 rounded-2xl border border-[#D4AF37]/30 text-center">
        <p className="text-sm text-[#7A7A7A] mb-2">Current value</p>
        <p className="text-3xl font-serif text-[#D4AF37]">₹{(currentCoins * 0.1).toLocaleString('en-IN')}</p>
        <p className="text-xs text-[#7A7A7A] mt-1">1 Coin = ₹0.10</p>
      </div>

      {/* How to Earn */}
      <div>
        <h3 className="font-medium text-[#2C2C2C] mb-4">Ways to Earn Coins</h3>
        <div className="space-y-3">
          {[
            { icon: Gift, label: 'Spin the Wheel', coins: '50-200' },
            { icon: Trophy, label: 'Complete Challenges', coins: '50-100' },
            { icon: Sparkles, label: 'Style Quiz', coins: '100' },
            { icon: Star, label: 'Make a Purchase', coins: '10% back' },
            { icon: Calendar, label: 'Daily Login', coins: '25' }
          ].map((method, i) => {
            const Icon = method.icon;
            return (
              <div key={i} className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <span className="text-[#2C2C2C]">{method.label}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-[#D4AF37]/10 rounded-full">
                  <Coins className="w-4 h-4 text-[#D4AF37]" />
                  <span className="text-sm font-medium text-[#2C2C2C]">{method.coins}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Redeem Button */}
      <button className="w-full px-6 py-4 bg-gradient-to-r from-[#E6C200] to-[#D4AF37] text-white rounded-full font-medium text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2">
        <Zap className="w-5 h-5" />
        Use Coins for Discount
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(248, 245, 240, 0.95)' }}>
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full animate-pulse"
              style={{
                backgroundColor: i % 3 === 0 ? '#D4AF37' : i % 3 === 1 ? '#E6C200' : '#CFAF5A',
                left: `${Math.random() * 100}%`,
                top: '-10px',
                animation: `fall ${2 + Math.random() * 2}s linear forwards`,
                opacity: 0.8,
                transform: `rotate(${Math.random() * 360}deg)`
              }}
            />
          ))}
        </div>
      )}

      {/* Main Container */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="relative px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-[#F8F5F0] to-white">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-serif text-[#2C2C2C]">Rewards & Challenges</h1>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-all"
            >
              <X className="w-5 h-5 text-[#2C2C2C]" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-4">
            {[
              { id: 'spin', label: 'Spin Wheel', icon: Gift },
              { id: 'challenges', label: 'Challenges', icon: Trophy },
              { id: 'coins', label: 'My Coins', icon: Coins }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 px-4 py-2 rounded-full font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-[#D4AF37] to-[#CFAF5A] text-white shadow-lg'
                      : 'bg-white text-[#7A7A7A] hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {activeTab === 'spin' && renderSpinWheel()}
          {activeTab === 'challenges' && renderChallenges()}
          {activeTab === 'coins' && renderCoins()}
        </div>
      </div>

      {/* Reward Popup Modal */}
      {showRewardPopup && wonReward && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="relative bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl fade-in-up"
            style={{
              boxShadow: '0 0 60px rgba(212, 175, 55, 0.4), 0 20px 60px rgba(0, 0, 0, 0.3)',
              animation: 'scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}>
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#E6C200]/20 to-[#D4AF37]/20 rounded-3xl blur-2xl -z-10" />

            <div className="text-center">
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#E6C200] to-[#D4AF37] mb-6 shadow-xl">
                <Sparkles className="w-10 h-10 text-white" />
              </div>

              {/* Title */}
              <h2 className="text-3xl font-serif text-[#2C2C2C] mb-2">Congratulations!</h2>
              <p className="text-[#7A7A7A] mb-6">You've won an amazing reward</p>

              {/* Reward Display */}
              <div className="p-6 bg-gradient-to-br from-[#D4AF37]/10 to-[#CFAF5A]/10 rounded-2xl border-2 border-[#D4AF37] mb-6">
                <div className="text-5xl font-serif text-[#D4AF37] mb-2">{wonReward.label}</div>
                {wonReward.type === 'discount' && (
                  <p className="text-sm text-[#7A7A7A]">On your next purchase</p>
                )}
                {wonReward.type === 'coins' && (
                  <p className="text-sm text-[#7A7A7A]">Added to your balance</p>
                )}
                {wonReward.type === 'shipping' && (
                  <p className="text-sm text-[#7A7A7A]">On your next order</p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowRewardPopup(false)}
                  className="flex-1 px-6 py-3 bg-gray-100 text-[#2C2C2C] rounded-full font-medium hover:bg-gray-200 transition-all"
                >
                  Maybe Later
                </button>
                <button
                  onClick={handleClaimReward}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-[#E6C200] to-[#D4AF37] text-white rounded-full font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                >
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
