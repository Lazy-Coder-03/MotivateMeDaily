"use client";

import { useEffect, useState } from 'react';
import NotificationSettingsForm from '@/components/forms/NotificationSettingsForm';
import type { NotificationSettings } from '@/types';
import { DEFAULT_NOTIFICATION_SETTINGS } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

const SETTINGS_STORAGE_KEY = 'motivateMeNotificationSettings';

export default function SettingsPage() {
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (storedSettings) {
      setSettings(JSON.parse(storedSettings));
    } else {
      setSettings(DEFAULT_NOTIFICATION_SETTINGS);
    }
    setIsLoading(false);
  }, []);

  const handleSaveSettings = (updatedSettings: NotificationSettings) => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updatedSettings));
    setSettings(updatedSettings);
  };

  if (isLoading || !settings) {
    return (
      <div className="w-full max-w-lg mx-auto space-y-6">
        <Skeleton className="h-12 w-1/2" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <NotificationSettingsForm initialSettings={settings} onSave={handleSaveSettings} />
    </div>
  );
}
