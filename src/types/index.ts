export interface UserProfile {
  age: number | undefined;
  goals: string;
  lifeSituation: string;
  motivationFocus: string; // New field
  motivationalTone?: 'inspirational' | 'humorous' | 'direct' | 'gentle' | 'philosophical';
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
  motivationFocus: '', // New field default
  motivationalTone: 'inspirational',
};

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  frequency: 'daily',
};
