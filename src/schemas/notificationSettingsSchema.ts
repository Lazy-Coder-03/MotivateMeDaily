
import { z } from 'zod';

export const notificationSettingsSchema = z.object({
  enabled: z.boolean(),
  startTime: z.coerce.number().min(0, "Start time cannot be before 00:00").max(23, "Start time cannot be after 23:00"),
  endTime: z.coerce.number().min(0, "End time cannot be before 00:00").max(23, "End time cannot be after 23:00"),
  numQuotes: z.coerce.number().min(1, "Must send at least 1 quote.").max(5, "Cannot send more than 5 quotes at a time."),
  intervalHours: z.coerce.number().min(1, "Interval must be at least 1 hour.").max(24, "Interval cannot be more than 24 hours."),
}).refine(data => {
    if (!data.enabled) return true; // If disabled, this specific validation doesn't apply
    // Ensure endTime is strictly greater than startTime for a valid window
    if (data.endTime <= data.startTime) return false;
    return true;
  }, {
    message: "End time must be after start time.",
    path: ["endTime"], 
  })
  .refine(data => {
    if (!data.enabled || data.endTime <= data.startTime) return true; // If disabled or invalid time window, skip this
    const duration = data.endTime - data.startTime;
    // Interval can be equal to duration (e.g. window of 1h, interval of 1h)
    return data.intervalHours <= duration; 
  }, {
    message: "Notification interval cannot be longer than the active time window.",
    path: ["intervalHours"],
  });

export type NotificationSettingsFormData = z.infer<typeof notificationSettingsSchema>;
