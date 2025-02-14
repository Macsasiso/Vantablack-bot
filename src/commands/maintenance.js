const { PermissionsBitField } = require('discord.js');
const { log } = require('../utils/logger');
const { setMaintenanceMode } = require('../utils/maintenance');

module.exports = {
    name: 'maintenance',
    description: 'Sets bot to maintenance mode (Admin only)',
    async execute(message, args) {
        // Check if user has admin permissions
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply('❌ Sorry, only administrators can use this command!');
        }

        try {
            // Enable maintenance mode first to prevent any commands from executing
            setMaintenanceMode(true);

            // Set status to idle and update activity
            await message.client.user.setPresence({
                status: 'idle',
                activities: [{
                    name: '🔧 Under Maintenance',
                    type: 'PLAYING'
                }]
            });

            // Log the status change
            log('info', `Bot entered maintenance mode by ${message.author.tag}`);

            // Send confirmation message
            return message.reply('🔧 Maintenance mode enabled. Use !restart to resume normal operations.');
        } catch (error) {
            log('error', 'Error setting maintenance mode:', error);
            setMaintenanceMode(false); // Reset maintenance mode if status update fails
            return message.reply('❌ Failed to enter maintenance mode!');
        }
    }
};