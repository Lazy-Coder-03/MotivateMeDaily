"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { UserProfileFormData } from "@/schemas/userProfileSchema";
import { userProfileSchema } from "@/schemas/userProfileSchema";
import type { UserProfile } from "@/types";

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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserProfileFormProps {
  initialProfile: UserProfile;
  onSave: (profile: UserProfile) => void;
}

const toneOptions = [
  { value: 'inspirational', label: 'Inspirational' },
  { value: 'humorous', label: 'Humorous' },
  { value: 'direct', label: 'Direct & Action-Oriented' },
  { value: 'gentle', label: 'Gentle & Encouraging' },
  { value: 'philosophical', label: 'Philosophical & Reflective' },
] as const;

export default function UserProfileForm({ initialProfile, onSave }: UserProfileFormProps) {
  const { toast } = useToast();
  const form = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      age: initialProfile.age || '',
      goals: initialProfile.goals || "",
      lifeSituation: initialProfile.lifeSituation || "",
      motivationFocus: initialProfile.motivationFocus || "", // Added default value
      motivationalTone: initialProfile.motivationalTone || "inspirational",
    },
  });

  function onSubmit(data: UserProfileFormData) {
    const profileToSave: UserProfile = {
      age: data.age ? Number(data.age) : undefined,
      goals: data.goals,
      lifeSituation: data.lifeSituation,
      motivationFocus: data.motivationFocus, // Save the new field
      motivationalTone: data.motivationalTone,
    };
    onSave(profileToSave);
    toast({
      title: "Profile Saved",
      description: "Your motivational profile has been updated.",
    });
  }

  return (
    <Card className="w-full max-w-lg mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Your Motivational Profile</CardTitle>
        <CardDescription>
          Tell us about yourself so we can tailor your motivational quotes.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Enter your age" {...field} onChange={e => field.onChange(e.target.value === '' ? '' : parseInt(e.target.value, 10))} />
                  </FormControl>
                  <FormDescription>
                    Your age helps us understand your life stage.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="goals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Goals</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Learn a new skill, run a marathon, start a business"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    What are you currently aspiring to achieve?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lifeSituation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Life Situation</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Student, working professional, new parent, facing challenges"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Briefly describe your current circumstances.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="motivationFocus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What do you need motivation for?</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Staying disciplined with studies, overcoming a setback, improving relationships"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Specify the area where you're seeking motivation.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="motivationalTone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Quote Tone</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a tone" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {toneOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose the style of motivation you prefer.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" size="lg">
              <Save className="mr-2 h-4 w-4" /> Save Profile
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
