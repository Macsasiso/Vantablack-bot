const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const { log } = require('./utils/logger');

// Create a new client instance with minimal required intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Create commands collection
client.commands = new Collection();

// Load commands
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.name, command);
}

// Load events
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

// Error handling
process.on('unhandledRejection', async error => {
    log('error', 'Unhandled promise rejection:', error);
    try {
        // Set status to idle when an error occurs
        await client.user.setStatus('idle');
        await client.user.setActivity('⚠️ Error Encountered', { type: 'PLAYING' });
        log('info', 'Bot status set to idle due to error');
    } catch (setStatusError) {
        log('error', 'Failed to set status to idle:', setStatusError);
    }
});

// Add additional error handler for uncaught exceptions
process.on('uncaughtException', async error => {
    log('error', 'Uncaught exception:', error);
    try {
        // Set status to idle when an error occurs
        await client.user.setStatus('idle');
        await client.user.setActivity('⚠️ Error Encountered', { type: 'PLAYING' });
        log('info', 'Bot status set to idle due to error');
    } catch (setStatusError) {
        log('error', 'Failed to set status to idle:', setStatusError);
    }
});

// Login to Discord
client.login(process.env.DISCORD_TOKEN);