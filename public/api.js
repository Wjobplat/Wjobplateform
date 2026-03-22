/* ============================================================
   W-JOB PLATFORM — PREMIUM UI v4.0
   Deep Tech Glass · Emerald Brand · Proper Variable Names
   ============================================================ */

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

/* ===== ALL CSS VARIABLES (matching inline styles in HTML) ===== */
:root {
  /* Brand */
  --brand:           #10b981;
  --brand-dark:      #059669;
  --brand-light:     #34d399;
  --brand-xlight:    #6ee7b7;
  --brand-glow:      rgba(16,185,129,0.32);

  /* Surfaces */
  --bg:              #040c17;
  --surface-0:       #060e1b;
  --surface-1:       #0a1828;
  --surface-2:       #0f2038;
  --surface-3:       #142849;

  /* Glass system */
  --glass-bg:        rgba(10,24,40,0.78);
  --glass-border:    rgba(16,185,129,0.15);
  --glass-blur:      22px;
  --glass-shadow:    0 0 0 1px rgba(16,185,129,0.09),
                     0 8px 40px rgba(0,0,0,0.52),
                     inset 0 1px 0 rgba(255,255,255,0.04),
                     inset 0 -1px 0 rgba(0,0,0,0.15);

  /* Text — HTML inline styles use these exact names */
  --color-text-primary:   #edf7f2;
  --color-text-secondary: #7aaa90;
  --color-text-muted:     #3f6b57;
  --color-text-dim:       #264438;
  --white:                #ffffff;

  /* Gradients — HTML inline styles use these exact names */
  --gradient-primary:   linear-gradient(135deg, #10b981 0%, #059669 100%);
  --gradient-secondary: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  --gradient-success:   linear-gradient(135deg, #10b981 0%, #065f46 100%);
  --gradient-emerald:   linear-gradient(135deg, #34d399 0%, #10b981 60%, #059669 100%);
  --gradient-purple:    linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
  --gradient-text:      linear-gradient(135deg, #ffffff 0%, #a7f3d0 50%, #10b981 100%);

  /* Status colors — HTML inline uses these exact names */
  --status-draft:     #94a3b8;
  --status-pending:   #f59e0b;
  --status-sent:      #3b82f6;
  --status-responded: #10b981;

  /* Semantic */
  --danger:  #f43f5e;
  --warning: #f59e0b;
  --info:    #3b82f6;
  --success: #10b981;
  --purple:  #8b5cf6;

  /* Spacing — HTML inline uses these exact names */
  --space-xs:  4px;
  --space-sm:  8px;
  --space-md:  16px;
  --space-lg:  24px;
  --space-xl:  32px;
  --space-2xl: 48px;
  --space-3xl: 64px;

  /* Border radius */
  --radius-xs:   4px;
  --radius-sm:   8px;
  --radius-md:   12px;
  --radius-lg:   16px;
  --radius-xl:   20px;
  --radius-2xl:  24px;
  --radius-full: 9999px;

  /* Typography */
  --font: 'Inter', system-ui, -apple-system, sans-serif;

  /* Transitions */
  --ease:     cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-in:  cubic-bezier(0.4, 0, 1, 1);
  --duration: 0.3s;

  /* Nav */
  --nav-height: 60px;
}

/* ===== RESET & BASE ===== */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
  -webkit-text-size-adjust: 100%;
}

body {
  font-family: var(--font);
  background-color: var(--bg);
  color: var(--color-text-primary);
  min-height: 100vh;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
}

/* Animated mesh background */
body::before {
  content: '';
  position: fixed;
  inset: 0;
  z-index: -2;
  pointer-events: none;
  background:
    radial-gradient(ellipse 80% 60% at 5% -5%,   rgba(16,185,129,0.18) 0%, transparent 58%),
    radial-gradient(ellipse 55% 45% at 95% 105%,  rgba(5,150,105,0.13) 0%, transparent 55%),
    radial-gradient(ellipse 40% 35% at 75% 20%,   rgba(59,130,246,0.06) 0%, transparent 50%),
    linear-gradient(160deg, #040c17 0%, #060e1b 50%, #040c17 100%);
}

/* Noise grain overlay */
body::after {
  content: '';
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  opacity: 0.4;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='250' height='250'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='250' height='250' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E");
}

a { text-decoration: none; color: inherit; }
img { max-width: 100%; display: block; }
button { cursor: pointer; border: none; background: none; font-family: var(--font); }
input, select, textarea { font-family: var(--font); }
ul, ol { list-style: none; }

/* ===== KEYFRAMES ===== */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-12px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-7px); }
}

@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(16,185,129,0.45); }
  50%       { box-shadow: 0 0 0 8px rgba(16,185,129,0); }
}

