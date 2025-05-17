
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { NotificationSettingsFormData } from "@/schemas/notificationSettingsSchema";
import { notificationSettingsSchema } from "@/schemas/notificationSettingsSchema";
import type { NotificationSettings } from "@/types";

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
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Save, BellRing } from "lucide-react";

interface NotificationSettingsFormProps {
  initialSettings: NotificationSettings;
  onSave: (settings: NotificationSettings) => void;
}

export default function NotificationSettingsForm({ initialSettings, onSave }: NotificationSettingsFormProps) {
  const { toast } = useToast();
  const form = useForm<NotificationSettingsFormData>({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: {
      enabled: initialSettings.enabled,
      startTime: initialSettings.startTime,
      endTime: initialSettings.endTime,
      numQuotes: initialSettings.numQuotes,
      intervalHours: initialSettings.intervalHours,
    },
  });

  const watchedEnabled = form.watch("enabled");
  const watchedStartTime = form.watch("startTime");
  const watchedEndTime = form.watch("endTime");

  function onSubmit(data: NotificationSettingsFormData) {
    onSave(data);
    toast({
      title: "Settings Saved",
      description: "Your notification preferences have been updated.",
    });
  }

  const formatHour = (hour: number): string => {
    const h = hour % 12 || 12; 
    const ampm = hour >= 12 && hour < 24 ? 'PM' : 'AM'; 
    if (hour === 24 || hour === 0) return '12:00 AM'; // Midnight
    return `${h.toString().padStart(1, '0')}:00 ${ampm}`;
  };

  const getTimeWindowDisplay = () => {
    const startStr = formatHour(watchedStartTime);
    let endStr = formatHour(watchedEndTime);
    if (watchedEndTime <= watchedStartTime && watchedEnabled) { // Check enabled to avoid "(next day)" when initializing
      endStr += " (next day)";
    }
    if (watchedStartTime === watchedEndTime && watchedEnabled) {
        return "All day (24 hours)";
    }
    return `${startStr} - ${endStr}`;
  };


  return (
    <Card className="w-full max-w-lg mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center"><BellRing className="mr-2 h-6 w-6 text-primary" /> Notification Preferences</CardTitle>
        <CardDescription>
          Customize your motivational quote notifications.
          <br/>
          <span className="text-xs text-muted-foreground">(Note: Actual push notifications are a conceptual feature for this demo.)</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="enabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Enable Notifications</FormLabel>
                    <FormDescription>
                      Turn on or off all quote notifications.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-label="Enable notifications"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {watchedEnabled && (
              <div className="space-y-6 pt-4 border-t mt-6">
                <FormItem>
                  <div className="flex justify-between items-center mb-1">
                    <FormLabel>Active Notification Window</FormLabel>
                    <span className="text-sm font-medium text-primary">
                      {getTimeWindowDisplay()}
                    </span>
                  </div>
                  <Slider
                    value={[watchedStartTime, watchedEndTime]}
                    min={0}
                    max={23} // Slider visually goes from 0 to 23
                    step={1}
                    onValueChange={(values: number[]) => {
                      form.setValue('startTime', values[0], { shouldValidate: true });
                      form.setValue('endTime', values[1], { shouldValidate: true });
                    }}
                    className="my-4"
                    aria-label={`Active notification window: ${getTimeWindowDisplay()}`}
                  />
                  <FormDescription>
                    Set the time window. If end time is earlier than start time, it implies the window crosses midnight. Selecting the same start and end time implies a 24-hour window.
                  </FormDescription>
                  {form.formState.errors.endTime && (
                    <FormMessage>{form.formState.errors.endTime.message}</FormMessage>
                  )}
                   {form.formState.errors.startTime && (
                    <FormMessage>{form.formState.errors.startTime.message}</FormMessage>
                  )}
                </FormItem>

                <FormField
                  control={form.control}
                  name="numQuotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Quotes per Notification</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={e => field.onChange(parseInt(e.target.value, 10) || 1)}
                          min="1"
                          max="5"
                          className="mt-1"
                        />
                      </FormControl>
                       <FormDescription>
                        How many quotes to send at each notification interval (1-5).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="intervalHours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notification Interval (in hours)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={e => field.onChange(parseInt(e.target.value, 10) || 1)}
                          min="1"
                          max="24"
                          className="mt-1"
                        />
                      </FormControl>
                      <FormDescription>
                        How often to send the batch of quotes (e.g., every X hours) within your active time window (1-24). If window is 24h, interval must be 24h.
                      </FormDescription>
                      {/* Display general interval error if refine for intervalHours fails */}
                      {form.formState.errors.intervalHours && !form.formState.errors.endTime && !form.formState.errors.startTime &&(
                         <FormMessage>{form.formState.errors.intervalHours.message}</FormMessage>
                      )}
                      {/* Display root error if it's the one from the schema refine for intervalHours */}
                      {form.formState.errors.root?.message?.includes("interval") && (
                         <FormMessage>{form.formState.errors.root.message}</FormMessage>
                      )}


                    </FormItem>
                  )}
                />
              </div>
            )}
            <Button type="submit" className="w-full" size="lg">
              <Save className="mr-2 h-4 w-4" /> Save Preferences
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
