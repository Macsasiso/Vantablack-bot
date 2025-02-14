const { PermissionsBitField, ActivityType } = require('discord.js');
const { setMaintenanceMode, isMaintenanceMode } = require('../utils/maintenance');
const { log } = require('../utils/logger');

module.exports = {
    name: 'restart',
    description: 'Restarts the bot from maintenance mode (Admin only)',
    async execute(message, args) {
        // Check if user has admin permissions
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply('❌ Sorry, only administrators can use this command!');
        }

        // Check if actually in maintenance mode
        if (!isMaintenanceMode()) {
            return message.reply('⚠️ Bot is not in maintenance mode.');
        }

        try {
            // Disable maintenance mode first
            await setMaintenanceMode(false, message.client);
            log('info', `Maintenance mode disabled by ${message.author.tag}`);

            // Update presence
            await message.client.user.setPresence({
                status: 'online',
                activities: [{
                    name: '!help for commands',
                    type: ActivityType.Playing
                }]
            });

            // Confirm restart
            return message.reply('✅ Bot is now back online and operational!');
        } catch (error) {
            log('error', 'Error restarting bot:', error);
            await setMaintenanceMode(true, message.client); // Revert to maintenance mode if status update fails
            return message.reply('❌ Failed to restart the bot!');
        }
    }
};