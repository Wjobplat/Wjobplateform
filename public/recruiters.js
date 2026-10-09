// Recruiters page - API-powered
let allRecruiters = [];
let activeFilter = 'all';

const AVATAR_GRADIENTS = [
    'linear-gradient(135deg,#059669,#10b981)',
    'linear-gradient(135deg,#2563eb,#3b82f6)',
    'linear-gradient(135deg,#7c3aed,#a78bfa)',
    'linear-gradient(135deg,#d97706,#fbbf24)',
    'linear-gradient(135deg,#0d9488,#14b8a6)'
];

document.addEventListener('DOMContentLoaded', async function () {
    const user = await requireAuth();
    if (!user) return;
    initUserAvatar(user);

    const search = document.getElementById('search-recruiters');
    if (search) search.addEventListener('input', applyFilters);
    document.querySelectorAll('#recruiter-filters .filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            activeFilter = btn.dataset.filter || 'all';
            document.querySelectorAll('#recruiter-filters .filter-btn').forEach(b => b.classList.toggle('active', b === btn));
            applyFilters();
        });
    });

    try {
        allRecruiters = await API.getRecruiters() || [];
    } catch (e) {
        // Table may not exist yet — show empty state
        console.warn('Recruiters not available:', e.message);
        allRecruiters = [];
    }
    renderStats(allRecruiters);
    applyFilters();
});

function renderStats(recruiters) {
    const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    set('total-recruiters', recruiters.length);
    set('total-companies', new Set(recruiters.map(r => r.company).filter(Boolean)).size);
    set('total-contacts', recruiters.filter(r => r.email).length);
    set('total-linkedin', recruiters.filter(r => r.linkedin).length);
}

function applyFilters() {
    const term = (document.getElementById('search-recruiters')?.value || '').trim().toLowerCase();
    let list = [...allRecruiters];
    if (activeFilter === 'email') list = list.filter(r => r.email);
    if (activeFilter === 'linkedin') list = list.filter(r => r.linkedin);
    if (term) list = list.filter(r =>
        [r.name, r.company, r.position, r.email].some(v => (v || '').toLowerCase().includes(term)));
    renderRecruiters(list);
}

function safeUrl(url) {
    const value = String(url || '').trim();
    if (!value) return '';
    const full = /^https?:\/\//i.test(value) ? value : 'https://' + value;
    return /^https?:\/\/[^\s"'<>]+$/i.test(full) ? full : '';
}

function renderRecruiters(recruiters) {
    const container = document.getElementById('recruiters-container');
    if (!container) return;

    if (recruiters.length === 0) {
        container.innerHTML = `<div class="empty-state" style="grid-column:1/-1">${allRecruiters.length
            ? 'Aucun recruteur ne correspond à cette recherche.'
            : 'Aucun recruteur pour le moment. Ils apparaîtront ici quand l\'agent en aura identifié.'}</div>`;
        return;
    }

    container.innerHTML = recruiters.map((r, i) => {
        const name = r.name || 'Recruteur';
        const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map(p => p[0].toUpperCase()).join('');
        const linkedin = safeUrl(r.linkedin);
        return `<div class="recruiter-card fade-in" style="animation-delay:${Math.min(i, 10) * 0.06}s">
            <div class="rec-top">
                <div class="rec-avatar" style="background:${AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length]}">${escapeHtml(initials)}</div>
                <div class="rec-info">
                    <div class="rec-name">${escapeHtml(name)}</div>
                    ${r.position ? `<div class="rec-role">${escapeHtml(r.position)}</div>` : ''}
                    ${r.company ? `<div class="rec-company">${escapeHtml(r.company)}</div>` : ''}
                </div>
                ${r.email ? '<span class="status-badge s-new">Email</span>' : ''}
            </div>
            ${r.email ? `<div class="rec-tags"><span class="rec-tag">${escapeHtml(r.email)}</span></div>` : ''}
            <div class="rec-footer">
                <span class="rec-date">${r.created_at ? 'Ajouté le ' + formatDate(r.created_at) : ''}</span>
                <div class="rec-actions">
                    ${linkedin ? `<a class="btn-view" href="${escapeHtml(linkedin)}" target="_blank" rel="noopener" style="text-decoration:none">LinkedIn</a>` : ''}
                    ${r.email ? `<a class="btn-contact" href="mailto:${encodeURIComponent(r.email)}" style="text-decoration:none">Contacter</a>` : ''}
                </div>
            </div>
        </div>`;
    }).join('');
}
