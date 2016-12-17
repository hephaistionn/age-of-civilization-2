const ee = require('../../services/eventEmitter');
const stateManager = require('../../services/stateManager');

module.exports = class MonitoringPanel {

    constructor() {
        this.opened = false;
        this.type = 'UI';
        this.previewes = ['wood', 'stone', 'meat'];
        this.updated = false;
        this.stateManager = stateManager;
    }

    open() {
        if(this.opened === true) return;
        this.opened = true;
        this.updated = true;
    }

    close() {
        if(this.opened === false) return;
        this.opened = false;
        this.updated = true;
    }

    switchTrade(id) {
        this.stateManager.switchTrade(id);
        this.updated = true;
    }

    goWorldmap() {
        this.close();
        const model = stateManager.loadCurrentWorldmap();
        ee.emit('openScreen', 'ScreenWorldmap', model);
    }

};