@keyframes shimmer {
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

@keyframes pop-in {
  from { opacity: 0; transform: scale(0.88); }
  to   { opacity: 1; transform: scale(1); }
}

/* Animation utility classes */
.fade-in   { animation: fadeInUp 0.5s var(--ease-out) both; }
.stagger-1 { animation-delay: 0.06s; }
.stagger-2 { animation-delay: 0.12s; }
.stagger-3 { animation-delay: 0.18s; }
.stagger-4 { animation-delay: 0.24s; }
.stagger-5 { animation-delay: 0.30s; }

/* ===== TOP NAVIGATION ===== */
.top-nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  height: var(--nav-height);
  background: rgba(4,12,23,0.88);
  backdrop-filter: blur(24px) saturate(1.6);
  -webkit-backdrop-filter: blur(24px) saturate(1.6);
  border-bottom: 1px solid rgba(16,185,129,0.09);
  box-shadow: 0 1px 24px rgba(0,0,0,0.45);
  z-index: 1000;
}

.top-nav-inner {
  display: flex;
  align-items: center;
  gap: var(--space-xl);
  height: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 var(--space-xl);
}

.top-nav-brand {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.top-nav-brand img {
  height: 27px;
  width: auto;
}

.top-nav-links {
  display: flex;
  align-items: center;
  gap: 2px;
  flex: 1;
}

.top-nav-link {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 7px 13px;
  border-radius: var(--radius-md);
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  transition: background 0.18s ease, color 0.18s ease;
  white-space: nowrap;
}

.top-nav-link:hover {
  color: var(--color-text-primary);
  background: rgba(255,255,255,0.05);
}

.top-nav-link.active {
  color: var(--brand-light);
  background: rgba(16,185,129,0.1);
  font-weight: 600;
}

.nav-icon {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
  opacity: 0.8;
}

.top-nav-link.active .nav-icon { opacity: 1; }

.top-nav-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: auto;
}

.top-nav-action {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: var(--radius-md);
  color: var(--color-text-secondary);
  transition: all 0.18s ease;
}

.top-nav-action:hover {
  color: var(--color-text-primary);
  background: rgba(255,255,255,0.06);
}

.top-nav-toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  padding: 8px;
  border-radius: var(--radius-md);
}

.top-nav-toggle span {
  display: block;
  width: 20px;
  height: 2px;
  background: var(--color-text-secondary);
  border-radius: 2px;
  transition: all 0.2s ease;
}

.top-nav-mobile-menu {
  display: none;
  position: fixed;
  top: var(--nav-height);
  left: 0; right: 0;
  background: rgba(6,14,27,0.97);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(16,185,129,0.1);
  padding: var(--space-md);
  flex-direction: column;
  gap: 4px;
  z-index: 999;
}

.top-nav-mobile-menu.open { display: flex; }
.top-nav-mobile-menu .top-nav-link { padding: 10px 14px; }

/* ===== LAYOUT ===== */
.app-container {
  padding-top: var(--nav-height);
  min-height: 100vh;
}

.main-content {
  max-width: 1300px;
  margin: 0 auto;
  padding: var(--space-2xl) var(--space-xl);
}

/* ===== PAGE HEADER ===== */
.page-header {
  margin-bottom: var(--space-2xl);
}

