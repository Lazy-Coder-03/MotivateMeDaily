"use client";

import { useEffect, useState } from 'react';
import QuoteBoard from '@/components/QuoteBoard';
import type { Quote, UserProfile } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { DEFAULT_USER_PROFILE } from '@/types';

const QUOTES_STORAGE_KEY = 'motivateMeQuotes';
const PROFILE_STORAGE_KEY = 'motivateMeUserProfile';

export default function HomePage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedQuotes = localStorage.getItem(QUOTES_STORAGE_KEY);
    if (storedQuotes) {
      setQuotes(JSON.parse(storedQuotes));
    }

    const storedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (storedProfile) {
      setUserProfile(JSON.parse(storedProfile));
    } else {
      // If no profile, set to default to allow QuoteBoard to show "Create Profile" prompt
      setUserProfile(DEFAULT_USER_PROFILE); 
    }
    setIsLoading(false);
  }, []);

  const handleQuotesUpdate = (updatedQuotes: Quote[]) => {
    localStorage.setItem(QUOTES_STORAGE_KEY, JSON.stringify(updatedQuotes));
    setQuotes(updatedQuotes);
  };
  
  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-12 w-32" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-60 w-full" />)}
        </div>
      </div>
    );
  }

  return (
    <QuoteBoard 
      initialQuotes={quotes} 
      userProfile={userProfile}
      onQuotesUpdate={handleQuotesUpdate}
    />
  );
}
