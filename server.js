const express = require('express');
const path = require('path');
const app = express();

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Fallback to index.html for specific files to avoid 404 on direct access
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Catch-all for other routes — always land on welcome page
app.get('*', (req, res) => {
    if (req.path.includes('.')) {
        return res.sendStatus(404);
    }
    res.sendFile(path.join(__dirname, 'public', 'welcome.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`\n✅ Server (Static) running! Open http://localhost:${PORT}/login.html to start.`);
});
