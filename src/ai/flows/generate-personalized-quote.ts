
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
  age: z.number().describe("The user's age."),
  goals: z.string().describe("The user's goals."),
  lifeSituation: z.string().describe("The user's current life situation."),
  motivationFocus: z.string().describe("What the user specifically needs motivation for."),
  motivationalTone: z.enum(['inspirational', 'humorous', 'direct', 'gentle', 'philosophical']).optional().describe('The desired tone of the motivational quote.'),
  gender: z.enum(['male', 'female', 'non-binary', 'other', 'prefer_not_to_say']).optional().describe("The user's gender identity, if provided."),
  relationshipStatus: z.enum(['single', 'in_a_relationship', 'married', 'engaged', 'divorced', 'widowed', 'complicated', 'prefer_not_to_say']).optional().describe("The user's relationship status, if provided."),
  sexuality: z.enum(['straight', 'gay', 'lesbian', 'bisexual', 'pansexual', 'asexual', 'queer', 'questioning', 'other', 'prefer_not_to_say']).optional().describe("The user's sexuality, if provided."),
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
  prompt: `You are a motivational quote generator. Generate a quote based on the following user information.
If a demographic field (Gender, Relationship Status, Sexuality) has the value "prefer_not_to_say", you should ignore that field and not use it for personalization.

Age: {{{age}}}
Goals: {{{goals}}}
Life Situation: {{{lifeSituation}}}
Specific focus for motivation: {{{motivationFocus}}}
{{#if motivationalTone}}
Desired Tone: {{{motivationalTone}}}
{{/if}}
{{#if gender}}
Gender: {{{gender}}}
{{/if}}
{{#if relationshipStatus}}
Relationship Status: {{{relationshipStatus}}}
{{/if}}
{{#if sexuality}}
Sexuality: {{{sexuality}}}
{{/if}}

Adjust the style and language of the quote to match the desired tone if provided. If no tone is specified, use a general inspirational and uplifting tone.
The quote should be concise and impactful.

If appropriate and aligns with the user's details (age, goals, life situation, motivation focus, and any provided demographic information like gender, relationship status, or sexuality), you can also draw inspiration from well-known books, fictional characters, or real influential figures who might offer relevant wisdom for the user's current stage or focus. Use any provided demographic information respectfully to enhance personalization and relevance, without making stereotypes. The quote should still be original and personalized, but can subtly reflect the essence or style of such a source if you choose to use one. For example, if the user is a student struggling with procrastination, a quote inspired by a stoic philosopher might be fitting.

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

