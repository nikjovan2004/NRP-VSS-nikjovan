export interface Provider {
  id: string;
  name: string;
  services: string[];
  rating: number;
  reviewCount: number;
  verified: boolean;
  priceRange: string;
  location: string;
  bio?: string;
}

export interface TimeSlot {
  date: string; // YYYY-MM-DD
  start: string; // HH:mm
  end: string;   // HH:mm
}
