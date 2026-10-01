import React, { useState } from 'react';
import { DayItinerary, ActivityItem } from '../types/itinerary';
import { ActivityCard } from './ActivityCard';
import {
  Sparkles,
  Calendar,
  Compass,
  Train,
  CheckCircle,
  Wand2,
  RefreshCw,
  Search,
  Filter,
} from 'lucide-react';

interface DayScheduleViewProps {
  days: DayItinerary[];
  destinationName: string;
  activeDayIndex: number | 'all';
  onSelectDay: (index: number | 'all') => void;
  completedActivities: string[];
  onToggleCompleteActivity: (id: string) => void;
  onLocateOnMap?: (lat: number, lng: number, id: string) => void;
  selectedActivityId?: string | null;
  onTweakDay: (dayNumber: number, instruction: string) => Promise<void>;
  isTweakingDay: boolean;
}

export const DayScheduleView: React.FC<DayScheduleViewProps> = ({
  days,
  destinationName,
  activeDayIndex,
  onSelectDay,
  completedActivities,
  onToggleCompleteActivity,
  onLocateOnMap,
  selectedActivityId,
  onTweakDay,
  isTweakingDay,
}) => {
  const [tweakModalOpen, setTweakModalOpen] = useState(false);
  const [tweakInstruction, setTweakInstruction] = useState('');
  const [targetTweakDay, setTargetTweakDay] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState('');

  const displayedDays =
    activeDayIndex === 'all'
      ? days
      : days.filter((_, idx) => idx === activeDayIndex);

  const handleOpenTweak = (dayNumber: number) => {
    setTargetTweakDay(dayNumber);
    setTweakInstruction('');
    setTweakModalOpen(true);
  };

  const handleExecuteTweak = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tweakInstruction.trim()) return;
    await onTweakDay(targetTweakDay, tweakInstruction.trim());
    setTweakModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Day Selector & Search Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Day Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          <button
            type="button"
            onClick={() => onSelectDay('all')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
              activeDayIndex === 'all'
                ? 'bg-stone-900 text-white shadow-sm'
                : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
            }`}
          >
            All Days ({days.length})
          </button>
          {days.map((day, idx) => {
            const isSelected = activeDayIndex === idx;
            return (
              <button
                key={day.dayNumber}
                type="button"
                onClick={() => onSelectDay(idx)}
                className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-amber-500 text-stone-950 shadow-sm'
                    : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
                }`}
              >
                <span>Day {day.dayNumber}</span>
              </button>
            );
          })}
        </div>

        {/* Quick Search in Itinerary */}
        <div className="relative min-w-[200px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search activities or food..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-stone-200 rounded-xl text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Days List */}
      <div className="space-y-8">
        {displayedDays.map((day) => {
          // Filter activities if search query is entered
          const filteredActivities = searchQuery
            ? day.activities.filter(
                (act) =>
                  act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  act.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  act.locationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  act.foodRecommendation?.dish.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  act.foodRecommendation?.venueName.toLowerCase().includes(searchQuery.toLowerCase())
              )
            : day.activities;

          return (
            <div
              key={day.dayNumber}
              className="bg-stone-50/70 border border-stone-200 rounded-2xl p-5 sm:p-6 space-y-5"
            >
              {/* Day Header Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded">
                      Day {day.dayNumber}
                    </span>
                    <span className="text-xs font-semibold text-stone-500">
                      {day.theme}
                    </span>
                  </div>
                  <h3 className="font-serif-display text-xl sm:text-2xl font-bold text-stone-900">
                    {day.title}
                  </h3>
                  {day.transitSummary && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-stone-600">
                      <Train className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
                      <span>{day.transitSummary}</span>
                    </div>
                  )}
                </div>

                {/* Day Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenTweak(day.dayNumber)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-stone-100 border border-stone-300 rounded-lg text-xs font-semibold text-stone-700 shadow-sm transition-all"
                    title="Customize or regenerate activities for this day"
                  >
                    <Wand2 className="w-3.5 h-3.5 text-amber-600" />
                    <span>Tweak Day {day.dayNumber}</span>
                  </button>
                </div>
              </div>

              {/* Day Highlights */}
              {day.dayHighlights && day.dayHighlights.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-stone-500 font-semibold">Key Highlights:</span>
                  {day.dayHighlights.map((hl, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-white border border-stone-200 text-stone-700 rounded-lg text-[11px] font-medium"
                    >
                      ✦ {hl}
                    </span>
                  ))}
                </div>
              )}

              {/* Activities Timeline */}
              <div className="space-y-4">
                {filteredActivities.length === 0 ? (
                  <div className="p-8 text-center bg-white rounded-xl border border-dashed border-stone-300 text-stone-500 text-xs">
                    No activities match your search "{searchQuery}" on Day {day.dayNumber}.
                  </div>
                ) : (
                  filteredActivities.map((activity, actIdx) => (
                    <ActivityCard
                      key={activity.id || actIdx}
                      activity={activity}
                      dayNumber={day.dayNumber}
                      activityIndex={actIdx}
                      isCompleted={completedActivities.includes(activity.id)}
                      onToggleComplete={onToggleCompleteActivity}
                      onLocateOnMap={onLocateOnMap}
                      isSelected={selectedActivityId === activity.id}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Tweak Day Modal */}
      {tweakModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-500/10 text-amber-700 rounded-lg">
                  <Wand2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-stone-900">
                    Tweak Day {targetTweakDay} with AI
                  </h4>
                  <p className="text-xs text-stone-500">
                    Tell Gemini how you would like to alter this specific day's schedule
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleExecuteTweak} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  What would you like to change?
                </label>
                <textarea
                  rows={3}
                  required
                  value={tweakInstruction}
                  onChange={(e) => setTweakInstruction(e.target.value)}
                  placeholder="e.g. 'Make the afternoon indoor-friendly because it might rain', 'Swap dinner for a top-rated ramen spot', or 'Make this day less strenuous with more cafe breaks'."
                  className="w-full p-3 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                />
              </div>

              {/* Quick suggestion prompt chips */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-stone-400">
                  Quick Ideas:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Make it more kid/family friendly',
                    'Focus on budget street food',
                    'Less walking / more relaxing pace',
                    'Add an art gallery or museum',
                    'Find vegetarian lunch options',
                  ].map((idea) => (
                    <button
                      key={idea}
                      type="button"
                      onClick={() => setTweakInstruction(idea)}
                      className="text-[11px] px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg border border-stone-200 transition-colors"
                    >
                      {idea}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setTweakModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isTweakingDay || !tweakInstruction.trim()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 font-bold text-xs rounded-xl shadow-sm transition-all"
                >
                  {isTweakingDay ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                      <span>Regenerating Day {targetTweakDay}...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Update Day Plan</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
