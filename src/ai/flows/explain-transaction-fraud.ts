'use server';

/**
 * @fileOverview An AI agent that explains why a transaction was flagged as fraudulent.
 *
 * - explainTransactionFraud - A function that handles the transaction fraud explanation process.
 * - ExplainTransactionFraudInput - The input type for the explainTransactionFraud function.
 * - ExplainTransactionFraudOutput - The return type for the explainTransactionFraud function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainTransactionFraudInputSchema = z.object({
  transactionFeatures: z.record(z.number()).describe('A map of transaction features and their values.'),
  prediction: z.boolean().describe('Whether the transaction was predicted as fraudulent or not.'),
  probability: z.number().describe('The probability of the transaction being fraudulent.'),
});
export type ExplainTransactionFraudInput = z.infer<
  typeof ExplainTransactionFraudInputSchema
>;

const ExplainTransactionFraudOutputSchema = z.object({
  explanation: z.string().describe('An explanation of why the transaction was flagged as fraudulent.'),
  influencingFactors: z
    .array(
      z.object({
        feature: z.string().describe('The name of the feature.'),
        impact: z.string().describe('The impact of the feature on the fraud score (INCREASES or DECREASES).'),
        importance: z.number().describe('The percentage importance of the feature.'),
      })
    )
    .describe('A list of the top influencing factors for the fraud prediction.'),
});
export type ExplainTransactionFraudOutput = z.infer<
  typeof ExplainTransactionFraudOutputSchema
>;

export async function explainTransactionFraud(
  input: ExplainTransactionFraudInput
): Promise<ExplainTransactionFraudOutput> {
  return explainTransactionFraudFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainTransactionFraudPrompt',
  input: {schema: ExplainTransactionFraudInputSchema},
  output: {schema: ExplainTransactionFraudOutputSchema},
  prompt: `You are an expert fraud analyst explaining why a transaction was flagged as fraudulent.

  The transaction was predicted as {{#if prediction}}fraudulent{{else}}not fraudulent{{/if}} with a probability of {{probability}}.

  Here are the transaction features and their values:
  {{#each transactionFeatures}}
  - {{@key}}: {{this}}
  {{/each}}

  Explain why this transaction was flagged as fraudulent, focusing on the key influencing factors and their importance. Return a list of the top 5 influencing factors with their feature name, impact (INCREASES or DECREASES), and percentage importance.
  Make sure the response is easy to understand for a technical audience.
  Respond in markdown format.
  `,
});

const explainTransactionFraudFlow = ai.defineFlow(
  {
    name: 'explainTransactionFraudFlow',
    inputSchema: ExplainTransactionFraudInputSchema,
    outputSchema: ExplainTransactionFraudOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
