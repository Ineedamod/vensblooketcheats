const Blooket = require('blooket'); // You must run: npm install blooket

// Grab the PIN passed from server.js
const pin = process.argv[2]; 

if (!pin) {
    console.error("CRITICAL: No PIN provided to bot.js");
    process.exit(1);
}

// Generate a random bot name
const botName = `IsaacBot_${Math.floor(Math.random() * 9999)}`;

async function startBot() {
    const client = new Blooket();

    try {
        console.log(`[ATTEMPT] Joining lobby ${pin} as ${botName}...`);
        
        // Attempt to join the live Blooket session
        await client.join(pin, botName);
        
        console.log(`[SUCCESS] ${botName} is now in lobby ${pin}!`);

        // Keep the process alive so the bot doesn't immediately leave
        setInterval(() => {
            // Optional: Add logic here to "auto-answer" if game starts
        }, 10000);

    } catch (err) {
        console.error(`[FAILED] Could not join lobby ${pin}:`, err.message);
        process.exit(1);
    }
}

// Global error handling to prevent the whole server from crashing
process.on('unhandledRejection', (reason) => {
    console.log('[ERROR] Bot Rejection:', reason);
});

startBot();
