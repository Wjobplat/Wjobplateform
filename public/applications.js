// Applications - Multi-Step Wizard
let currentStep = 1;
let maxStep = 1;
let selectedFile = null;
let analysisData = null;
let searchResults = [];
let selectedJobs = new Set();

document.addEventListener('DOMContentLoaded', () => {
    setupFileUpload();
});

// =============================================
// STEP NAVIGATION
// =============================================
function goToStep(step) {
    if (step > maxStep) return; // Can't skip forward beyond completed

    currentStep = step;

    // Update wizard indicators
    document.querySelectorAll('.step-wizard-item').forEach(item => {
        const s = parseInt(item.dataset.step);
        item.classList.remove('active', 'completed');
        if (s === currentStep) item.classList.add('active');
        else if (s < currentStep) item.classList.add('completed');
    });

    // Update connectors
    document.querySelectorAll('.step-wizard-connector').forEach((c, i) => {
        c.classList.toggle('active', i + 1 < currentStep);
    });

    // Show correct panel with animation
    document.querySelectorAll('.step-panel').forEach(p => p.classList.remove('active'));
    const panel = document.getElementById(`step-${step}`);
    panel.classList.add('active');
    // Re-trigger animation
    panel.style.animation = 'none';
    panel.offsetHeight; // Force reflow
    panel.style.animation = '';
}

// =============================================
// STEP 1: FILE UPLOAD
// =============================================
function setupFileUpload() {
    const dropzone = document.getElementById('cv-upload-area');
    const input = document.getElementById('cv-file-input');
    const startBtn = document.getElementById('start-analysis-btn');
    const removeBtn = document.getElementById('remove-file-btn');

    if (!dropzone || !input) return;

    // Handle Dropzone Click
    dropzone.addEventListener('click', (e) => {
        // If clicking a button, do nothing (let button's listener handle it)
        if (e.target.closest('button')) {
            return;
        }

        // If a file is already selected, don't trigger file picker
        if (selectedFile) {
            return;
        }

        input.click();
    });

    // Handle Drag & Drop
    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (selectedFile) return;
        dropzone.classList.add('dragover');
    });

    dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));

    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        if (selectedFile) return;
        if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
    });

    // Handle File Selection (Standard Input)
    input.addEventListener('change', () => {
        if (input.files.length) handleFile(input.files[0]);
    });

    // Handle Buttons
    if (startBtn) {
        startBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            startAnalysis();
        };
    }

    if (removeBtn) {
        removeBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            removeFile();
        };
    }
}

function handleFile(file) {
    if (file.type !== 'application/pdf') {
        showToast('Veuillez sélectionner un fichier PDF', 'error');
        return;
    }
    if (file.size > 10 * 1024 * 1024) {
        showToast('Le fichier doit faire moins de 10 MB', 'error');
        return;
    }
    selectedFile = file;
    document.getElementById('dropzone-content').classList.add('hidden');
    document.getElementById('file-preview').classList.remove('hidden');
    document.getElementById('file-name').textContent = file.name;
    document.getElementById('file-size').textContent = (file.size / 1024 / 1024).toFixed(2) + ' MB';
}

function removeFile() {
    selectedFile = null;
    document.getElementById('cv-file-input').value = '';
    document.getElementById('file-preview').classList.add('hidden');
    document.getElementById('dropzone-content').classList.remove('hidden');
}

// =============================================
// STEP 2: AI ANALYSIS
// =============================================
async function startAnalysis() {
    if (!selectedFile) return;

    maxStep = 2;
    goToStep(2);

    // Show loading
    document.getElementById('analysis-loading').classList.remove('hidden');
    document.getElementById('analysis-results').classList.add('hidden');

    const bar = document.getElementById('analysis-bar');
    const statusText = document.getElementById('analysis-status-text');

    // Animated progress steps
    const steps = [
        { text: 'Lecture du CV...', progress: 20 },
        { text: 'Extraction des compétences...', progress: 45 },
        { text: 'Analyse du profil...', progress: 70 },
        { text: 'Génération du résumé...', progress: 90 },
    ];

    for (const step of steps) {
        statusText.textContent = step.text;
        bar.style.width = step.progress + '%';
        await delay(600);
    }

    try {
        const formData = new FormData();
        formData.append('cv', selectedFile);
        const res = await API.analyzeCV(formData);

        bar.style.width = '100%';
        statusText.textContent = 'Terminé !';
        await delay(400);

        if (res.success) {
            analysisData = res;
            displayAnalysis(res);
            maxStep = 3;
        }
    } catch (e) {
        console.error(e);
        showToast('Erreur lors de l\'analyse', 'error');
        goToStep(1);
    }
}

