// Recruiters page - API-powered
document.addEventListener('DOMContentLoaded', async function () {
    const user = await requireAuth();
    if (!user) return;
    try {
        const recruiters = await API.getRecruiters();
        document.getElementById('total-recruiters').textContent = recruiters.length;
        const companies = new Set(recruiters.map(r => r.company)).size;
        document.getElementById('total-companies').textContent = companies;
        document.getElementById('total-contacts').textContent = recruiters.filter(r => r.email).length;
        if (recruiters.length > 0) renderRecruiters(recruiters);
    } catch (e) {
        // Table may not exist yet — silently show zeros
        console.warn('Recruiters not available:', e.message);
        document.getElementById('total-recruiters').textContent = '0';
        document.getElementById('total-companies').textContent = '0';
        document.getElementById('total-contacts').textContent = '0';
    }
});

function renderRecruiters(recruiters) {
    const container = document.getElementById('recruiters-container');
    if (!container) return;
    const grid = document.createElement('div');
    grid.className = 'job-grid';
    recruiters.forEach((r, i) => {
        const card = document.createElement('div');
        card.className = 'job-card';
        card.style.opacity = '0';
        card.innerHTML = `
            <div style="display: flex; align-items: center; gap: var(--space-lg); margin-bottom: var(--space-lg);">
                <div style="width: 48px; height: 48px; background: var(--gradient-primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex-shrink: 0;">
                    ${r.name.charAt(0)}
                </div>
                <div>
                    <div style="font-weight: 700; font-size: 1rem;">${r.name}</div>
                    <div style="color: var(--color-text-secondary); font-size: 0.85rem;">${r.position}</div>
                </div>
            </div>
            <div style="margin-bottom: var(--space-md);">
                <div class="job-detail" style="margin-bottom: var(--space-sm);">🏢 ${r.company}</div>
                <div class="job-detail" style="margin-bottom: var(--space-sm);">📧 ${r.email}</div>
                ${r.linkedin ? `<div class="job-detail">🔗 ${r.linkedin}</div>` : ''}
            </div>
        `;
        grid.appendChild(card);
        setTimeout(() => {
            card.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
            card.style.opacity = '1';
        }, i * 80);
    });
    container.appendChild(grid);
}
