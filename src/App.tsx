/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PlannerForm } from './components/PlannerForm';
import { ItineraryView } from './components/ItineraryView';
import { SavedTripsDrawer } from './components/SavedTripsDrawer';
import { SAMPLE_ITINERARIES } from './data/sampleItineraries';
import { ItineraryData, ItineraryRequest, DayItinerary } from './types/itinerary';
import { AlertCircle, Compass, Sparkles } from 'lucide-react';

const SAVED_TRIPS_STORAGE_KEY = 'voyager_saved_trips_v1';

export default function App() {
  const [currentItinerary, setCurrentItinerary] = useState<ItineraryData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedTrips, setSavedTrips] = useState<ItineraryData[]>([]);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [isTweakingDay, setIsTweakingDay] = useState(false);

  // Load saved trips from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SAVED_TRIPS_STORAGE_KEY);
      if (stored) {
        setSavedTrips(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load trips from storage:', e);
    }
  }, []);

  // Save trips to localStorage whenever updated
  const persistSavedTrips = (trips: ItineraryData[]) => {
    setSavedTrips(trips);
    try {
      localStorage.setItem(SAVED_TRIPS_STORAGE_KEY, JSON.stringify(trips));
    } catch (e) {
      console.error('Failed to save trips to storage:', e);
    }
  };

  const handleSaveTrip = (trip: ItineraryData) => {
    const exists = savedTrips.some((t) => t.id === trip.id);
    if (exists) {
      // Remove if already saved (toggle)
      persistSavedTrips(savedTrips.filter((t) => t.id !== trip.id));
    } else {
      persistSavedTrips([trip, ...savedTrips]);
    }
  };

  const handleDeleteTrip = (id: string) => {
    persistSavedTrips(savedTrips.filter((t) => t.id !== id));
  };

  // Generate Itinerary via Backend AI Endpoint
  const handleGenerateItinerary = async (request: ItineraryRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/itinerary/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server responded with status ${response.status}`);
      }

      const data: ItineraryData = await response.json();
      setCurrentItinerary(data);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Itinerary generation error:', err);
      setError(err.message || 'Failed to generate itinerary. Please try again or check your inputs.');
    } finally {
      setIsLoading(false);
    }
  };

  // Tweak specific day
  const handleTweakDay = async (dayNumber: number, instruction: string) => {
    if (!currentItinerary) return;
    setIsTweakingDay(true);

    try {
      const currentDay = currentItinerary.days.find((d) => d.dayNumber === dayNumber);
      if (!currentDay) throw new Error('Day not found');

      const response = await fetch('/api/itinerary/tweak-day', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: currentItinerary.destination.name,
          dayNumber,
          currentDay,
          instruction,
          currency: currentItinerary.requestParameters.currency,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update day with AI');
      }

      const updatedDay: DayItinerary = await response.json();
      const updatedDays = currentItinerary.days.map((d) =>
        d.dayNumber === dayNumber ? updatedDay : d
      );

      setCurrentItinerary({
        ...currentItinerary,
        days: updatedDays,
      });
    } catch (err: any) {
      console.error('Day tweak error:', err);
      alert(err.message || 'Could not update this day.');
    } finally {
      setIsTweakingDay(false);
    }
  };

  const handleSelectSample = (sampleKey: 'tokyo' | 'amalfi') => {
    const sample = SAMPLE_ITINERARIES[sampleKey];
    if (sample) {
      setCurrentItinerary(sample);
      setError(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isCurrentTripSaved = currentItinerary
    ? savedTrips.some((t) => t.id === currentItinerary.id)
    : false;

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        onNewTrip={() => {
          setCurrentItinerary(null);
          setError(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSaved={() => setIsSavedDrawerOpen(true)}
        savedCount={savedTrips.length}
        hasCurrentTrip={!!currentItinerary}
        onShare={() => {
          if (navigator.share && currentItinerary) {
            navigator.share({
              title: `${currentItinerary.destination.name} Travel Itinerary`,
              text: `Check out my ${currentItinerary.days.length}-day trip to ${currentItinerary.destination.name}!`,
              url: window.location.href,
            }).catch(() => {});
          } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Trip link copied to clipboard!');
          }
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Error notification banner */}
        {error && (
          <div className="max-w-4xl mx-auto px-4 mt-6">
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs sm:text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-bold">Generation Notice: </span>
                <span>{error}</span>
                <div className="mt-2">
                  <span className="text-rose-600 font-medium">Tip: </span>
                  <span>
                    You can also click one of the pre-curated samples below to explore a complete itinerary immediately.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Switch: Planner Form vs Itinerary Display */}
        {currentItinerary ? (
          <ItineraryView
            itinerary={currentItinerary}
            onSaveTrip={handleSaveTrip}
            isSaved={isCurrentTripSaved}
            onTweakDay={handleTweakDay}
            isTweakingDay={isTweakingDay}
            onBackToPlanner={() => setCurrentItinerary(null)}
          />
        ) : (
          <PlannerForm
            onSubmit={handleGenerateItinerary}
            isLoading={isLoading}
            onSelectSample={handleSelectSample}
          />
        )}
      </main>

      {/* Saved Trips Drawer */}
      <SavedTripsDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        savedTrips={savedTrips}
        onSelectTrip={(trip) => {
          setCurrentItinerary(trip);
          setIsSavedDrawerOpen(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onDeleteTrip={handleDeleteTrip}
      />

      {/* Footer */}
      <footer className="border-t border-stone-200 py-6 text-center text-xs text-stone-500 bg-white">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Voyager AI · Personalized Travel Planning Powered by Gemini</span>
          <span className="text-stone-400">
            Real coordinates, authentic local dining, and smart day logistics
          </span>
        </div>
      </footer>
    </div>
  );
}
