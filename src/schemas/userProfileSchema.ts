import { z } from 'zod';

export const userProfileSchema = z.object({
  age: z.coerce.number().min(1, "Age is required").max(120, "Age must be realistic").optional().or(z.literal('')),
  goals: z.string().min(3, "Goals must be at least 3 characters long.").max(500, "Goals are too long."),
  lifeSituation: z.string().min(3, "Life situation must be at least 3 characters long.").max(500, "Life situation is too long."),
  motivationFocus: z.string().min(3, "Please describe what you need motivation for (min 3 characters).").max(500, "This description is too long (max 500 characters)."),
  motivationalTone: z.enum(['inspirational', 'humorous', 'direct', 'gentle', 'philosophical'], {
    required_error: "Please select a motivational tone."
  }).optional(),
  gender: z.enum(['male', 'female', 'non-binary', 'other', 'prefer_not_to_say']).optional(),
  relationshipStatus: z.enum(['single', 'in_a_relationship', 'married', 'engaged', 'divorced', 'widowed', 'complicated', 'prefer_not_to_say']).optional(),
  sexuality: z.enum(['straight', 'gay', 'lesbian', 'bisexual', 'pansexual', 'asexual', 'queer', 'questioning', 'other', 'prefer_not_to_say']).optional(),
  onlyFamousQuotes: z.boolean().optional(),
});

export type UserProfileFormData = z.infer<typeof userProfileSchema>;