.page-title {
  font-size: clamp(1.8rem, 3vw, 2.6rem);
  font-weight: 800;
  background: var(--gradient-text);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.15;
  letter-spacing: -0.025em;
  margin-bottom: 6px;
}

.page-subtitle {
  font-size: 0.92rem;
  color: var(--color-text-secondary);
  font-weight: 400;
  line-height: 1.5;
}

/* ===== GLASS CARD ===== */
.card {
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-xl);
  box-shadow: var(--glass-shadow);
  overflow: hidden;
  position: relative;
}

.card::before {
  content: '';
  position: absolute;
  top: 0; left: 16px; right: 16px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(16,185,129,0.28), transparent);
}

.card-header {
  padding: var(--space-lg) var(--space-xl);
  border-bottom: 1px solid rgba(255,255,255,0.04);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
}

.card-body { padding: var(--space-xl); }

.card-title {
  font-size: 0.97rem;
  font-weight: 700;
  color: var(--color-text-primary);
  letter-spacing: -0.015em;
}

/* ===== KPI GRID ===== */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: var(--space-lg);
  margin-bottom: var(--space-2xl);
}

.kpi-card {
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-xl);
  box-shadow: var(--glass-shadow);
  padding: var(--space-xl);
  position: relative;
  overflow: hidden;
  transition: transform 0.25s var(--ease), box-shadow 0.25s ease, border-color 0.25s ease;
}

.kpi-card::before {
  content: '';
  position: absolute;
  top: 0; left: 12px; right: 12px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(16,185,129,0.38), transparent);
}

.kpi-card:hover {
  transform: translateY(-4px);
  border-color: rgba(16,185,129,0.25);
  box-shadow:
    0 0 0 1px rgba(16,185,129,0.18),
    0 20px 55px rgba(0,0,0,0.48),
    inset 0 1px 0 rgba(255,255,255,0.05);
}

/* Dashboard KPI — uses .kpi-header / .kpi-icon / .kpi-label / .kpi-value / .kpi-trend */
.kpi-header {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
}

.kpi-icon {
  width: 44px;
  height: 44px;
  min-width: 44px;
  border-radius: var(--radius-md);
  background: var(--gradient-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
  box-shadow: 0 4px 16px rgba(16,185,129,0.35);
  animation: float 5s ease-in-out infinite;
}

.kpi-card.stagger-2 .kpi-icon { animation-delay: -1.2s; }
.kpi-card.stagger-3 .kpi-icon { animation-delay: -2.5s; }
.kpi-card.stagger-4 .kpi-icon { animation-delay: -3.8s; }

.kpi-label {
  font-size: 0.76rem;
  font-weight: 700;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  line-height: 1.3;
}

.kpi-value {
  font-size: 2.5rem;
  font-weight: 900;
  background: var(--gradient-text);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  letter-spacing: -0.04em;
  margin-bottom: var(--space-sm);
}

.kpi-trend {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.76rem;
  color: var(--brand-light);
  font-weight: 500;
  opacity: 0.85;
}

/* Recruiter page KPI — emoji + inline font-size styles */
.kpi-card > div[style] > div[style*="font-size: 2rem"],
.kpi-card > div[style] > div[style*="font-size:2rem"] {
  width: 44px !important;
  height: 44px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  background: var(--gradient-primary) !important;
  border-radius: var(--radius-md) !important;
  margin: 0 auto var(--space-md) auto !important;
  font-size: 1.25rem !important;
  box-shadow: 0 4px 16px rgba(16,185,129,0.35) !important;
  animation: float 5s ease-in-out infinite;
}

.kpi-card > div[style] > div[style*="font-size: 1.8rem"],
.kpi-card > div[style] > div[style*="font-size:1.8rem"] {
  font-size: 2.3rem !important;
  font-weight: 900 !important;
  background: var(--gradient-text) !important;
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  background-clip: text !important;
  line-height: 1 !important;
  letter-spacing: -0.04em !important;
  margin-bottom: var(--space-xs) !important;
}

/* ===== FILTERS ===== */
.filters-container {
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-xl);
  padding: var(--space-lg) var(--space-xl);
  margin-bottom: var(--space-lg);
  box-shadow: var(--glass-shadow);
  position: relative;
}

