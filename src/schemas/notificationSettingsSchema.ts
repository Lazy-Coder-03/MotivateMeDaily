import { z } from 'zod';

export const notificationSettingsSchema = z.object({
  frequency: z.enum(['daily', 'twice_daily', 'hourly', 'disabled'], {
    required_error: "You need to select a notification frequency.",
  }),
});

export type NotificationSettingsFormData = z.infer<typeof notificationSettingsSchema>;
