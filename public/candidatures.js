// Candidatures page - Animated tabs & application listing
let allApplications = [];

document.addEventListener('DOMContentLoaded', async () => {
    try {
        allApplications = await API.getApplications();
        updateCounts();
        renderApplications(allApplications);
        // Position the indicator on the first tab
        requestAnimationFrame(() => moveIndicator(document.querySelector('.animated-tab.active')));
    } catch (e) {
        console.error(e);
        showToast('Erreur de chargement des candidatures', 'error');
    }
});

// =============================================
// ANIMATED TAB INDICATOR
// =============================================
function moveIndicator(tabEl) {
    const indicator = document.getElementById('tab-indicator');
    const container = document.getElementById('tabs-container');
    if (!indicator || !tabEl || !container) return;

    const containerRect = container.getBoundingClientRect();
    const tabRect = tabEl.getBoundingClientRect();

    indicator.style.left = (tabRect.left - containerRect.left) + 'px';
    indicator.style.width = tabRect.width + 'px';
}

function filterByStatus(status, tabEl) {
    // Update active tab
    document.querySelectorAll('.animated-tab').forEach(t => t.classList.remove('active'));
    tabEl.classList.add('active');

    // Slide indicator
    moveIndicator(tabEl);

    // Filter and render
    const filtered = status === 'all' ? allApplications : allApplications.filter(a => a.status === status);
    renderApplications(filtered);
}

// =============================================
// COUNTS
// =============================================
function updateCounts() {
    document.getElementById('count-all').textContent = allApplications.length;
    document.getElementById('count-draft').textContent = allApplications.filter(a => a.status === 'draft').length;
    document.getElementById('count-pending').textContent = allApplications.filter(a => a.status === 'pending').length;
    document.getElementById('count-sent').textContent = allApplications.filter(a => a.status === 'sent').length;
    document.getElementById('count-responded').textContent = allApplications.filter(a => a.status === 'responded').length;
}

// =============================================
// RENDER
// =============================================
function renderApplications(apps) {
    const container = document.getElementById('applications-container');
    if (!container) return;
    container.innerHTML = '';

    if (apps.length === 0) {
        container.innerHTML = `
            <div class="card" style="text-align: center; padding: var(--space-2xl);">
                <div style="font-size: 3rem; margin-bottom: var(--space-md); opacity: 0.3;">📋</div>
                <p style="color: var(--color-text-muted); margin-bottom: var(--space-lg);">Aucune candidature trouvée.</p>
                <a href="applications.html" class="btn btn-primary">Démarrer une recherche</a>
            </div>`;
        return;
    }

    const grid = document.createElement('div');
    grid.className = 'job-grid';

    apps.forEach((app, i) => {
        const job = app.job || {};
        const statusLabels = {
            draft: 'Brouillon',
            pending: 'En attente',
            sent: 'Envoyée',
            responded: 'Réponse reçue',
            to_modify: 'À modifier'
        };

        const hasCv = app.cv_path ? '<span title="CV joint" style="margin-left:8px;">📎</span>' : '';
        const hasCover = app.cover_letter ? '<span title="Lettre de motivation" style="margin-left:4px;">📄</span>' : '';

        const card = document.createElement('div');
        card.className = 'job-card';
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';

        card.innerHTML = `
            <div class="job-card-header">
                <div>
                    <div class="job-company">${job.company || 'Entreprise'}</div>
                    <div class="job-title">${job.title || 'Poste'}</div>
                </div>
                <span class="badge badge-${app.status}">${statusLabels[app.status] || app.status}</span>
            </div>
            ${app.sentDate ? `<div class="job-detail">✉️ Envoyée le ${formatDate(app.sentDate)}</div>` : ''}
            ${app.responseDate ? `<div class="job-detail">💬 Réponse le ${formatDate(app.responseDate)}</div>` : ''}
            <div class="job-detail" style="margin-left: auto;">${hasCv}${hasCover}</div>
            ${app.notes ? `<p style="color: var(--color-text-muted); font-size: 0.85rem; margin-bottom: var(--space-md);">📝 ${app.notes}</p>` : ''}
            <div class="job-footer">
                <span></span>
                <a href="application-review.html?id=${app.id}" class="btn btn-primary btn-sm">Réviser</a>
            </div>
        `;

        grid.appendChild(card);

        // Staggered entrance animation
        setTimeout(() => {
            card.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, i * 80);
    });

    container.appendChild(grid);
}

// Handle window resize for indicator
window.addEventListener('resize', () => {
    const activeTab = document.querySelector('.animated-tab.active');
    if (activeTab) moveIndicator(activeTab);
});
