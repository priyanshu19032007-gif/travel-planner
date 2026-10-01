import React from 'react';
import {
  Bookmark,
  X,
  MapPin,
  Calendar,
  Trash2,
  ArrowRight,
  Luggage,
} from 'lucide-react';
import { ItineraryData } from '../types/itinerary';

interface SavedTripsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedTrips: ItineraryData[];
  onSelectTrip: (trip: ItineraryData) => void;
  onDeleteTrip: (id: string) => void;
}

export const SavedTripsDrawer: React.FC<SavedTripsDrawerProps> = ({
  isOpen,
  onClose,
  savedTrips,
  onSelectTrip,
  onDeleteTrip,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-stone-950/50 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col border-l border-stone-200">
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Bookmark className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-base text-stone-900">
              My Saved Itineraries ({savedTrips.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Trips List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
          {savedTrips.length === 0 ? (
            <div className="text-center py-16 px-4 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center mx-auto">
                <Luggage className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-stone-800 text-sm">No saved trips yet</h4>
              <p className="text-xs text-stone-500 leading-relaxed max-w-xs mx-auto">
                Generate an itinerary or click "Save Trip" to keep your travel plans accessible anytime.
              </p>
            </div>
          ) : (
            savedTrips.map((trip) => (
              <div
                key={trip.id}
                className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-stone-100/60 transition-all flex flex-col justify-between gap-3 group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-sm text-stone-900 group-hover:text-amber-800 transition-colors">
                      {trip.destination.name}, {trip.destination.country}
                    </h4>
                    <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {trip.days.length} Days
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                    {trip.destination.tagline || trip.overviewNarrative}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-200/60 text-xs">
                  <span className="text-stone-400 text-[11px]">
                    Saved {new Date(trip.createdAt).toLocaleDateString()}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onDeleteTrip(trip.id)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors"
                      title="Delete saved trip"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectTrip(trip);
                        onClose();
                      }}
                      className="px-3 py-1 bg-stone-900 hover:bg-stone-800 text-white font-medium rounded-lg inline-flex items-center gap-1 transition-colors"
                    >
                      <span>Open</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
