
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
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Save, BellRing } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface NotificationSettingsFormProps {
  initialSettings: NotificationSettings;
  onSave: (settings: NotificationSettings) => void;
}

const hourOptions = Array.from({ length: 24 }, (_, i) => {
  const hour = i;
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  const ampm = hour < 12 || hour === 24 ? 'AM' : 'PM';
  if (hour === 0) return { value: 0, label: `12:00 AM (Midnight)` };
  if (hour === 12) return { value: 12, label: `12:00 PM (Noon)` };
  return { value: hour, label: `${displayHour}:00 ${ampm}` };
});


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
  
  const formatHourForDisplay = (hour: number): string => {
    const foundOption = hourOptions.find(option => option.value === hour);
    return foundOption ? foundOption.label : `${String(hour).padStart(2, '0')}:00`;
  };

  const getTimeWindowDisplay = () => {
    if (!watchedEnabled) return "Notifications disabled";
    
    const startStr = formatHourForDisplay(watchedStartTime);
    let endStr = formatHourForDisplay(watchedEndTime);

    if (watchedStartTime === watchedEndTime) {
        return `All day (24 hours), starting at ${startStr}`;
    }
    if (watchedEndTime < watchedStartTime) { 
      endStr += " (next day)";
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
                </FormItem>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Time</FormLabel>
                        <Select onValueChange={value => field.onChange(Number(value))} defaultValue={String(field.value)}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select start time" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {hourOptions.map(option => (
                              <SelectItem key={`start-${option.value}`} value={String(option.value)}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="endTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Time</FormLabel>
                        <Select onValueChange={value => field.onChange(Number(value))} defaultValue={String(field.value)}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select end time" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {hourOptions.map(option => (
                              <SelectItem key={`end-${option.value}`} value={String(option.value)}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormDescription>
                  Set the time window for notifications. If end time is earlier than start time, it implies the window crosses midnight. Selecting the same start and end time implies a 24-hour window for interval calculation.
                </FormDescription>


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
                        How often to send the batch of quotes (e.g., every X hours) within your active time window (1-24).
                      </FormDescription>
                      {form.formState.errors.intervalHours && (
                         <FormMessage>{form.formState.errors.intervalHours.message}</FormMessage>
                      )}
                       {form.formState.errors.root?.message && form.formState.errors.root.message.includes("interval") && (
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

