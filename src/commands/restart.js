const { PermissionsBitField } = require('discord.js');
const { setMaintenanceMode } = require('../utils/maintenance');
const { log } = require('../utils/logger');

module.exports = {
    name: 'restart',
    description: 'Restarts the bot from maintenance mode (Admin only)',
    async execute(message, args) {
        // Check if user has admin permissions
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply('❌ Sorry, only administrators can use this command!');
        }

        try {
            // Update presence to online with default activity
            await message.client.user.setPresence({
                status: 'online',
                activities: [{
                    name: '!help for commands',
                    type: 'PLAYING'
                }]
            });

            // Disable maintenance mode after status is updated
            setMaintenanceMode(false);

            // Log the restart
            log('info', `Bot restarted from maintenance mode by ${message.author.tag}`);

            // Send confirmation message
            return message.reply('✅ Bot is now back online and operational!');
        } catch (error) {
            log('error', 'Error restarting bot:', error);
            return message.reply('❌ Failed to restart the bot!');
        }
    }
};