const express = require('express');
const path = require('path');
const { spawn } = require('child_process');
const app = express();

app.use(express.json());

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Root Route: Explicitly sends index.html to fix "Cannot GET /"
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

let activeBots = [];

app.post('/run-bot', (req, res) => {
    const pin = req.body.pin;
    // Note: On Vercel, spawned processes may be killed quickly due to timeout
    const botProcess = spawn('node', [path.join(__dirname, 'bot.js'), pin]);
    activeBots.push(botProcess);
    
    botProcess.on('exit', () => {
        activeBots = activeBots.filter(p => p !== botProcess);
    });

    res.send(`Attempting to deploy bot to PIN ${pin}...`);
});

app.post('/kill-bots', (req, res) => {
    const count = activeBots.length;
    activeBots.forEach(proc => proc.kill('SIGKILL'));
    activeBots = [];
    res.send(`Nuked ${count} active sessions.`);
});

// Port handling for Local vs Vercel
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server live on port ${PORT}`));

// REQUIRED FOR VERCEL
module.exports = app;
