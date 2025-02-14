const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const { log } = require('./utils/logger');

// Create a new client instance with required intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences // Add presence intent for better member tracking
    ]
});

// Create commands collection
client.commands = new Collection();

// Load commands
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    log('info', `Loading command from file: ${file}`);
    const command = require(filePath);
    client.commands.set(command.name, command);
    log('info', `Loaded command: ${command.name}`);
}

// Load events
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

// Track loaded events to prevent duplicates
const loadedEvents = new Set();

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    log('info', `Loading event from file: ${file}`);
    const event = require(filePath);

    // Check for duplicate event handlers
    if (loadedEvents.has(event.name)) {
        log('warn', `Duplicate event handler detected for ${event.name}, skipping...`);
        continue;
    }

    loadedEvents.add(event.name);

    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
        log('info', `Registered one-time event handler: ${event.name}`);
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
        log('info', `Registered event handler: ${event.name}`);
    }
}

// Error handling
process.on('unhandledRejection', async error => {
    log('error', 'Unhandled promise rejection:', error);
    try {
        await client.user.setStatus('idle');
        await client.user.setActivity('⚠️ Error Encountered', { type: 'PLAYING' });
        log('info', 'Bot status set to idle due to error');
    } catch (setStatusError) {
        log('error', 'Failed to set status to idle:', setStatusError);
    }
});

process.on('uncaughtException', async error => {
    log('error', 'Uncaught exception:', error);
    try {
        await client.user.setStatus('idle');
        await client.user.setActivity('⚠️ Error Encountered', { type: 'PLAYING' });
        log('info', 'Bot status set to idle due to error');
    } catch (setStatusError) {
        log('error', 'Failed to set status to idle:', setStatusError);
    }
});

// Login to Discord
client.login(process.env.DISCORD_TOKEN);