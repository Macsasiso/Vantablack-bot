const { EmbedBuilder } = require('discord.js');
const { log } = require('../utils/logger');

module.exports = {
    name: 'mention',
    description: 'Responds when the bot is mentioned',
    execute(message, args) {
        try {
            log('info', `Bot was mentioned by ${message.author.tag}`);

            const embed = new EmbedBuilder()
                .setColor('#FF69B4')
                .setTitle('get a load of this guy')
                .setDescription("blud im a bot, not a user 😭🙏")
                .setTimestamp()
                .setFooter({ text: 'hah you looked 👌' });

            message.reply({ embeds: [embed] });
            log('info', 'Mention response sent successfully');
        } catch (error) {
            log('error', 'Error handling mention:', error);
        }
    }
};