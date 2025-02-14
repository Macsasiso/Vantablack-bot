const { PermissionsBitField, ActivityType } = require('discord.js');
const { log } = require('../utils/logger');
const { setMaintenanceMode, isMaintenanceMode } = require('../utils/maintenance');

module.exports = {
    name: 'maintenance',
    description: 'Sets bot to maintenance mode (Admin only)',
    async execute(message, args) {
        // Check if user has admin permissions
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply('❌ Sorry, only administrators can use this command!');
        }

        // Check if already in maintenance mode
        if (isMaintenanceMode()) {
            return message.reply('⚠️ Bot is already in maintenance mode. Use !restart to resume normal operations.');
        }

        try {
            // Enable maintenance mode and update status
            await setMaintenanceMode(true, message.client);
            log('info', `Maintenance mode enabled by ${message.author.tag}`);

            // Update presence
            await message.client.user.setPresence({
                status: 'idle',
                activities: [{
                    name: 'Under Maintenance',
                    type: ActivityType.Playing
                }]
            });

            // Confirm maintenance mode
            return message.reply('🔧 Maintenance mode enabled. Use !restart to resume normal operations.');
        } catch (error) {
            log('error', 'Error setting maintenance mode:', error);
            await setMaintenanceMode(false, message.client); // Reset maintenance mode if status update fails
            return message.reply('❌ Failed to enter maintenance mode!');
        }
    }
};