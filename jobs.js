// Jobs Page JavaScript

let filteredJobs = [...mockData.jobs];

document.addEventListener('DOMContentLoaded', function () {
    initializeJobsPage();
    setupEventListeners();
});

function initializeJobsPage() {
    renderJobs(mockData.jobs);
    updateResultsCount(mockData.jobs.length);
}

function setupEventListeners() {
    // Filter inputs
    document.getElementById('filter-search').addEventListener('input', applyFilters);
    document.getElementById('filter-location').addEventListener('change', applyFilters);
    document.getElementById('filter-contract').addEventListener('change', applyFilters);
    document.getElementById('filter-source').addEventListener('change', applyFilters);
    document.getElementById('filter-compatibility').addEventListener('change', applyFilters);

    // Sort
    document.getElementById('sort-by').addEventListener('change', applySorting);
}

function applyFilters() {
    const searchTerm = document.getElementById('filter-search').value.toLowerCase();
    const location = document.getElementById('filter-location').value.toLowerCase();
    const contract = document.getElementById('filter-contract').value;
    const source = document.getElementById('filter-source').value;
    const minCompatibility = parseInt(document.getElementById('filter-compatibility').value) || 0;

    filteredJobs = mockData.jobs.filter(job => {
        // Search filter
        const matchesSearch = !searchTerm ||
            job.title.toLowerCase().includes(searchTerm) ||
            job.company.toLowerCase().includes(searchTerm) ||
            job.skills.some(skill => skill.toLowerCase().includes(searchTerm));

        // Location filter
        const matchesLocation = !location ||
            (location === 'remote' && job.remote) ||
            job.location.toLowerCase().includes(location);

        // Contract filter
        const matchesContract = !contract || job.contractType === contract;

        // Source filter
        const matchesSource = !source || job.source === source;

        // Compatibility filter
        const matchesCompatibility = job.compatibility >= minCompatibility;

        return matchesSearch && matchesLocation && matchesContract && matchesSource && matchesCompatibility;
    });

    applySorting();
}

function applySorting() {
    const sortBy = document.getElementById('sort-by').value;

    filteredJobs.sort((a, b) => {
        switch (sortBy) {
            case 'compatibility':
                return b.compatibility - a.compatibility;
            case 'date':
                return new Date(b.postedDate) - new Date(a.postedDate);
            case 'company':
                return a.company.localeCompare(b.company);
            default:
                return 0;
        }
    });

    renderJobs(filteredJobs);
    updateResultsCount(filteredJobs.length);
}

function resetFilters() {
    document.getElementById('filter-search').value = '';
    document.getElementById('filter-location').value = '';
    document.getElementById('filter-contract').value = '';
    document.getElementById('filter-source').value = '';
    document.getElementById('filter-compatibility').value = '0';

    applyFilters();
}

