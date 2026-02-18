// Application Review Page JavaScript

let currentApplication = null;
let currentJob = null;
let originalEmail = '';
let originalCover = '';

document.addEventListener('DOMContentLoaded', function () {
    initializeReviewPage();
});

function initializeReviewPage() {
    // Get application ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const appId = parseInt(urlParams.get('id'));

    if (!appId) {
        alert('ID de candidature manquant');
        window.location.href = 'applications.html';
        return;
    }

    // Load application data
    currentApplication = mockData.applications.find(app => app.id === appId);
    if (!currentApplication) {
        alert('Candidature non trouvée');
        window.location.href = 'applications.html';
        return;
    }

    currentJob = getJobById(currentApplication.jobId);
    if (!currentJob) {
        alert('Offre d\'emploi non trouvée');
        window.location.href = 'applications.html';
        return;
    }

    // Initialize page
    renderJobInfo();
    renderEmailPreview();
    renderCoverLetterPreview();
    loadNotes();

    // Generate default content if empty
    if (!currentApplication.customEmail) {
        generateDefaultEmail();
    }
    if (!currentApplication.coverLetter) {
        generateDefaultCoverLetter();
    }
}

function renderJobInfo() {
    const card = document.getElementById('job-info-card');

    const compatibilityClass =
        currentJob.compatibility >= 85 ? 'score-high' :
            currentJob.compatibility >= 70 ? 'score-medium' : 'score-low';

    card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: start;">
            <div>
                <h2 style="font-size: 1.5rem; font-weight: 700; margin-bottom: var(--space-sm);">
                    ${currentJob.title}
                </h2>
                <div style="color: var(--color-text-secondary); font-size: 1.125rem; margin-bottom: var(--space-md);">
                    ${currentJob.company}
                </div>
                <div style="display: flex; flex-wrap: wrap; gap: var(--space-md); color: var(--color-text-secondary);">
                    <div style="display: flex; align-items: center; gap: var(--space-xs);">
                        <span>📍</span>
                        <span>${currentJob.location}</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: var(--space-xs);">
                        <span>💼</span>
                        <span>${currentJob.contractType}</span>
                    </div>
                    ${currentJob.salary ? `
                        <div style="display: flex; align-items: center; gap: var(--space-xs);">
                            <span>💰</span>
                            <span>${currentJob.salary}</span>
                        </div>
                    ` : ''}
                </div>
            </div>
            <div class="compatibility-score">
                <div class="score-circle ${compatibilityClass}" style="width: 64px; height: 64px; font-size: 1.125rem;">
                    ${currentJob.compatibility}%
                </div>
            </div>
        </div>
    `;
}

function generateDefaultEmail() {
    const recruiter = mockData.recruiters.find(r => r.company === currentJob.company);
    const greeting = recruiter ? `Bonjour ${recruiter.name.split(' ')[0]},` : 'Madame, Monsieur,';

    currentApplication.customEmail = `${greeting}

Je me permets de vous contacter concernant le poste de ${currentJob.title} au sein de ${currentJob.company}.

Avec mon expérience et mes compétences en ${currentJob.skills.slice(0, 3).join(', ')}, je suis convaincu(e) de pouvoir apporter une réelle valeur ajoutée à votre équipe.

Vous trouverez ci-joint mon CV ainsi qu'une lettre de motivation détaillant mon parcours et mes motivations pour ce poste.

Je reste à votre disposition pour échanger sur ma candidature lors d'un entretien.

Cordialement,
[Votre nom]`;

    originalEmail = currentApplication.customEmail;
}

function generateDefaultCoverLetter() {
    currentApplication.coverLetter = `Madame, Monsieur,

Actuellement à la recherche de nouvelles opportunités professionnelles, je me permets de vous adresser ma candidature pour le poste de ${currentJob.title} au sein de ${currentJob.company}.

Votre offre a particulièrement retenu mon attention car elle correspond parfaitement à mon profil et à mes aspirations professionnelles. Les technologies mentionnées (${currentJob.skills.join(', ')}) font partie de mon expertise quotidienne.

Mon parcours professionnel m'a permis de développer des compétences solides en développement logiciel et en résolution de problèmes complexes. Je suis particulièrement attiré(e) par ${currentJob.company} pour [raison spécifique à personnaliser].

Rigoureux(se), autonome et doté(e) d'un excellent esprit d'équipe, je suis convaincu(e) de pouvoir contribuer efficacement aux projets de votre entreprise.

Je serais ravi(e) de vous rencontrer pour discuter plus en détail de ma candidature et de la manière dont je pourrais contribuer au succès de vos projets.

Dans cette attente, je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.

[Votre nom]`;

    originalCover = currentApplication.coverLetter;
}

function renderEmailPreview() {
    const preview = document.getElementById('email-preview');
    preview.innerHTML = `<pre style="white-space: pre-wrap; font-family: var(--font-sans); line-height: 1.8;">${currentApplication.customEmail || 'Aucun email rédigé'}</pre>`;

    document.getElementById('email-textarea').value = currentApplication.customEmail || '';
    originalEmail = currentApplication.customEmail || '';
}

function renderCoverLetterPreview() {
    const preview = document.getElementById('cover-preview');
    preview.innerHTML = `<pre style="white-space: pre-wrap; font-family: var(--font-sans); line-height: 1.8;">${currentApplication.coverLetter || 'Aucune lettre de motivation rédigée'}</pre>`;

    document.getElementById('cover-textarea').value = currentApplication.coverLetter || '';
    originalCover = currentApplication.coverLetter || '';
}

function loadNotes() {
    document.getElementById('notes-textarea').value = currentApplication.notes || '';
}

function toggleEdit(type) {
    const preview = document.getElementById(`${type}-preview`);
    const edit = document.getElementById(`${type}-edit`);

    preview.classList.toggle('hidden');
    edit.classList.toggle('hidden');
}

function saveEdit(type) {
    const textarea = document.getElementById(`${type}-textarea`);
    const newContent = textarea.value;

    if (type === 'email') {
        currentApplication.customEmail = newContent;
        renderEmailPreview();
    } else if (type === 'cover') {
        currentApplication.coverLetter = newContent;
        renderCoverLetterPreview();
    }

    toggleEdit(type);

    // Show success message
    showNotification('✅ Modifications enregistrées', 'success');
}

function cancelEdit(type) {
    if (type === 'email') {
        document.getElementById('email-textarea').value = currentApplication.customEmail || '';
    } else if (type === 'cover') {
        document.getElementById('cover-textarea').value = currentApplication.coverLetter || '';
    }

    toggleEdit(type);
}

function saveDraft() {
    // Save notes
    currentApplication.notes = document.getElementById('notes-textarea').value;
    currentApplication.status = 'draft';

    showNotification('💾 Brouillon enregistré', 'success');

    setTimeout(() => {
        window.location.href = 'applications.html';
    }, 1500);
}

function markAsPending() {
    if (!validateApplication()) {
        return;
    }

    // Save notes
    currentApplication.notes = document.getElementById('notes-textarea').value;
    currentApplication.status = 'pending';

    showNotification('⏳ Candidature marquée comme "En attente"', 'success');

    setTimeout(() => {
        window.location.href = 'applications.html';
    }, 1500);
}

function approveAndSend() {
    if (!validateApplication()) {
        return;
    }

    if (!confirm('⚠️ CONFIRMATION REQUISE\n\nÊtes-vous sûr(e) de vouloir envoyer cette candidature ?\n\nCette action marquera la candidature comme envoyée.')) {
        return;
    }

    // Save notes
    currentApplication.notes = document.getElementById('notes-textarea').value;

    // Update application status
    currentApplication.status = 'sent';
    currentApplication.sentDate = new Date().toISOString().split('T')[0];

    showNotification('✅ Candidature envoyée avec succès !', 'success');

    setTimeout(() => {
        window.location.href = 'applications.html';
    }, 2000);
}

function validateApplication() {
    if (!currentApplication.customEmail || currentApplication.customEmail.trim() === '') {
        alert('❌ L\'email de candidature est vide. Veuillez le rédiger avant de continuer.');
        return false;
    }

    if (!currentApplication.coverLetter || currentApplication.coverLetter.trim() === '') {
        alert('❌ La lettre de motivation est vide. Veuillez la rédiger avant de continuer.');
        return false;
    }

    return true;
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: var(--space-xl);
        right: var(--space-xl);
        background: var(--gradient-success);
        color: white;
        padding: var(--space-lg) var(--space-xl);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-xl);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        font-weight: 600;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}