.filters-container::before {
  content: '';
  position: absolute;
  top: 0; left: 16px; right: 16px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(16,185,129,0.22), transparent);
}

.filters-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr auto;
  gap: var(--space-md);
  align-items: end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.filter-label {
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.09em;
}

.filter-input,
.filter-select {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
  font-size: 0.875rem;
  padding: 9px 13px;
  outline: none;
  transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
  appearance: none;
  -webkit-appearance: none;
}

.filter-input::placeholder { color: var(--color-text-muted); }

.filter-input:focus,
.filter-select:focus {
  border-color: rgba(16,185,129,0.5);
  background: rgba(16,185,129,0.05);
  box-shadow: 0 0 0 3px rgba(16,185,129,0.1);
}

.filter-select option {
  background: #0a1828;
  color: var(--color-text-primary);
}

/* ===== JOB GRID ===== */
.job-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
  gap: var(--space-lg);
  margin-bottom: var(--space-2xl);
}

/* ===== JOB CARD ===== */
.job-card {
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border: 1px solid rgba(16,185,129,0.1);
  border-radius: var(--radius-xl);
  padding: var(--space-xl);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.28s var(--ease), box-shadow 0.28s ease, border-color 0.28s ease;
}

/* Top shimmer line on hover */
.job-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent 0%, rgba(16,185,129,0.6) 50%, transparent 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.job-card:hover {
  transform: translateY(-5px);
  border-color: rgba(16,185,129,0.22);
  box-shadow:
    0 0 0 1px rgba(16,185,129,0.14),
    0 22px 55px rgba(0,0,0,0.52),
    inset 0 1px 0 rgba(255,255,255,0.04);
}

.job-card:hover::before { opacity: 1; }

/* Job card header */
.job-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-md);
  margin-bottom: var(--space-md);
}

/* Company — small brand-colored label */
.job-company {
  font-size: 0.68rem;
  font-weight: 700;
  color: var(--brand);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 5px;
  line-height: 1;
}

/* Job title — large and prominent */
.job-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-text-primary);
  line-height: 1.35;
  letter-spacing: -0.01em;
}

/* Compatibility score circle */
.score-circle {
  min-width: 50px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.78rem;
  font-weight: 800;
  flex-shrink: 0;
  border: 2px solid;
  letter-spacing: -0.02em;
  transition: transform 0.2s ease;
}

.job-card:hover .score-circle { transform: scale(1.06); }

.score-high {
  background: rgba(16,185,129,0.12);
  border-color: rgba(16,185,129,0.45);
  color: #34d399;
  box-shadow: 0 0 18px rgba(16,185,129,0.18);
}

.score-medium {
  background: rgba(245,158,11,0.1);
  border-color: rgba(245,158,11,0.38);
  color: #fbbf24;
  box-shadow: 0 0 14px rgba(245,158,11,0.13);
}

.score-low {
  background: rgba(239,68,68,0.09);
  border-color: rgba(239,68,68,0.32);
  color: #f87171;
}

/* Detail row — location, contract, salary */
.job-details {
  display: flex;
  flex-wrap: wrap;
  gap: 5px var(--space-md);
  margin-bottom: var(--space-md);
}

.job-detail {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.78rem;
  color: var(--color-text-secondary);
}

.job-detail svg { opacity: 0.55; flex-shrink: 0; }

/* Description — clamped to 3 lines */
.job-description {
  font-size: 0.82rem;
  color: var(--color-text-secondary);
  line-height: 1.65;
  margin-bottom: var(--space-md);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}

