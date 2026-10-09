// Jobs page - API-powered
let allJobs = [];
let activeContract = '';

const ICONS = {
    company: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    contract: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>',
    salary: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
    date: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
    logo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>'
};

document.addEventListener('DOMContentLoaded', async function () {
    const user = await requireAuth();
    if (!user) return;
    initUserAvatar(user);
    setupFilters();
    try {
        allJobs = await API.getJobs();
        renderStats(allJobs);
        applyFilters();
    } catch (e) {
        console.error(e);
        renderJobs([]);
        showToast('Erreur de chargement des offres', 'error');
    }
});

function renderStats(jobs) {
    const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    const weekAgo = Date.now() - 7 * 86400000;
    const scores = jobs.map(j => j.compatibility).filter(n => typeof n === 'number');
    set('stat-total', jobs.length);
    set('stat-new', jobs.filter(j => j.postedDate && new Date(j.postedDate).getTime() >= weekAgo).length);
    set('stat-avg', scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) + '%' : '–');
    set('stat-companies', new Set(jobs.map(j => j.company).filter(Boolean)).size);
}

function scoreRing(score) {
    const s = Number(score) || 0;
    const offset = Math.round(113 * (1 - s / 100));
    return `<div class="score-ring">
        <svg width="44" height="44" viewBox="0 0 44 44"><circle cx="22" cy="22" r="18" fill="none" stroke="rgba(16,185,129,.12)" stroke-width="3"/><circle cx="22" cy="22" r="18" fill="none" stroke="#10b981" stroke-width="3" stroke-dasharray="113" stroke-dashoffset="${offset}" stroke-linecap="round"/></svg>
        <span class="score-val">${s}%</span>
    </div>`;
}

function jobMeta(job, withSource) {
    return [
        job.company && `<span class="job-meta-item">${ICONS.company} ${escapeHtml(job.company)}</span>`,
        job.location && `<span class="job-meta-item">${ICONS.pin} ${escapeHtml(job.location)}</span>`,
        job.contractType && `<span class="job-meta-item">${ICONS.contract} ${escapeHtml(job.contractType)}</span>`,
        job.salary && `<span class="job-meta-item">${ICONS.salary} ${escapeHtml(job.salary)}</span>`,
        withSource && job.source && `<span class="job-meta-item">Source : ${escapeHtml(job.source)}</span>`
    ].filter(Boolean).join('');
}

function renderJobs(jobs) {
    const grid = document.getElementById('job-grid');
    const count = document.getElementById('results-count');
    if (!grid) return;
    if (count) count.textContent = jobs.length;

    if (jobs.length === 0) {
        grid.innerHTML = allJobs.length
            ? `<div class="empty-state">Aucune offre ne correspond à ces filtres. <a href="#" onclick="resetFilters();return false;">Réinitialiser</a></div>`
            : `<div class="empty-state">Aucune offre pour le moment. <a href="applications.html">Lancer une recherche</a></div>`;
        return;
    }

    grid.innerHTML = jobs.map((job, i) => {
        const id = Number(job.id);
        const tags = (job.skills || []).slice(0, 6)
            .map((s, k) => `<span class="job-tag${k < 2 ? ' highlight' : ''}">${escapeHtml(s)}</span>`).join('');
        return `<div class="job-card fade-in${job.compatibility >= 90 ? ' featured' : ''}" style="animation-delay:${Math.min(i, 10) * 0.05}s" onclick="openJobModal(${id})">
            <div class="job-top">
                <div class="job-logo">${ICONS.logo}</div>
                <div class="job-info">
                    <div class="job-role">${escapeHtml(job.title || 'Poste')}</div>
                    <div class="job-meta">${jobMeta(job)}</div>
                </div>
                <div class="job-score">${scoreRing(job.compatibility)}</div>
            </div>
            ${tags ? `<div class="job-tags">${tags}</div>` : ''}
            <div class="job-footer">
                <span class="job-date">${ICONS.date} ${job.postedDate ? 'Publié ' + formatRelativeTime(job.postedDate).toLowerCase() : 'Date inconnue'}</span>
                <div class="job-actions">
                    <button class="btn-save" onclick="event.stopPropagation();openJobModal(${id})">Détails</button>
                    <button class="btn-apply" onclick="event.stopPropagation();postulerToJob(${id})">Candidater</button>
                </div>
            </div>
        </div>`;
    }).join('');
}

