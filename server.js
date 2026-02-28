const express = require('express');
const { spawn } = require('child_process');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public')); // Serves your index.html from the public folder

let activeBots = [];

// Route to Deploy a Bot
app.post('/run-bot', (req, res) => {
    const pin = req.body.pin;
    if (!pin) return res.status(400).send("No PIN provided.");

    console.log(`[SYSTEM] Deploying bot to PIN: ${pin}`);

    // Spawns a new independent Node process for the bot
    const bot = spawn('node', ['bot.js', pin]);

    activeBots.push({ process: bot, pin: pin });

    bot.stdout.on('data', (data) => console.log(`[BOT-LOG]: ${data}`));
    
    bot.on('exit', () => {
        activeBots = activeBots.filter(b => b.process !== bot);
        console.log(`[SYSTEM] Bot exited lobby ${pin}.`);
    });

    res.send(`Bot deployed to ${pin}. Active sessions: ${activeBots.length}`);
});

// Route to Nuke All Sessions
app.post('/kill-bots', (req, res) => {
    const count = activeBots.length;
    activeBots.forEach(b => b.process.kill('SIGKILL'));
    activeBots = [];
    console.log(`[SYSTEM] Nuked ${count} sessions.`);
    res.send(`Successfully nuked ${count} bot processes.`);
});

app.listen(port, () => {
    console.log(`----------------------------------------`);
    console.log(`ISAACS BLOOKET LOWKV IS LIVE`);
    console.log(`URL: http://localhost:${port}`);
    console.log(`----------------------------------------`);
});
                     
