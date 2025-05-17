
"use client";

import { useState } from 'react';
import FactGenerationForm from '@/components/forms/FactGenerationForm';
import type { GeneratedFact } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Lightbulb, Info } from 'lucide-react';

export default function FactsPage() {
  const [generatedFact, setGeneratedFact] = useState<GeneratedFact | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleFactGenerated = (fact: GeneratedFact) => {
    setGeneratedFact(fact);
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      <FactGenerationForm 
        onFactGenerated={handleFactGenerated}
        isGenerating={isGenerating}
        setIsGenerating={setIsGenerating}
      />

      {isGenerating && !generatedFact && (
        <Card className="w-full max-w-lg mx-auto shadow-lg animate-pulse">
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2 mt-1" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-16 w-full" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-4 w-1/4" />
          </CardFooter>
        </Card>
      )}

      {!isGenerating && !generatedFact && (
        <Card className="w-full max-w-lg mx-auto shadow-md border-2 border-dashed border-muted-foreground/20">
            <CardHeader className="items-center text-center">
                <Lightbulb className="h-12 w-12 text-muted-foreground/50 mb-2" />
                <CardTitle className="text-xl text-muted-foreground">Discover Something New!</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
                <p className="text-muted-foreground">
                    Enter a topic and select a style above, then click "Generate Fact" to get started.
                </p>
            </CardContent>
        </Card>
      )}

      {generatedFact && !isGenerating && (
        <Card className="w-full max-w-lg mx-auto shadow-xl bg-secondary/30 transform transition-all duration-500 ease-out hover:shadow-2xl scale-100 animate-in fade-in-0 zoom-in-95">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center text-primary">
              <Info className="mr-3 h-7 w-7" />
              Here's a Fact for You:
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xl font-semibold leading-relaxed text-foreground">
              {generatedFact.fact}
            </p>
            {generatedFact.source && (
              <CardDescription className="text-sm italic text-muted-foreground">
                Source: {generatedFact.source}
              </CardDescription>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
