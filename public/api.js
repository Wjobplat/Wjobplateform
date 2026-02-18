// JobFlow API Module - Supabase Version

var API = {
    // Auth
    login: async function (email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        if (error) throw error;
        localStorage.setItem('wjob_token', data.session.access_token);
        return data.user;
    },

    signup: async function (email, password, name) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { name, role: 'user' }
            }
        });
        if (error) throw error;
        return data;
    },

    logout: async function () {
        try {
            await supabase.auth.signOut();
        } catch (e) {
            console.error('Sign out error:', e);
        }
        localStorage.removeItem('wjob_token');
        window.location.href = 'login.html';
    },

    getMe: async function () {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            localStorage.removeItem('wjob_token');
            window.location.href = 'login.html';
            throw new Error('Unauthorized');
        }
        return {
            id: user.id,
            email: user.email,
            name: user.user_metadata?.name || user.email.split('@')[0],
            firstName: user.user_metadata?.firstName || '',
            lastName: user.user_metadata?.lastName || '',
            role: user.user_metadata?.role || 'user'
        };
    },

    updateProfile: async function (data) {
        const updates = {};
        if (data.email) {
            updates.email = data.email;
        }
        const meta = {};
        if (data.firstName !== undefined) meta.firstName = data.firstName;
        if (data.lastName !== undefined) meta.lastName = data.lastName;
        if (data.firstName !== undefined || data.lastName !== undefined) {
            meta.name = `${data.firstName || ''} ${data.lastName || ''}`.trim();
        }
        if (Object.keys(meta).length > 0) updates.data = meta;

        const { error } = await supabase.auth.updateUser(updates);
        if (error) throw error;
        return { success: true };
    },

    isAdmin: async function () {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return false;
        // Allow if local override is set (useful for setup)
        if (localStorage.getItem('wjob_admin_override') === 'true') return true;
        // Strict check on user metadata role
        return user.user_metadata?.role === 'admin';
    },

    promoteMe: function () {
        localStorage.setItem('wjob_admin_override', 'true');
        showToast('Promotion Admin activée ! Redémarrage...', 'success');
        setTimeout(() => location.reload(), 1000);
    },

    // Jobs
    getJobs: async function () {
        const { data, error } = await supabase
            .from('jobs')
            .select('*')
            .order('posted_date', { ascending: false });

        if (error) throw error;
        return data;
        // Note: 'skills' is already JSONB, so automatic parsing should work, 
        // but if Supabase returns it as object, no manual JSON.parse needed.
    },

    deleteJob: async function (id) {
        const { error } = await supabase.from('jobs').delete().eq('id', id);
        if (error) throw error;
        return { success: true };
    },

    // Applications
    getApplications: async function () {
        const { data, error } = await supabase
            .from('applications')
            .select(`
                *,
                job:jobs (
                    company,
                    title,
                    location,
                    compatibility
                )
            `);

        if (error) throw error;

        // Flatten structure to match old API if necessary, or adapt frontend.
        // Frontend expects: { ..., job: { company, ... } } which Supabase provides.
        // We might need to map snake_case to camelCase if frontend relies on it.
        // For now, let's map it to keep frontend happy.
        return data.map(app => ({
            id: app.id,
            jobId: app.job_id,
            status: app.status,
            createdDate: app.created_date,
            sentDate: app.sent_date,
            responseDate: app.response_date,
            coverLetter: app.cover_letter,
            customEmail: app.custom_email,
            notes: app.notes,
            cv_path: app.cv_path,
            job: {
                id: app.job_id,
                company: app.job?.company,
                title: app.job?.title,
                location: app.job?.location,
                compatibility: app.job?.compatibility
            }
        }));
    },

    createApplication: async function (data) {
        const { jobId, status, customEmail, notes } = data;
        const user = (await supabase.auth.getUser()).data.user;

        const { data: result, error } = await supabase
            .from('applications')
            .insert({
                job_id: jobId,
                user_id: user.id,
                status: status || 'draft',
                custom_email: customEmail,
                notes: notes,
                created_date: new Date().toISOString()
            })
            .select()
            .single();

        if (error) throw error;
        return { success: true, id: result.id };
    },

    updateApplicationStatus: async function (id, status) {
        const updates = { status };
        if (status === 'sent') updates.sent_date = new Date().toISOString();
        if (status === 'responded') updates.response_date = new Date().toISOString();

        const { error } = await supabase
            .from('applications')
            .update(updates)
            .eq('id', id);

        if (error) throw error;
        return { success: true };
    },

    updateApplication: async function (id, data) {
        const updates = {};
        if (data.coverLetter !== undefined) updates.cover_letter = data.coverLetter;
        if (data.customEmail !== undefined) updates.custom_email = data.customEmail;
        if (data.notes !== undefined) updates.notes = data.notes;

        const { error } = await supabase
            .from('applications')
            .update(updates)
            .eq('id', id);

        if (error) throw error;
        return { success: true };
    },

    uploadCV: async function (id, formData) {
        const file = formData.get('cv');
        if (!file) throw new Error('File missing');

        const fileName = `cv-${Date.now()}-${file.name}`;

        // 1. Upload to Storage
        const { error: uploadError } = await supabase.storage
            .from('cvs')
            .upload(fileName, file);

        if (uploadError) throw uploadError;

        // 2. Update Application Record
        const { error: dbError } = await supabase
            .from('applications')
            .update({ cv_path: fileName })
            .eq('id', id);

        if (dbError) throw dbError;

        return { success: true, filename: fileName };
    },

    // Recruiters
    getRecruiters: async function () {
        const { data, error } = await supabase.from('recruiters').select('*');
        if (error) throw error;
        return data;
    },

    // Dashboard
    getStats: async function () {
        // Mocking stats for now as complex aggregation queries are harder in client-side JS without Views
        // Or we can do separate queries.
        const { count: jobCount } = await supabase.from('jobs').select('*', { count: 'exact', head: true });
        const { count: appCount } = await supabase.from('applications').select('*', { count: 'exact', head: true });

        return {
            totalJobs: jobCount || 0,
            totalApplications: appCount || 0,
            totalCompanies: 12, // Placeholder
            totalRecruiters: 5, // Placeholder
            draftCount: 2,
            pendingCount: 1,
            sentCount: 3,
            respondedCount: 1
        };
    },

    getActivity: async function () {
        // Mock activity or create a table
        return [
            { id: 1, date: "2026-02-17", time: "10:30", type: "job_found", title: "Migration Supabase", description: "Migration vers le cloud effectuée." }
        ];
    },

    // Agent (Supabase Powered)
    getAgentStatus: async function () {
        const { data, error } = await supabase
            .from('agent_actions')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        // If no actions, return default status
        if (error && error.code !== 'PGRST116') throw error;

        const { count } = await supabase
            .from('agent_actions')
            .select('*', { count: 'exact', head: true });

        // Agent is considered "connected" if there's been activity in the last 24h
        const lastActivity = data ? new Date(data.created_at) : null;
        const isConnected = lastActivity && (Date.now() - lastActivity.getTime() < 86400000);

        return {
            connected: !!isConnected,
            lastActivity: data?.created_at || null,
            totalActions: count || 0
        };
    },

    getAgentActions: async function () {
        const { data, error } = await supabase
            .from('agent_actions')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(10);

        if (error) throw error;
        return data.map(action => ({
            id: action.id,
            event: action.event,
            status: action.status,
            result: action.result,
            timestamp: action.created_at
        }));
    },

    triggerAgent: async function (action) {
        const config = await this.getWebhookConfig();
        if (!config.enabled || !config.outgoingUrl) {
            throw new Error('Webhook non configuré ou désactivé');
        }

        // 1. Log the intent locally in Supabase
        const { data: user } = await supabase.auth.getUser();
        await supabase.from('agent_actions').insert({
            event: `manual.${action}`,
            user_id: user.id || null,
            status: 'pending',
            result: { message: `Déclenchement manuel de ${action}` }
        });

        // 2. Call the external webhook (n8n, Make, etc.)
        const response = await fetch(config.outgoingUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: action,
                user_id: user.id,
                user_email: user.email,
                timestamp: new Date().toISOString()
            })
        });

        if (!response.ok) throw new Error('Erreur lors de l’appel au webhook externe');

        return { success: true, result: { message: "Action transmise à l'agent" } };
    },

    generateAiEmail: async function (data) {
        // ... same mock as before or can be evolved to real AI call
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({ email: `Sujet : Candidature - ${data.job?.title || 'Poste'}\n\nMadame, Monsieur,\n\nJe suis très intéressé par le poste... (Généré par IA)` });
            }, 1000);
        });
    },

    analyzeCV: async function (formData) {
        // ... same mock for now
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    success: true,
                    analysis: "CV Analysé par l'IA. Profil : Développeur.",
                    recommendations: ["Full Stack", "React", "Supabase"]
                });
            }, 1500);
        });
    },

    // Webhooks (Mocked for now since not in schema)
    getWebhookConfig: async function () {
        const stored = localStorage.getItem('wjob_webhook_config');
        return stored ? JSON.parse(stored) : {
            incomingUrl: "https://api.wjob.com/v1/webhooks/incoming",
            outgoingUrl: "",
            secret: "wjob_sec_9k2m8L4n",
            enabled: false,
            events: {
                'job.created': true,
                'recruiter.found': true,
                'application.generated': false,
                'application.status_changed': true
            }
        };
    },

    saveWebhookConfig: async function (config) {
        const current = await this.getWebhookConfig();
        const updated = { ...current, ...config };
        localStorage.setItem('wjob_webhook_config', JSON.stringify(updated));
        return { success: true };
    },

    testWebhook: async function () {
        return new Promise(resolve => {
            setTimeout(() => resolve({ success: true }), 1000);
        });
    },

    getWebhookLogs: async function () {
        return [
            { id: 1, status: 'success', direction: 'incoming', event: 'job.created', details: 'Nouveau poste trouvé via Agent IA', timestamp: new Date().toISOString() }
        ];
    },

    // Consent (Mocked)
    getConsent: async function () {
        const stored = localStorage.getItem('wjob_consent');
        return stored ? JSON.parse(stored) : {
            dataProcessing: true,
            analytics: false,
            webhookSharing: false
        };
    },

    saveConsent: async function (consent) {
        localStorage.setItem('wjob_consent', JSON.stringify(consent));
        return { success: true };
    },

    exportData: function () {
        const data = { profile: "User Data", timestamp: new Date().toISOString() };
        const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'jobflow-export.json';
        a.click();
    },

    deleteData: async function () {
        localStorage.clear();
        return { success: true, message: "Toutes les données locales ont été supprimées." };
    }
};

