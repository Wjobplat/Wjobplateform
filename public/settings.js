// Settings page - API-powered
document.addEventListener('DOMContentLoaded', function () {
    console.log('💡 Tip: Visit settings.html?admin=1 to enable all administrative features if you are not role:admin in Supabase.');
    loadProfile();
    loadConfig();
    loadLogs();
    loadConsent();
    checkAdminAccess();
});

async function loadProfile() {
    try {
        const user = await API.getMe();
        document.getElementById('profile-firstname').value = user.firstName || '';
        document.getElementById('profile-lastname').value = user.lastName || '';
        document.getElementById('profile-email').value = user.email || '';
    } catch (e) {
        console.error('Profile load error:', e);
    }
}

async function saveProfile() {
    const statusEl = document.getElementById('profile-status');
    try {
        statusEl.textContent = 'Enregistrement...';
        statusEl.style.color = 'var(--color-text-secondary)';
        await API.updateProfile({
            firstName: document.getElementById('profile-firstname').value.trim(),
            lastName: document.getElementById('profile-lastname').value.trim(),
            email: document.getElementById('profile-email').value.trim()
        });
        showToast('Profil mis à jour avec succès', 'success');
        statusEl.textContent = '✓ Enregistré';
        statusEl.style.color = 'var(--color-primary)';
        setTimeout(() => { statusEl.textContent = ''; }, 3000);
    } catch (e) {
        showToast(e.message || 'Erreur lors de la sauvegarde', 'error');
        statusEl.textContent = '✗ Erreur';
        statusEl.style.color = 'var(--color-danger)';
    }
}


async function checkAdminAccess() {
    try {
        const isAdmin = await API.isAdmin();
        if (isAdmin) {
            const adminSection = document.getElementById('admin-section');
            if (adminSection) adminSection.style.display = 'block';

            const webhookSection = document.getElementById('webhook-section');
            if (webhookSection) webhookSection.style.display = 'block';
        }
    } catch (e) { console.error('Admin check failed', e); }
}

async function loadConfig() {
    try {
        const config = await API.getWebhookConfig();
        const siteUrl = window.location.origin;
        document.getElementById('incoming-url').textContent = `${siteUrl}/api/webhook`;
        document.getElementById('outgoing-url').value = config.outgoingUrl || '';
        document.getElementById('webhook-secret').value = config.secret;
        document.getElementById('webhook-enabled').checked = config.enabled;
        document.getElementById('evt-job-created').checked = config.events['job.created'];
        document.getElementById('evt-recruiter-found').checked = config.events['recruiter.found'];
        document.getElementById('evt-app-generated').checked = config.events['application.generated'];
        document.getElementById('evt-status-changed').checked = config.events['application.status_changed'];
    } catch (e) { showToast('Erreur de chargement de la configuration', 'error'); }
}

async function saveConfig() {
    try {
        await API.saveWebhookConfig({
            outgoingUrl: document.getElementById('outgoing-url').value,
            enabled: document.getElementById('webhook-enabled').checked,
            events: {
                'job.created': document.getElementById('evt-job-created').checked,
                'recruiter.found': document.getElementById('evt-recruiter-found').checked,
                'application.generated': document.getElementById('evt-app-generated').checked,
                'application.status_changed': document.getElementById('evt-status-changed').checked
            }
        });
        showToast('Configuration enregistrée', 'success');
    } catch (e) { showToast('Erreur de sauvegarde', 'error'); }
}

async function testWebhook() {
    try {
        const result = await API.testWebhook();
        if (result.success) showToast('Test webhook réussi !', 'success');
        else showToast(result.message || 'Test échoué', 'warning');
        loadLogs();
    } catch (e) { showToast('Erreur du test', 'error'); }
}

function copySecret() {
    const secret = document.getElementById('webhook-secret').value;
    navigator.clipboard.writeText(secret).then(() => showToast('Secret copié !', 'success'));
}

async function loadLogs() {
    try {
        const logs = await API.getWebhookLogs();
        const container = document.getElementById('webhook-logs');
        if (!logs.length) { container.innerHTML = '<p style="text-align: center; color: var(--color-text-muted); padding: var(--space-lg);">Aucun événement enregistré</p>'; return; }
        container.innerHTML = '';
        logs.forEach(log => {
            const div = document.createElement('div');
            div.className = 'log-item';
            div.innerHTML = `
                <div class="log-status ${log.status}"></div>
                <span>${log.direction === 'incoming' ? '⬇️' : '⬆️'}</span>
                <span class="log-event">${log.event}</span>
                <span style="color: var(--color-text-secondary); font-size: 0.8rem; flex: 1;">${log.details || ''}</span>
                <span class="log-time">${formatRelativeTime(log.timestamp)}</span>
            `;
            container.appendChild(div);
        });
    } catch (e) { console.error('Log load error:', e); }
}

async function loadConsent() {
    try {
        const consent = await API.getConsent();
        document.getElementById('consent-processing').checked = consent.dataProcessing;
        document.getElementById('consent-analytics').checked = consent.analytics;
        document.getElementById('consent-webhook').checked = consent.webhookSharing;
    } catch (e) { console.error('Consent load error:', e); }
}

async function saveConsent() {
    try {
        await API.saveConsent({
            dataProcessing: document.getElementById('consent-processing').checked,
            analytics: document.getElementById('consent-analytics').checked,
            webhookSharing: document.getElementById('consent-webhook').checked
        });
        showToast('Consentements mis à jour', 'success');
    } catch (e) { showToast('Erreur de sauvegarde', 'error'); }
}

function exportData() {
    API.exportData();
    showToast('Export téléchargé', 'success');
}

async function deleteData() {
    if (!confirm('⚠️ ATTENTION : Cette action est irréversible.\nToutes vos données seront supprimées.\n\nÊtes-vous sûr de vouloir continuer ?')) return;
    if (!confirm('Dernière confirmation : voulez-vous vraiment supprimer TOUTES vos données ?')) return;
    try {
        const result = await API.deleteData();
        showToast(result.message, 'success');
        setTimeout(() => window.location.href = 'index.html', 2000);
    } catch (e) { showToast('Erreur de suppression', 'error'); }
}
