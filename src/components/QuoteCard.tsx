"use client";

import { useState } from 'react';
import type { Quote } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Trash2, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';


interface QuoteCardProps {
  quote: Quote;
  onRate: (quoteId: string, rating: number) => void;
  onDelete: (quoteId: string) => void;
  className?: string;
}

export default function QuoteCard({ quote, onRate, onDelete, className }: QuoteCardProps) {
  const [currentRating, setCurrentRating] = useState(quote.rating || 0);
  const { toast } = useToast();

  const handleRating = (rating: number) => {
    setCurrentRating(rating);
    onRate(quote.id, rating);
    toast({ title: "Rating Saved!", description: `You rated this quote ${rating} star(s).` });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(quote.text);
    toast({ title: "Copied!", description: "Quote copied to clipboard." });
  };

  // Generate a random rotation between -3deg and 3deg
  const [rotation] = useState(Math.floor(Math.random() * 7) - 3);

  return (
    <Card 
      className={cn(
        "w-full sm:w-72 h-auto min-h-[200px] bg-[hsl(55,100%,88%)] text-stone-800 shadow-xl flex flex-col justify-between p-4 relative break-inside-avoid-column transition-all duration-300 ease-out hover:shadow-2xl",
        className
      )}
      style={{ transform: `rotate(${rotation}deg)` }}
      aria-label={`Motivational quote: ${quote.text}`}
    >
      <button 
        onClick={handleCopy}
        className="absolute top-2 right-10 p-1.5 text-stone-500 hover:text-stone-700 transition-colors rounded-full hover:bg-black/10"
        aria-label="Copy quote"
      >
        <Copy size={16} />
      </button>
      <button 
        onClick={() => onDelete(quote.id)}
        className="absolute top-2 right-2 p-1.5 text-red-400 hover:text-red-600 transition-colors rounded-full hover:bg-black/10"
        aria-label="Delete quote"
      >
        <Trash2 size={16} />
      </button>

      <CardContent className="p-2 flex-grow overflow-auto">
        <p className="text-lg font-medium leading-relaxed whitespace-pre-wrap">"{quote.text}"</p>
      </CardContent>
      <CardFooter className="p-2 flex flex-col items-start space-y-2">
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Button
              key={star}
              variant="ghost"
              size="icon"
              className="p-1 h-auto w-auto text-amber-400 hover:text-amber-500"
              onClick={() => handleRating(star)}
              aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
            >
              <Star size={20} fill={star <= currentRating ? 'currentColor' : 'none'} />
            </Button>
          ))}
        </div>
        <p className="text-xs text-stone-500">
          Generated {formatDistanceToNow(new Date(quote.timestamp), { addSuffix: true })}
        </p>
      </CardFooter>
    </Card>
  );
}
