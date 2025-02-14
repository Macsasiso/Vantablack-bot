const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'test',
    description: 'A fun test command with a creative response',
    execute(message, args) {
        const responses = [
            "🎮 Beep boop! All systems operational and ready for gaming!",
            "🔮 According to my crystal ball, you're awesome!",
            "🚀 Houston, we have a successful test! Over and out!",
            "🎲 Rolling the dice... You rolled a natural 20! Critical success!",
            "🎯 Target acquired! Test command hit successfully!"
        ];

        const embed = new EmbedBuilder()
            .setColor('#FF69B4')
            .setTitle('🎉 Test Command Activated!')
            .setDescription(responses[Math.floor(Math.random() * responses.length)])
            .addFields({
                name: 'Status',
                value: '✅ Working perfectly!',
                inline: true
            })
            .setFooter({ text: '🤖 Beep boop! Your friendly neighborhood bot' })
            .setTimestamp();

        message.reply({ embeds: [embed] });
    }
};
