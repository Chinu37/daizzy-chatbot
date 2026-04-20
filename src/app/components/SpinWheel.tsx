import { useState } from 'react';
import { Sparkles } from 'lucide-react';

const rewards = [
  { label: '10% OFF', color: '#C9A961', textColor: '#FFFFFF' },
  { label: '50 Coins', color: '#E8DCC8', textColor: '#2C2416' },
  { label: '₹500 OFF', color: '#D4C4A8', textColor: '#FFFFFF' },
  { label: '100 Coins', color: '#F8F4EE', textColor: '#2C2416' },
  { label: 'Free Ship', color: '#C9A961', textColor: '#FFFFFF' },
  { label: '20% OFF', color: '#E8DCC8', textColor: '#2C2416' },
];

export function SpinWheel() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonReward, setWonReward] = useState<string | null>(null);

  const spinWheel = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setWonReward(null);

    const spins = 5 + Math.random() * 3;
    const extraDegrees = Math.random() * 360;
    const totalRotation = rotation + spins * 360 + extraDegrees;

    setRotation(totalRotation);

    setTimeout(() => {
      const normalizedRotation = totalRotation % 360;
      const segmentAngle = 360 / rewards.length;
      const winningIndex = Math.floor((360 - normalizedRotation) / segmentAngle) % rewards.length;
      setWonReward(rewards[winningIndex].label);
      setIsSpinning(false);
    }, 4000);
  };

  return (
    <div className="relative bg-gradient-to-br from-white/80 to-[var(--velour-cream)]/80 backdrop-blur-sm rounded-2xl p-6 border border-[var(--border)]">
      {/* Wheel Container */}
      <div className="relative flex flex-col items-center">
        <div className="relative w-64 h-64">
          {/* Pointer */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
            <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-[var(--velour-gold)]" />
          </div>

          {/* Wheel */}
          <div
            className="relative w-full h-full rounded-full overflow-hidden transition-transform duration-[4000ms] ease-out"
            style={{
              transform: `rotate(${rotation}deg)`,
              boxShadow: '0 8px 32px rgba(201, 169, 97, 0.3), inset 0 0 0 8px rgba(201, 169, 97, 0.2)'
            }}
          >
            {rewards.map((reward, index) => {
              const angle = (360 / rewards.length) * index;
              return (
                <div
                  key={index}
                  className="absolute w-full h-full"
                  style={{
                    transform: `rotate(${angle}deg)`,
                  }}
                >
                  <div
                    className="absolute top-0 left-1/2 w-1/2 h-1/2 origin-bottom-left flex items-start justify-end pr-4 pt-6"
                    style={{
                      backgroundColor: reward.color,
                      clipPath: 'polygon(0 0, 100% 0, 0 100%)',
                      transform: `rotate(${360 / rewards.length}deg)`,
                    }}
                  >
                    <span
                      className="text-xs font-bold transform -rotate-45"
                      style={{ color: reward.textColor }}
                    >
                      {reward.label}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Center Circle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-[var(--velour-gold)] to-[var(--velour-gold-dark)] flex items-center justify-center border-4 border-white shadow-xl">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        {/* Spin Button */}
        <button
          onClick={spinWheel}
          disabled={isSpinning}
          className="mt-6 px-8 py-3.5 bg-gradient-to-br from-[var(--velour-gold)] to-[var(--velour-gold-dark)] text-white rounded-full font-medium shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isSpinning ? 'Spinning...' : 'Spin the Wheel'}
        </button>
      </div>

      {/* Win Notification */}
      {wonReward && (
        <div className="mt-4 p-4 bg-gradient-to-br from-[var(--velour-gold)]/20 to-[var(--velour-gold)]/10 rounded-xl border border-[var(--velour-gold)]/30 text-center fade-in-up">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--velour-gold)] to-[var(--velour-gold-dark)] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <p className="text-lg font-serif font-semibold text-[var(--velour-text)]">
              You won: {wonReward}!
            </p>
          </div>
          <p className="text-sm text-[var(--velour-text-soft)]">
            Reward applied to your account
          </p>
        </div>
      )}
    </div>
  );
}
