const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'offline',
    description: 'Shuts down the bot (Admin only)',
    async execute(message, args) {
        // Check if user has admin permissions
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply('❌ Sorry, only administrators can use this command!');
        }

        // Send confirmation message
        await message.reply('Initializing shutdown sequence...');
        
        // Log the shutdown
        console.log(`[${new Date().toISOString()}] Bot shutdown initiated by ${message.author.tag}`);
        
        message.client.user.setPresence({
            status: 'invisible',
        });
        // Destroy the client connection
        message.client.destroy();
        
        // Exit the process
        process.exit(0);
    }
};
