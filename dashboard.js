// Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function () {
    initializeDashboard();
});

function initializeDashboard() {
    // Load statistics
    loadKPIs();

    // Load activity timeline
    loadActivityTimeline();

    // Load application status counts
    loadApplicationStatus();

    // Add animation delays to cards
    animateCards();
}

function loadKPIs() {
    const stats = getStats();

    // Animate numbers counting up
    animateValue('kpi-offers', 0, stats.totalJobs, 1000);
    animateValue('kpi-companies', 0, stats.totalCompanies, 1000);
    animateValue('kpi-recruiters', 0, stats.totalRecruiters, 1000);
    animateValue('kpi-applications', 0, stats.totalApplications, 1000);
}

function loadActivityTimeline() {
    const timeline = document.getElementById('activity-timeline');

    mockData.activityTimeline.forEach((activity, index) => {
        const item = document.createElement('div');
        item.className = 'timeline-item';
        item.style.animationDelay = `${index * 100}ms`;

        item.innerHTML = `
            <div class="timeline-date">${formatDateTime(activity.date, activity.time)}</div>
            <div class="timeline-title">${activity.title}</div>
            <div class="timeline-content">${activity.description}</div>
        `;

        timeline.appendChild(item);
    });
}

function loadApplicationStatus() {
    const stats = getStats();

    animateValue('status-draft', 0, stats.draftCount, 800);
    animateValue('status-pending', 0, stats.pendingCount, 800);
    animateValue('status-sent', 0, stats.sentCount, 800);
    animateValue('status-responded', 0, stats.respondedCount, 800);
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

function animateCards() {
    const cards = document.querySelectorAll('.kpi-card, .card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';

        setTimeout(() => {
            card.style.transition = 'all 0.5s ease-out';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}
