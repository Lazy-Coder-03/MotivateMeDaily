
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { FactGenerationFormData } from "@/schemas/factGenerationSchema";
import { factGenerationSchema } from "@/schemas/factGenerationSchema";
import { FACT_STYLES, type FactStyle, type GeneratedFact } from "@/types";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Wand2 } from "lucide-react";

interface FactGenerationFormProps {
  onFactGenerated: (fact: GeneratedFact) => void;
  isGenerating: boolean;
  setIsGenerating: (isGenerating: boolean) => void;
}

export default function FactGenerationForm({ onFactGenerated, isGenerating, setIsGenerating }: FactGenerationFormProps) {
  const { toast } = useToast();
  const form = useForm<FactGenerationFormData>({
    resolver: zodResolver(factGenerationSchema),
    defaultValues: {
      topic: "",
      factStyle: FACT_STYLES[0], // Default to the first style
    },
  });

  async function onSubmit(data: FactGenerationFormData) {
    setIsGenerating(true);
    try {
      // Lazy load the AI function
      const { generateRandomFact } = await import('@/ai/flows/generate-random-fact');
      const result = await generateRandomFact({
        topic: data.topic,
        factStyle: data.factStyle as FactStyle,
      });
      onFactGenerated(result);
      toast({
        title: "Fact Generated!",
        description: "A new interesting fact is ready.",
      });
    } catch (error) {
      console.error("Failed to generate fact:", error);
      toast({
        title: "Error Generating Fact",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      // Optionally provide a default error fact to the parent
      onFactGenerated({ fact: "Could not generate a fact at this moment.", source: "System Error" });
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <Card className="w-full max-w-lg mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center">
          <Wand2 className="mr-2 h-6 w-6 text-primary" />
          Random Fact Generator
        </CardTitle>
        <CardDescription>
          Enter a topic and choose a style to get a surprising fact!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Topic</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Ancient Rome, Black Holes, The Ocean" {...field} />
                  </FormControl>
                  <FormDescription>
                    What subject are you curious about?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="factStyle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fact Style</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a style for the fact" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {FACT_STYLES.map(style => (
                        <SelectItem key={style} value={style}>
                          {style}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose the tone or type of fact you'd like.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" size="lg" disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" /> Generate Fact
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
