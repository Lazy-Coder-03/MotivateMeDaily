
import { z } from 'zod';

export const notificationSettingsSchema = z.object({
  enabled: z.boolean(),
  startTime: z.coerce.number().min(0, "Start time cannot be before 00:00").max(23, "Start time cannot be after 23:00"),
  endTime: z.coerce.number().min(0, "End time cannot be before 00:00").max(23, "End time cannot be after 23:00"),
  numQuotes: z.coerce.number().min(1, "Must send at least 1 quote.").max(5, "Cannot send more than 5 quotes at a time."),
  intervalHours: z.coerce.number().min(1, "Interval must be at least 1 hour.").max(24, "Interval cannot be more than 24 hours."),
})
  .refine(data => {
    if (!data.enabled) return true; // If disabled, skip this validation

    // Calculate duration, allowing for endTime < startTime (next day wrap)
    let duration;
    if (data.endTime > data.startTime) {
      duration = data.endTime - data.startTime;
    } else if (data.endTime < data.startTime) { // Wraps around midnight
      duration = (24 - data.startTime) + data.endTime;
    } else { // startTime === endTime, implies a 24-hour window if distinct from initial state
      // Or could be disallowed if a zero-duration window isn't sensible.
      // For now, let's assume if they are equal it implies a 24hr window or a user might be in the middle of sliding.
      // A more robust solution might require an explicit "all day" toggle or min duration.
      // For interval check, let's assume if they are same it's a 24h window for now.
      duration = 24; 
    }
    
    // Interval can be equal to duration (e.g. window of 1h, interval of 1h)
    // Or if duration is 0 (start and end are same and not wrapping), interval can't be >0.
    // This logic gets a bit complex if start === end implies a 0 duration window.
    // Let's refine to ensure if startTime === endTime, interval must be 24 or invalid.
    if (data.startTime === data.endTime) { // If times are the same
        return data.intervalHours === 24; // Only allow 24hr interval if it's a full day
    }

    return data.intervalHours <= duration;
  }, {
    message: "Notification interval cannot be longer than the active time window, or if window is 24h, interval must be 24h.",
    path: ["intervalHours"],
  });

export type NotificationSettingsFormData = z.infer<typeof notificationSettingsSchema>;
