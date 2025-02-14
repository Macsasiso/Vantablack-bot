// Maintenance state tracker
let isInMaintenance = false;

function setMaintenanceMode(value) {
    isInMaintenance = value;
}

function isMaintenanceMode() {
    return isInMaintenance;
}

module.exports = {
    setMaintenanceMode,
    isMaintenanceMode
};