/* Skill tags */
.skill-tag {
  display: inline-block;
  background: rgba(16,185,129,0.09);
  border: 1px solid rgba(16,185,129,0.2);
  color: #34d399;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: var(--radius-full);
  letter-spacing: 0.02em;
  margin: 2px;
  transition: background 0.2s, border-color 0.2s;
}

.skill-tag:hover {
  background: rgba(16,185,129,0.16);
  border-color: rgba(16,185,129,0.35);
}

/* Job card footer */
.job-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: var(--space-md);
  border-top: 1px solid rgba(255,255,255,0.05);
}

/* Score in modal */
.compatibility-score {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

/* ===== BUTTONS ===== */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  font-size: 0.87rem;
  font-weight: 600;
  padding: 9px 20px;
  border-radius: var(--radius-md);
  transition: all 0.25s var(--ease);
  cursor: pointer;
  border: none;
  letter-spacing: 0.01em;
  white-space: nowrap;
}

.btn:disabled { opacity: 0.45; cursor: not-allowed; }

.btn-primary {
  background: var(--gradient-primary);
  color: #fff;
  box-shadow: 0 4px 18px rgba(16,185,129,0.32);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(16,185,129,0.44);
  filter: brightness(1.1);
}

.btn-secondary {
  background: rgba(255,255,255,0.06);
  color: var(--color-text-primary);
  border: 1px solid rgba(255,255,255,0.1);
}

.btn-secondary:hover:not(:disabled) {
  background: rgba(255,255,255,0.09);
  border-color: rgba(255,255,255,0.16);
  transform: translateY(-1px);
}

.btn-danger {
  background: rgba(244,63,94,0.12);
  color: #fb7185;
  border: 1px solid rgba(244,63,94,0.28);
}

.btn-danger:hover:not(:disabled) {
  background: rgba(244,63,94,0.2);
  border-color: rgba(244,63,94,0.45);
}

.btn-outline {
  background: transparent;
  color: var(--brand-light);
  border: 1px solid rgba(16,185,129,0.32);
}

.btn-outline:hover {
  background: rgba(16,185,129,0.08);
  border-color: rgba(16,185,129,0.55);
}

.btn-ghost {
  background: transparent;
  color: var(--color-text-secondary);
}

.btn-ghost:hover {
  background: rgba(255,255,255,0.05);
  color: var(--color-text-primary);
}

.btn-sm   { padding: 6px 14px;  font-size: 0.78rem; }
.btn-lg   { padding: 12px 28px; font-size: 0.95rem; }
.btn-icon { padding: 8px; border-radius: var(--radius-md); min-width: 36px; }

/* ===== MODAL ===== */
.modal {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: var(--space-xl);
}

.modal.hidden { display: none; }

.modal-overlay {
  position: absolute;
  inset: 0;
  background: rgba(4,12,23,0.88);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.modal-content {
  background: #0a1828;
  border: 1px solid rgba(16,185,129,0.18);
  border-radius: var(--radius-xl);
  box-shadow:
    0 0 0 1px rgba(16,185,129,0.1),
    0 32px 80px rgba(0,0,0,0.75);
  max-width: 560px;
  width: 100%;
  max-height: 88vh;
  overflow-y: auto;
  position: relative;
  z-index: 1;
  animation: pop-in 0.3s var(--ease) both;
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-md);
  padding: var(--space-xl);
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.modal-header h2 {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-text-primary);
  line-height: 1.35;
}

.modal-body { padding: var(--space-xl); }

.modal-close {
  width: 30px;
  height: 30px;
  min-width: 30px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  transition: all 0.18s;
  cursor: pointer;
}

.modal-close:hover {
  background: rgba(255,255,255,0.07);
  color: var(--color-text-primary);
}

/* ===== BADGES ===== */
.badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 10px;
  border-radius: var(--radius-full);
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  border: 1px solid;
}

