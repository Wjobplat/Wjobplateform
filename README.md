# W-JOB — Plateforme de candidature avec agent IA

Dépose ton CV, l'IA (Claude) analyse ton profil, trouve des offres compatibles et prépare les emails de candidature. Aucune candidature n'est envoyée sans validation humaine.

En ligne : https://wjobplateform.vercel.app/

## Stack

- **Front** : HTML / CSS / JS vanilla, servi statiquement depuis `public/` (pas de bundler)
- **Auth + base de données** : Supabase (`public/supabase-client.js`, schéma dans `migrations/supabase_schema.sql`)
- **Fonctions serveur** : Vercel serverless (`api/`, Node.js)
- **IA** : API Anthropic (Claude) via les fonctions `api/`

## Pages (`public/`)

| Page | Rôle |
|---|---|
| `welcome.html` | Page d'accueil publique (`/`) |
| `login.html` | Connexion / inscription Supabase |
| `applications.html` | Wizard « Démarrer » : upload CV → analyse IA → offres → emails |
| `index.html` | Dashboard (KPIs, dernières candidatures, activité) |
| `jobs.html` | Offres trouvées : recherche, filtres, détail, candidater |
| `candidatures.html` | Suivi en kanban par statut |
| `application-review.html` | Révision / validation d'une candidature |
| `recruiters.html` | Contacts recruteurs |
| `settings.html` | Profil, webhooks, consentements RGPD, export / suppression des données |
| `agent.html` | Pilotage de l'agent IA (admin) |
| `privacy.html`, `terms.html`, `legal.html` | Pages légales |

JS associé : un fichier par page (`jobs.js`, `candidatures.js`, …) + `api.js` (couche Supabase, helpers `showToast`, `escapeHtml`, `initUserAvatar`, `apiHeaders`), `theme.js`, `cookie-consent.js`.

## Fonctions serveur (`api/`)

| Route | Rôle | Authentification |
|---|---|---|
| `POST /api/analyze-cv` | Analyse d'un CV PDF par Claude | JWT Supabase (`Authorization: Bearer`) |
| `POST /api/generate-email` | Email de candidature | JWT Supabase |
| `POST /api/generate-cover-letter` | Lettre de motivation | JWT Supabase |
| `POST /api/trigger` | Événements de l'agent (`test.ping` public) | JWT ou `X-Webhook-Secret` |
| `POST /api/webhook?user_id=…` | Webhook entrant (agent externe → Supabase) | JWT ou `X-Webhook-Secret` |

`api/_lib/auth.js` contient les vérifications (non exposé comme route).

## Variables d'environnement Vercel

| Variable | Usage |
|---|---|
| `ANTHROPIC_API_KEY` | Appels Claude |
| `SUPABASE_SERVICE_ROLE_KEY` | Écritures du webhook + vérification du secret webhook |
| `NEXT_PUBLIC_SUPABASE_URL` *(optionnel)* | URL Supabase (valeur par défaut dans le code) |

## Développement local

```bash
npm install
npx serve public -p 3000
```

Les fonctions `api/` nécessitent `vercel dev` pour tourner en local.

## Administration

Le rôle admin se lit dans `app_metadata.role` du compte Supabase (modifiable uniquement côté serveur) :

```sql
update auth.users
set raw_app_meta_data = raw_app_meta_data || '{"role":"admin"}'
where email = 'ton@email.fr';
```
