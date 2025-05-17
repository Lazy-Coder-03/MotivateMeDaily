import { z } from 'zod';

export const userProfileSchema = z.object({
  age: z.coerce.number().min(1, "Age is required").max(120, "Age must be realistic").optional().or(z.literal('')),
  goals: z.string().min(3, "Goals must be at least 3 characters long.").max(500, "Goals are too long."),
  lifeSituation: z.string().min(3, "Life situation must be at least 3 characters long.").max(500, "Life situation is too long."),
});

export type UserProfileFormData = z.infer<typeof userProfileSchema>;
