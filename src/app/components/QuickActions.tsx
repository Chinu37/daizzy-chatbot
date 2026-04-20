import { Palette, Sparkles, Gift, Calendar, Briefcase, Coffee, Music } from 'lucide-react';

interface QuickAction {
  id: string;
  label: string;
  icon: string;
}

interface QuickActionsProps {
  actions: QuickAction[];
  onAction: (id: string) => void;
}

const iconMap: Record<string, any> = {
  palette: Palette,
  sparkles: Sparkles,
  gift: Gift,
  calendar: Calendar,
  briefcase: Briefcase,
  coffee: Coffee,
  music: Music,
};

export function QuickActions({ actions, onAction }: QuickActionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((action) => {
        const Icon = iconMap[action.icon] || Sparkles;
        return (
          <button
            key={action.id}
            onClick={() => onAction(action.id)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/80 backdrop-blur-sm hover:bg-[var(--velour-gold)]/10 border border-[var(--border)] hover:border-[var(--velour-gold)]/30 rounded-full transition-all group hover:scale-105 active:scale-95 hover:-translate-y-0.5 fade-in-up"
          >
            <Icon className="w-4 h-4 text-[var(--velour-gold)] group-hover:rotate-12 transition-transform" />
            <span className="text-sm font-medium text-[var(--velour-text)]">{action.label}</span>
          </button>
        );
      })}
    </div>
  );
}
