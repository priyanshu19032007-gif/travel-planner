import React, { useState } from 'react';
import {
  Clock,
  MapPin,
  Tag,
  DollarSign,
  Lightbulb,
  Utensils,
  CheckCircle2,
  Circle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { ActivityItem } from '../types/itinerary';

interface ActivityCardProps {
  activity: ActivityItem;
  dayNumber: number;
  activityIndex: number;
  isCompleted?: boolean;
  onToggleComplete?: (id: string) => void;
  onLocateOnMap?: (lat: number, lng: number, id: string) => void;
  isSelected?: boolean;
}

const CATEGORY_STYLES: Record<string, { label: string; bg: string; text: string }> = {
  sightseeing: { label: 'Landmark & Sight', bg: 'bg-sky-50 text-sky-700 border-sky-200', text: 'text-sky-700' },
  food: { label: 'Culinary & Dining', bg: 'bg-amber-50 text-amber-700 border-amber-200', text: 'text-amber-700' },
  culture: { label: 'Art & Heritage', bg: 'bg-purple-50 text-purple-700 border-purple-200', text: 'text-purple-700' },
  nature: { label: 'Nature & Scenic', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', text: 'text-emerald-700' },
  relaxation: { label: 'Wellness & Chill', bg: 'bg-teal-50 text-teal-700 border-teal-200', text: 'text-teal-700' },
  adventure: { label: 'Outdoor Adventure', bg: 'bg-rose-50 text-rose-700 border-rose-200', text: 'text-rose-700' },
  shopping: { label: 'Markets & Crafts', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200', text: 'text-indigo-700' },
  nightlife: { label: 'Nightlife & Bars', bg: 'bg-pink-50 text-pink-700 border-pink-200', text: 'text-pink-700' },
};

export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  dayNumber,
  activityIndex,
  isCompleted = false,
  onToggleComplete,
  onLocateOnMap,
  isSelected = false,
}) => {
  const [expanded, setExpanded] = useState(true);

  const catStyle = CATEGORY_STYLES[activity.category] || {
    label: activity.category,
    bg: 'bg-stone-50 text-stone-700 border-stone-200',
    text: 'text-stone-700',
  };

  const handleLocate = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onLocateOnMap && activity.coordinates?.lat && activity.coordinates?.lng) {
      onLocateOnMap(activity.coordinates.lat, activity.coordinates.lng, activity.id);
    }
  };

  return (
    <div
      className={`rounded-xl border transition-all duration-200 ${
        isSelected
          ? 'bg-amber-50/50 border-amber-500 shadow-md ring-2 ring-amber-400/30'
          : isCompleted
          ? 'bg-stone-50/60 border-stone-200 opacity-70'
          : 'bg-white border-stone-200 hover:border-stone-300 shadow-sm'
      }`}
    >
      {/* Top Header */}
      <div className="p-4 sm:p-5 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          {/* Index / Checkbox */}
          <button
            type="button"
            onClick={() => onToggleComplete && onToggleComplete(activity.id)}
            className="mt-0.5 text-stone-400 hover:text-amber-600 transition-colors focus:outline-none"
            title={isCompleted ? 'Mark as uncompleted' : 'Mark as completed'}
          >
            {isCompleted ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
            ) : (
              <div className="w-5 h-5 rounded-full border-2 border-stone-300 flex items-center justify-center text-[10px] font-bold text-stone-600 hover:border-amber-500">
                {activityIndex + 1}
              </div>
            )}
          </button>

          <div className="flex-1">
            {/* Meta Row: Time, Category, Slot */}
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1 font-mono text-xs font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded">
                <Clock className="w-3 h-3 text-stone-500" />
                {activity.time}
              </span>

              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${catStyle.bg}`}
              >
                {catStyle.label}
              </span>

              <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider">
                {activity.timeSlot}
              </span>
            </div>

            {/* Title */}
            <h4
              className={`text-base sm:text-lg font-bold text-stone-900 leading-snug ${
                isCompleted ? 'line-through text-stone-500' : ''
              }`}
            >
              {activity.title}
            </h4>

            {/* Location & Map Pin Button */}
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-600">
              <span className="font-medium flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                {activity.locationName}
              </span>

              {activity.address && (
                <span className="text-stone-400 hidden sm:inline">
                  ({activity.address})
                </span>
              )}

              {activity.coordinates?.lat && activity.coordinates?.lng && (
                <button
                  type="button"
                  onClick={handleLocate}
                  className="text-amber-700 hover:text-amber-800 hover:underline font-semibold inline-flex items-center gap-0.5"
                >
                  <span>Locate on Map</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Cost & Duration Badges */}
        <div className="text-right flex-shrink-0">
          <div className="text-xs font-bold text-emerald-700 font-mono bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block mb-1">
            {activity.estimatedCost}
          </div>
          <div className="text-[11px] text-stone-500 font-medium">
            {activity.duration}
          </div>
        </div>
      </div>

      {/* Description & Recommendations Body */}
      {expanded && (
        <div className="px-4 pb-4 sm:px-5 sm:pb-5 space-y-3 pt-1 border-t border-stone-100">
          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
            {activity.description}
          </p>

          {/* Insider Travel Tip */}
          {activity.travelTip && (
            <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
              <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-950 mr-1">Insider Tip:</span>
                <span>{activity.travelTip}</span>
              </div>
            </div>
          )}

          {/* Food Recommendation */}
          {activity.foodRecommendation && (
            <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 flex items-start gap-2.5">
              <Utensils className="w-4 h-4 text-stone-500 flex-shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <div className="font-bold text-stone-900">
                  Recommended Bite: {activity.foodRecommendation.dish}
                </div>
                <div className="text-stone-600">
                  <span className="font-medium text-stone-800">{activity.foodRecommendation.venueName}</span>
                  {activity.foodRecommendation.notes && (
                    <span className="text-stone-500"> — {activity.foodRecommendation.notes}</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
