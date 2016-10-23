const ee = require('../../services/eventEmitter');
const stateManager = require('../stateManager');

module.exports = class WorldmapMenu {

    constructor(config) {
        this.type = 'UI';
        this.construct = null;
        this.constructMode = false;
    }

    goCity() {
        ee.emit('screen', 'ScreenWorldmap');
    }

    back() {
        ee.emit('openScreen', 'ScreenMap');
    }

    switchConstrucMode(status) {
        this.constructMode = !this.constructMode;
        ee.emit('onUpdate', 'worldmapMenu', this);
    }

    constructCity(fct) {
        this.construct = fct;
    }
};
