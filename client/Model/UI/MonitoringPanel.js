const ee = require('../../services/eventEmitter');
const stateManager = require('../stateManager');

module.exports = class MonitoringPanel {

    constructor() {
        this.opened = false;
        this.type = 'UI';
        this.previewes = ['wood','stone', 'meat'];

        this.stateManager = stateManager;
    }

    open() {
        if(this.opened === true) return;
        this.opened = true;
        ee.emit('onUpdate', 'monitoringPanel', this);
    }

    close() {
        if(this.opened === false) return;
        this.opened = false;
        ee.emit('onUpdate', 'monitoringPanel', this);
    }

    switchTrade(id) {
        this.stateManager.switchTrade(id);
        ee.emit('onUpdate', 'monitoringPanel', this);
    }

};
