const express = require('express');
const { spawn } = require('child_process');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static('public')); // Serves index.html from the public folder

let activeBots = [];

app.post('/run-bot', (req, res) => {
    const pin = req.body.pin;
    const botProcess = spawn('node', ['bot.js', pin]);
    activeBots.push(botProcess);
    botProcess.on('exit', () => activeBots = activeBots.filter(p => p !== botProcess));
    res.send(`Bot for PIN ${pin} deployed successfully.`);
});

app.post('/kill-bots', (req, res) => {
    const count = activeBots.length;
    activeBots.forEach(proc => proc.kill('SIGKILL'));
    activeBots = [];
    res.send(`Nuked ${count} active bot sessions.`);
});

app.listen(3000, () => console.log('Isaacs Blooket lowkV: http://localhost:3000'));
      
