// Application Review - API-powered
let currentApp = null;

document.addEventListener('DOMContentLoaded', async function () {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id'));

    // Register listener here so it works for ALL flows (new & existing)
    document.getElementById('cv-upload').addEventListener('change', handleCvUpload);

    // NEW: Check for job passed via "Postuler" button if no ID
    if (!id) {
        const jobData = localStorage.getItem('jobToApply');
        if (jobData) {
            const job = JSON.parse(jobData);
            renderJobReview(job);
            return;
        }
        window.location.href = 'applications.html';
        return;
    }

    try {
        const apps = await API.getApplications();
        currentApp = apps.find(a => a.id === id);
        if (!currentApp) { showToast('Candidature introuvable', 'error'); return; }
        renderReview();
    } catch (e) {
        showToast('Erreur de chargement', 'error');
    }
});

function renderJobReview(job) {
    document.getElementById('page-title').textContent = `Candidature : ${job.title}`;
    document.getElementById('page-subtitle').textContent = job.company;

    document.getElementById('job-info-card').innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: start; flex-wrap: wrap; gap: var(--space-md);">
            <div>
                <h3 style="font-weight: 700; margin-bottom: var(--space-xs);">${job.title}</h3>
                <p style="color: var(--color-text-secondary);">${job.company} · ${job.location}</p>
            </div>
            <span class="badge badge-draft">Nouvelle</span>
        </div>
        <div style="margin-top: var(--space-md);">
            ${job.skills.map(s => `<span class="skill-tag">${s}</span>`).join('')}
        </div>
    `;

    // Initialize empty state for new application
    currentApp = {
        job: job,
        status: 'draft',
        customEmail: `Madame, Monsieur,\n\nJe souhaite postuler au poste de ${job.title} chez ${job.company}.`,
        coverLetter: '',
        notes: ''
    };

    // Pre-fill textareas
    document.getElementById('email-textarea').value = currentApp.customEmail;
    document.getElementById('email-preview').innerHTML = `<p style="white-space: pre-wrap; line-height: 1.8;">${currentApp.customEmail}</p>`;

    // Hide CV section or show upload prompt since it's new
    document.getElementById('cv-display').innerHTML = '<div style="color: var(--color-text-muted);">Veuillez téléverser un CV pour cette candidature.</div>';
}

function renderReview() {
    const job = currentApp.job || {};
    document.getElementById('page-title').textContent = job.title || 'Candidature';
    document.getElementById('page-subtitle').textContent = job.company || '';

    document.getElementById('job-info-card').innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: start; flex-wrap: wrap; gap: var(--space-md);">
            <div>
                <h3 style="font-weight: 700; margin-bottom: var(--space-xs);">${job.title || 'Poste'}</h3>
                <p style="color: var(--color-text-secondary);">${job.company || ''} ${job.location ? '· ' + job.location : ''}</p>
            </div>
            <span class="badge badge-${currentApp.status}">${currentApp.status}</span>
        </div>
        </div>
    `;

    const cvSection = document.getElementById('cv-display');
    const uploadWrapper = document.querySelector('.file-upload-wrapper');
    if (currentApp.cv_path) {
        uploadWrapper.style.display = 'none';
        cvSection.innerHTML = `
            <div style="display: flex; align-items: center; gap: var(--space-md); padding: var(--space-md); background: var(--color-bg-tertiary); border-radius: var(--radius-md); border: 1px solid var(--glass-border);">
                <span style="font-size: 1.5rem;">📄</span>
                <div style="flex: 1;">
                    <div style="font-weight: 600; font-size: 0.9rem;">CV.pdf</div>
                    <div style="color: var(--color-text-muted); font-size: 0.8rem;">Document joint</div>
                </div>
                <button onclick="downloadCV()" class="btn btn-secondary btn-sm">⬇️ Télécharger</button>
            </div>
        `;
    } else {
        uploadWrapper.style.display = 'block';
        cvSection.innerHTML = '<div style="color: var(--color-text-muted); font-style: italic;">Aucun CV joint</div>';
    }

    document.getElementById('email-preview').innerHTML = `<p style="white-space: pre-wrap; line-height: 1.8;">${currentApp.customEmail || '<em style="color: var(--color-text-muted);">Aucun email rédigé</em>'}</p>`;
    document.getElementById('email-textarea').value = currentApp.customEmail || '';
    document.getElementById('cover-preview').innerHTML = `<p style="white-space: pre-wrap; line-height: 1.8;">${currentApp.coverLetter || '<em style="color: var(--color-text-muted);">Aucune lettre de motivation</em>'}</p>`;
    document.getElementById('cover-textarea').value = currentApp.coverLetter || '';
    document.getElementById('notes-textarea').value = currentApp.notes || '';
}

function toggleEdit(type) {
    document.getElementById(`${type}-preview`).classList.toggle('hidden');
    document.getElementById(`${type}-edit`).classList.toggle('hidden');
}

