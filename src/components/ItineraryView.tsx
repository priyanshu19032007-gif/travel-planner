import React, { useState } from 'react';
import {
  Calendar,
  Compass,
  MapPin,
  Wallet,
  Clock,
  Printer,
  Copy,
  Bookmark,
  MessageSquare,
  Share2,
  Luggage,
  ShieldCheck,
  Check,
  Sparkles,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';
import { ItineraryData } from '../types/itinerary';
import { DayScheduleView } from './DayScheduleView';
import { InteractiveMap } from './InteractiveMap';
import { BudgetCalculator } from './BudgetCalculator';
import { PackingChecklist } from './PackingChecklist';
import { LocalGuideView } from './LocalGuideView';
import { ConciergeModal } from './ConciergeModal';

interface ItineraryViewProps {
  itinerary: ItineraryData;
  onSaveTrip: (trip: ItineraryData) => void;
  isSaved: boolean;
  onTweakDay: (dayNumber: number, instruction: string) => Promise<void>;
  isTweakingDay: boolean;
  onBackToPlanner: () => void;
}

export const ItineraryView: React.FC<ItineraryViewProps> = ({
  itinerary,
  onSaveTrip,
  isSaved,
  onTweakDay,
  isTweakingDay,
  onBackToPlanner,
}) => {
  const [activeTab, setActiveTab] = useState<
    'schedule' | 'map' | 'budget' | 'packing' | 'guide'
  >('schedule');
  const [activeDayIndex, setActiveDayIndex] = useState<number | 'all'>('all');
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
  const [completedActivities, setCompletedActivities] = useState<string[]>([]);
  const [isConciergeOpen, setIsConciergeOpen] = useState(false);
  const [copiedState, setCopiedState] = useState(false);

  const { destination, budgetBreakdown, days, requestParameters } = itinerary;

  const handleToggleComplete = (id: string) => {
    setCompletedActivities((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleLocateOnMap = (lat: number, lng: number, id: string) => {
    setSelectedActivityId(id);
    setActiveTab('map');
  };

  const handleCopyMarkdown = () => {
    let md = `# ${destination.name}, ${destination.country} - ${days.length} Day Itinerary\n`;
    md += `*${destination.tagline}*\n\n`;
    md += `Estimated Budget: ${budgetBreakdown.totalEstimatedCost} (${budgetBreakdown.perPersonPerDay})\n\n`;

    days.forEach((d) => {
      md += `## Day ${d.dayNumber}: ${d.title}\n`;
      md += `*Theme: ${d.theme}*\n`;
      if (d.transitSummary) md += `*Transit: ${d.transitSummary}*\n\n`;

      d.activities.forEach((act) => {
        md += `### ${act.time} - ${act.title} (${act.category})\n`;
        md += `📍 Location: ${act.locationName} | Cost: ${act.estimatedCost} | Duration: ${act.duration}\n`;
        md += `${act.description}\n`;
        if (act.travelTip) md += `💡 Insider Tip: ${act.travelTip}\n`;
        if (act.foodRecommendation) {
          md += `🍴 Food Spot: ${act.foodRecommendation.dish} at ${act.foodRecommendation.venueName}\n`;
        }
        md += `\n`;
      });
    });

    navigator.clipboard.writeText(md);
    setCopiedState(true);
    setTimeout(() => setCopiedState(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <button
          onClick={onBackToPlanner}
          className="text-stone-500 hover:text-stone-900 font-medium inline-flex items-center gap-1 transition-colors"
        >
          <span>← Back to Planner</span>
        </button>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onSaveTrip(itinerary)}
            className={`px-3 py-1.5 rounded-lg border font-semibold inline-flex items-center gap-1.5 transition-all ${
              isSaved
                ? 'bg-amber-50 border-amber-300 text-amber-900 shadow-sm'
                : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
            }`}
          >
            <Bookmark
              className={`w-3.5 h-3.5 ${
                isSaved ? 'text-amber-600 fill-amber-500' : 'text-stone-400'
              }`}
            />
            <span>{isSaved ? 'Saved to My Trips' : 'Save Trip'}</span>
          </button>

          <button
            onClick={handleCopyMarkdown}
            className="px-3 py-1.5 bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 rounded-lg font-medium inline-flex items-center gap-1.5 transition-colors"
          >
            {copiedState ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-stone-400" />
                <span>Copy Summary</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="px-3 py-1.5 bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 rounded-lg font-medium inline-flex items-center gap-1.5 transition-colors"
            title="Print or Save as PDF"
          >
            <Printer className="w-3.5 h-3.5 text-stone-400" />
            <span>Print / PDF</span>
          </button>

          <button
            onClick={() => setIsConciergeOpen(true)}
            className="px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg font-semibold inline-flex items-center gap-1.5 shadow-sm transition-all"
          >
            <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
            <span>Ask Concierge</span>
          </button>
        </div>
      </div>

      {/* Hero Itinerary Card */}
      <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-10 border border-stone-800 shadow-xl relative overflow-hidden">
        {/* Subtle Decorative Background Graphic */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-amber-500/10 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
            <MapPin className="w-3.5 h-3.5" />
            <span>{destination.country}</span>
            <span>·</span>
            <span>{days.length} Days</span>
            <span>·</span>
            <span>{requestParameters.budgetLevel.toUpperCase()} Tier</span>
            <span>·</span>
            <span>{requestParameters.travelParty.toUpperCase()}</span>
          </div>

          <h1 className="font-serif-display text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            {destination.name}
          </h1>

          <p className="font-serif-display text-lg sm:text-xl text-amber-200/90 italic font-medium">
            "{destination.tagline}"
          </p>

          <p className="text-stone-300 text-xs sm:text-sm leading-relaxed max-w-2xl pt-1">
            {destination.heroSummary || itinerary.overviewNarrative}
          </p>

          {/* Quick Metrics Bar */}
          <div className="pt-4 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-stone-800 text-xs">
            <div>
              <span className="text-stone-400 text-[11px] block">Est. Total Cost</span>
              <span className="font-bold text-white font-mono text-sm">
                {budgetBreakdown.totalEstimatedCost}
              </span>
            </div>
            <div>
              <span className="text-stone-400 text-[11px] block">Daily Average</span>
              <span className="font-bold text-emerald-400 font-mono text-sm">
                {budgetBreakdown.perPersonPerDay}
              </span>
            </div>
            <div>
              <span className="text-stone-400 text-[11px] block">Currency</span>
              <span className="font-bold text-white text-sm">
                {destination.localCurrency}
              </span>
            </div>
            <div>
              <span className="text-stone-400 text-[11px] block">Emergency Line</span>
              <span className="font-bold text-amber-300 font-mono text-sm">
                {destination.emergencyNumber}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-stone-200">
        <nav className="flex items-center gap-2 sm:gap-4 overflow-x-auto pb-px">
          {[
            { id: 'schedule', label: 'Daily Schedule', icon: Calendar, badge: `${days.length} Days` },
            { id: 'map', label: 'Interactive Map', icon: Compass },
            { id: 'budget', label: 'Budget & Tracker', icon: Wallet },
            { id: 'packing', label: 'Packing Checklist', icon: Luggage },
            { id: 'guide', label: 'Local Intelligence', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-3.5 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition-all ${
                  isActive
                    ? 'border-amber-500 text-stone-900 bg-amber-50/30'
                    : 'border-transparent text-stone-500 hover:text-stone-800 hover:border-stone-300'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-600' : 'text-stone-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 font-semibold">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Contents */}
      <div className="pt-2">
        {activeTab === 'schedule' && (
          <DayScheduleView
            days={days}
            destinationName={destination.name}
            activeDayIndex={activeDayIndex}
            onSelectDay={setActiveDayIndex}
            completedActivities={completedActivities}
            onToggleCompleteActivity={handleToggleComplete}
            onLocateOnMap={handleLocateOnMap}
            selectedActivityId={selectedActivityId}
            onTweakDay={onTweakDay}
            isTweakingDay={isTweakingDay}
          />
        )}

        {activeTab === 'map' && (
          <InteractiveMap
            days={days}
            centerCoordinates={destination.centerCoordinates}
            destinationName={destination.name}
            activeDayIndex={activeDayIndex}
            onSelectDay={setActiveDayIndex}
            selectedActivityId={selectedActivityId}
            onSelectActivity={(id) => setSelectedActivityId(id)}
          />
        )}

        {activeTab === 'budget' && (
          <BudgetCalculator
            budgetBreakdown={budgetBreakdown}
            currency={requestParameters.currency}
          />
        )}

        {activeTab === 'packing' && (
          <PackingChecklist weatherAndClothing={itinerary.weatherAndClothing} />
        )}

        {activeTab === 'guide' && <LocalGuideView itinerary={itinerary} />}
      </div>

      {/* Concierge Modal */}
      <ConciergeModal
        isOpen={isConciergeOpen}
        onClose={() => setIsConciergeOpen(false)}
        destination={destination.name}
        tripSummary={`Trip to ${destination.name}, ${destination.country} for ${days.length} days with a ${requestParameters.budgetLevel} budget. Interests: ${requestParameters.interests.join(', ')}.`}
      />
    </div>
  );
};
