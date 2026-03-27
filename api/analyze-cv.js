import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { cvBase64 } = req.body;
  if (!cvBase64 || cvBase64.length === 0) {
    return res.status(400).json({ error: 'PDF du CV manquant ou invalide' });
  }

  try {
    const message = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'document',
              source: {
                type: 'base64',
                media_type: 'application/pdf',
                data: cvBase64
              }
            },
            {
              type: 'text',
              text: `Tu es un expert RH. Analyse ce CV et extrais les informations clés en JSON strict.

Retourne UNIQUEMENT ce JSON (sans markdown, sans explication) :
{
  "name": "Prénom Nom",
  "title": "Titre professionnel principal",
  "summary": "Résumé professionnel en 2 phrases max",
  "skills": ["skill1", "skill2", ...],
  "experience_years": <nombre>,
  "education": "Diplôme le plus élevé",
  "languages": ["Français", "Anglais", ...],
  "job_titles": ["titre recherché 1", "titre recherché 2"],
  "search_keywords": ["mot-clé1", "mot-clé2", ...]
}`
            }
          ]
        }
      ]
    });

    const raw = message.content[0].text.trim();
    let analysis;
    try {
      analysis = JSON.parse(raw);
    } catch {
      const match = raw.match(/\{[\s\S]*\}/);
      analysis = match ? JSON.parse(match[0]) : null;
    }

    if (!analysis) return res.status(500).json({ error: 'Erreur de parsing de la réponse Claude' });

    res.status(200).json({ success: true, analysis });
  } catch (err) {
    console.error('Claude analyze-cv error:', err);
    res.status(500).json({ error: 'Erreur lors de l\'analyse par Claude' });
  }
}
