const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// Simulation configuration
const ACTIONS = {
    'search_jobs': {
        event: 'job.created',
        delay: 2000,
        generate: (data) => ({
            company: "Agent-Found Tech",
            title: "Simulated AI Position",
            location: "Remote World",
            contractType: "CDI",
            salary: "45k - 60k €",
            source: "Agent IA Simulation",
            compatibility: 95,
            description: "Une offre d'emploi trouvée automatiquement par l'agent pendant la simulation.",
            skills: ["Node.js", "Express", "Automation"],
            remote: true,
            postedDate: new Date().toISOString().split('T')[0]
        })
    },
    'find_recruiters': {
        event: 'recruiter.found',
        delay: 1500,
        generate: (data) => ({
            name: "Sophie Automation",
            email: "sophie@agent-found.tech",
            linkedin: "https://linkedin.com/in/sophie-auto",
            company: "Agent-Found Tech",
            position: "Consultante en automatisation"
        })
    },
    'generate_applications': {
        event: 'application.generated',
        delay: 3000,
        generate: (data) => ({
            jobId: data.jobId || 1,
            coverLetter: "Madame, Monsieur,\n\nCeci est une lettre de motivation générée automatiquement par l'Agent IA pour tester le workflow JobFlow...",
            customEmail: "Bonjour, je vous contacte concernant l'offre trouvée par mon agent...",
            notes: "Génération automatique réussie."
        })
    }
};

app.post('/trigger', async (req, res) => {
    const { action, user_id, user_email } = req.body;
    console.log(`\n🤖 Agent IA received trigger: ${action} for user ${user_id}`);

    const config = ACTIONS[action];
    if (!config) {
        return res.status(400).json({ error: `Action '${action}' not supported by simulation.` });
    }

    res.json({ success: true, message: `Action '${action}' en cours de traitement...` });

    // Simulate async work
    setTimeout(async () => {
        console.log(`✨ Processing ${action} finished. Sending webhook...`);

        const payload = {
            user_id: user_id,
            event: config.event,
            data: config.generate(req.body)
        };

        // Post back to platform webhook
        // We use local address for simulation, but in prod it would be the platform URL
        const platformWebhook = 'http://localhost:3000/api/webhook';

        try {
            const response = await fetch(platformWebhook, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (response.ok) {
                console.log(`✅ Webhook sent successfully: ${config.event}`);
            } else {
                console.error(`❌ Webhook failed: ${response.status}`);
            }
        } catch (e) {
            console.error(`❌ Error sending webhook to platform:`, e.message);
        }
    }, config.delay);
});

app.listen(PORT, () => {
    console.log(`\n🤖 Agent IA (Simulation) running at http://localhost:${PORT}`);
    console.log(`👉 Monitoring endpoint: POST /trigger`);
});