.badge-draft     { background: rgba(148,163,184,0.1); color: var(--status-draft);     border-color: rgba(148,163,184,0.2); }
.badge-pending   { background: rgba(245,158,11,0.1);  color: var(--status-pending);   border-color: rgba(245,158,11,0.22); }
.badge-sent      { background: rgba(59,130,246,0.1);  color: var(--status-sent);      border-color: rgba(59,130,246,0.22); }
.badge-responded { background: rgba(16,185,129,0.1);  color: var(--status-responded); border-color: rgba(16,185,129,0.22); }
.badge-success   { background: rgba(16,185,129,0.1);  color: #34d399;                 border-color: rgba(16,185,129,0.22); }
.badge-error     { background: rgba(244,63,94,0.1);   color: #fb7185;                 border-color: rgba(244,63,94,0.22); }

.status-draft     { color: var(--status-draft); }
.status-pending   { color: var(--status-pending); }
.status-sent      { color: var(--status-sent); }
.status-responded { color: var(--status-responded); }

/* ===== TIMELINE ===== */
.timeline {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  padding: var(--space-lg) var(--space-xl);
}

.timeline-item {
  display: flex;
  gap: var(--space-md);
  position: relative;
}

.timeline-item::after {
  content: '';
  position: absolute;
  left: 4px;
  top: 18px;
  bottom: calc(-1 * var(--space-lg));
  width: 1px;
  background: linear-gradient(to bottom, rgba(16,185,129,0.2), transparent);
}

.timeline-item:last-child::after { display: none; }

.timeline-dot {
  width: 9px;
  height: 9px;
  min-width: 9px;
  border-radius: 50%;
  background: var(--brand);
  box-shadow: 0 0 8px rgba(16,185,129,0.4);
  margin-top: 5px;
}

.timeline-content { flex: 1; min-width: 0; }
.timeline-title   { font-size: 0.875rem; font-weight: 600; color: var(--color-text-primary); margin-bottom: 2px; }
.timeline-desc    { font-size: 0.8rem; color: var(--color-text-secondary); line-height: 1.5; }
.timeline-time    { font-size: 0.7rem; color: var(--color-text-muted); margin-top: 3px; }

/* ===== FORMS ===== */
.form-group   { display: flex; flex-direction: column; gap: 6px; margin-bottom: var(--space-lg); }
.form-row     { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-md); }

.form-label {
  font-size: 0.74rem;
  font-weight: 700;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.form-input,
.form-select,
.form-textarea {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
  font-size: 0.9rem;
  padding: 10px 14px;
  outline: none;
  width: 100%;
  transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
}

.form-input::placeholder,
.form-textarea::placeholder { color: var(--color-text-muted); }

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  border-color: rgba(16,185,129,0.48);
  background: rgba(16,185,129,0.04);
  box-shadow: 0 0 0 3px rgba(16,185,129,0.1);
}

.form-textarea { resize: vertical; min-height: 120px; line-height: 1.65; }
.form-select { appearance: none; -webkit-appearance: none; }
.form-select option { background: #0a1828; }
.form-hint  { font-size: 0.76rem; color: var(--color-text-muted); line-height: 1.4; }
.form-error { font-size: 0.76rem; color: #f87171; }

/* ===== STEP WIZARD ===== */
.step-wizard {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--space-2xl);
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.step-connector {
  width: 72px;
  height: 1px;
  background: rgba(16,185,129,0.15);
  margin: 0 var(--space-sm);
  margin-bottom: 30px;
  transition: background 0.3s;
}

.step-connector.active { background: var(--brand); }

.step-number {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 700;
  border: 2px solid rgba(255,255,255,0.08);
  color: var(--color-text-muted);
  background: rgba(255,255,255,0.03);
  transition: all 0.3s var(--ease);
}

.step-item.active .step-number {
  background: var(--gradient-primary);
  border-color: transparent;
  color: white;
  animation: pulse-glow 2.5s ease-in-out infinite;
  box-shadow: 0 0 24px rgba(16,185,129,0.4);
}

.step-item.completed .step-number {
  background: rgba(16,185,129,0.12);
  border-color: rgba(16,185,129,0.38);
  color: var(--brand-light);
}

.step-label {
  font-size: 0.72rem;
  font-weight: 500;
  color: var(--color-text-muted);
  white-space: nowrap;
}

.step-item.active .step-label {
  color: var(--brand-light);
  font-weight: 700;
}

/* ===== UPLOAD ZONE ===== */
.upload-zone {
  border: 2px dashed rgba(16,185,129,0.22);
  border-radius: var(--radius-xl);
  padding: var(--space-3xl) var(--space-2xl);
  text-align: center;
  transition: border-color 0.25s, background 0.25s;
  cursor: pointer;
  background: rgba(16,185,129,0.025);
}

.upload-zone:hover,
.upload-zone.drag-over {
  border-color: rgba(16,185,129,0.5);
  background: rgba(16,185,129,0.06);
}

.upload-icon {
  font-size: 2.5rem;
  margin-bottom: var(--space-md);
  display: block;
  animation: float 4s ease-in-out infinite;
}

.upload-text {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--space-xs);
}

.upload-hint {
  font-size: 0.82rem;
  color: var(--color-text-secondary);
}

/* ===== RECRUITER AVATARS (inline styles in recruiters.js) ===== */
.job-card div[style*="border-radius: 50%"],
.job-card div[style*="border-radius:50%"] {
  background: var(--gradient-primary) !important;
  box-shadow: 0 4px 16px rgba(16,185,129,0.32) !important;
  font-weight: 700 !important;
  color: white !important;
}

/* ===== SETTINGS ===== */
.settings-section {
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-xl);
  overflow: hidden;
  margin-bottom: var(--space-xl);
  box-shadow: var(--glass-shadow);
  position: relative;
}

.settings-section::before {
  content: '';
  position: absolute;
  top: 0; left: 12px; right: 12px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(16,185,129,0.25), transparent);
}