function displayAnalysis(data) {
    document.getElementById('analysis-loading').classList.add('hidden');
    document.getElementById('analysis-results').classList.remove('hidden');

    const profile = document.getElementById('ai-profile');
    profile.innerHTML = `
        <div style="background: rgba(99, 102, 241, 0.08); border: 1px solid rgba(99, 102, 241, 0.2); border-radius: var(--radius-lg); padding: var(--space-xl); margin-bottom: var(--space-lg);">
            <h4 style="margin-bottom: var(--space-md); color: var(--color-primary-light); display:flex; align-items:center; gap:0.4rem;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg> Profil détecté</h4>
            <p style="line-height: 1.8;">${data.analysis}</p>
        </div>
        <div>
            <h4 style="margin-bottom: var(--space-md); display:flex; align-items:center; gap:0.4rem;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="22" y1="12" x2="18" y2="12"></line><line x1="6" y1="12" x2="2" y2="12"></line><line x1="12" y1="6" x2="12" y2="2"></line><line x1="12" y1="22" x2="12" y2="18"></line></svg> Compétences identifiées</h4>
            <div style="display: flex; flex-wrap: wrap; gap: var(--space-sm);">
                ${data.recommendations.map(r => `<span class="skill-tag">${r}</span>`).join('')}
            </div>
        </div>
    `;
}

// =============================================
// STEP 3: SEARCH RESULTS
// =============================================
async function startSearch() {
    goToStep(3);

    document.getElementById('search-loading').classList.remove('hidden');
    document.getElementById('search-results').classList.add('hidden');

    try {
        // Fetch real jobs from Supabase
        const jobs = await API.getJobs();
        let recruiters = [];
        try { recruiters = await API.getRecruiters(); } catch (e) { /* table may not exist */ }

        // Map jobs to the format expected by the UI
        searchResults = jobs.map((job, i) => {
            // Try to find a matching recruiter by company name
            const recruiter = recruiters.find(r => r.company && job.company && r.company.toLowerCase() === job.company.toLowerCase())
                || { name: 'Recruteur', email: 'contact@' + (job.company || 'entreprise').toLowerCase().replace(/\s+/g, '') + '.com', linkedin: '' };

            return {
                id: job.id,
                title: job.title,
                company: job.company,
                location: job.location || 'Non spécifié',
                contract: job.contract_type || 'CDI',
                description: job.description || 'Aucune description disponible.',
                recruiter: { name: recruiter.name, email: recruiter.email, linkedin: recruiter.linkedin || '' },
                strengths: (job.skills || []).slice(0, 3).map(s => typeof s === 'string' ? s : s.name || s),
                weaknesses: []
            };
        });

        document.getElementById('search-loading').classList.add('hidden');
        document.getElementById('search-results').classList.remove('hidden');

        if (searchResults.length === 0) {
            document.getElementById('results-count').textContent = 'Aucun emploi trouvé. Ajoutez des offres dans l\'onglet Emplois.';
        } else {
            document.getElementById('results-count').textContent = `${searchResults.length} résultat(s) trouvé(s)`;
        }

        renderResults();
    } catch (e) {
        console.error('Search error:', e);
        showToast('Erreur lors de la recherche', 'error');
        document.getElementById('search-loading').classList.add('hidden');
        document.getElementById('search-results').classList.remove('hidden');
        document.getElementById('results-count').textContent = 'Erreur de chargement des offres.';
    }
}

function renderResults() {
    const grid = document.getElementById('results-grid');
    grid.innerHTML = '';

    searchResults.forEach((job, i) => {
        const card = document.createElement('div');
        card.className = `result-card ${selectedJobs.has(job.id) ? 'selected' : ''}`;
        card.style.opacity = '0';
        card.onclick = () => toggleJobSelection(job.id);

        card.innerHTML = `
            <div style="margin-bottom: var(--space-lg);">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--space-sm);">
                    <div>
                        <div style="color: var(--color-text-secondary); font-size: 0.82rem; font-weight: 600;">${job.company}</div>
                        <div style="font-size: 1.1rem; font-weight: 700;">${job.title}</div>
                    </div>
                    <span class="badge badge-sent">${job.contract}</span>
                </div>
                <div style="display: flex; gap: var(--space-md); color: var(--color-text-secondary); font-size: 0.82rem; margin-bottom: var(--space-md);">
                    <span>📍 ${job.location}</span>
                </div>
                <p style="color: var(--color-text-secondary); font-size: 0.85rem; line-height: 1.6; margin-bottom: var(--space-md);">${job.description}</p>
            </div>

            <div style="margin-bottom: var(--space-lg);">
                <div style="margin-bottom: var(--space-sm);">
                    ${job.strengths.map(s => `<span class="result-tag tag-strength">✓ ${s}</span>`).join('')}
                </div>
                <div>
                    ${job.weaknesses.map(w => `<span class="result-tag tag-weakness">⚠ ${w}</span>`).join('')}
                </div>
            </div>

            <div style="padding-top: var(--space-md); border-top: 1px solid var(--glass-border); display: flex; align-items: center; gap: var(--space-md);">
                <div style="width: 36px; height: 36px; border-radius: 50%; background: var(--gradient-primary); display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 0.8rem;">${job.recruiter.name.charAt(0)}</div>
                <div>
                    <div style="font-weight: 600; font-size: 0.85rem;">${job.recruiter.name}</div>
                    <div style="color: var(--color-text-muted); font-size: 0.75rem;">${job.recruiter.email}</div>
                </div>
            </div>
        `;

        grid.appendChild(card);

        // Stagger animation
        setTimeout(() => {
            card.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
            card.style.opacity = '1';
        }, i * 100);
    });
}

