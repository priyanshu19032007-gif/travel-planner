import React, { useState } from 'react';
import {
  Compass,
  MapPin,
  Calendar,
  Wallet,
  Users,
  Utensils,
  Landmark,
  Trees,
  Gem,
  Palette,
  PartyPopper,
  Sparkles,
  Camera,
  ShoppingBag,
  Flame,
  ArrowRight,
  Clock,
  Check,
  Coffee,
  HelpCircle,
} from 'lucide-react';
import { ItineraryRequest } from '../types/itinerary';

interface PlannerFormProps {
  onSubmit: (request: ItineraryRequest) => void;
  isLoading: boolean;
  onSelectSample: (sampleKey: 'tokyo' | 'amalfi') => void;
}

const POPULAR_DESTINATIONS = [
  'Tokyo, Japan',
  'Amalfi Coast, Italy',
  'Kyoto, Japan',
  'Reykjavik, Iceland',
  'Paris, France',
  'Oaxaca, Mexico',
  'Swiss Alps, Switzerland',
  'Bali, Indonesia',
  'Barcelona, Spain',
  'New York City, USA',
];

const INTEREST_OPTIONS = [
  { id: 'Food & Culinary', label: 'Food & Street Markets', icon: Utensils },
  { id: 'Historic & Heritage', label: 'History & Ancient Sites', icon: Landmark },
  { id: 'Nature & Hiking', label: 'Scenic Nature & Hikes', icon: Trees },
  { id: 'Hidden Gems', label: 'Local Hidden Gems', icon: Gem },
  { id: 'Art & Museums', label: 'Art, Design & Museums', icon: Palette },
  { id: 'Nightlife & Social', label: 'Nightlife & Bars', icon: PartyPopper },
  { id: 'Relaxing & Wellness', label: 'Relaxation & Spas', icon: Coffee },
  { id: 'Photography', label: 'Iconic Photography Vistas', icon: Camera },
  { id: 'Shopping & Markets', label: 'Local Crafts & Boutiques', icon: ShoppingBag },
  { id: 'Adventure & Outdoors', label: 'Active Adventures', icon: Flame },
];

const DIETARY_OPTIONS = [
  'Vegetarian',
  'Vegan',
  'Halal',
  'Kosher',
  'Gluten-Free',
  'Seafood Allergy',
  'Nut Allergy',
];

const CURRENCIES = [
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '€' },
  { code: 'GBP', symbol: '£' },
  { code: 'JPY', symbol: '¥' },
  { code: 'CAD', symbol: '$' },
  { code: 'AUD', symbol: '$' },
  { code: 'INR', symbol: '₹' },
];

