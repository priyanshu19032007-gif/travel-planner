import React from 'react';
import {
  ShieldAlert,
  Compass,
  Train,
  HeartHandshake,
  Gem,
  PhoneCall,
  Coins,
  Globe2,
  Umbrella,
  Sparkles,
} from 'lucide-react';
import { ItineraryData } from '../types/itinerary';

interface LocalGuideViewProps {
  itinerary: ItineraryData;
}

export const LocalGuideView: React.FC<LocalGuideViewProps> = ({ itinerary }) => {
  const { localTips, destination, alternativeActivities } = itinerary;

  return (
    <div className="space-y-8">
      {/* Quick Practical Logistics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-sm flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/10 text-amber-700 rounded-xl">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
              Local Currency
            </div>
            <div className="text-xs sm:text-sm font-bold text-stone-900 truncate">
              {destination.localCurrency || 'Local Currency'}
            </div>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-sm flex items-center gap-3">
          <div className="p-2.5 bg-sky-500/10 text-sky-700 rounded-xl">
            <Globe2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
              Languages Spoken
            </div>
            <div className="text-xs sm:text-sm font-bold text-stone-900 truncate">
              {destination.language || 'Local Language'}
            </div>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-sm flex items-center gap-3">
          <div className="p-2.5 bg-rose-500/10 text-rose-700 rounded-xl">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
              Emergency Service
            </div>
            <div className="text-xs sm:text-sm font-bold text-rose-700 font-mono">
              {destination.emergencyNumber || '112 / 911'}
            </div>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-sm flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 text-emerald-700 rounded-xl">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
              Ideal Travel Window
            </div>
            <div className="text-xs sm:text-sm font-bold text-stone-900 truncate">
              {destination.bestTimeToVisit || 'Spring / Fall'}
            </div>
          </div>
        </div>
      </div>

      {/* Main 4 Insight Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Cultural Etiquette & Customs */}
        <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
            <HeartHandshake className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900">
              Cultural Etiquette & Respect
            </h3>
          </div>
          <div className="space-y-3">
            {localTips.culturalEtiquette.map((tip, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-stone-700">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                <span className="leading-relaxed">{tip}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Transit Passes & Navigation */}
        <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
            <Train className="w-4 h-4 text-sky-600" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900">
              Transit & Commuter Intelligence
            </h3>
          </div>
          <div className="space-y-3">
            {localTips.localTransitAdvice.map((tip, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-stone-700">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1.5 flex-shrink-0" />
                <span className="leading-relaxed">{tip}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Scams & Safety Precautions */}
        <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900">
              Scams & Neighborhood Safety
            </h3>
          </div>
          <div className="space-y-3">
            {localTips.safetyAndScams.map((tip, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-stone-700">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 flex-shrink-0" />
                <span className="leading-relaxed">{tip}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Local Secrets & Hidden Gems */}
        <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
            <Gem className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900">
              Insider Secrets & Secret Spots
            </h3>
          </div>
          <div className="space-y-3">
            {localTips.hiddenGemsAdvice.map((tip, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-stone-700">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                <span className="leading-relaxed">{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alternative & Rainy-Day Activities */}
      {alternativeActivities && alternativeActivities.length > 0 && (
        <div className="p-6 bg-stone-50 border border-stone-200 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-200 pb-3">
            <Umbrella className="w-4 h-4 text-amber-600" />
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900">
                Alternative & Rainy-Day Pivot Activities
              </h3>
              <p className="text-xs text-stone-500">
                Pre-researched backup options tailored to your preferences if weather turns or lines are long
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {alternativeActivities.map((alt, idx) => (
              <div
                key={idx}
                className="p-4 bg-white rounded-xl border border-stone-200 space-y-2 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-stone-900">{alt.title}</h4>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 bg-stone-100 text-stone-600 rounded">
                    {alt.category}
                  </span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {alt.description}
                </p>
                <div className="p-2.5 bg-amber-50/70 border border-amber-200/60 rounded-lg text-[11px] text-amber-900 flex items-start gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Why consider:</strong> {alt.whyConsider}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
