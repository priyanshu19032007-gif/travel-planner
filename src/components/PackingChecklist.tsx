import React, { useState } from 'react';
import {
  Luggage,
  CloudSun,
  Thermometer,
  CheckCircle2,
  Circle,
  PlusCircle,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { PackingCategory } from '../types/itinerary';

interface PackingChecklistProps {
  weatherAndClothing: {
    expectedWeather: string;
    temperatureRange: string;
    packingChecklist: PackingCategory[];
  };
}

export const PackingChecklist: React.FC<PackingChecklistProps> = ({
  weatherAndClothing,
}) => {
  // Store packed item names in state
  const [packedItems, setPackedItems] = useState<Record<string, boolean>>({});
  const [customItems, setCustomItems] = useState<string[]>([]);
  const [newItemText, setNewItemText] = useState('');

  // Collect all default items
  const allDefaultItems = weatherAndClothing.packingChecklist.flatMap((c) => c.items);
  const totalItemsCount = allDefaultItems.length + customItems.length;

  const packedCount = Object.values(packedItems).filter(Boolean).length;
  const progressPercent = totalItemsCount > 0 ? Math.round((packedCount / totalItemsCount) * 100) : 0;

  const toggleItem = (itemName: string) => {
    setPackedItems((prev) => ({
      ...prev,
      [itemName]: !prev[itemName],
    }));
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    setCustomItems([...customItems, newItemText.trim()]);
    setNewItemText('');
  };

  const handleReset = () => {
    setPackedItems({});
  };

  return (
    <div className="space-y-6">
      {/* Weather & Climate Overview Banner */}
      <div className="p-6 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent rounded-2xl border border-amber-200/60 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800">
            <CloudSun className="w-4 h-4 text-amber-600" />
            <span>Destination Climate Intelligence</span>
          </div>
          <p className="text-sm text-stone-800 font-medium">
            {weatherAndClothing.expectedWeather}
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-stone-200 flex-shrink-0">
          <Thermometer className="w-5 h-5 text-amber-600" />
          <div>
            <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
              Typical Range
            </div>
            <div className="text-sm font-bold text-stone-900 font-mono">
              {weatherAndClothing.temperatureRange}
            </div>
          </div>
        </div>
      </div>

      {/* Progress & Quick Actions */}
      <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Luggage className="w-4 h-4 text-amber-600" />
            <span className="font-bold text-stone-900 uppercase tracking-wider">
              Packing Preparedness
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono font-bold text-amber-800">
              {packedCount} / {totalItemsCount} Packed ({progressPercent}%)
            </span>
            {packedCount > 0 && (
              <button
                type="button"
                onClick={handleReset}
                className="text-stone-400 hover:text-stone-700 transition-colors inline-flex items-center gap-1 text-[11px]"
                title="Reset packed items"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Categorized Checklist Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {weatherAndClothing.packingChecklist.map((cat, idx) => (
          <div
            key={idx}
            className="p-5 bg-white rounded-2xl border border-stone-200 shadow-sm space-y-3 flex flex-col justify-between"
          >
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 border-b border-stone-100 pb-2 mb-3">
                {cat.categoryName}
              </h4>
              <div className="space-y-2">
                {cat.items.map((item, itemIdx) => {
                  const isChecked = !!packedItems[item];
                  return (
                    <label
                      key={itemIdx}
                      className="flex items-start gap-2.5 text-xs text-stone-800 cursor-pointer select-none group"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleItem(item)}
                        className="hidden"
                      />
                      <div className="mt-0.5 flex-shrink-0">
                        {isChecked ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                        ) : (
                          <Circle className="w-4 h-4 text-stone-300 group-hover:text-amber-500" />
                        )}
                      </div>
                      <span className={isChecked ? 'line-through text-stone-400' : ''}>
                        {item}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        ))}

        {/* Custom Items Card */}
        <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 border-b border-stone-100 pb-2 mb-3">
              Custom Personal Items
            </h4>

            <div className="space-y-2">
              {customItems.map((item, i) => {
                const isChecked = !!packedItems[item];
                return (
                  <label
                    key={i}
                    className="flex items-start gap-2.5 text-xs text-stone-800 cursor-pointer select-none group"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleItem(item)}
                      className="hidden"
                    />
                    <div className="mt-0.5 flex-shrink-0">
                      {isChecked ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                      ) : (
                        <Circle className="w-4 h-4 text-stone-300 group-hover:text-amber-500" />
                      )}
                    </div>
                    <span className={isChecked ? 'line-through text-stone-400' : ''}>
                      {item}
                    </span>
                  </label>
                );
              })}
              {customItems.length === 0 && (
                <p className="text-[11px] text-stone-400 italic">
                  Add your own medications, lenses, or camera gear below.
                </p>
              )}
            </div>
          </div>

          <form onSubmit={handleAddCustom} className="flex items-center gap-1.5 pt-3 border-t border-stone-100">
            <input
              type="text"
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              placeholder="Add personal gear..."
              className="flex-1 px-2.5 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
            <button
              type="submit"
              className="px-2.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-medium"
            >
              Add
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
