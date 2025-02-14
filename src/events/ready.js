const { log } = require('../utils/logger');

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        log('info', `Logged in as ${client.user.tag}`);
        client.user.setActivity('!help for commands', { type: 'PLAYING' });
    }
};
