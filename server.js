import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());

// Serve static files from 'public' directory
app.use(express.static(join(__dirname, 'public')));

// Clean URL routes (without .html extension)
app.get('/login',          (req, res) => res.sendFile(join(__dirname, 'public', 'login.html')));
app.get('/dashboard',      (req, res) => res.sendFile(join(__dirname, 'public', 'index.html')));
app.get('/applications',   (req, res) => res.sendFile(join(__dirname, 'public', 'applications.html')));
app.get('/jobs',           (req, res) => res.sendFile(join(__dirname, 'public', 'jobs.html')));
app.get('/candidatures',   (req, res) => res.sendFile(join(__dirname, 'public', 'candidatures.html')));
app.get('/recruiters',     (req, res) => res.sendFile(join(__dirname, 'public', 'recruiters.html')));
app.get('/settings',       (req, res) => res.sendFile(join(__dirname, 'public', 'settings.html')));

// Catch-all → welcome page
app.get('*', (req, res) => {
    if (req.path.includes('.')) return res.sendStatus(404);
    res.sendFile(join(__dirname, 'public', 'welcome.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ W-JOB running on http://localhost:${PORT}`);
});
