export interface UserProfile {
  age: number | undefined;
  goals: string;
  lifeSituation: string;
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
};

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  frequency: 'daily',
};
