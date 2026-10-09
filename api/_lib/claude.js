// Appel Claude partagé par les fonctions /api
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export const MODEL = 'claude-opus-5-5';

// Envoie `messages` et renvoie le texte de la réponse.
// La réflexion est toujours active sur ce modèle : max_tokens couvre réflexion + réponse,
// et le texte est cherché parmi les blocs (le premier peut être un bloc "thinking").
export async function askClaude({ messages, effort = 'low', maxTokens = 8000 }) {
    const message = await client.beta.messages.create({
        model: MODEL,
        max_tokens: maxTokens,
        output_config: { effort },
        betas: ['server-side-fallback-2026-07-01'],
        fallbacks: 'default',
        messages
    });

    if (message.stop_reason === 'refusal') {
        throw new Error('Requête refusée par le modèle');
    }

    const text = message.content
        .filter(block => block.type === 'text')
        .map(block => block.text)
        .join('')
        .trim();

    if (!text) throw new Error(`Réponse vide (stop_reason: ${message.stop_reason})`);
    return text;
}
