const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const { log } = require('../utils/logger');

module.exports = {
    name: 'colorpicker',
    description: 'Preview and set role colors (!colorpicker @role #hexcolor)',
    async execute(message, args) {
        try {
            log('info', `Color picker command initiated by ${message.author.tag}`);

            // Check if user has manage roles permission
            if (!message.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
                log('info', `User ${message.author.tag} attempted to use colorpicker without permission`);
                return message.reply('❌ You need the Manage Roles permission to use this command!');
            }

            // Validate arguments
            if (args.length !== 2) {
                log('info', `Invalid arguments provided by ${message.author.tag}: ${args.join(' ')}`);
                return message.reply('❌ Please provide both a role mention and a hex color (e.g., !colorpicker @Role #FF0000)');
            }

            // Get the role from mention
            const role = message.mentions.roles.first();
            if (!role) {
                log('info', `Invalid role mention by ${message.author.tag}`);
                return message.reply('❌ Please mention a valid role!');
            }

            // Check bot's permissions for the role
            if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
                log('error', `Bot lacks permission to modify roles in guild ${message.guild.name}`);
                return message.reply('❌ I need the Manage Roles permission to change role colors!');
            }

            // Validate hex color format
            const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
            const color = args[1].toUpperCase();
            if (!colorRegex.test(color)) {
                log('info', `Invalid color format provided by ${message.author.tag}: ${color}`);
                return message.reply('❌ Please provide a valid hex color code (e.g., #FF0000)');
            }

            log('info', `Creating color preview for role "${role.name}" with color ${color}`);

            // Create preview embed
            const previewEmbed = new EmbedBuilder()
                .setColor(color)
                .setTitle('🎨 Role Color Preview')
                .setDescription(`Preview for role: ${role.name}`)
                .addFields(
                    { name: 'Current Color', value: role.hexColor, inline: true },
                    { name: 'New Color', value: color, inline: true }
                )
                .setFooter({ text: 'React with ✅ to apply this color or ❌ to cancel' });

            // Send preview message with reactions
            const previewMsg = await message.reply({ embeds: [previewEmbed] });
            await previewMsg.react('✅');
            await previewMsg.react('❌');

            log('info', `Color preview sent for role "${role.name}" (${color})`);

            // Create reaction collector
            const filter = (reaction, user) => {
                return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id;
            };

            // Wait for reaction
            const collector = previewMsg.createReactionCollector({ filter, time: 30000, max: 1 });

            collector.on('collect', async (reaction, user) => {
                log('info', `Reaction ${reaction.emoji.name} collected from ${user.tag}`);

                if (reaction.emoji.name === '✅') {
                    try {
                        await role.setColor(color);
                        log('info', `Successfully updated role "${role.name}" color to ${color}`);
                        await message.reply(`✅ Successfully updated the color of ${role.name} to ${color}!`);
                    } catch (error) {
                        log('error', `Failed to update role color:`, error);
                        await message.reply('❌ Failed to update the role color. Make sure I have the right permissions!');
                    }
                } else {
                    log('info', `Color change cancelled for role "${role.name}"`);
                    await message.reply('❌ Color change cancelled.');
                }

                // Clean up the preview message
                try {
                    await previewMsg.delete();
                    log('info', 'Preview message cleaned up');
                } catch (error) {
                    log('error', 'Failed to delete preview message:', error);
                }
            });

            collector.on('end', collected => {
                if (collected.size === 0) {
                    log('info', `Color preview expired for role "${role.name}"`);
                    message.reply('❌ Color preview expired. Please try again.');
                    previewMsg.delete().catch(error => log('error', 'Failed to delete expired preview:', error));
                }
            });

        } catch (error) {
            log('error', 'Error in colorpicker command:', error);
            message.reply('❌ An error occurred while processing the command.');
        }
    }
};