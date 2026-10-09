// Candidatures page - Kanban par statut, recherche & tri
let allApplications = [];

const COLUMNS = ['draft', 'pending', 'sent', 'responded'];

const STATUS_LABELS = {
    draft: 'Brouillon',
    pending: 'En attente',
    sent: 'Envoyée',
    responded: 'Réponse reçue',
    to_modify: 'À modifier'
};

const ACTION_LABELS = {
    draft: 'Finaliser',
    pending: 'Réviser',
    to_modify: 'Modifier',
    sent: 'Voir',
    responded: 'Voir'
};

const CARD_ICONS = {
    logo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>',
    company: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
    date: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>',
    alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>'
};

document.addEventListener('DOMContentLoaded', async () => {
    const user = await requireAuth();
    if (!user) return;
    initUserAvatar(user);

    const searchInput = document.getElementById('search-candidatures');
    if (searchInput) searchInput.addEventListener('input', applyFilters);
    const sortSelect = document.getElementById('sort-candidatures');
    if (sortSelect) sortSelect.addEventListener('change', applyFilters);

    showSkeletons();
    try {
        allApplications = await API.getApplications();
        updateStats();
        applyFilters();
    } catch (e) {
        console.error(e);
        renderApplications([]);
        showToast('Erreur de chargement des candidatures', 'error');
    }
});

// Les candidatures "à modifier" vivent dans la colonne "En attente"
function columnOf(status) {
    return status === 'to_modify' ? 'pending' : (COLUMNS.includes(status) ? status : 'draft');
}

function showSkeletons() {
    COLUMNS.forEach(key => {
        const col = document.getElementById(`col-${key}`);
        if (col) col.innerHTML = '<div class="skeleton" style="height:120px"></div>';
    });
}

function applyFilters() {
    const searchTerm = (document.getElementById('search-candidatures')?.value || '').trim().toLowerCase();
    const sortBy = document.getElementById('sort-candidatures')?.value || 'date-desc';

    let filtered = [...allApplications];
    if (searchTerm) {
        filtered = filtered.filter(a =>
            (a.job?.company || '').toLowerCase().includes(searchTerm) ||
            (a.job?.title || '').toLowerCase().includes(searchTerm));
    }

    switch (sortBy) {
        case 'date-asc':
            filtered.sort((a, b) => new Date(a.createdDate || 0) - new Date(b.createdDate || 0));
            break;
        case 'company':
            filtered.sort((a, b) => (a.job?.company || '').localeCompare(b.job?.company || ''));
            break;
        case 'score':
            filtered.sort((a, b) => (b.job?.compatibility || 0) - (a.job?.compatibility || 0));
            break;
        default:
            filtered.sort((a, b) => new Date(b.createdDate || 0) - new Date(a.createdDate || 0));
    }

    renderApplications(filtered);
}

function updateStats() {
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    const scores = allApplications.map(a => a.job?.compatibility).filter(n => typeof n === 'number');
    set('stat-total', allApplications.length);
    set('stat-sent', allApplications.filter(a => a.status === 'sent').length);
    set('stat-pending', allApplications.filter(a => a.status === 'pending' || a.status === 'to_modify').length);
    set('stat-best', scores.length ? Math.max(...scores) + '%' : '–');
}

function renderCard(app) {
    const job = app.job || {};
    const status = app.status || 'draft';
    const where = [job.company, job.location].filter(Boolean).map(escapeHtml).join(' · ');
    const date = app.responseDate || app.sentDate || app.createdDate;
    const score = typeof job.compatibility === 'number'
        ? `<span class="match-score">${job.compatibility}%</span>`
        : `<span class="match-score">${STATUS_LABELS[status] || escapeHtml(status)}</span>`;
    const tags = [
        app.cv_path && '<span class="tag">CV joint</span>',
        app.coverLetter && '<span class="tag">Lettre</span>',
        app.customEmail && '<span class="tag">Email</span>'
    ].filter(Boolean).join('');

    const column = columnOf(status);
    return `<div class="app-card ${column === 'responded' ? 'response' : column}">
        <div class="card-top">
            <div class="company-logo">${CARD_ICONS.logo}</div>
            ${score}
        </div>
        <div class="card-role">${escapeHtml(job.title || 'Poste')}</div>
        ${where ? `<div class="card-company">${CARD_ICONS.company} ${where}</div>` : ''}
        ${tags ? `<div class="card-tags">${tags}</div>` : ''}
        ${status === 'to_modify' ? `<div class="card-alert alert-yellow">${CARD_ICONS.alert} À modifier${app.notes ? ' : ' + escapeHtml(app.notes) : ''}</div>` : ''}
        <div class="card-footer">
            <span class="card-date">${CARD_ICONS.date} ${date ? formatDate(date) : '–'}</span>
            <a href="application-review.html?id=${encodeURIComponent(app.id)}" class="card-action">${ACTION_LABELS[status] || 'Voir'} ${CARD_ICONS.arrow}</a>
        </div>
    </div>`;
}

function renderApplications(apps) {
    COLUMNS.forEach(key => {
        const col = document.getElementById(`col-${key}`);
        const count = document.getElementById(`col-count-${key}`);
        const items = apps.filter(a => columnOf(a.status) === key);
        if (count) count.textContent = items.length;
        if (!col) return;
        col.innerHTML = items.length
            ? items.map(renderCard).join('')
            : `<div style="text-align:center;padding:1.5rem .5rem;color:var(--muted);font-size:.78rem">Aucune candidature</div>`;
    });

    const draftCol = document.getElementById('col-draft');
    if (draftCol) {
        draftCol.insertAdjacentHTML('beforeend', `<a href="applications.html" class="add-card" style="display:flex;text-decoration:none;color:inherit">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
            Nouvelle candidature
        </a>`);
    }
}
