// Dashboard JavaScript — Compatible avec le design v7.0
// IDs utilisés dans index.html :
//   KPIs      : stat-jobs | stat-apps | stat-companies | stat-recruiters
//   Status    : stat-draft | stat-pending | stat-sent | stat-responded
//   Barres    : bar-draft  | bar-pending  | bar-sent  | bar-responded
//   Timeline  : activity-timeline
//   Dernières : latest-apps-list

document.addEventListener('DOMContentLoaded', function () {
    console.log('[W-JOB] Dashboard v7.0 chargé');
    loadDashboard();
});

async function loadDashboard() {
    try {
        const [stats, activity] = await Promise.all([
            API.getStats(),
            API.getActivity()
        ]);
        renderKPIs(stats);
        renderTimeline(activity);
        renderStatusCounts(stats);
        renderStatusBars(stats);
        renderLatestApps();
    } catch (error) {
        console.error('[W-JOB] Dashboard load error:', error);
        showToast('Erreur de chargement du dashboard', 'error');
    }
}

// ── KPI Cards ────────────────────────────────────────────
function renderKPIs(stats) {
    animateValue('stat-jobs',       0, stats.totalJobs,         900);
    animateValue('stat-apps',       0, stats.totalApplications, 900);
    animateValue('stat-companies',  0, stats.totalCompanies,    900);
    animateValue('stat-recruiters', 0, stats.totalRecruiters,   900);
}

// ── Timeline ─────────────────────────────────────────────
function renderTimeline(activity) {
    const el = document.getElementById('activity-timeline');
    if (!el) return;
    el.innerHTML = '';

    if (!activity || activity.length === 0) {
        el.innerHTML = '<p style="color: var(--color-text-muted); padding: 8px 0; font-size:0.85rem;">Aucune activité récente.</p>';
        return;
    }

    activity.slice(0, 5).forEach((item, i) => {
        const div = document.createElement('div');
        div.className = 'timeline-item';
        div.style.animationDelay = `${i * 80}ms`;
        div.innerHTML = `
            <div class="timeline-date">${formatDateTime(item.date, item.time)}</div>
            <div class="timeline-title">${item.title || ''}</div>
            <div class="timeline-content">${item.description || ''}</div>
        `;
        el.appendChild(div);
    });
}

// ── Status Counts ─────────────────────────────────────────
function renderStatusCounts(stats) {
    animateValue('stat-draft',     0, stats.draftCount,     700);
    animateValue('stat-pending',   0, stats.pendingCount,   700);
    animateValue('stat-sent',      0, stats.sentCount,      700);
    animateValue('stat-responded', 0, stats.respondedCount, 700);
}

// ── Status Progress Bars ──────────────────────────────────
function renderStatusBars(stats) {
    const total = stats.totalApplications || 1;

    function setBar(barId, count) {
        const bar = document.getElementById(barId);
        if (bar) {
            setTimeout(() => {
                bar.style.width = Math.round((count / total) * 100) + '%';
            }, 400);
        }
    }

    setBar('bar-draft',     stats.draftCount);
    setBar('bar-pending',   stats.pendingCount);
    setBar('bar-sent',      stats.sentCount);
    setBar('bar-responded', stats.respondedCount);
}

// ── Latest Applications ───────────────────────────────────
async function renderLatestApps() {
    const el = document.getElementById('latest-apps-list');
    if (!el) return;

    const statusLabels = {
        draft:     'Brouillon',
        pending:   'En attente',
        sent:      'Envoyée',
        responded: 'Réponse reçue',
        to_modify: 'À modifier'
    };

    try {
        const apps = await API.getApplications();
        if (apps.length === 0) {
            el.innerHTML = '<p style="color: var(--color-text-muted); text-align: center; padding: 1.25rem; font-size:0.85rem;">Aucune candidature pour le moment.</p>';
            return;
        }
        el.innerHTML = apps.slice(0, 3).map(app => `
            <div style="display:flex;justify-content:space-between;align-items:center;padding:var(--space-md);background:rgba(255,255,255,0.03);border-radius:var(--radius-md);margin-bottom:var(--space-sm);border:1px solid var(--glass-border);transition:border-color 0.2s;" onmouseenter="this.style.borderColor='rgba(16,185,129,0.3)'" onmouseleave="this.style.borderColor='var(--glass-border)'">
                <div style="flex:1;min-width:0;">
                    <div style="font-weight:600;font-size:0.9rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${app.job.title || 'Poste'}</div>
                    <div style="font-size:0.78rem;color:var(--color-text-secondary);">${app.job.company || 'Entreprise'}</div>
                </div>
                <div style="display:flex;align-items:center;gap:var(--space-md);margin-left:1rem;flex-shrink:0;">
                    <span class="badge badge-${app.status}" style="font-size:0.7rem;">${statusLabels[app.status] || app.status}</span>
                    <a href="application-review.html?id=${app.id}" class="btn btn-secondary btn-sm" title="Réviser" style="padding:0.35rem;">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </a>
                </div>
            </div>
        `).join('');
    } catch (e) {
        console.error('[W-JOB] Latest apps error:', e);
        el.innerHTML = '<p style="color:var(--color-text-muted);padding:1rem;font-size:0.85rem;">Impossible de charger les candidatures.</p>';
    }
}

// ── Animated Counter ──────────────────────────────────────
function animateValue(id, start, end, duration) {
    const el = document.getElementById(id);
    if (!el) return;
    const range = end - start;
    if (range === 0) { el.textContent = end; return; }
    const ms = duration || 800;
    const step = range / (ms / 16);
    let current = start;
    const timer = setInterval(() => {
        current += step;
        if ((step > 0 && current >= end) || (step < 0 && current <= end)) {
            el.textContent = end;
            clearInterval(timer);
        } else {
            el.textContent = Math.floor(current);
        }
    }, 16);
}
