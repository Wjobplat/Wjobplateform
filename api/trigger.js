
// Vercel Serverless Function to simulate agent actions
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { action, user_id, user_email } = req.body;

    // Simulations configuration
    const ACTIONS = {
        'search_jobs': {
            event: 'job.created',
            generate: () => ({
                company: "TechFound IA",
                title: "Développeur Full Stack (Simulé)",
                location: "Remote Full",
                contract_type: "CDI",
                salary: "50k - 65k €",
                source: "Simulation Vercel",
                compatibility: 94,
                description: "Cette offre a été générée par le simulateur d'agent pour tester le workflow Vercel.",
                skills: ["React", "Vercel", "Supabase"],
                remote: true,
                posted_date: new Date().toISOString().split('T')[0]
            })
        },
        'find_recruiters': {
            event: 'recruiter.found',
            generate: () => ({
                name: "Alex Vercel",
                email: "alex@vercel-found.tech",
                linkedin: "https://linkedin.com/in/alex-vercel",
                company: "Vercel Found",
                position: "Talent Acquisition"
            })
        },
        'generate_applications': {
            event: 'application.generated',
            generate: (data) => ({
                jobId: data.jobId || 1,
                coverLetter: "Madame, Monsieur,\n\nTest d'application générée via la fonction serverless sur Vercel...",
                customEmail: "Bonjour, voici une candidature simulée...",
                notes: "Généré par Simulation Vercel"
            })
        }
    };

    const config = ACTIONS[action];
    if (!config) {
        return res.status(400).json({ error: `Action '${action}' not supported.` });
    }

    // Process immediately in serverless env (short execution)
    const payload = {
        user_id: user_id,
        event: config.event,
        data: config.generate(req.body)
    };

    // We call the webhook internally or via local address
    // In Vercel, we can't easily rely on 'localhost', so we use the request host
    const host = req.headers.host;
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const webhookUrl = `${protocol}://${host}/api/webhook`;

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        return res.status(200).json({
            success: true,
            message: `Action '${action}' transmise avec succès à ${webhookUrl}`
        });
    } catch (e) {
        return res.status(500).json({ error: `Webhook failed: ${e.message}` });
    }
}
