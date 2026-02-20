
// Vercel Serverless Function — Agent IA Trigger
// Handles all incoming events from the frontend (outgoing webhook)
// and routes them back to /api/webhook for processing

export default async function handler(req, res) {
    // Allow CORS for browser requests
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Webhook-Secret');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const body = req.body || {};
    const event = body.event || body.action;
    const user_id = body.user_id || body.data?.user_id;

    console.log(`[Trigger] Received: event=${event}, user_id=${user_id}`);

    // =============================================
    // 1. TEST PING — respond immediately
    // =============================================
    if (event === 'test.ping') {
        return res.status(200).json({
            success: true,
            message: 'Pong ! Agent IA connect\u00e9 et fonctionnel.',
            timestamp: new Date().toISOString()
        });
    }

    // =============================================
    // 2. CV UPLOADED — acknowledge receipt
    // =============================================
    if (event === 'cv.uploaded') {
        console.log(`[Trigger] CV received: ${body.data?.file_name} (${body.data?.file_size} bytes)`);
        console.log(`[Trigger] CV URL: ${body.data?.cv_url}`);

        // In production, this is where you'd send the CV to your real AI service
        // For now, log it and acknowledge
        const webhookResult = await forwardToWebhook(req, {
            user_id,
            event: 'cv.uploaded',
            data: {
                message: `CV "${body.data?.file_name}" re\u00e7u par l'agent IA`,
                file_name: body.data?.file_name,
                cv_url: body.data?.cv_url,
                status: 'received'
            }
        });

        return res.status(200).json({
            success: true,
            message: `CV re\u00e7u et enregistr\u00e9 par l'agent IA`,
            analysis: 'Analyse en cours par l\'agent...',
            webhookResult
        });
    }

    // =============================================
    // 3. EMAIL GENERATE — generate a real email
    // =============================================
    if (event === 'email.generate') {
        const d = body.data || {};
        const email = `Objet : Candidature au poste de ${d.job_title || 'Poste'} \u2014 ${d.company || 'Entreprise'}

Bonjour ${d.recruiter_name || 'Madame, Monsieur'},

Suite \u00e0 la d\u00e9couverte de votre offre pour le poste de ${d.job_title || 'd\u00e9veloppeur'} chez ${d.company || 'votre entreprise'}, je souhaite vous pr\u00e9senter ma candidature.

${d.job_description ? `Votre recherche d'un profil capable de "${d.job_description.substring(0, 100)}..." correspond parfaitement \u00e0 mon parcours professionnel.` : 'Mon exp\u00e9rience et mes comp\u00e9tences correspondent aux attentes du poste.'}

Je serais ravi(e) d'\u00e9changer avec vous lors d'un entretien pour approfondir ma motivation et ma vision pour ce r\u00f4le.

Dans l'attente de votre retour, je vous prie d'agr\u00e9er mes salutations distingu\u00e9es.

Cordialement`;

        return res.status(200).json({
            success: true,
            email: email
        });
    }

    // =============================================
    // 4. AGENT ACTIONS — search_jobs, find_recruiters, generate_applications
    // =============================================
    const SIMULATED_ACTIONS = {
        'search_jobs': {
            event: 'job.created',
            generate: () => ({
                company: "TechFound IA",
                title: "D\u00e9veloppeur Full Stack (Agent IA)",
                location: "Remote Full",
                contract_type: "CDI",
                salary: "50k - 65k \u20ac",
                source: "Agent IA W-JOB",
                compatibility: 94,
                description: "Offre d\u00e9couverte par l'agent IA suite \u00e0 l'analyse de votre profil.",
                skills: ["React", "Node.js", "Supabase"],
                remote: true,
                posted_date: new Date().toISOString().split('T')[0]
            })
        },
        'find_recruiters': {
            event: 'recruiter.found',
            generate: () => ({
                name: "Alex Recruteur",
                email: "alex@techfound-ia.com",
                linkedin: "https://linkedin.com/in/alex-recruteur",
                company: "TechFound IA",
                position: "Talent Acquisition"
            })
        },
        'generate_applications': {
            event: 'application.generated',
            generate: () => ({
                jobId: 1,
                coverLetter: "Madame, Monsieur,\n\nSuite \u00e0 l'analyse de votre offre par notre agent IA, je souhaite vous pr\u00e9senter ma candidature...",
                customEmail: "Bonjour, veuillez trouver ci-joint ma candidature g\u00e9n\u00e9r\u00e9e par l'agent IA.",
                notes: "G\u00e9n\u00e9r\u00e9 par Agent IA W-JOB"
            })
        },
        'follow_up': {
            event: 'application.status_changed',
            generate: () => ({
                message: "Relance automatique envoy\u00e9e par l'agent IA",
                action: "follow_up"
            })
        }
    };

    // Check if it's a known simulated action
    const actionKey = body.action || event;
    const config = SIMULATED_ACTIONS[actionKey];

    if (config) {
        const payload = {
            user_id: user_id,
            event: config.event,
            data: config.generate()
        };

        const result = await forwardToWebhook(req, payload);

        return res.status(200).json({
            success: true,
            message: `Action '${actionKey}' ex\u00e9cut\u00e9e avec succ\u00e8s`,
            result
        });
    }

    // =============================================
    // 5. UNKNOWN EVENT — log and acknowledge
    // =============================================
    console.log(`[Trigger] Unknown event: ${event}`);

    if (user_id && event) {
        await forwardToWebhook(req, {
            user_id,
            event,
            data: body.data || { message: `\u00c9v\u00e9nement ${event} re\u00e7u` }
        });
    }

    return res.status(200).json({
        success: true,
        message: `\u00c9v\u00e9nement '${event || 'unknown'}' re\u00e7u`
    });
}

// Helper: forward event to /api/webhook for Supabase logging
async function forwardToWebhook(req, payload) {
    try {
        const host = req.headers.host;
        const protocol = host.includes('localhost') ? 'http' : 'https';
        const webhookUrl = `${protocol}://${host}/api/webhook`;

        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        return { forwarded: true, status: response.status };
    } catch (e) {
        console.error('[Trigger] Forward to webhook failed:', e.message);
        return { forwarded: false, error: e.message };
    }
}
