const { log } = require('../utils/logger');
const { ActivityType } = require('discord.js');

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        log('info', `Logged in as ${client.user.tag}`);
        client.user.setPresence({
            status: 'online',
            activities: [{
                name: '!help for commands',
                type: ActivityType.Playing
            }]
        });
    }
};