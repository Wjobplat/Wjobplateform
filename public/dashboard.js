// Dashboard JavaScript - API-powered
document.addEventListener('DOMContentLoaded', function () {
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
        renderStatus(stats);
        renderStatBars(stats);
        renderLatestApps();
        animateCards();
    } catch (error) {
        console.error('Dashboard load error:', error);
        showToast('Erreur de chargement du dashboard', 'error');
    }
}

function renderKPIs(stats) {
    animateValue('kpi-offers', 0, stats.totalJobs, 800);
    animateValue('kpi-companies', 0, stats.totalCompanies, 800);
    animateValue('kpi-recruiters', 0, stats.totalRecruiters, 800);
    animateValue('kpi-applications', 0, stats.totalApplications, 800);
}

function renderTimeline(activity) {
    const el = document.getElementById('activity-timeline');
    if (!el) return;
    el.innerHTML = '';
    activity.slice(0, 5).forEach((item, i) => {
        const div = document.createElement('div');
        div.className = 'timeline-item';
        div.style.animationDelay = `${i * 80}ms`;
        div.innerHTML = `
            <div class="timeline-date">${formatDateTime(item.date, item.time)}</div>
            <div class="timeline-title">${item.title}</div>
            <div class="timeline-content">${item.description}</div>
        `;
        el.appendChild(div);
    });
}

function renderStatus(stats) {
    animateValue('status-draft', 0, stats.draftCount, 600);
    animateValue('status-pending', 0, stats.pendingCount, 600);
    animateValue('status-sent', 0, stats.sentCount, 600);
    animateValue('status-responded', 0, stats.respondedCount, 600);
}

function renderStatBars(stats) {
    const total = stats.totalApplications || 1;
    const responseRate = Math.round((stats.respondedCount / total) * 100);
    const sentRate = Math.round(((stats.sentCount + stats.respondedCount) / total) * 100);
    setTimeout(() => {
        document.getElementById('stat-response-rate').textContent = responseRate + '%';
        document.getElementById('bar-response').style.width = responseRate + '%';
        document.getElementById('stat-compat').textContent = '84%';
        document.getElementById('bar-compat').style.width = '84%';
        document.getElementById('stat-sent-rate').textContent = sentRate + '%';
        document.getElementById('bar-sent').style.width = sentRate + '%';
    }, 300);
}

async function renderLatestApps() {
    const el = document.getElementById('latest-apps-list');
    if (!el) return;
    try {
        const apps = await API.getApplications();
        if (apps.length === 0) {
            el.innerHTML = '<p style="color: var(--color-text-muted); text-align: center; padding: 1rem;">Aucune candidature pour le moment.</p>';
            return;
        }
        el.innerHTML = apps.slice(0, 3).map(app => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: var(--space-md); background: rgba(255,255,255,0.03); border-radius: var(--radius-md); margin-bottom: var(--space-sm); border: 1px solid var(--glass-border);">
                <div style="flex: 1; min-width: 0;">
                    <div style="font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${app.job.title}</div>
                    <div style="font-size: 0.8rem; color: var(--color-text-secondary);">${app.job.company}</div>
                </div>
                <div style="display: flex; align-items: center; gap: var(--space-md); margin-left: 1rem;">
                    <span class="badge badge-${app.status}" style="font-size: 0.7rem;">${app.status === 'to_modify' ? 'À modifier' : app.status}</span>
                    <a href="application-review.html?id=${app.id}" class="btn btn-secondary btn-sm" title="Réviser" style="padding: 0.4rem;">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </a>
                </div>
            </div>
        `).join('');
    } catch (e) {
        el.innerHTML = '<p style="color: var(--color-text-error);">Erreur de chargement</p>';
    }
}

function animateValue(id, start, end, duration) {
    const el = document.getElementById(id);
    if (!el) return;
    const range = end - start;
    if (range === 0) { el.textContent = end; return; }
    const durationMs = duration || 800;
    const step = range / (durationMs / 16);
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

function animateCards() {
    document.querySelectorAll('.kpi-card, .card').forEach((card, i) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(16px)';
        setTimeout(() => {
            card.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, i * 80);
    });
}
