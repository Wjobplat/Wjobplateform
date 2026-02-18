// Recruiters Page JavaScript

document.addEventListener('DOMContentLoaded', function () {
    initializeRecruitersPage();
});

function initializeRecruitersPage() {
    loadStats();
    renderRecruiters();
}

function loadStats() {
    const totalRecruiters = mockData.recruiters.length;
    const uniqueCompanies = new Set(mockData.recruiters.map(r => r.company)).size;
    const totalContacts = mockData.recruiters.filter(r => r.email).length;

    animateValue('total-recruiters', 0, totalRecruiters, 800);
    animateValue('total-companies', 0, uniqueCompanies, 800);
    animateValue('total-contacts', 0, totalContacts, 800);
}

function renderRecruiters() {
    const container = document.getElementById('recruiters-container');

    if (mockData.recruiters.length === 0) {
        container.innerHTML = `
            <div class="card" style="text-align: center; padding: var(--space-2xl);">
                <div style="font-size: 3rem; margin-bottom: var(--space-lg);">👥</div>
                <h3 style="margin-bottom: var(--space-sm); color: var(--color-text-primary);">
                    Aucun recruteur
                </h3>
                <p style="color: var(--color-text-secondary);">
                    Les recruteurs seront automatiquement identifiés lors de vos recherches d'emplois
                </p>
            </div>
        `;
        return;
    }

    container.innerHTML = mockData.recruiters.map((recruiter, index) => {
        return createRecruiterCard(recruiter, index);
    }).join('');
}

function createRecruiterCard(recruiter, index) {
    return `
        <div class="card fade-in" style="margin-bottom: var(--space-xl); animation-delay: ${index * 50}ms;">
            <div style="display: flex; gap: var(--space-xl);">
                <div style="width: 80px; height: 80px; background: var(--gradient-primary); border-radius: var(--radius-lg); display: flex; align-items: center; justify-content: center; font-size: 2rem; flex-shrink: 0;">
                    👤
                </div>
                
                <div style="flex: 1;">
                    <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: var(--space-xs);">
                        ${recruiter.name}
                    </h3>
                    <div style="color: var(--color-text-secondary); margin-bottom: var(--space-md);">
                        ${recruiter.position} chez ${recruiter.company}
                    </div>
                    
                    <div style="display: flex; flex-direction: column; gap: var(--space-sm);">
                        ${recruiter.email ? `
                            <div style="display: flex; align-items: center; gap: var(--space-sm); color: var(--color-text-secondary); font-size: 0.875rem;">
                                <span>📧</span>
                                <a href="mailto:${recruiter.email}" style="color: var(--color-primary); text-decoration: none;">
                                    ${recruiter.email}
                                </a>
                            </div>
                        ` : ''}
                        
                        ${recruiter.linkedin ? `
                            <div style="display: flex; align-items: center; gap: var(--space-sm); color: var(--color-text-secondary); font-size: 0.875rem;">
                                <span>🔗</span>
                                <a href="https://${recruiter.linkedin}" target="_blank" style="color: var(--color-primary); text-decoration: none;">
                                    LinkedIn
                                </a>
                            </div>
                        ` : ''}
                    </div>
                </div>
                
                <div style="display: flex; flex-direction: column; gap: var(--space-sm);">
                    <button class="btn btn-primary btn-sm" onclick="contactRecruiter('${recruiter.email}')">
                        📧 Contacter
                    </button>
                    <button class="btn btn-secondary btn-sm" onclick="viewCompanyJobs('${recruiter.company}')">
                        🔍 Voir les offres
                    </button>
                </div>
            </div>
        </div>
    `;
}

function animateValue(elementId, start, end, duration) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            element.textContent = end;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

function contactRecruiter(email) {
    if (email) {
        window.location.href = `mailto:${email}`;
    } else {
        alert('Email non disponible pour ce recruteur');
    }
}

function viewCompanyJobs(company) {
    // Redirect to jobs page with company filter
    window.location.href = `jobs.html?company=${encodeURIComponent(company)}`;
}
