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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Save, BellRing } from "lucide-react";

interface NotificationSettingsFormProps {
  initialSettings: NotificationSettings;
  onSave: (settings: NotificationSettings) => void;
}

const frequencyOptions = [
  { value: 'daily', label: 'Once a day' },
  { value: 'twice_daily', label: 'Twice a day' },
  { value: 'hourly', label: 'Once an hour' },
  { value: 'disabled', label: 'Disabled (No notifications)' },
] as const;


export default function NotificationSettingsForm({ initialSettings, onSave }: NotificationSettingsFormProps) {
  const { toast } = useToast();
  const form = useForm<NotificationSettingsFormData>({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: {
      frequency: initialSettings.frequency || "daily",
    },
  });

  function onSubmit(data: NotificationSettingsFormData) {
    onSave(data);
    toast({
      title: "Settings Saved",
      description: "Your notification preferences have been updated.",
    });
  }

  return (
    <Card className="w-full max-w-lg mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center"><BellRing className="mr-2 h-6 w-6 text-primary" /> Notification Preferences</CardTitle>
        <CardDescription>
          Customize how often you receive motivational quotes. 
          <br/>
          <span className="text-xs text-muted-foreground">(Note: Actual push notifications are a conceptual feature for this demo.)</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="frequency"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Notification Frequency</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      {frequencyOptions.map(option => (
                        <FormItem key={option.value} className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value={option.value} />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {option.label}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" size="lg">
              <Save className="mr-2 h-4 w-4" /> Save Preferences
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
