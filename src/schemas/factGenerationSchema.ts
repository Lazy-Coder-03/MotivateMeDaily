
import { z } from 'zod';
import { FACT_STYLES } from '@/types';

export const factGenerationSchema = z.object({
  topic: z.string().min(2, "Topic must be at least 2 characters long.").max(100, "Topic is too long (max 100 characters)."),
  factStyle: z.enum(FACT_STYLES, {
    required_error: "Please select a fact style."
  }),
});

export type FactGenerationFormData = z.infer<typeof factGenerationSchema>;
