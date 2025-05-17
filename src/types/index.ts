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
  frequency: 'daily' | 'twice_daily' | 'hourly' | 'disabled';
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
  frequency: 'daily',
};
