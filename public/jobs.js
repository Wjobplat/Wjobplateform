// Jobs page - API-powered
let allJobs = [];

document.addEventListener('DOMContentLoaded', async function () {
    try {
        allJobs = await API.getJobs();
        renderJobs(allJobs);
        setupFilters();
    } catch (e) {
        showToast('Erreur de chargement des offres', 'error');
    }
});

function renderJobs(jobs) {
    const grid = document.getElementById('job-grid');
    const count = document.getElementById('results-count');
    if (!grid) return;
    count.textContent = jobs.length;
    grid.innerHTML = '';
    jobs.forEach((job, i) => {
        const scoreClass = job.compatibility >= 85 ? 'score-high' : job.compatibility >= 70 ? 'score-medium' : 'score-low';
        const card = document.createElement('div');
        card.className = 'job-card';
        card.style.animationDelay = `${i * 60}ms`;
        card.style.opacity = '0';
        card.innerHTML = `
            <div class="job-card-header">
                <div>
                    <div class="job-company">${job.company}</div>
                    <div class="job-title">${job.title}</div>
                </div>
                <div class="score-circle ${scoreClass}">${job.compatibility}%</div>
            </div>
            <div class="job-details">
                <div class="job-detail">📍 ${job.location}</div>
                <div class="job-detail">📄 ${job.contractType}</div>
                <div class="job-detail">💰 ${job.salary}</div>
            </div>
            <div class="job-description">${job.description}</div>
            <div style="margin-bottom: var(--space-md);">
                ${job.skills.map(s => `<span class="skill-tag">${s}</span>`).join('')}
            </div>
            <div class="job-footer">
                <span style="color: var(--color-text-muted); font-size: 0.8rem;">${formatDate(job.postedDate)}</span>
                <button class="btn btn-primary btn-sm" onclick="openJobModal(${job.id})">Voir détails</button>
            </div>
        `;
        grid.appendChild(card);
        setTimeout(() => {
            card.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
            card.style.opacity = '1';
        }, i * 60);
    });
}

function setupFilters() {
    ['filter-search', 'filter-location', 'filter-contract', 'filter-compatibility', 'sort-by'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener(id === 'filter-search' ? 'input' : 'change', applyFilters);
    });
}

function applyFilters() {
    let jobs = [...allJobs];
    const search = document.getElementById('filter-search')?.value.toLowerCase() || '';
    const location = document.getElementById('filter-location')?.value || '';
    const contract = document.getElementById('filter-contract')?.value || '';
    const compat = parseInt(document.getElementById('filter-compatibility')?.value || '0');

    if (search) jobs = jobs.filter(j => j.title.toLowerCase().includes(search) || j.company.toLowerCase().includes(search) || j.skills.some(s => s.toLowerCase().includes(search)));
    if (location) jobs = jobs.filter(j => j.location.toLowerCase().includes(location));
    if (contract) jobs = jobs.filter(j => j.contractType === contract);
    if (compat) jobs = jobs.filter(j => j.compatibility >= compat);

    const sort = document.getElementById('sort-by')?.value || 'compatibility';
    if (sort === 'compatibility') jobs.sort((a, b) => b.compatibility - a.compatibility);
    else if (sort === 'date') jobs.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
    else if (sort === 'company') jobs.sort((a, b) => a.company.localeCompare(b.company));

    renderJobs(jobs);
}

function resetFilters() {
    ['filter-search'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    ['filter-location', 'filter-contract'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    document.getElementById('filter-compatibility').value = '0';
    renderJobs(allJobs);
}

function openJobModal(jobId) {
    const job = allJobs.find(j => j.id === jobId);
    if (!job) return;
    document.getElementById('modal-job-title').textContent = job.title;
    document.getElementById('modal-job-content').innerHTML = `
        <div style="margin-bottom: var(--space-xl);">
            <div style="color: var(--color-text-secondary); margin-bottom: var(--space-sm);">${job.company}</div>
            <div style="display: flex; flex-wrap: wrap; gap: var(--space-md); margin-bottom: var(--space-lg);">
                <span class="job-detail">📍 ${job.location}</span>
                <span class="job-detail">📄 ${job.contractType}</span>
                <span class="job-detail">💰 ${job.salary}</span>
                <span class="job-detail">📡 ${job.source}</span>
            </div>
            <p style="color: var(--color-text-secondary); line-height: 1.8; margin-bottom: var(--space-lg);">${job.description}</p>
            <div style="margin-bottom: var(--space-lg);">
                <strong>Compétences :</strong><br>
                <div style="margin-top: var(--space-sm);">
                    ${job.skills.map(s => `<span class="skill-tag">${s}</span>`).join('')}
                </div>
            </div>
            <div class="compatibility-score" style="margin-bottom: var(--space-lg);">
                <div class="score-circle ${job.compatibility >= 85 ? 'score-high' : job.compatibility >= 70 ? 'score-medium' : 'score-low'}">${job.compatibility}%</div>
                <span style="color: var(--color-text-secondary);">Compatibilité</span>
            </div>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-md);">
            <button class="btn btn-danger btn-lg" onclick="deleteJob(${job.id})">Supprimer l'offre</button>
            <button class="btn btn-primary btn-lg" onclick="postulerToJob(${job.id})">Postuler à cette offre</button>
        </div>
    `;
    document.getElementById('job-modal').classList.remove('hidden');
}

async function deleteJob(jobId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette offre ? Cette action est irréversible et supprimera toutes les candidatures associées.')) return;

    const originalText = document.querySelector('.btn-danger').innerText;
    document.querySelector('.btn-danger').innerText = 'Suppression...';

    try {
        await API.deleteJob(jobId);
        showToast('Offre supprimée avec succès', 'success');
        closeJobModal();
        // Refresh list
        allJobs = await API.getJobs();
        renderJobs(allJobs);
    } catch (e) {
        console.error(e);
        showToast('Erreur lors de la suppression', 'error');
        document.querySelector('.btn-danger').innerText = originalText;
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
