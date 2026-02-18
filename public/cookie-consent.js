// Cookie Consent Banner - RGPD Compliant
(function () {
    const CONSENT_KEY = 'jobflow_cookie_consent';

    function getConsent() {
        try { return JSON.parse(localStorage.getItem(CONSENT_KEY)); } catch { return null; }
    }

    function saveConsent(consent) {
        consent.date = new Date().toISOString();
        localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
    }

    function createBanner() {
        if (getConsent()) { createFloatingButton(); return; }

        const overlay = document.createElement('div');
        overlay.id = 'cookie-overlay';
        overlay.innerHTML = `
            <div class="cookie-banner">
                <div class="cookie-banner-content">
                    <div class="cookie-banner-icon">🍪</div>
                    <div>
                        <h3 class="cookie-title">Nous respectons votre vie privée</h3>
                        <p class="cookie-text">
                            Ce site utilise des cookies pour améliorer votre expérience. Conformément au RGPD,
                            vous pouvez choisir les cookies que vous acceptez.
                            <a href="privacy.html" class="cookie-link">Politique de confidentialité</a>
                        </p>
                    </div>
                </div>
                <div id="cookie-details" class="cookie-details hidden">
                    <div class="cookie-category">
                        <label class="cookie-toggle">
                            <input type="checkbox" checked disabled>
                            <span class="cookie-toggle-slider"></span>
                        </label>
                        <div>
                            <strong>Cookies essentiels</strong>
                            <small>Nécessaires au fonctionnement du site (toujours actifs)</small>
                        </div>
                    </div>
                    <div class="cookie-category">
                        <label class="cookie-toggle">
                            <input type="checkbox" id="cookie-analytics">
                            <span class="cookie-toggle-slider"></span>
                        </label>
                        <div>
                            <strong>Cookies analytiques</strong>
                            <small>Nous aident à comprendre comment vous utilisez le site</small>
                        </div>
                    </div>
                    <div class="cookie-category">
                        <label class="cookie-toggle">
                            <input type="checkbox" id="cookie-functional">
                            <span class="cookie-toggle-slider"></span>
                        </label>
                        <div>
                            <strong>Cookies fonctionnels</strong>
                            <small>Mémorisent vos préférences et personnalisations</small>
                        </div>
                    </div>
                </div>
                <div class="cookie-actions">
                    <button class="cookie-btn cookie-btn-outline" onclick="window._cookieConsent.customize()">Personnaliser</button>
                    <button class="cookie-btn cookie-btn-reject" onclick="window._cookieConsent.rejectAll()">Tout refuser</button>
                    <button class="cookie-btn cookie-btn-accept" onclick="window._cookieConsent.acceptAll()">Tout accepter</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
        requestAnimationFrame(() => overlay.classList.add('cookie-visible'));
    }

    function removeBanner() {
        const overlay = document.getElementById('cookie-overlay');
        if (overlay) {
            overlay.classList.remove('cookie-visible');
            setTimeout(() => overlay.remove(), 300);
        }
        createFloatingButton();
    }

    function createFloatingButton() {
        if (document.getElementById('cookie-float-btn')) return;
        const btn = document.createElement('button');
        btn.id = 'cookie-float-btn';
        btn.className = 'cookie-float';
        btn.textContent = '🍪';
        btn.title = 'Gérer les cookies';
        btn.onclick = () => {
            btn.remove();
            localStorage.removeItem(CONSENT_KEY);
            createBanner();
        };
        document.body.appendChild(btn);
    }

    window._cookieConsent = {
        acceptAll() {
            saveConsent({ essential: true, analytics: true, functional: true });
            removeBanner();
        },
        rejectAll() {
            saveConsent({ essential: true, analytics: false, functional: false });
            removeBanner();
        },
        customize() {
            const details = document.getElementById('cookie-details');
            if (details) details.classList.toggle('hidden');
        },
        saveCustom() {
            saveConsent({
                essential: true,
                analytics: document.getElementById('cookie-analytics')?.checked || false,
                functional: document.getElementById('cookie-functional')?.checked || false
            });
            removeBanner();
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createBanner);
    } else {
        createBanner();
    }
})();