function renderJobs(jobs) {
    const grid = document.getElementById('job-grid');
    grid.innerHTML = '';

    if (jobs.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: var(--space-2xl); color: var(--color-text-secondary);">
                <div style="font-size: 3rem; margin-bottom: var(--space-lg);">🔍</div>
                <h3 style="margin-bottom: var(--space-sm);">Aucune offre trouvée</h3>
                <p>Essayez de modifier vos filtres de recherche</p>
            </div>
        `;
        return;
    }

    jobs.forEach((job, index) => {
        const card = createJobCard(job);
        card.style.animationDelay = `${index * 50}ms`;
        grid.appendChild(card);
    });
}

function createJobCard(job) {
    const card = document.createElement('div');
    card.className = 'job-card fade-in';
    card.onclick = () => openJobModal(job.id);

    const compatibilityClass =
        job.compatibility >= 85 ? 'score-high' :
            job.compatibility >= 70 ? 'score-medium' : 'score-low';

    card.innerHTML = `
        <div class="job-card-header">
            <div>
                <div class="job-company">${job.company}</div>
                <h3 class="job-title">${job.title}</h3>
            </div>
            <div class="compatibility-score">
                <div class="score-circle ${compatibilityClass}">
                    ${job.compatibility}%
                </div>
            </div>
        </div>
        
        <div class="job-details">
            <div class="job-detail">
                <span class="job-detail-icon">📍</span>
                <span>${job.location}</span>
            </div>
            <div class="job-detail">
                <span class="job-detail-icon">💼</span>
                <span>${job.contractType}</span>
            </div>
            ${job.salary ? `
                <div class="job-detail">
                    <span class="job-detail-icon">💰</span>
                    <span>${job.salary}</span>
                </div>
            ` : ''}
        </div>
        
        <div class="job-description">
            ${job.description}
        </div>
        
        <div style="display: flex; flex-wrap: wrap; gap: var(--space-sm); margin-bottom: var(--space-lg);">
            ${job.skills.slice(0, 4).map(skill => `
                <span style="background: var(--color-bg-tertiary); padding: var(--space-xs) var(--space-md); border-radius: var(--radius-full); font-size: 0.75rem; color: var(--color-text-secondary);">
                    ${skill}
                </span>
            `).join('')}
        </div>
        
        <div class="job-footer">
            <div style="display: flex; align-items: center; gap: var(--space-sm); color: var(--color-text-muted); font-size: 0.75rem;">
                <span>📅</span>
                <span>${formatDate(job.postedDate)}</span>
            </div>
            <div style="display: flex; gap: var(--space-sm);">
                <button class="btn btn-secondary btn-sm" onclick="event.stopPropagation(); openJobModal(${job.id})">
                    Voir détails
                </button>
                <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); prepareApplication(${job.id})">
                    Postuler
                </button>
            </div>
        </div>
    `;

    return card;
}

function updateResultsCount(count) {
    document.getElementById('results-count').textContent = count;
}

function openJobModal(jobId) {
    const job = getJobById(jobId);
    if (!job) return;

    const modal = document.getElementById('job-modal');
    const title = document.getElementById('modal-job-title');
    const content = document.getElementById('modal-job-content');

    title.textContent = job.title;

    const compatibilityClass =
        job.compatibility >= 85 ? 'score-high' :
            job.compatibility >= 70 ? 'score-medium' : 'score-low';

    content.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: var(--space-xl);">
            <div>
                <h3 style="color: var(--color-text-secondary); font-size: 1.125rem; margin-bottom: var(--space-sm);">
                    ${job.company}
                </h3>
                <div style="display: flex; flex-wrap: wrap; gap: var(--space-md); margin-bottom: var(--space-lg);">
                    <div class="job-detail">
                        <span class="job-detail-icon">📍</span>
                        <span>${job.location}</span>
                    </div>
                    <div class="job-detail">
                        <span class="job-detail-icon">💼</span>
                        <span>${job.contractType}</span>
                    </div>
                    ${job.salary ? `
                        <div class="job-detail">
                            <span class="job-detail-icon">💰</span>
                            <span>${job.salary}</span>
                        </div>
                    ` : ''}
                    <div class="job-detail">
                        <span class="job-detail-icon">🌐</span>
                        <span>${job.source}</span>
                    </div>
                </div>
            </div>
            <div class="compatibility-score">
                <div class="score-circle ${compatibilityClass}" style="width: 64px; height: 64px; font-size: 1.125rem;">
                    ${job.compatibility}%
                </div>
            </div>
        </div>
        
        <div style="margin-bottom: var(--space-xl);">
            <h4 style="margin-bottom: var(--space-md); color: var(--color-text-primary);">Description du poste</h4>
            <p style="color: var(--color-text-secondary); line-height: 1.8;">
                ${job.description}
            </p>
        </div>
        
        <div style="margin-bottom: var(--space-xl);">
            <h4 style="margin-bottom: var(--space-md); color: var(--color-text-primary);">Compétences requises</h4>
            <div style="display: flex; flex-wrap: wrap; gap: var(--space-sm);">
                ${job.skills.map(skill => `
                    <span style="background: var(--gradient-primary); padding: var(--space-sm) var(--space-lg); border-radius: var(--radius-full); font-size: 0.875rem; font-weight: 600;">
                        ${skill}
                    </span>
                `).join('')}
            </div>
        </div>
        
        <div style="display: flex; gap: var(--space-md); padding-top: var(--space-xl); border-top: 1px solid var(--glass-border);">
            <button class="btn btn-secondary" onclick="closeJobModal()">
                Fermer
            </button>
            <button class="btn btn-primary" onclick="prepareApplication(${job.id})" style="flex: 1;">
                Préparer ma candidature
            </button>
        </div>
    `;

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeJobModal() {
    const modal = document.getElementById('job-modal');
    modal.classList.add('hidden');
    document.body.style.overflow = '';
}

function prepareApplication(jobId) {
    // Check if application already exists
    const existingApp = mockData.applications.find(app => app.jobId === jobId);

    if (existingApp) {
        alert('Une candidature existe déjà pour cette offre !');
        window.location.href = `application-review.html?id=${existingApp.id}`;
        return;
    }

    // Create new draft application
    const newApp = {
        id: mockData.applications.length + 1,
        jobId: jobId,
        status: 'draft',
        createdDate: new Date().toISOString().split('T')[0],
        sentDate: null,
        responseDate: null,
        coverLetter: '',
        customEmail: '',
        notes: ''
    };

    mockData.applications.push(newApp);

    alert('Candidature créée ! Redirection vers la page de préparation...');
    window.location.href = `application-review.html?id=${newApp.id}`;
}
