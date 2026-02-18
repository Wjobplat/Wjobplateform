// Applications Page JavaScript

let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', function () {
    initializeApplicationsPage();
});

function initializeApplicationsPage() {
    updateStatusCounts();
    renderApplications('all');
}

function updateStatusCounts() {
    const stats = getStats();

    document.getElementById('count-all').textContent = stats.totalApplications;
    document.getElementById('count-draft').textContent = stats.draftCount;
    document.getElementById('count-pending').textContent = stats.pendingCount;
    document.getElementById('count-sent').textContent = stats.sentCount;
    document.getElementById('count-responded').textContent = stats.respondedCount;
}

function filterByStatus(status) {
    currentFilter = status;

    // Update active tab
    document.querySelectorAll('.status-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-status="${status}"]`).classList.add('active');

    renderApplications(status);
}

function renderApplications(status) {
    const container = document.getElementById('applications-container');

    let applications = mockData.applications;
    if (status !== 'all') {
        applications = getApplicationsByStatus(status);
    }

    // Sort by created date (newest first)
    applications.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));

    if (applications.length === 0) {
        container.innerHTML = `
            <div class="card" style="text-align: center; padding: var(--space-2xl);">
                <div style="font-size: 3rem; margin-bottom: var(--space-lg);">📭</div>
                <h3 style="margin-bottom: var(--space-sm); color: var(--color-text-primary);">
                    Aucune candidature
                </h3>
                <p style="color: var(--color-text-secondary); margin-bottom: var(--space-xl);">
                    ${status === 'all' ? 'Commencez par rechercher des offres d\'emploi' : `Aucune candidature avec le statut "${getStatusLabel(status)}"`}
                </p>
                <a href="jobs.html" class="btn btn-primary">
                    Rechercher des emplois
                </a>
            </div>
        `;
        return;
    }

    container.innerHTML = applications.map((app, index) => {
        const job = getJobById(app.jobId);
        if (!job) return '';

        return createApplicationCard(app, job, index);
    }).join('');
}

function createApplicationCard(application, job, index) {
    const statusInfo = getStatusInfo(application.status);

    return `
        <div class="card fade-in" style="margin-bottom: var(--space-xl); animation-delay: ${index * 50}ms;">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: var(--space-lg);">
                <div style="flex: 1;">
                    <div style="display: flex; align-items: center; gap: var(--space-md); margin-bottom: var(--space-sm);">
                        <h3 style="font-size: 1.25rem; font-weight: 700; color: var(--color-text-primary);">
                            ${job.title}
                        </h3>
                        <span class="badge badge-${application.status}">${statusInfo.label}</span>
                    </div>
                    <div style="color: var(--color-text-secondary); margin-bottom: var(--space-md);">
                        ${job.company} • ${job.location}
                    </div>
                    <div style="display: flex; flex-wrap: wrap; gap: var(--space-md); color: var(--color-text-muted); font-size: 0.875rem;">
                        <div style="display: flex; align-items: center; gap: var(--space-xs);">
                            <span>📅</span>
                            <span>Créée le ${formatDate(application.createdDate)}</span>
                        </div>
                        ${application.sentDate ? `
                            <div style="display: flex; align-items: center; gap: var(--space-xs);">
                                <span>✉️</span>
                                <span>Envoyée le ${formatDate(application.sentDate)}</span>
                            </div>
                        ` : ''}
                        ${application.responseDate ? `
                            <div style="display: flex; align-items: center; gap: var(--space-xs);">
                                <span>✅</span>
                                <span>Réponse le ${formatDate(application.responseDate)}</span>
                            </div>
                        ` : ''}
                    </div>
                    ${application.notes ? `
                        <div style="margin-top: var(--space-md); padding: var(--space-md); background: var(--color-bg-tertiary); border-radius: var(--radius-md); color: var(--color-text-secondary); font-size: 0.875rem;">
                            💡 ${application.notes}
                        </div>
                    ` : ''}
                </div>
                <div class="compatibility-score">
                    <div class="score-circle ${job.compatibility >= 85 ? 'score-high' : job.compatibility >= 70 ? 'score-medium' : 'score-low'}">
                        ${job.compatibility}%
                    </div>
                </div>
            </div>
            
            <div style="display: flex; gap: var(--space-md); padding-top: var(--space-lg); border-top: 1px solid var(--glass-border);">
                ${getActionButtons(application)}
            </div>
        </div>
    `;
}

function getStatusInfo(status) {
    const statusMap = {
        draft: { label: 'Brouillon', icon: '📋' },
        pending: { label: 'En attente', icon: '⏳' },
        sent: { label: 'Envoyée', icon: '✉️' },
        responded: { label: 'Réponse reçue', icon: '✅' }
    };
    return statusMap[status] || { label: status, icon: '❓' };
}

function getStatusLabel(status) {
    return getStatusInfo(status).label;
}

function getActionButtons(application) {
    switch (application.status) {
        case 'draft':
            return `
                <button class="btn btn-primary" onclick="editApplication(${application.id})">
                    ✏️ Compléter la candidature
                </button>
                <button class="btn btn-secondary" onclick="deleteApplication(${application.id})">
                    🗑️ Supprimer
                </button>
            `;
        case 'pending':
            return `
                <button class="btn btn-primary" onclick="reviewApplication(${application.id})">
                    👁️ Réviser et envoyer
                </button>
                <button class="btn btn-secondary" onclick="editApplication(${application.id})">
                    ✏️ Modifier
                </button>
            `;
        case 'sent':
            return `
                <button class="btn btn-secondary" onclick="viewApplication(${application.id})">
                    👁️ Voir les détails
                </button>
                <button class="btn btn-secondary" onclick="markAsResponded(${application.id})">
                    ✅ Marquer comme répondu
                </button>
            `;
        case 'responded':
            return `
                <button class="btn btn-primary" onclick="viewApplication(${application.id})">
                    👁️ Voir les détails
                </button>
            `;
        default:
            return '';
    }
}

function editApplication(id) {
    window.location.href = `application-review.html?id=${id}`;
}

function reviewApplication(id) {
    window.location.href = `application-review.html?id=${id}`;
}

function viewApplication(id) {
    window.location.href = `application-review.html?id=${id}`;
}

function deleteApplication(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette candidature ?')) {
        const index = mockData.applications.findIndex(app => app.id === id);
        if (index !== -1) {
            mockData.applications.splice(index, 1);
            updateStatusCounts();
            renderApplications(currentFilter);
            alert('Candidature supprimée avec succès');
        }
    }
}

function markAsResponded(id) {
    const application = mockData.applications.find(app => app.id === id);
    if (application) {
        application.status = 'responded';
        application.responseDate = new Date().toISOString().split('T')[0];
        updateStatusCounts();
        renderApplications(currentFilter);
        alert('Candidature marquée comme répondue !');
    }
}
