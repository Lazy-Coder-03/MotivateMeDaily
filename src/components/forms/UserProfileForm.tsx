
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
import { Switch } from "@/components/ui/switch";

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

const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'non-binary', label: 'Non-binary' },
  { value: 'other', label: 'Other' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' },
] as const;

const relationshipStatusOptions = [
  { value: 'single', label: 'Single' },
  { value: 'in_a_relationship', label: 'In a relationship' },
  { value: 'married', label: 'Married' },
  { value: 'engaged', label: 'Engaged'},
  { value: 'divorced', label: 'Divorced' },
  { value: 'widowed', label: 'Widowed' },
  { value: 'complicated', label: "It's complicated" },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' },
] as const;

const sexualityOptions = [
  { value: 'straight', label: 'Straight' },
  { value: 'gay', label: 'Gay' },
  { value: 'lesbian', label: 'Lesbian' },
  { value: 'bisexual', label: 'Bisexual' },
  { value: 'pansexual', label: 'Pansexual' },
  { value: 'asexual', label: 'Asexual' },
  { value: 'queer', label: 'Queer' },
  { value: 'questioning', label: 'Questioning' },
  { value: 'other', label: 'Other' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' },
] as const;


export default function UserProfileForm({ initialProfile, onSave }: UserProfileFormProps) {
  const { toast } = useToast();
  const form = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      age: initialProfile.age || '',
      goals: initialProfile.goals || "",
      lifeSituation: initialProfile.lifeSituation || "",
      motivationFocus: initialProfile.motivationFocus || "",
      motivationalTone: initialProfile.motivationalTone || "inspirational",
      gender: initialProfile.gender || "prefer_not_to_say",
      relationshipStatus: initialProfile.relationshipStatus || "prefer_not_to_say",
      sexuality: initialProfile.sexuality || "prefer_not_to_say",
      onlyFamousQuotes: initialProfile.onlyFamousQuotes || false,
    },
  });

  function onSubmit(data: UserProfileFormData) {
    const profileToSave: UserProfile = {
      age: data.age ? Number(data.age) : undefined,
      goals: data.goals,
      lifeSituation: data.lifeSituation,
      motivationFocus: data.motivationFocus,
      motivationalTone: data.motivationalTone,
      gender: data.gender,
      relationshipStatus: data.relationshipStatus,
      sexuality: data.sexuality,
      onlyFamousQuotes: data.onlyFamousQuotes,
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
          Tell us about yourself so we can tailor your motivational quotes. All fields are optional unless marked.
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
                  <FormLabel>Your Goals <span className="text-destructive">*</span></FormLabel>
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
                  <FormLabel>Current Life Situation <span className="text-destructive">*</span></FormLabel>
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
                  <FormLabel>What do you need motivation for? <span className="text-destructive">*</span></FormLabel>
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

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {genderOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Optional: Helps in personalizing quote context.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="relationshipStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Relationship Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your relationship status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {relationshipStatusOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Optional: Your relationship status can add context.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sexuality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sexuality</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your sexuality" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sexualityOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Optional: Helps understand perspectives for motivation.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="onlyFamousQuotes"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Only Quotes from Famous Sources?</FormLabel>
                    <FormDescription>
                      If enabled, quotes will only be from known people, characters, or books.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
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
