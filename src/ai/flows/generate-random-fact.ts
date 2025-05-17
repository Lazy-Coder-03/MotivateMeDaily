
'use server';
/**
 * @fileOverview A random fact generator AI flow.
 *
 * - generateRandomFact - A function that generates a random fact based on topic and style.
 * - GenerateRandomFactInput - The input type for the generateRandomFact function.
 * - GenerateRandomFactOutput - The return type for the generateRandomFact function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { FactStyle } from '@/types'; // Assuming FACT_STYLES is exported if needed here, or just use the Zod enum directly
import { FACT_STYLES } from '@/types';


const GenerateRandomFactInputSchema = z.object({
  topic: z.string().describe("The topic for which a random fact should be generated."),
  factStyle: z.enum(FACT_STYLES).describe("The desired style or tone of the fact (e.g., 'General & Informative', 'Dark & Unusual')."),
});
export type GenerateRandomFactInput = z.infer<typeof GenerateRandomFactInputSchema>;

const GenerateRandomFactOutputSchema = z.object({
  fact: z.string().describe('The generated random fact.'),
  source: z.string().optional().describe('An optional source for the fact, if applicable and found.'),
});
export type GenerateRandomFactOutput = z.infer<typeof GenerateRandomFactOutputSchema>;

export async function generateRandomFact(
  input: GenerateRandomFactInput
): Promise<GenerateRandomFactOutput> {
  return generateRandomFactFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRandomFactPrompt',
  input: {schema: GenerateRandomFactInputSchema},
  output: {schema: GenerateRandomFactOutputSchema},
  prompt: `You are a knowledgeable and versatile fact generator.
Your task is to generate an interesting, surprising, or little-known fact about the given topic, matching the specified style.

Topic: {{{topic}}}
Desired Fact Style: {{{factStyle}}}

Consider the style:
- If 'General & Informative': Provide a straightforward, verifiable fact.
- If 'Niche & Specific': Delve into a more obscure or detailed aspect of the topic.
- If 'Dark & Unusual': Find a fact that is intriguing due to its macabre, strange, or unsettling nature, but still factual.
- If 'Lighthearted & Fun': Aim for an amusing, quirky, or entertaining fact.
- If 'Mind-blowing & Surprising': Look for a fact that challenges common assumptions or is exceptionally astonishing.

The fact should be concise. If possible and relevant, briefly mention a source or context, but prioritize the fact itself.
Only return the fact and an optional source in the specified output format. Do not add any conversational fluff.
If the topic is too vague or a suitable fact cannot be found for the given style, state that you couldn't find a specific fact for that combination.
Output the fact directly.
`,
});

const generateRandomFactFlow = ai.defineFlow(
  {
    name: 'generateRandomFactFlow',
    inputSchema: GenerateRandomFactInputSchema,
    outputSchema: GenerateRandomFactOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      return { fact: "Sorry, I couldn't generate a fact for that topic and style right now.", source: undefined };
    }
    return output;
  }
);
