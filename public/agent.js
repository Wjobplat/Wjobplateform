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
        document.getElementById('webhook-status').innerHTML = config.enabled
            ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Actif'
            : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> Inactif';
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
            const svgIcons = {
                'job.created': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>',
                'recruiter.found': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>',
                'application.generated': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>',
                'application.status_changed': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>',
                'manual.search_jobs': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>',
                'manual.find_recruiters': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>',
                'manual.generate_applications': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>',
                'manual.follow_up': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>',
                'test': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>'
            };
            const defaultIcon = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10"></polygon></svg>';
            div.innerHTML = `
                <div class="log-status success"></div>
                <span>${svgIcons[action.event] || defaultIcon}</span>
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
