// Applications - Multi-Step Wizard
let currentStep = 1;
let maxStep = 1;
let selectedFile = null;
let analysisData = null;
let searchResults = [];
let selectedJobs = new Set();

document.addEventListener('DOMContentLoaded', async () => {
    const user = await requireAuth();
    if (!user) return;
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
        if (e.target.closest('button')) return;
        if (selectedFile) return;
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
        showToast('Veuillez s\u00e9lectionner un fichier PDF', 'error');
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
// STEP 2: AI ANALYSIS (REAL PROGRESS)
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

    function setProgress(text, percent) {
        statusText.textContent = text;
        bar.style.width = percent + '%';
    }

    try {
        // Step 1: Prepare file
        setProgress('Pr\u00e9paration du fichier (' + (selectedFile.size / 1024).toFixed(0) + ' KB)...', 10);
        const formData = new FormData();
        formData.append('cv', selectedFile);

        // Step 2: Upload to Supabase + send to webhook
        setProgress('Upload du CV vers le serveur...', 25);

        const res = await API.analyzeCV(formData);

        // Step 3: Show real result
        if (res.profile && Object.keys(res.profile).length > 0) {
            setProgress('Analyse IA termin\u00e9e !', 100);
        } else {
            setProgress(res.analysis || 'Analyse termin\u00e9e', 100);
        }

        await delay(600);

        if (res.success) {
            analysisData = res;
            displayAnalysis(res);
            maxStep = 3;
        }
    } catch (e) {
        console.error('Analyse error:', e);
        setProgress('Erreur', 0);
        showToast("Erreur lors de l'analyse: " + (e.message || ''), 'error');
        goToStep(1);
    }
}

function displayAnalysis(data) {
    document.getElementById('analysis-loading').classList.add('hidden');
    document.getElementById('analysis-results').classList.remove('hidden');

    const profile = data.profile || {};
    const skills = profile.skills || data.recommendations || [];
    const languages = profile.languages || [];
    const jobTitles = profile.job_titles || [];
    const pEl = document.getElementById('ai-profile');

    const infoCards = [
        profile.education ? { label: 'FORMATION', value: profile.education } : null,
        languages.length > 0 ? { label: 'LANGUES', value: languages.join(', ') } : null,
        jobTitles.length > 0 ? { label: 'POSTES RECHERCH\u00c9S', value: jobTitles.join(', ') } : null
    ].filter(Boolean);

    pEl.innerHTML = `
        <div class="profile-box">
            <div class="profile-box-title">PROFIL</div>
            <p style="font-size:.88rem;line-height:1.8;color:var(--dim)">${profile.summary || data.analysis || 'CV analys\u00e9 avec succ\u00e8s.'}</p>
        </div>
        ${skills.length > 0 ? `
        <div class="profile-box">
            <div class="profile-box-title">COMP\u00c9TENCES</div>
            <div style="display:flex;flex-wrap:wrap;gap:.45rem">${skills.map(s => `<span style="background:rgba(16,185,129,.08);border:1px solid rgba(16,185,129,.2);color:var(--em-l);font-size:.75rem;font-weight:600;padding:.28rem .7rem;border-radius:999px">${s}</span>`).join('')}</div>
        </div>` : ''}
        ${infoCards.length > 0 ? `
        <div style="display:grid;grid-template-columns:repeat(${infoCards.length},1fr);gap:.75rem">
            ${infoCards.map(c => `
            <div class="profile-box" style="margin-bottom:0">
                <div class="profile-box-title">${c.label}</div>
                <p style="font-size:.82rem;line-height:1.6;color:var(--dim)">${c.value}</p>
            </div>`).join('')}
        </div>` : ''}
    `;
}

// =============================================
// STEP 3: SEARCH RESULTS
// =============================================
function computeCompatibility(job, profile) {
    if (!profile || Object.keys(profile).length === 0) return 72;

    let score = 0;
    const jobTitle = (job.title || '').toLowerCase();
    const jobTitles = (profile.job_titles || []).map(t => t.toLowerCase());
    const keywords = (profile.search_keywords || []).map(k => k.toLowerCase());

    // Title match (40 pts)
    let titleScore = 0;
    for (const t of jobTitles) {
        if (jobTitle.includes(t) || t.includes(jobTitle.split(' ')[0])) { titleScore = 40; break; }
    }
    if (!titleScore) {
        for (const kw of keywords) {
            if (jobTitle.includes(kw)) { titleScore = 20; break; }
        }
    }
    score += titleScore;

    // Skills match (60 pts)
    const cvSkills = (profile.skills || []).map(s => s.toLowerCase());
    const jobSkills = (job.skills || []).map(s => (typeof s === 'string' ? s : s.name || '').toLowerCase());
    if (cvSkills.length > 0 && jobSkills.length > 0) {
        const matches = cvSkills.filter(cs => jobSkills.some(js => js.includes(cs) || cs.includes(js)));
        score += Math.round((matches.length / Math.max(jobSkills.length, 1)) * 60);
    } else {
        score += 30;
    }

    return Math.min(97, Math.max(score, 32));
}

async function startSearch() {
    goToStep(3);

    document.getElementById('search-loading').classList.remove('hidden');
    document.getElementById('search-results').classList.add('hidden');

    try {
        const profile = analysisData?.profile || {};
        const jobs = await API.getJobs();
        let recruiters = [];
        try { recruiters = await API.getRecruiters(); } catch (e) {}

        const cvSkills = (profile.skills || []).map(s => s.toLowerCase());

        searchResults = jobs.map((job) => {
            const recruiter = recruiters.find(r => r.company && job.company && r.company.toLowerCase() === job.company.toLowerCase())
                || { name: 'Recruteur', email: 'contact@' + (job.company || 'entreprise').toLowerCase().replace(/\s+/g, '') + '.com', linkedin: '' };

            const jobSkills = (job.skills || []).map(s => typeof s === 'string' ? s : s.name || s);
            const matchedSkills = jobSkills.filter(js => cvSkills.some(cs => js.toLowerCase().includes(cs) || cs.includes(js.toLowerCase())));
            const unmatchedSkills = jobSkills.filter(js => !cvSkills.some(cs => js.toLowerCase().includes(cs) || cs.includes(js.toLowerCase())));

            return {
                id: job.id,
                title: job.title,
                company: job.company,
                location: job.location || 'Non sp\u00e9cifi\u00e9',
                contract: job.contractType || job.contract_type || 'CDI',
                description: job.description || 'Aucune description disponible.',
                recruiter: { name: recruiter.name, email: recruiter.email, linkedin: recruiter.linkedin || '' },
                matchedSkills,
                unmatchedSkills: unmatchedSkills.slice(0, 3),
                compatibility: computeCompatibility(job, profile)
            };
        });

        // Sort by compatibility descending
        searchResults.sort((a, b) => b.compatibility - a.compatibility);

        document.getElementById('search-loading').classList.add('hidden');
        document.getElementById('search-results').classList.remove('hidden');

        const n = searchResults.length;
        document.getElementById('results-count').textContent = n === 0
            ? "Aucun emploi trouv\u00e9. Ajoutez des offres dans l'onglet Emplois."
            : `${n} offre${n > 1 ? 's' : ''} compatible${n > 1 ? 's' : ''} trouv\u00e9e${n > 1 ? 's' : ''}`;

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
        const isSelected = selectedJobs.has(job.id);
        const card = document.createElement('div');
        card.className = `result-card ${isSelected ? 'selected' : ''}`;
        card.dataset.jobId = job.id;
        card.style.opacity = '0';
        card.onclick = () => toggleJobSelection(job.id);

        const compat = job.compatibility;
        const compatColor = compat >= 75 ? 'var(--em)' : compat >= 50 ? '#f59e0b' : 'var(--muted)';
        const compatBg   = compat >= 75 ? 'rgba(16,185,129,.1)' : compat >= 50 ? 'rgba(245,158,11,.08)' : 'rgba(255,255,255,.04)';

        card.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:.8rem;gap:.75rem">
                <div>
                    <div style="font-size:.73rem;font-weight:600;color:var(--muted);margin-bottom:.18rem;letter-spacing:.02em">${job.company}</div>
                    <div style="font-size:1rem;font-weight:800;color:var(--text);letter-spacing:-.02em;line-height:1.3">${job.title}</div>
                </div>
                <div style="display:flex;flex-direction:column;align-items:flex-end;gap:.3rem;flex-shrink:0">
                    <span style="background:${compatBg};border:1px solid ${compatColor};color:${compatColor};font-size:.7rem;font-weight:800;padding:.22rem .65rem;border-radius:999px;white-space:nowrap">${compat}% compatible</span>
                    <span style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.09);color:var(--muted);font-size:.67rem;font-weight:600;padding:.18rem .55rem;border-radius:999px">${job.contract}</span>
                </div>
            </div>

            <div style="display:flex;align-items:center;gap:.3rem;color:var(--muted);font-size:.77rem;margin-bottom:.8rem">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                ${job.location}
            </div>

            <p style="color:var(--muted);font-size:.82rem;line-height:1.6;margin-bottom:.85rem;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${job.description}</p>

            ${job.matchedSkills.length > 0 || job.unmatchedSkills.length > 0 ? `
            <div style="display:flex;flex-wrap:wrap;gap:.3rem;margin-bottom:.85rem">
                ${job.matchedSkills.slice(0, 4).map(s => `<span style="background:rgba(16,185,129,.08);border:1px solid rgba(16,185,129,.2);color:var(--em-l);font-size:.67rem;font-weight:600;padding:.16rem .52rem;border-radius:6px">&#10003; ${s}</span>`).join('')}
                ${job.unmatchedSkills.slice(0, 2).map(s => `<span style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);color:var(--muted);font-size:.67rem;padding:.16rem .52rem;border-radius:6px">${s}</span>`).join('')}
            </div>` : ''}

            <div style="padding-top:.7rem;border-top:1px solid rgba(255,255,255,.06);display:flex;align-items:center;justify-content:space-between">
                <div style="display:flex;align-items:center;gap:.55rem">
                    <div style="width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,var(--em-d),var(--em));display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:.65rem;flex-shrink:0">${(job.recruiter.name || 'R').charAt(0).toUpperCase()}</div>
                    <div>
                        <div style="font-weight:700;font-size:.78rem;color:var(--text)">${job.recruiter.name}</div>
                        <div style="color:var(--muted);font-size:.68rem">${job.recruiter.email}</div>
                    </div>
                </div>
                <div class="rc-check" style="width:18px;height:18px;border-radius:50%;border:2px solid ${isSelected ? 'var(--em)' : 'rgba(255,255,255,.18)'};background:${isSelected ? 'var(--em)' : 'transparent'};display:flex;align-items:center;justify-content:center;transition:all .18s;flex-shrink:0">
                    ${isSelected ? '<svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>' : ''}
                </div>
            </div>
        `;

        grid.appendChild(card);
        setTimeout(() => {
            card.style.transition = 'opacity .35s ease, transform .35s cubic-bezier(.16,1,.3,1)';
            card.style.opacity = '1';
        }, i * 75);
    });
}

