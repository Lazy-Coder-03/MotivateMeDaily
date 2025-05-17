'use server';

/**
 * @fileOverview A personalized motivation quote generator.
 *
 * - generatePersonalizedQuote - A function that generates a personalized motivational quote.
 * - GeneratePersonalizedQuoteInput - The input type for the generatePersonalizedQuote function.
 * - GeneratePersonalizedQuoteOutput - The return type for the generatePersonalizedQuote function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePersonalizedQuoteInputSchema = z.object({
  age: z.number().describe('The user\'s age.'),
  goals: z.string().describe('The user\'s goals.'),
  lifeSituation: z.string().describe('The user\'s current life situation.'),
});
export type GeneratePersonalizedQuoteInput = z.infer<typeof GeneratePersonalizedQuoteInputSchema>;

const GeneratePersonalizedQuoteOutputSchema = z.object({
  quote: z.string().describe('A personalized motivational quote.'),
});
export type GeneratePersonalizedQuoteOutput = z.infer<typeof GeneratePersonalizedQuoteOutputSchema>;

export async function generatePersonalizedQuote(
  input: GeneratePersonalizedQuoteInput
): Promise<GeneratePersonalizedQuoteOutput> {
  return generatePersonalizedQuoteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePersonalizedQuotePrompt',
  input: {schema: GeneratePersonalizedQuoteInputSchema},
  output: {schema: GeneratePersonalizedQuoteOutputSchema},
  prompt: `You are a motivational quote generator. Generate a quote based on the following user information:

Age: {{{age}}}
Goals: {{{goals}}}
Life Situation: {{{lifeSituation}}}

Quote:`,
});

const generatePersonalizedQuoteFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedQuoteFlow',
    inputSchema: GeneratePersonalizedQuoteInputSchema,
    outputSchema: GeneratePersonalizedQuoteOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
