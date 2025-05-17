"use client";

import { useEffect, useState } from 'react';
import UserProfileForm from '@/components/forms/UserProfileForm';
import type { UserProfile } from '@/types';
import { DEFAULT_USER_PROFILE } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

const PROFILE_STORAGE_KEY = 'motivateMeUserProfile';

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (storedProfile) {
      setProfile(JSON.parse(storedProfile));
    } else {
      setProfile(DEFAULT_USER_PROFILE);
    }
    setIsLoading(false);
  }, []);

  const handleSaveProfile = (updatedProfile: UserProfile) => {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updatedProfile));
    setProfile(updatedProfile);
  };

  if (isLoading || !profile) {
    return (
      <div className="w-full max-w-lg mx-auto space-y-6">
        <Skeleton className="h-12 w-1/2" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <UserProfileForm initialProfile={profile} onSave={handleSaveProfile} />
    </div>
  );
}