.settings-header {
  padding: var(--space-lg) var(--space-xl);
  border-bottom: 1px solid rgba(255,255,255,0.04);
}

.settings-title   { font-size: 0.97rem; font-weight: 700; color: var(--color-text-primary); }
.settings-subtitle { font-size: 0.8rem; color: var(--color-text-secondary); margin-top: 2px; }
.settings-body    { padding: var(--space-xl); }

/* ===== TABLES ===== */
table { width: 100%; border-collapse: collapse; }

th {
  text-align: left;
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.09em;
  padding: var(--space-sm) var(--space-md);
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

td {
  padding: var(--space-md);
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  border-bottom: 1px solid rgba(255,255,255,0.03);
  transition: background 0.15s;
}

tr:last-child td { border-bottom: none; }
tr:hover td { background: rgba(16,185,129,0.03); color: var(--color-text-primary); }

/* ===== TOGGLE SWITCH ===== */
.toggle {
  position: relative;
  width: 44px;
  height: 24px;
  flex-shrink: 0;
}

.toggle input { opacity: 0; width: 0; height: 0; position: absolute; }

.toggle-slider {
  position: absolute;
  inset: 0;
  background: rgba(255,255,255,0.09);
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.28s var(--ease);
  border: 1px solid rgba(255,255,255,0.08);
}

.toggle-slider::before {
  content: '';
  position: absolute;
  width: 18px;
  height: 18px;
  left: 3px;
  bottom: 2px;
  background: white;
  border-radius: 50%;
  transition: transform 0.28s var(--ease);
  box-shadow: 0 2px 6px rgba(0,0,0,0.35);
}

.toggle input:checked + .toggle-slider {
  background: var(--brand);
  border-color: transparent;
}

.toggle input:checked + .toggle-slider::before {
  transform: translateX(20px);
}

/* ===== AGENT STATUS ===== */
.agent-status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
  flex-shrink: 0;
}

.agent-status-dot.connected {
  background: var(--brand);
  box-shadow: 0 0 8px rgba(16,185,129,0.55);
  animation: pulse-glow 2s ease-in-out infinite;
}

