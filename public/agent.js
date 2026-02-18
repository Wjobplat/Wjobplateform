// Agent IA page - API-powered
document.addEventListener('DOMContentLoaded', function () {
    refreshStatus();
    loadActivity();
    // Auto-refresh every 15s
    setInterval(() => { refreshStatus(); loadActivity(); }, 15000);
});

async function refreshStatus() {
    try {
        const [status, config] = await Promise.all([API.getAgentStatus(), API.getWebhookConfig()]);
        const display = document.getElementById('agent-status-display');
        if (status.connected) {
            display.className = 'agent-status connected';
            display.innerHTML = '<div class="status-dot pulse"></div><span>Connecté</span>';
        } else {
            display.className = 'agent-status disconnected';
            display.innerHTML = '<div class="status-dot offline"></div><span>Déconnecté</span>';
        }
        document.getElementById('last-activity').textContent = status.lastActivity ? formatRelativeTime(status.lastActivity) : '—';
        document.getElementById('total-actions').textContent = status.totalActions;
        document.getElementById('webhook-status').textContent = config.enabled ? '✅ Actif' : '❌ Inactif';
    } catch (e) {
        console.error('Status refresh error:', e);
    }
}

async function loadActivity() {
    try {
        const actions = await API.getAgentActions();
        const container = document.getElementById('agent-activity');
        if (!actions.length) return;
        container.innerHTML = '';
        actions.forEach(action => {
            const div = document.createElement('div');
            div.className = 'log-item';
            const icons = {
                'job.created': '🔍', 'recruiter.found': '👥', 'application.generated': '📝',
                'application.status_changed': '📨', 'manual.search_jobs': '🔍',
                'manual.find_recruiters': '👥', 'manual.generate_applications': '📝',
                'manual.follow_up': '🔔', 'test': '🧪'
            };
            div.innerHTML = `
                <div class="log-status success"></div>
                <span>${icons[action.event] || '⚡'}</span>
                <span class="log-event">${action.event}</span>
                <span style="color: var(--color-text-secondary); font-size: 0.85rem;">${action.result?.message || action.result?.action || ''}</span>
                <span class="log-time">${formatRelativeTime(action.timestamp)}</span>
            `;
            container.appendChild(div);
        });
    } catch (e) { console.error('Activity load error:', e); }
}

async function triggerAction(action) {
    try {
        showToast(`Action "${action}" déclenchée...`, 'info');
        const result = await API.triggerAgent(action);
        showToast(result.result?.message || 'Action réussie', 'success');
        loadActivity();
    } catch (e) {
        showToast('Erreur lors du déclenchement', 'error');
    }
}