// Helper functions (Unchanged)
function formatDate(dateString) {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function formatDateTime(dateString, timeString) {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return `${date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} à ${timeString || ''}`;
}

function formatRelativeTime(isoString) {
    if (!isoString) return '';
    const diff = Date.now() - new Date(isoString).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "À l'instant";
    if (mins < 60) return `Il y a ${mins} min`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `Il y a ${hours}h`;
    const days = Math.floor(hours / 24);
    return `Il y a ${days}j`;
}

// Toast notifications (Unchanged)
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
    toast.innerHTML = `<span class="toast-icon">${icons[type] || icons.info}</span><span>${message}</span>`;
    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('toast-show'));
    setTimeout(() => {
        toast.classList.remove('toast-show');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// Auto-admin via URL parameter (e.g., settings.html?admin=1)
(function () {
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === '1') {
        localStorage.setItem('wjob_admin_override', 'true');
        // Clean up URL and reload
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
        location.reload();
    }
})();

// Global UI Manager for Admin-only elements
document.addEventListener('DOMContentLoaded', async function () {
    try {
        const isAdmin = await API.isAdmin();
        if (isAdmin) {
            document.querySelectorAll('[data-admin-only]').forEach(el => {
                // Determine appropriate display mode
                if (el.tagName === 'A' && el.classList.contains('top-nav-link')) {
                    el.style.display = 'flex';
                } else {
                    el.style.display = 'block';
                }
            });
        }
    } catch (e) {
        console.error('Global admin check failed:', e);
    }
});
