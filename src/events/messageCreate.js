const { log } = require('../utils/logger');
const { isMaintenanceMode } = require('../utils/maintenance');

module.exports = {
    name: 'messageCreate',
    execute(message, client) {
        // Log every message received with unique identifier
        log('info', `Processing message ID: ${message.id} from ${message.author.tag}`);

        // Ignore messages from bots
        if (message.author.bot) {
            log('info', `Ignored bot message ID: ${message.id}`);
            return;
        }

        // Check for bot mention
        if (message.mentions.has(client.user)) {
            log('info', `Bot mention detected in message ID: ${message.id}`);
            const mentionCommand = client.commands.get('mention');
            if (mentionCommand) {
                try {
                    mentionCommand.execute(message, [], client);
                } catch (error) {
                    log('error', `Error executing mention response:`, error);
                }
            }
            return;
        }

        // Check for command prefix
        const prefix = '!';
        if (!message.content.startsWith(prefix)) {
            log('info', `Ignored non-command message ID: ${message.id}`);
            return;
        }

        // Parse command and arguments
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        log('info', `Command "${commandName}" detected in message ID: ${message.id}`);

        // Early return if command doesn't exist
        if (!client.commands.has(commandName)) {
            log('info', `Unknown command "${commandName}" in message ID: ${message.id}`);
            return;
        }

        // Get command object
        const command = client.commands.get(commandName);

        // Maintenance mode check - Do this before any command execution
        if (isMaintenanceMode() && !['restart', 'maintenance'].includes(commandName)) {
            log('info', `Blocking command "${commandName}" - maintenance mode active (Message ID: ${message.id})`);
            return message.reply('⚠️ Bot is currently in maintenance mode. Only administrators can use !restart to resume normal operations.')
                .catch(error => log('error', `Failed to send maintenance message for message ID ${message.id}:`, error));
        }

        // Execute command if we pass maintenance check
        try {
            log('info', `Executing command "${commandName}" (Message ID: ${message.id})`);
            command.execute(message, args, client);
            log('info', `Successfully executed command "${commandName}" for message ID: ${message.id}`);
        } catch (error) {
            log('error', `Error executing command "${commandName}" for message ID: ${message.id}:`, error);
            message.reply('There was an error executing that command!')
                .catch(err => log('error', `Failed to send error message for message ID ${message.id}:`, err));
        }
    }
};