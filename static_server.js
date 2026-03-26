import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const path = { join };
const app = express();

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Fallback to index.html for SPA-like behavior (optional, but good for safety)
app.get('*', (req, res) => {
    // If it's a file request that wasn't found (e.g. .css, .js), send 404
    if (req.path.includes('.')) {
        return res.sendStatus(404);
    }
    // Otherwise serve index.html
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`\n✅ Server running! Open http://localhost:${PORT}/login.html to start.`);
});
