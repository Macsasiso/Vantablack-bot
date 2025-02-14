const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const { log } = require('../utils/logger');

module.exports = {
    name: 'roles',
    description: 'Lists all roles and their members',
    async execute(message, args) {
        try {
            log('info', `Fetching roles for guild: ${message.guild.name}`);

            // Fetch all members before processing roles
            await message.guild.members.fetch();
            log('info', 'Successfully fetched all guild members');

            // Get all roles (excluding @everyone) and sort by position
            const roles = message.guild.roles.cache
                .filter(role => role.id !== message.guild.id) // Exclude @everyone
                .sort((a, b) => b.position - a.position);

            if (roles.size === 0) {
                log('info', 'No roles found in guild');
                return message.reply('No roles found in this server.');
            }

            // Create embed
            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('Server Roles')
                .setDescription('Here are all the roles and their members:')
                .setTimestamp();

            let hasRolesWithMembers = false;

            // Add field for each role
            for (const [id, role] of roles) {
                log('info', `Processing role: ${role.name} (${role.id})`);
                // Get members with this role
                const members = role.members
                    .map(member => member.user.tag)
                    .sort((a, b) => a.localeCompare(b)) // Sort members alphabetically
                    .join('\n');

                // Add field for role (if there are members)
                if (members.length > 0) {
                    hasRolesWithMembers = true;
                    log('info', `Role ${role.name} has ${role.members.size} members`);
                    // Truncate if too long (Discord has 1024 char limit per field)
                    const truncatedMembers = members.length > 1000 
                        ? members.substring(0, 997) + '...'
                        : members;

                    embed.addFields({
                        name: `${role.name} (${role.members.size} members)`,
                        value: truncatedMembers || 'No members',
                        inline: false
                    });
                }
            }

            if (!hasRolesWithMembers) {
                log('info', 'No roles with members found');
                return message.reply('No roles with members found in this server.');
            }

            // Send the embed
            await message.reply({ embeds: [embed] });
            log('info', `Roles command executed successfully in guild: ${message.guild.name}`);

        } catch (error) {
            log('error', 'Error executing roles command:', error);
            await message.reply('❌ Failed to fetch roles information!');
        }
    }
};