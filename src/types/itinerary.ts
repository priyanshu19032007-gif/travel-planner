export interface ItineraryRequest {
  destination: string;
  durationDays: number;
  startDate?: string;
  budgetLevel: 'budget' | 'moderate' | 'luxury' | 'ultra_luxury';
  approxBudget?: string;
  currency: string;
  travelParty: 'solo' | 'couple' | 'family' | 'friends';
  interests: string[];
  pace: 'relaxed' | 'balanced' | 'packed';
  dietaryRestrictions?: string[];
  customPreferences?: string;
}

export interface ActivityItem {
  id: string;
  timeSlot: 'morning' | 'afternoon' | 'evening';
  time: string; // e.g. "09:00 AM"
  title: string;
  description: string;
  category: 'sightseeing' | 'food' | 'culture' | 'nature' | 'relaxation' | 'adventure' | 'shopping' | 'nightlife';
  locationName: string;
  address?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  estimatedCost: string;
  duration: string;
  travelTip?: string;
  foodRecommendation?: {
    dish: string;
    venueName: string;
    notes: string;
  };
}

export interface DayItinerary {
  dayNumber: number;
  title: string;
  theme: string;
  dateStr?: string;
  transitSummary: string;
  activities: ActivityItem[];
  dayHighlights: string[];
}

export interface PackingCategory {
  categoryName: string;
  items: string[];
}

export interface ExpenseCategory {
  category: string;
  amount: string;
  percentage: number;
  details: string;
}

export interface ItineraryData {
  id: string;
  createdAt: string;
  destination: {
    name: string;
    country: string;
    tagline: string;
    heroSummary: string;
    bestTimeToVisit: string;
    localCurrency: string;
    language: string;
    emergencyNumber: string;
    centerCoordinates: {
      lat: number;
      lng: number;
    };
  };
  requestParameters: ItineraryRequest;
  overviewNarrative: string;
  budgetBreakdown: {
    totalEstimatedCost: string;
    perPersonPerDay: string;
    categories: ExpenseCategory[];
    moneySavingTips: string[];
  };
  weatherAndClothing: {
    expectedWeather: string;
    temperatureRange: string;
    packingChecklist: PackingCategory[];
  };
  localTips: {
    culturalEtiquette: string[];
    localTransitAdvice: string[];
    safetyAndScams: string[];
    hiddenGemsAdvice: string[];
  };
  days: DayItinerary[];
  alternativeActivities: {
    title: string;
    category: string;
    description: string;
    whyConsider: string;
  }[];
}
