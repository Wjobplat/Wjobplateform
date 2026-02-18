// Webhook Module - HMAC-SHA256 signature verification and event handling
const crypto = require('crypto');
const { db } = require('./database');

// Verify incoming webhook signature
function verifySignature(payload, signature, secret) {
    if (!secret || !signature) return false;
    const expected = generateSignature(payload, secret);
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

// Generate HMAC-SHA256 signature for outgoing webhooks
function generateSignature(payload, secret) {
    const data = typeof payload === 'string' ? payload : JSON.stringify(payload);
    return 'sha256=' + crypto.createHmac('sha256', secret).update(data).digest('hex');
}

// Send webhook to external URL
async function sendWebhook(url, event, data, secret) {
    const payload = JSON.stringify({ event, data, timestamp: new Date().toISOString() });
    const headers = { 'Content-Type': 'application/json' };

    if (secret) {
        headers['X-Webhook-Signature'] = generateSignature(payload, secret);
    }
    headers['X-Webhook-Event'] = event;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: payload,
            signal: AbortSignal.timeout(10000)
        });
        return {
            success: response.ok,
            status: response.status,
            statusText: response.statusText
        };
    } catch (error) {
        return {
            success: false,
            status: 0,
            statusText: error.message
        };
    }
}

// Process incoming webhook event
function processIncomingEvent(event, data) {
    try {
        const handlers = {
            'job.created': (d) => {
                const info = db.prepare('INSERT INTO jobs (company, title, location, contract_type, salary, source, compatibility, description, skills, posted_date, remote) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').run(
                    d.company, d.title, d.location, d.contractType, d.salary, d.source, d.compatibility, d.description, JSON.stringify(d.skills || []), d.postedDate || new Date().toISOString().split('T')[0], d.remote ? 1 : 0
                );

                db.prepare('INSERT INTO activity_timeline (date, time, type, title, description) VALUES (?, ?, ?, ?, ?)').run(
                    new Date().toISOString().split('T')[0],
                    new Date().toTimeString().slice(0, 5),
                    'job_found',
                    'Nouvelle offre via Agent IA',
                    `${d.title} chez ${d.company}`
                );
                return { action: 'created', type: 'job', id: info.lastInsertRowid };
            },
            'recruiter.found': (d) => {
                const info = db.prepare('INSERT INTO recruiters (name, email, linkedin, company, position) VALUES (?, ?, ?, ?, ?)').run(
                    d.name, d.email, d.linkedin, d.company, d.position
                );

                db.prepare('INSERT INTO activity_timeline (date, time, type, title, description) VALUES (?, ?, ?, ?, ?)').run(
                    new Date().toISOString().split('T')[0],
                    new Date().toTimeString().slice(0, 5),
                    'recruiter_found',
                    'Recruteur identifié via Agent IA',
                    `${d.name} - ${d.company}`
                );
                return { action: 'created', type: 'recruiter', id: info.lastInsertRowid };
            },
            'application.generated': (d) => {
                const info = db.prepare('INSERT INTO applications (job_id, status, created_date, sent_date, response_date, cover_letter, custom_email, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').run(
                    d.jobId,
                    'draft',
                    new Date().toISOString().split('T')[0],
                    null,
                    null,
                    d.coverLetter || '',
                    d.customEmail || '',
                    d.notes || 'Générée par l\'Agent IA'
                );

                const job = db.prepare('SELECT title, company FROM jobs WHERE id = ?').get(d.jobId);

                db.prepare('INSERT INTO activity_timeline (date, time, type, title, description) VALUES (?, ?, ?, ?, ?)').run(
                    new Date().toISOString().split('T')[0],
                    new Date().toTimeString().slice(0, 5),
                    'application_generated',
                    'Candidature générée par Agent IA',
                    job ? `${job.title} chez ${job.company}` : `Job #${d.jobId}`
                );
                return { action: 'created', type: 'application', id: info.lastInsertRowid };
            },
            'application.status_changed': (d) => {
                const app = db.prepare('SELECT * FROM applications WHERE id = ?').get(d.applicationId);
                if (!app) return { action: 'error', message: 'Application not found' };

                const updates = { status: d.status };
                if (d.status === 'sent') updates.sent_date = new Date().toISOString().split('T')[0];
                if (d.status === 'responded') updates.response_date = new Date().toISOString().split('T')[0];

                db.prepare('UPDATE applications SET status = @status, sent_date = COALESCE(@sent_date, sent_date), response_date = COALESCE(@response_date, response_date) WHERE id = @id').run({
                    ...updates,
                    id: d.applicationId,
                    sent_date: updates.sent_date || null,
                    response_date: updates.response_date || null
                });

                return { action: 'updated', type: 'application', id: d.applicationId };
            }
        };

        const handler = handlers[event];
        if (!handler) return { action: 'error', message: `Unknown event: ${event}` };
        return handler(data);
    } catch (error) {
        console.error('Webhook processing error:', error);
        return { action: 'error', message: error.message };
    }
}

module.exports = { verifySignature, generateSignature, sendWebhook, processIncomingEvent };