.agent-status-dot.disconnected { background: #374151; }

/* ===== TOAST NOTIFICATIONS ===== */
#toast-container {
  position: fixed;
  bottom: var(--space-xl);
  right: var(--space-xl);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  background: rgba(10,24,40,0.96);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: var(--radius-lg);
  padding: var(--space-md) var(--space-lg);
  font-size: 0.875rem;
  color: var(--color-text-primary);
  min-width: 270px;
  max-width: 360px;
  box-shadow: 0 10px 36px rgba(0,0,0,0.55);
  opacity: 0;
  transform: translateX(20px);
  transition: opacity 0.3s var(--ease), transform 0.3s var(--ease);
  pointer-events: all;
}

.toast.toast-show { opacity: 1; transform: translateX(0); }
.toast-icon { flex-shrink: 0; display: flex; }

.toast-success { border-left: 3px solid #10b981; }
.toast-error   { border-left: 3px solid #f43f5e; }
.toast-info    { border-left: 3px solid #3b82f6; }
.toast-warning { border-left: 3px solid #f59e0b; }

/* ===== FOOTER ===== */
.site-footer {
  border-top: 1px solid rgba(255,255,255,0.05);
  padding: var(--space-xl) 0;
  margin-top: var(--space-3xl);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--space-md);
}

.footer-links { display: flex; gap: var(--space-lg); }

.footer-links a {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  transition: color 0.2s;
}

.footer-links a:hover { color: var(--brand-light); }

.footer-copy { font-size: 0.76rem; color: var(--color-text-dim); }

/* ===== COOKIE CONSENT ===== */
.cookie-consent {
  position: fixed;
  bottom: var(--space-xl);
  left: 50%;
  transform: translateX(-50%);
  background: #0a1828;
  border: 1px solid rgba(16,185,129,0.18);
  border-radius: var(--radius-xl);
  padding: var(--space-lg) var(--space-xl);
  box-shadow: 0 16px 50px rgba(0,0,0,0.65);
  z-index: 3000;
  max-width: 520px;
  width: calc(100% - 40px);
  display: flex;
  gap: var(--space-lg);
  align-items: center;
  animation: fadeInUp 0.4s var(--ease) both;
}

/* ===== LOADING SPINNER ===== */
.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(16,185,129,0.2);
  border-top-color: var(--brand);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  display: inline-block;
}

/* ===== DIVIDER ===== */
.divider { height: 1px; background: rgba(255,255,255,0.05); margin: var(--space-xl) 0; }

/* ===== SCROLLBAR ===== */
::-webkit-scrollbar { width: 5px; height: 5px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(16,185,129,0.22); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: rgba(16,185,129,0.38); }

/* ===== SELECTION ===== */
::selection { background: rgba(16,185,129,0.22); color: var(--color-text-primary); }

/* ===== UTILITIES ===== */
.text-brand  { color: var(--brand); }
.text-muted  { color: var(--color-text-muted); }
.font-bold   { font-weight: 700; }
.hidden      { display: none !important; }
.sr-only     { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0); }

/* ===== RESPONSIVE ===== */
@media (max-width: 1024px) {
  .filters-grid { grid-template-columns: 1fr 1fr 1fr; }
}

@media (max-width: 768px) {
  .top-nav-links,
  .top-nav-actions { display: none; }
  .top-nav-toggle  { display: flex; }
  .top-nav-inner   { gap: var(--space-md); }
  .main-content    { padding: var(--space-xl) var(--space-md); }
  .filters-grid    { grid-template-columns: 1fr; }
  .job-grid        { grid-template-columns: 1fr; }
  .kpi-grid        { grid-template-columns: repeat(2, 1fr); }
  .page-title      { font-size: 1.8rem; }
  .site-footer     { flex-direction: column; align-items: flex-start; }
  .cookie-consent  { flex-direction: column; }
}

@media (max-width: 480px) {
  .kpi-grid { grid-template-columns: 1fr; }
  .modal    { padding: var(--space-md); }
  .form-row { grid-template-columns: 1fr; }
}