function setupFilters() {
    ['filter-search', 'filter-location'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', applyFilters);
    });
    ['filter-compatibility', 'sort-by'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('change', applyFilters);
    });
    document.querySelectorAll('#contract-filters .filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            activeContract = btn.dataset.contract || '';
            document.querySelectorAll('#contract-filters .filter-btn').forEach(b => b.classList.toggle('active', b === btn));
            applyFilters();
        });
    });
}

function applyFilters() {
    let jobs = [...allJobs];
    const search = (document.getElementById('filter-search')?.value || '').trim().toLowerCase();
    const location = (document.getElementById('filter-location')?.value || '').trim().toLowerCase();
    const compat = parseInt(document.getElementById('filter-compatibility')?.value || '0', 10);

    if (search) jobs = jobs.filter(j =>
        (j.title || '').toLowerCase().includes(search) ||
        (j.company || '').toLowerCase().includes(search) ||
        (j.skills || []).some(s => String(s).toLowerCase().includes(search)));
    if (location) jobs = jobs.filter(j => (j.location || '').toLowerCase().includes(location));
    if (activeContract) jobs = jobs.filter(j => (j.contractType || '').toLowerCase().includes(activeContract.toLowerCase()));
    if (compat) jobs = jobs.filter(j => (j.compatibility || 0) >= compat);

    const sort = document.getElementById('sort-by')?.value || 'compatibility';
    if (sort === 'compatibility') jobs.sort((a, b) => (b.compatibility || 0) - (a.compatibility || 0));
    else if (sort === 'date') jobs.sort((a, b) => new Date(b.postedDate || 0) - new Date(a.postedDate || 0));
    else if (sort === 'company') jobs.sort((a, b) => (a.company || '').localeCompare(b.company || ''));

    renderJobs(jobs);
}

function resetFilters() {
    ['filter-search', 'filter-location'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    const compat = document.getElementById('filter-compatibility');
    if (compat) compat.value = '0';
    activeContract = '';
    document.querySelectorAll('#contract-filters .filter-btn').forEach(b => b.classList.toggle('active', !b.dataset.contract));
    applyFilters();
}

function openJobModal(jobId) {
    const job = allJobs.find(j => j.id === jobId);
    if (!job) return;
    document.getElementById('modal-job-title').textContent = job.title || 'Offre';
    document.getElementById('modal-job-content').innerHTML = `
        <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1rem">
            ${scoreRing(job.compatibility)}
            <div class="job-meta" style="flex:1">${jobMeta(job, true)}</div>
        </div>
        ${job.description ? `<p style="color:var(--dim);line-height:1.7;font-size:.875rem;margin-bottom:1rem;white-space:pre-line">${escapeHtml(job.description)}</p>` : ''}
        ${(job.skills || []).length ? `<div class="job-tags">${job.skills.map(s => `<span class="job-tag">${escapeHtml(s)}</span>`).join('')}</div>` : ''}
        <div class="modal-actions">
            <button class="btn-danger" id="delete-job-btn" onclick="deleteJob(${Number(job.id)})">Supprimer l'offre</button>
            <button class="btn-apply" style="padding:.6rem 1rem;font-size:.85rem" onclick="postulerToJob(${Number(job.id)})">Postuler à cette offre</button>
        </div>
    `;
    document.getElementById('job-modal').classList.remove('hidden');
}

async function deleteJob(jobId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette offre ? Cette action est irréversible et supprimera toutes les candidatures associées.')) return;

    const btn = document.getElementById('delete-job-btn');
    const originalText = btn ? btn.innerText : '';
    if (btn) btn.innerText = 'Suppression...';

    try {
        await API.deleteJob(jobId);
        showToast('Offre supprimée avec succès', 'success');
        closeJobModal();
        allJobs = await API.getJobs();
        renderStats(allJobs);
        applyFilters();
    } catch (e) {
        console.error(e);
        showToast('Erreur lors de la suppression', 'error');
        if (btn) btn.innerText = originalText;
    }
}

function postulerToJob(jobId) {
    const job = allJobs.find(j => j.id === jobId);
    if (!job) return;

    // Save job details to localStorage to retrieve them on the application page
    localStorage.setItem('jobToApply', JSON.stringify(job));

    // Redirect to application review page
    window.location.href = 'application-review.html';
}

function closeJobModal() {
    document.getElementById('job-modal').classList.add('hidden');
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeJobModal(); });
