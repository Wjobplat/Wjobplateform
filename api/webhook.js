
// Vercel Serverless Function to handle incoming webhooks
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { event, data, user_id } = req.body;

        if (!event || !user_id) {
            return res.status(400).json({ error: 'Missing event or user_id' });
        }

        console.log(`Webhook received: ${event} for user ${user_id}`);

        // 1. Log the action in Supabase
        const { error: logError } = await supabase
            .from('agent_actions')
            .insert({
                user_id,
                event,
                status: 'success',
                result: data || {}
            });

        if (logError) throw logError;

        // 2. Perform business logic based on event
        if (event === 'job.created') {
            await supabase.from('jobs').insert(data);
        } else if (event === 'recruiter.found') {
            await supabase.from('recruiters').insert(data);
        } else if (event === 'application.generated') {
            const { jobId, status, coverLetter, customEmail, notes } = data;
            await supabase.from('applications').insert({
                job_id: jobId,
                user_id: user_id,
                status: status || 'draft',
                cover_letter: coverLetter,
                custom_email: customEmail,
                notes: notes,
                created_date: new Date().toISOString().split('T')[0]
            });
        } else if (event === 'application.status_changed') {
            const { applicationId, status } = data;
            const updates = { status };
            if (status === 'sent') updates.sent_date = new Date().toISOString().split('T')[0];
            if (status === 'responded') updates.response_date = new Date().toISOString().split('T')[0];

            await supabase.from('applications').update(updates).eq('id', applicationId);
        }

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Webhook Error:', error);
        return res.status(500).json({ error: error.message });
    }
}
