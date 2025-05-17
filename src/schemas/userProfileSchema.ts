import { z } from 'zod';

export const userProfileSchema = z.object({
  age: z.coerce.number().min(1, "Age is required").max(120, "Age must be realistic").optional().or(z.literal('')),
  goals: z.string().min(3, "Goals must be at least 3 characters long.").max(500, "Goals are too long."),
  lifeSituation: z.string().min(3, "Life situation must be at least 3 characters long.").max(500, "Life situation is too long."),
  motivationFocus: z.string().min(3, "Please describe what you need motivation for (min 3 characters).").max(500, "This description is too long (max 500 characters)."),
  motivationalTone: z.enum(['inspirational', 'humorous', 'direct', 'gentle', 'philosophical'], {
    required_error: "Please select a motivational tone."
  }).optional(),
});

export type UserProfileFormData = z.infer<typeof userProfileSchema>;
