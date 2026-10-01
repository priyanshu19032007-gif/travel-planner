import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { DayItinerary, ActivityItem } from '../types/itinerary';
import { MapPin, Navigation, Compass, Layers } from 'lucide-react';

interface InteractiveMapProps {
  days: DayItinerary[];
  centerCoordinates: { lat: number; lng: number };
  destinationName: string;
  activeDayIndex: number | 'all';
  onSelectDay: (dayIndex: number | 'all') => void;
  selectedActivityId?: string | null;
  onSelectActivity?: (activityId: string) => void;
}

const DAY_COLORS = [
  '#f59e0b', // amber-500
  '#0284c7', // sky-600
  '#10b981', // emerald-500
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
  '#f97316', // orange-500
  '#06b6d4', // cyan-500
];

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  days,
  centerCoordinates,
  destinationName,
  activeDayIndex,
  onSelectDay,
  selectedActivityId,
  onSelectActivity,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const polylineLayerRef = useRef<L.LayerGroup | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const lat = centerCoordinates.lat || 35.6762;
      const lng = centerCoordinates.lng || 139.6503;

      const map = L.map(mapContainerRef.current, {
        center: [lat, lng],
        zoom: 13,
        scrollWheelZoom: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      polylineLayerRef.current = L.layerGroup().addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      // Keep map instance alive during re-renders, cleanup on unmount
    };
  }, []);

  // Update Markers and Polylines based on activeDayIndex
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !markersLayerRef.current || !polylineLayerRef.current) return;

    markersLayerRef.current.clearLayers();
    polylineLayerRef.current.clearLayers();

    const bounds: [number, number][] = [];

    // Filter days to display
    const daysToShow =
      activeDayIndex === 'all'
        ? days
        : days.filter((_, idx) => idx === activeDayIndex);

    daysToShow.forEach((day, dIdx) => {
      const actualDayNum = day.dayNumber;
      const dayColor = DAY_COLORS[(actualDayNum - 1) % DAY_COLORS.length];
      const dayPoints: [number, number][] = [];

      day.activities.forEach((act, actIdx) => {
        const { lat, lng } = act.coordinates;
        if (!lat || !lng || (lat === 0 && lng === 0)) return;

        bounds.push([lat, lng]);
        dayPoints.push([lat, lng]);

        const isSelected = selectedActivityId === act.id;

        // Custom div icon
        const customIcon = L.divIcon({
          className: 'custom-leaflet-marker',
          html: `
            <div style="
              background-color: ${isSelected ? '#1e293b' : dayColor};
              color: white;
              width: ${isSelected ? '32px' : '26px'};
              height: ${isSelected ? '32px' : '26px'};
              border-radius: 9999px;
              border: ${isSelected ? '3px solid #fbbf24' : '2px solid white'};
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 11px;
              font-weight: 800;
              box-shadow: 0 4px 10px rgba(0,0,0,0.3);
              cursor: pointer;
              transition: all 0.2s ease;
            ">
              ${actIdx + 1}
            </div>
          `,
          iconSize: [isSelected ? 32 : 26, isSelected ? 32 : 26],
          iconAnchor: [isSelected ? 16 : 13, isSelected ? 16 : 13],
        });

        const marker = L.marker([lat, lng], { icon: customIcon });

        const popupContent = `
          <div style="font-family: system-ui, sans-serif; min-width: 200px; padding: 2px;">
            <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: ${dayColor}; margin-bottom: 2px;">
              Day ${actualDayNum} · ${act.time}
            </div>
            <div style="font-size: 14px; font-weight: 700; color: #1e293b; margin-bottom: 4px; line-height: 1.2;">
              ${act.title}
            </div>
            <div style="font-size: 11px; color: #64748b; margin-bottom: 6px;">
              📍 ${act.locationName}
            </div>
            <div style="display: flex; align-items: center; justify-content: space-between; font-size: 11px; border-top: 1px solid #f1f5f9; padding-top: 4px;">
              <span style="font-weight: 600; color: #047857;">${act.estimatedCost}</span>
              <span style="color: #64748b;">${act.duration}</span>
            </div>
            ${
              act.travelTip
                ? `<div style="font-size: 10px; color: #854d0e; background: #fefce8; padding: 4px 6px; border-radius: 4px; margin-top: 6px;">
                    💡 ${act.travelTip}
                  </div>`
                : ''
            }
          </div>
        `;

        marker.bindPopup(popupContent);

        marker.on('click', () => {
          if (onSelectActivity) {
            onSelectActivity(act.id);
          }
        });

        markersLayerRef.current?.addLayer(marker);
      });

      // Draw route connecting day activities
      if (dayPoints.length > 1) {
        const polyline = L.polyline(dayPoints, {
          color: dayColor,
          weight: 3.5,
          opacity: 0.7,
          dashArray: '6, 8',
        });
        polylineLayerRef.current?.addLayer(polyline);
      }
    });

    // Fit map bounds to show markers
    if (bounds.length > 0) {
      map.fitBounds(bounds, {
        padding: [40, 40],
        maxZoom: 15,
      });
    } else if (centerCoordinates.lat && centerCoordinates.lng) {
      map.setView([centerCoordinates.lat, centerCoordinates.lng], 13);
    }
  }, [days, activeDayIndex, centerCoordinates, selectedActivityId]);

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
      {/* Map Header & Day Selector Bar */}
      <div className="p-4 bg-stone-50 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-700 flex items-center justify-center">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
              Interactive Route & Landmark Map
            </h3>
            <p className="text-[11px] text-stone-500">
              Click pins for timing, costs, and authentic culinary stops
            </p>
          </div>
        </div>

        {/* Day Selector Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto py-1">
          <button
            type="button"
            onClick={() => onSelectDay('all')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
              activeDayIndex === 'all'
                ? 'bg-stone-900 text-white shadow-sm'
                : 'bg-stone-200/70 text-stone-700 hover:bg-stone-300'
            }`}
          >
            All Days
          </button>
          {days.map((day, idx) => {
            const isSelected = activeDayIndex === idx;
            const dayColor = DAY_COLORS[idx % DAY_COLORS.length];
            return (
              <button
                key={day.dayNumber}
                type="button"
                onClick={() => onSelectDay(idx)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                    : 'bg-stone-200/70 text-stone-700 hover:bg-stone-300'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: dayColor }}
                />
                <span>Day {day.dayNumber}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Map Canvas Container */}
      <div className="relative">
        <div ref={mapContainerRef} className="h-[440px] sm:h-[500px] w-full z-10" />

        {/* Map Legend Overlay */}
        <div className="absolute bottom-3 left-3 z-[400] bg-white/90 backdrop-blur-sm px-3 py-2 rounded-xl border border-stone-200 shadow-md text-[11px] space-y-1">
          <div className="font-bold text-stone-700 uppercase tracking-wider text-[10px]">
            Route Legend
          </div>
          <div className="flex items-center gap-2 text-stone-600">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Numbered stops in chronological order</span>
          </div>
          <div className="flex items-center gap-2 text-stone-600">
            <span className="w-4 h-0.5 border-t-2 border-dashed border-stone-500" />
            <span>Dashed route lines per day</span>
          </div>
        </div>
      </div>
    </div>
  );
};
