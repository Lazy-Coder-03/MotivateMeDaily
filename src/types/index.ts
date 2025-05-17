
export interface UserProfile {
  age: number | undefined;
  goals: string;
  lifeSituation: string;
  motivationFocus: string;
  motivationalTone?: 'inspirational' | 'humorous' | 'direct' | 'gentle' | 'philosophical';
  gender?: 'male' | 'female' | 'non-binary' | 'other' | 'prefer_not_to_say';
  relationshipStatus?: 'single' | 'in_a_relationship' | 'married' | 'engaged' | 'divorced' | 'widowed' | 'complicated' | 'prefer_not_to_say';
  sexuality?: 'straight' | 'gay' | 'lesbian' | 'bisexual' | 'pansexual' | 'asexual' | 'queer' | 'questioning' | 'other' | 'prefer_not_to_say';
  onlyFamousQuotes?: boolean;
}

export interface Quote {
  id: string;
  text: string;
  timestamp: number;
  rating?: number; // e.g., 1-5 stars
}

export interface NotificationSettings {
  enabled: boolean;
  startTime: number; // Hour 0-23
  endTime: number;   // Hour 0-23
  numQuotes: number;
  intervalHours: number; // e.g., every X hours
}

export const DEFAULT_USER_PROFILE: UserProfile = {
  age: undefined,
  goals: '',
  lifeSituation: '',
  motivationFocus: '',
  motivationalTone: 'inspirational',
  gender: 'prefer_not_to_say',
  relationshipStatus: 'prefer_not_to_say',
  sexuality: 'prefer_not_to_say',
  onlyFamousQuotes: false,
};

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  enabled: true,
  startTime: 9, // 9 AM
  endTime: 17,  // 5 PM
  numQuotes: 1,
  intervalHours: 4, 
};

// Types for Fact Generation
export const FACT_STYLES = [
  'General & Informative',
  'Niche & Specific',
  'Dark & Unusual',
  'Lighthearted & Fun',
  'Mind-blowing & Surprising',
] as const;

export type FactStyle = typeof FACT_STYLES[number];

export interface FactGenerationInput {
  topic: string;
  factStyle: FactStyle;
}

export interface GeneratedFact {
  fact: string;
  source?: string; // Optional source for the fact
}
