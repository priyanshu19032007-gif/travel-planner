import React from 'react';
import { Compass, Bookmark, PlusCircle, Sparkles, MapPin, Share2 } from 'lucide-react';

interface HeaderProps {
  onNewTrip: () => void;
  onOpenSaved: () => void;
  savedCount: number;
  hasCurrentTrip: boolean;
  onShare?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onNewTrip,
  onOpenSaved,
  savedCount,
  hasCurrentTrip,
  onShare,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-stone-900/90 backdrop-blur-md border-b border-stone-800 text-stone-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={onNewTrip}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 group-hover:scale-105 group-hover:bg-amber-500/30 transition-all shadow-sm">
            <Compass className="w-5 h-5 animate-[spin_12s_linear_infinite]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif-display text-xl font-bold tracking-tight text-white group-hover:text-amber-300 transition-colors">
                Voyager
              </span>
              <span className="text-xs font-semibold uppercase tracking-widest text-amber-400/90 font-mono">
                AI
              </span>
            </div>
            <p className="text-[10px] text-stone-400 font-medium hidden sm:block">
              Personalized Travel Intelligence
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {hasCurrentTrip && onShare && (
            <button
              onClick={onShare}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-300 hover:text-white bg-stone-800/80 hover:bg-stone-700/80 rounded-lg transition-colors border border-stone-700/60"
              title="Share Trip"
            >
              <Share2 className="w-3.5 h-3.5 text-stone-400" />
              <span>Share</span>
            </button>
          )}

          <button
            onClick={onOpenSaved}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-stone-300 hover:text-white bg-stone-800/80 hover:bg-stone-700/80 rounded-lg transition-colors border border-stone-700/60 relative"
          >
            <Bookmark className="w-3.5 h-3.5 text-amber-400" />
            <span>My Trips</span>
            {savedCount > 0 && (
              <span className="w-4 h-4 bg-amber-500 text-stone-950 font-bold text-[10px] rounded-full flex items-center justify-center">
                {savedCount}
              </span>
            )}
          </button>

          <button
            onClick={onNewTrip}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-lg transition-all shadow-sm active:scale-95"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Plan New Trip</span>
          </button>
        </div>
      </div>
    </header>
  );
};