function toggleJobSelection(id) {
    if (selectedJobs.has(id)) {
        selectedJobs.delete(id);
    } else {
        selectedJobs.add(id);
    }

    // Update card visuals
    document.querySelectorAll('.result-card').forEach((card, i) => {
        card.classList.toggle('selected', selectedJobs.has(searchResults[i].id));
    });

    // Update button
    const count = selectedJobs.size;
    document.getElementById('selected-count').textContent = count;
    document.getElementById('apply-selected-btn').disabled = count === 0;
}

// =============================================
// STEP 4: APPLY
// =============================================
async function generateEmails() {
    const container = document.getElementById('email-drafts');
    container.innerHTML = '';

    const selected = searchResults.filter(j => selectedJobs.has(j.id));

    for (const [i, job] of selected.entries()) {
        const wrapper = document.createElement('div');
        wrapper.className = 'card';
        wrapper.style.marginBottom = 'var(--space-lg)';
        wrapper.style.opacity = '0';
        wrapper.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-lg);">
                <div>
                    <div style="font-weight: 700;">${job.title}</div>
                    <div style="color: var(--color-text-secondary); font-size: 0.85rem;">${job.company} — ${job.recruiter.name}</div>
                </div>
                <span class="badge badge-pending">Brouillon</span>
            </div>
            <div id="email-content-${job.id}" style="background: var(--color-bg-tertiary); padding: var(--space-lg); border-radius: var(--radius-md); font-size: 0.9rem; line-height: 1.7; white-space: pre-wrap; margin-bottom: var(--space-md);">
                Génération en cours...
            </div>
            <div style="display: flex; gap: var(--space-sm); justify-content: flex-end;">
                <button class="btn btn-secondary btn-sm" onclick="editEmail(${job.id})">Modifier</button>
                <button class="btn btn-primary btn-sm" onclick="sendSingleApplication(${job.id})">Envoyer</button>
            </div>
        `;
        container.appendChild(wrapper);

        setTimeout(() => {
            wrapper.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
            wrapper.style.opacity = '1';
        }, i * 150);

        // Generate email with mock AI
        try {
            const res = await API.generateAiEmail({ job });
            document.getElementById(`email-content-${job.id}`).textContent = res.email;
        } catch (e) {
            document.getElementById(`email-content-${job.id}`).textContent = 'Erreur de génération.';
        }
    }
}

// Navigate to step 4 and generate
const originalGoToStep = goToStep;
// Override: when going to step 4, also generate emails
const _goToStep = goToStep;
goToStep = function (step) {
    _goToStep(step);
    if (step === 4) {
        maxStep = 4;
        generateEmails();
    }
};

function editEmail(jobId) {
    const el = document.getElementById(`email-content-${jobId}`);
    const currentText = el.textContent;
    el.innerHTML = `<textarea style="width:100%; min-height: 200px; background: transparent; border: 1px solid var(--glass-border); border-radius: var(--radius-md); padding: var(--space-md); color: var(--color-text-primary); font-family: var(--font-sans); font-size: 0.9rem; resize: vertical;" onblur="this.parentElement.textContent = this.value">${currentText}</textarea>`;
    el.querySelector('textarea').focus();
}

async function sendSingleApplication(jobId) {
    const job = searchResults.find(j => j.id === jobId);
    if (!job) return;

    try {
        const emailEl = document.getElementById(`email-content-${jobId}`);
        const emailText = emailEl?.textContent || '';

        await API.createApplication({
            job_id: job.id,
            status: 'sent',
            custom_email: emailText,
            sent_date: new Date().toISOString().slice(0, 10)
        });

        showToast(`Candidature envoyée pour ${job.title}`, 'success');
    } catch (e) {
        console.error('Send error:', e);
        showToast('Erreur lors de l\'envoi', 'error');
    }
}

async function sendAllApplications() {
    const count = selectedJobs.size;
    let sent = 0;

    for (const jobId of selectedJobs) {
        const job = searchResults.find(j => j.id === jobId);
        if (!job) continue;

        try {
            const emailEl = document.getElementById(`email-content-${jobId}`);
            const emailText = emailEl?.textContent || '';

            await API.createApplication({
                job_id: job.id,
                status: 'sent',
                custom_email: emailText,
                sent_date: new Date().toISOString().slice(0, 10)
            });
            sent++;
        } catch (e) {
            console.error(`Error sending application for job ${jobId}:`, e);
        }
    }

    showToast(`${sent}/${count} candidature(s) envoyée(s) avec succès !`, 'success');
    setTimeout(() => {
        window.location.href = 'candidatures.html';
    }, 2000);
}

// =============================================
// UTILITY
// =============================================
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