export const PlannerForm: React.FC<PlannerFormProps> = ({
  onSubmit,
  isLoading,
  onSelectSample,
}) => {
  const [destination, setDestination] = useState('');
  const [durationDays, setDurationDays] = useState(4);
  const [startDate, setStartDate] = useState('');
  const [budgetLevel, setBudgetLevel] = useState<'budget' | 'moderate' | 'luxury' | 'ultra_luxury'>('moderate');
  const [approxBudget, setApproxBudget] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [travelParty, setTravelParty] = useState<'solo' | 'couple' | 'family' | 'friends'>('couple');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Food & Culinary',
    'Hidden Gems',
    'Historic & Heritage',
  ]);
  const [pace, setPace] = useState<'relaxed' | 'balanced' | 'packed'>('balanced');
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [customPreferences, setCustomPreferences] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      if (selectedInterests.length > 1) {
        setSelectedInterests(selectedInterests.filter((i) => i !== interest));
      }
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const toggleDietary = (item: string) => {
    if (selectedDietary.includes(item)) {
      setSelectedDietary(selectedDietary.filter((d) => d !== item));
    } else {
      setSelectedDietary([...selectedDietary, item]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) return;

    onSubmit({
      destination: destination.trim(),
      durationDays,
      startDate,
      budgetLevel,
      approxBudget: approxBudget.trim(),
      currency,
      travelParty,
      interests: selectedInterests,
      pace,
      dietaryRestrictions: selectedDietary,
      customPreferences: customPreferences.trim(),
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* Hero Welcome */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-700 dark:text-amber-400 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 border border-amber-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Tailored Day-by-Day Intelligence</span>
        </div>
        <h1 className="font-serif-display text-3xl sm:text-5xl font-bold tracking-tight text-stone-900 mb-4">
          Where will your curiosity take you?
        </h1>
        <p className="text-stone-600 text-sm sm:text-base max-w-2xl mx-auto">
          Specify your dream destination, budget, and travel style. Voyager AI will craft a bespoke,
          geographically optimized itinerary with authentic dining, real map pins, and insider advice.
        </p>

        {/* Instant Curated Sample Buttons */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-stone-500 font-medium">Or explore instantly:</span>
          <button
            type="button"
            onClick={() => onSelectSample('tokyo')}
            className="px-3 py-1.5 bg-stone-200/70 hover:bg-stone-300 text-stone-800 rounded-lg font-medium transition-colors border border-stone-300/80 inline-flex items-center gap-1.5"
          >
            <span>🇯🇵 4 Days in Tokyo (Food & Heritage)</span>
          </button>
          <button
            type="button"
            onClick={() => onSelectSample('amalfi')}
            className="px-3 py-1.5 bg-stone-200/70 hover:bg-stone-300 text-stone-800 rounded-lg font-medium transition-colors border border-stone-300/80 inline-flex items-center gap-1.5"
          >
            <span>🇮🇹 5 Days in Amalfi Coast (Romantic Luxury)</span>
          </button>
        </div>
      </div>

      {/* Main Planning Card */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-xl shadow-stone-200/60 border border-stone-200 overflow-hidden"
      >
        <div className="p-6 sm:p-8 space-y-8">
          {/* 1. Destination Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
              Destination City or Region <span className="text-amber-600">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <MapPin className="w-5 h-5 text-amber-600" />
              </div>
              <input
                type="text"
                required
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Tokyo, Kyoto, Amalfi Coast, Paris, Oaxaca..."
                className="w-full pl-11 pr-4 py-3.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 placeholder-stone-400 text-base font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
              />
            </div>

            {/* Destination Quick Chips */}
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] text-stone-400 font-medium">Quick ideas:</span>
              {POPULAR_DESTINATIONS.slice(0, 6).map((dest) => (
                <button
                  key={dest}
                  type="button"
                  onClick={() => setDestination(dest)}
                  className={`text-xs px-2.5 py-1 rounded-md transition-colors ${
                    destination === dest
                      ? 'bg-amber-100 text-amber-900 font-semibold border border-amber-300'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200 border border-stone-200/60'
                  }`}
                >
                  {dest}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Duration & Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                  Duration (Days)
                </label>
                <span className="text-sm font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {durationDays} {durationDays === 1 ? 'Day' : 'Days'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="1"
                  max="14"
                  value={durationDays}
                  onChange={(e) => setDurationDays(Number(e.target.value))}
                  className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                />
              </div>
              <div className="flex justify-between text-[11px] text-stone-400 font-medium mt-1.5">
                <span>1 Day</span>
                <span>3 Days</span>
                <span>7 Days</span>
                <span>10 Days</span>
                <span>14 Days</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                Approx. Start Date <span className="text-stone-400 font-normal lowercase">(optional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Calendar className="w-4 h-4 text-stone-400" />
                </div>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* 3. Budget Level & Currency */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
              Budget Tier & Target
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-3">
              {[
                { id: 'budget', label: 'Backpacker', sub: 'Hostels & street food', icon: '$' },
                { id: 'moderate', label: 'Comfort / Balanced', sub: 'Boutique hotels & bistros', icon: '$$' },
                { id: 'luxury', label: 'Luxury', sub: 'Fine dining & 4-5★ hotels', icon: '$$$' },
                { id: 'ultra_luxury', label: 'Ultra Luxury', sub: 'Premier suites & private tours', icon: '$$$$' },
              ].map((tier) => (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => setBudgetLevel(tier.id as any)}
                  className={`p-3 text-left rounded-xl border transition-all ${
                    budgetLevel === tier.id
                      ? 'bg-amber-50/70 border-amber-500 ring-2 ring-amber-500/20 text-stone-900'
                      : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs uppercase tracking-wider text-amber-700 font-mono">
                      {tier.icon}
                    </span>
                    {budgetLevel === tier.id && <Check className="w-3.5 h-3.5 text-amber-600" />}
                  </div>
                  <div className="font-semibold text-xs text-stone-900">{tier.label}</div>
                  <div className="text-[11px] text-stone-500 leading-tight mt-0.5">{tier.sub}</div>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-stone-500 mb-1">
                  Target Total Budget (Optional)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={approxBudget}
                    onChange={(e) => setApproxBudget(e.target.value)}
                    placeholder="e.g. 1500"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-stone-500 mb-1">
                  Display Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} ({c.symbol})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 4. Travel Party & Pace */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                Travel Party
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'solo', label: 'Solo Traveler', icon: '🧭' },
                  { id: 'couple', label: 'Couple / Duo', icon: '🥂' },
                  { id: 'family', label: 'Family with Kids', icon: '👨‍👩‍👧' },
                  { id: 'friends', label: 'Friends Group', icon: '🎒' },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setTravelParty(p.id as any)}
                    className={`px-3 py-2.5 rounded-lg border text-xs font-medium text-left flex items-center gap-2 transition-all ${
                      travelParty === p.id
                        ? 'bg-amber-50 border-amber-500 text-stone-900 font-semibold ring-1 ring-amber-500'
                        : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <span className="text-base">{p.icon}</span>
                    <span>{p.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                Travel Pace
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'relaxed', label: 'Relaxed', sub: '1-2 spots/day' },
                  { id: 'balanced', label: 'Balanced', sub: '2-3 spots + dinner' },
                  { id: 'packed', label: 'Packed', sub: 'See everything' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPace(item.id as any)}
                    className={`p-2.5 rounded-lg border text-center transition-all ${
                      pace === item.id
                        ? 'bg-amber-50 border-amber-500 text-stone-900 ring-1 ring-amber-500'
                        : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <div className="text-xs font-bold text-stone-900">{item.label}</div>
                    <div className="text-[10px] text-stone-500 mt-0.5">{item.sub}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 5. Interests & Passions */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                Interests & Passions <span className="text-stone-400 font-normal lowercase">(Select multiple)</span>
              </label>
              <span className="text-xs text-amber-800 font-semibold">
                {selectedInterests.length} selected
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {INTEREST_OPTIONS.map((interest) => {
                const Icon = interest.icon;
                const isSelected = selectedInterests.includes(interest.id);
                return (
                  <button
                    key={interest.id}
                    type="button"
                    onClick={() => toggleInterest(interest.id)}
                    className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      isSelected
                        ? 'bg-amber-50/80 border-amber-500 ring-1 ring-amber-500/30 text-stone-900'
                        : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-amber-500 text-white' : 'bg-stone-200 text-stone-600'}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-amber-600" />}
                    </div>
                    <span className="text-xs font-medium leading-tight">
                      {interest.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Collapsible Dietary & Custom Preferences */}
          <div className="border-t border-stone-200/80 pt-4">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-xs font-semibold text-stone-600 hover:text-stone-900 flex items-center gap-1.5 focus:outline-none"
            >
              <span>{showAdvanced ? '− Hide' : '+ Add'} Dietary Restrictions & Special Preferences</span>
            </button>

            {showAdvanced && (
              <div className="mt-4 space-y-4 pt-2">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-2">
                    Dietary Restrictions
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {DIETARY_OPTIONS.map((diet) => {
                      const isSelected = selectedDietary.includes(diet);
                      return (
                        <button
                          key={diet}
                          type="button"
                          onClick={() => toggleDietary(diet)}
                          className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                            isSelected
                              ? 'bg-stone-900 text-white border-stone-900 font-medium'
                              : 'bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200'
                          }`}
                        >
                          {diet}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                    Specific Trip Wishes or Constraints
                  </label>
                  <textarea
                    rows={2}
                    value={customPreferences}
                    onChange={(e) => setCustomPreferences(e.target.value)}
                    placeholder="e.g. We love specialty filter coffee and mid-century modern design; we prefer walking over taxis; my partner has a mild knee injury so avoid long steep stairs."
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Form Submission Footer */}
        <div className="p-6 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-stone-500 text-center sm:text-left">
            <span>Powered by Gemini 3.8 Flash · Accurate real-world coordinates and local insights</span>
          </div>

          <button
            type="submit"
            disabled={isLoading || !destination.trim()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-stone-950 font-bold text-sm rounded-xl shadow-md shadow-amber-500/20 active:scale-98 transition-all"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                <span>Crafting Your Custom Itinerary...</span>
              </>
            ) : (
              <>
                <span>Generate Itinerary</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
