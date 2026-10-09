import { askClaude } from './_lib/claude.js';
import { requireUser } from './_lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!(await requireUser(req, res))) return;

  const { cvBase64 } = req.body;
  if (!cvBase64 || cvBase64.length === 0) {
    return res.status(400).json({ error: 'PDF du CV manquant ou invalide' });
  }

  try {
    const message = await askClaude({
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

    const raw = message;
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
