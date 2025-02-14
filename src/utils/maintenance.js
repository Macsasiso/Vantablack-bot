// Maintenance state tracker
let isInMaintenance = false;

// Initialize maintenance mode state
function initMaintenanceMode() {
    isInMaintenance = false;
}

// Set maintenance mode with validation and status update
async function setMaintenanceMode(value, client) {
    if (typeof value !== 'boolean') {
        throw new Error('Maintenance mode value must be a boolean');
    }
    isInMaintenance = value;

    // Update client status if provided
    if (client) {
        await client.user.setStatus(value ? 'dnd' : 'online');
    }
}

// Check maintenance mode state
function isMaintenanceMode() {
    return isInMaintenance;
}

module.exports = {
    initMaintenanceMode,
    setMaintenanceMode,
    isMaintenanceMode
};