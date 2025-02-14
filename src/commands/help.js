const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'help',
    description: 'Lists all available commands',
    execute(message, args, client) {
        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Bot Commands')
            .setDescription('Here are all the available commands:')
            .addFields(
                Array.from(client.commands.values()).map(command => ({
                    name: `!${command.name}`,
                    value: command.description
                }))
            )
            .setTimestamp()
            .setFooter({ text: 'Use ! prefix before each command' });

        message.reply({ embeds: [embed] });
    }
};
