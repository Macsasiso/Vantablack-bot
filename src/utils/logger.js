function log(level, ...messages) {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
    
    switch (level) {
        case 'error':
            console.error(prefix, ...messages);
            break;
        case 'warn':
            console.warn(prefix, ...messages);
            break;
        case 'info':
            console.log(prefix, ...messages);
            break;
        default:
            console.log(prefix, ...messages);
    }
}

module.exports = { log };
