
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
  age: z.number().optional().describe("The user's age."),
  goals: z.string().describe("The user's goals."),
  lifeSituation: z.string().describe("The user's current life situation."),
  motivationFocus: z.string().describe("What the user specifically needs motivation for."),
  motivationalTone: z.enum(['inspirational', 'humorous', 'direct', 'gentle', 'philosophical']).optional().describe('The desired tone of the motivational quote.'),
  gender: z.enum(['male', 'female', 'non-binary', 'other', 'prefer_not_to_say']).optional().describe("The user's gender identity, if provided."),
  relationshipStatus: z.enum(['single', 'in_a_relationship', 'married', 'engaged', 'divorced', 'widowed', 'complicated', 'prefer_not_to_say']).optional().describe("The user's relationship status, if provided."),
  sexuality: z.enum(['straight', 'gay', 'lesbian', 'bisexual', 'pansexual', 'asexual', 'queer', 'questioning', 'other', 'prefer_not_to_say']).optional().describe("The user's sexuality, if provided."),
  onlyFamousQuotes: z.boolean().optional().describe("If true, the quote must be sourced from a known person, character, or book. If false or undefined, the AI can generate an original quote or source one."),
  recentQuotes: z.array(z.string()).optional().describe('A list of recently generated quote texts to avoid repetition.'),
});
export type GeneratePersonalizedQuoteInput = z.infer<typeof GeneratePersonalizedQuoteInputSchema>;

const GeneratePersonalizedQuoteOutputSchema = z.object({
  quote: z.string().describe('A personalized motivational quote. If onlyFamousQuotes was true and no suitable famous quote was found, this might state that.'),
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

{{#if age}}
Age: {{{age}}}
{{/if}}
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

{{#if onlyFamousQuotes}}
IMPORTANT: The user has requested that the quote MUST be from a well-known book, fictional character, or real influential figure.
You MUST find an existing quote from such a source that is relevant to the user's details. Do NOT generate an original quote.
You MUST also ensure the quote is NOT present in the following list of recent quotes:
{{#if recentQuotes}}
{{#each recentQuotes}}
- "{{{this}}}"
{{/each}}
{{else}}
(No recent quotes provided, so less restriction on uniqueness for the first few famous quotes)
{{/if}}
Strive for variety; if you have provided a quote for this user recently, try to find a different famous quote that still fits their needs.
If you cannot find a suitable AND unique famous quote (i.e., one not in the recent quotes list), clearly state that you couldn't find a famous quote matching their criteria and recency requirements, for example: "I couldn't find a new famous quote that perfectly matched your request and recent history." or "Could not find a new, specific famous quote for your criteria at this time."
Attribute the quote if possible (e.g., "- Character Name, Book Title" or "- Influential Figure").
{{else}}
Generate an original and personalized quote.
You MUST ensure the quote is NOT present in the following list of recent quotes:
{{#if recentQuotes}}
{{#each recentQuotes}}
- "{{{this}}}"
{{/each}}
{{else}}
(No recent quotes provided, so less restriction on uniqueness for the first few quotes)
{{/if}}
If appropriate and aligns with the user's details (age, goals, life situation, motivation focus, and any provided demographic information like gender, relationship status, or sexuality), you can also draw inspiration from well-known books, fictional characters, or real influential figures who might offer relevant wisdom for the user's current stage or focus. Use any provided demographic information respectfully to enhance personalization and relevance, without making stereotypes. The quote should still be original and personalized, but can subtly reflect the essence or style of such a source if you choose to use one.
Strive for variety; if you have provided a quote for this user recently, try to find a different quote (original or inspired) that still fits their needs.
{{/if}}

Quote:`,
});

const generatePersonalizedQuoteFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedQuoteFlow',
    inputSchema: GeneratePersonalizedQuoteInputSchema,
    outputSchema: GeneratePersonalizedQuoteOutputSchema,
  },
  async (input): Promise<GeneratePersonalizedQuoteOutput> => {
    try {
      const {output} = await prompt(input);
      
      // Check if output is valid and output.quote is a non-empty string
      if (!output || typeof output.quote !== 'string' || output.quote.trim() === '') {
        console.warn('Personalized quote generation returned invalid, missing, or empty quote. Falling back to default.');
        return { quote: "Sorry, I couldn't generate a personalized quote for you at this moment. Please try again or adjust your profile." };
      }
      
      return output;
    } catch (flowError) {
      console.error('Error within generatePersonalizedQuoteFlow during prompt execution:', flowError);
      // Return a valid structure according to GeneratePersonalizedQuoteOutputSchema in case of any error
      return { quote: "An unexpected error occurred while generating your quote. Please try again or contact support." };
    }
  }
);