function toggleJobSelection(id) {
    if (selectedJobs.has(id)) {
        selectedJobs.delete(id);
    } else {
        selectedJobs.add(id);
    }

    // Update card visuals
    document.querySelectorAll('.result-card').forEach((card) => {
        const jobId = card.dataset.jobId;
        const isSelected = selectedJobs.has(jobId);
        card.classList.toggle('selected', isSelected);
        const check = card.querySelector('.rc-check');
        if (check) {
            check.style.borderColor = isSelected ? 'var(--em)' : 'rgba(255,255,255,.18)';
            check.style.background = isSelected ? 'var(--em)' : 'transparent';
            check.innerHTML = isSelected ? '<svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>' : '';
        }
    });

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
                    <div style="color: var(--color-text-secondary); font-size: 0.85rem;">${job.company} \u2014 ${job.recruiter.name}</div>
                </div>
                <span class="badge badge-pending">Brouillon</span>
            </div>
            <div id="email-content-${job.id}" style="background: var(--color-bg-tertiary); padding: var(--space-lg); border-radius: var(--radius-md); font-size: 0.9rem; line-height: 1.7; white-space: pre-wrap; margin-bottom: var(--space-md);">
                G\u00e9n\u00e9ration en cours...
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

        // Generate email via Claude API
        try {
            const res = await API.generateAiEmail({ job, profile: analysisData?.profile || {} });
            document.getElementById(`email-content-${job.id}`).textContent = res.email;
        } catch (e) {
            document.getElementById(`email-content-${job.id}`).textContent = 'Erreur de g\u00e9n\u00e9ration.';
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
            jobId: job.id,
            status: 'sent',
            customEmail: emailText,
            notes: ''
        });

        showToast(`Candidature envoy\u00e9e pour ${job.title}`, 'success');
    } catch (e) {
        console.error('Send error:', e);
        showToast("Erreur lors de l'envoi", 'error');
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
                jobId: job.id,
                status: 'sent',
                customEmail: emailText,
                notes: ''
            });
            sent++;
        } catch (e) {
            console.error(`Error sending application for job ${jobId}:`, e);
        }
    }

    showToast(`${sent}/${count} candidature(s) envoy\u00e9e(s) avec succ\u00e8s !`, 'success');
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
