"use client";

import type { Quote, UserProfile } from '@/types';
import QuoteCard from './QuoteCard';
import { Button } from './ui/button';
import { PlusCircle, AlertTriangle, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { generatePersonalizedQuote } from '@/ai/flows/generate-personalized-quote';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Skeleton } from './ui/skeleton';

interface QuoteBoardProps {
  initialQuotes: Quote[];
  userProfile: UserProfile | null;
  onQuotesUpdate: (quotes: Quote[]) => void;
}

export default function QuoteBoard({ initialQuotes, userProfile, onQuotesUpdate }: QuoteBoardProps) {
  const { toast } = useToast();
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);
  const [quotes, setQuotes] = useState<Quote[]>(initialQuotes);

  const handleGenerateQuote = async () => {
    if (!userProfile || !userProfile.age) {
      toast({
        title: "Profile Incomplete",
        description: "Please complete your profile to generate personalized quotes.",
        variant: "destructive",
        action: <Button asChild variant="outline"><Link href="/profile">Go to Profile</Link></Button>,
      });
      return;
    }

    setIsLoadingQuote(true);
    try {
      const result = await generatePersonalizedQuote({
        age: userProfile.age,
        goals: userProfile.goals,
        lifeSituation: userProfile.lifeSituation,
        motivationalTone: userProfile.motivationalTone || 'inspirational',
      });
      const newQuote: Quote = {
        id: Date.now().toString(), // Simple ID generation
        text: result.quote,
        timestamp: Date.now(),
        rating: 0,
      };
      const updatedQuotes = [newQuote, ...quotes];
      setQuotes(updatedQuotes);
      onQuotesUpdate(updatedQuotes);
      toast({
        title: "New Quote Generated!",
        description: "A fresh dose of motivation just for you.",
      });
    } catch (error) {
      console.error("Failed to generate quote:", error);
      toast({
        title: "Error Generating Quote",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingQuote(false);
    }
  };

  const handleRateQuote = (quoteId: string, rating: number) => {
    const updatedQuotes = quotes.map(q => q.id === quoteId ? { ...q, rating } : q);
    setQuotes(updatedQuotes);
    onQuotesUpdate(updatedQuotes);
  };

  const handleDeleteQuote = (quoteId: string) => {
    const updatedQuotes = quotes.filter(q => q.id !== quoteId);
    setQuotes(updatedQuotes);
    onQuotesUpdate(updatedQuotes);
    toast({ title: "Quote Deleted", description: "The quote has been removed from your board." });
  };

  if (!userProfile) {
     return (
      <div className="text-center py-10">
        <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Welcome to MotivateMe Daily!</h2>
        <p className="text-muted-foreground mb-4">
          Please set up your profile to start receiving personalized motivational quotes.
        </p>
        <Button asChild>
          <Link href="/profile">Create Your Profile</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Your Motivation Board</h2>
        <Button onClick={handleGenerateQuote} disabled={isLoadingQuote} size="lg">
          {isLoadingQuote ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            <>
              <PlusCircle className="mr-2 h-5 w-5" />
              New Quote
            </>
          )}
        </Button>
      </div>

      {isLoadingQuote && quotes.length === 0 && (
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-60 w-full bg-yellow-200/50" />)}
        </div>
      )}

      {quotes.length === 0 && !isLoadingQuote && (
        <div className="text-center py-10 border-2 border-dashed border-muted-foreground/30 rounded-lg">
          <Sparkles className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold text-muted-foreground">Your board is empty!</h3>
          <p className="text-muted-foreground">Click "New Quote" to get your first piece of motivation.</p>
        </div>
      )}

      {quotes.length > 0 && (
         <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-8 space-y-8">
          {quotes.map((quote) => (
            <QuoteCard 
              key={quote.id} 
              quote={quote} 
              onRate={handleRateQuote}
              onDelete={handleDeleteQuote}
              className="animate-in fade-in-0 zoom-in-95 duration-500"
            />
          ))}
        </div>
      )}
    </div>
  );
}
