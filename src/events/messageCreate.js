const { log } = require('../utils/logger');

module.exports = {
    name: 'messageCreate',
    execute(message, client) {
        // Ignore messages from bots
        if (message.author.bot) return;

        // Check for command prefix
        const prefix = '!';
        if (!message.content.startsWith(prefix)) return;

        // Parse command and arguments
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        // Check if command exists
        if (!client.commands.has(commandName)) return;

        const command = client.commands.get(commandName);

        try {
            // Execute command
            command.execute(message, args, client);
            log('info', `Command ${commandName} executed by ${message.author.tag}`);
        } catch (error) {
            log('error', `Error executing command ${commandName}:`, error);
            message.reply('There was an error executing that command!');
        }
    }
};