function cancelEdit(type) {
    document.getElementById(`${type}-preview`).classList.remove('hidden');
    document.getElementById(`${type}-edit`).classList.add('hidden');
}

async function saveEdit(type) {
    const field = type === 'email' ? 'customEmail' : 'coverLetter';
    const value = document.getElementById(`${type}-textarea`).value;
    try {
        await API.updateApplication(currentApp.id, { [field]: value });
        currentApp[field] = value;
        renderReview();
        cancelEdit(type);
        showToast('Modification enregistrée', 'success');
    } catch (e) { showToast('Erreur de sauvegarde', 'error'); }
}

async function saveDraft() {
    const notes = document.getElementById('notes-textarea').value;
    try {
        if (!currentApp.id) {
            // Create new
            const res = await API.createApplication({
                jobId: currentApp.job.id,
                status: 'draft',
                customEmail: currentApp.customEmail,
                notes: notes
            });
            currentApp.id = res.id;
            currentApp.status = 'draft';
            currentApp.notes = notes;
            renderReview();
            showToast('Brouillon créé', 'success');
        } else {
            // Update existing
            await API.updateApplication(currentApp.id, { notes, status: 'draft' });
            showToast('Brouillon enregistré', 'success');
        }
    } catch (e) { console.error(e); showToast('Erreur', 'error'); }
}

async function markAsPending() {
    try {
        await API.updateApplicationStatus(currentApp.id, 'pending');
        showToast('Candidature marquée en attente', 'info');
        setTimeout(() => window.location.href = 'applications.html', 1000);
    } catch (e) { showToast('Erreur', 'error'); }
}

async function approveAndSend() {
    if (!confirm('Confirmer l\'envoi de cette candidature ?')) return;
    try {
        if (!currentApp.id) {
            // Create and send
            const res = await API.createApplication({
                jobId: currentApp.job.id,
                status: 'sent',
                customEmail: currentApp.customEmail,
                notes: currentApp.notes
            });
            currentApp.id = res.id;
        } else {
            // Update status
            await API.updateApplicationStatus(currentApp.id, 'sent');
        }
        showToast('Candidature approuvée et envoyée !', 'success');
        setTimeout(() => window.location.href = 'applications.html', 1500);
    } catch (e) { console.error(e); showToast('Erreur', 'error'); }
}

async function markAsToModify() {
    try {
        await API.updateApplicationStatus(currentApp.id, 'to_modify');
        showToast('Marqué comme à modifier', 'info');
        currentApp.status = 'to_modify';
        renderReview();
    } catch (e) { showToast('Erreur', 'error'); }
}

async function handleCvUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    // If this is a brand-new application (no ID yet), save the draft first
    if (!currentApp.id) {
        try {
            const res = await API.createApplication({
                jobId: currentApp.job.id,
                status: 'draft',
                customEmail: currentApp.customEmail,
                notes: ''
            });
            currentApp.id = res.id;
            currentApp.status = 'draft';
            showToast('Brouillon créé automatiquement', 'info');
        } catch (err) {
            showToast('Erreur: sauvegardez le brouillon avant de téléverser un CV', 'error');
            return;
        }
    }

    const formData = new FormData();
    formData.append('cv', file);

    try {
        await API.uploadCV(currentApp.id, formData);
        showToast('CV téléversé avec succès', 'success');
        // Refresh app data to show the new file
        const apps = await API.getApplications();
        currentApp = apps.find(a => a.id === currentApp.id);
        renderReview();
    } catch (err) {
        console.error('Upload failed:', err);
        showToast(`Erreur : ${err.message || 'Téléversement échoué'}`, 'error');
    }
}

async function downloadCV() {
    try {
        const { data, error } = await supabase.storage
            .from('cvs')
            .createSignedUrl(currentApp.cv_path, 60);
        if (error) throw error;
        window.open(data.signedUrl, '_blank');
    } catch (e) {
        showToast('Erreur de téléchargement du CV', 'error');
    }
}

async function generateAiEmail() {
    const btn = document.querySelector('.btn-ai');
    if (!btn) return;
    const originalText = btn.innerHTML;
    try {
        btn.innerHTML = '🤖 Génération...';
        btn.disabled = true;

        const result = await API.generateAiEmail({
            jobId: currentApp.job.id, // Ensure we access jobId correctly from job object or app
            applicationId: currentApp.id
        });

        if (result.email) {
            document.getElementById('email-textarea').value = result.email;
            document.getElementById('email-preview').innerHTML = `<p style="white-space: pre-wrap; line-height: 1.8;">${result.email}</p>`;
            await API.updateApplication(currentApp.id, { customEmail: result.email });
            currentApp.customEmail = result.email;
            showToast('Email généré par l\'IA !', 'success');
        } else {
            showToast('Aucun résultat de l\'IA', 'warning');
        }
    } catch (err) {
        console.error(err);
        showToast('Erreur de génération IA', 'error');
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}
