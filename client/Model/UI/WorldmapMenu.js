const ee = require('../../services/eventEmitter');
const stateManager = require('../stateManager');

module.exports = class WorldmapMenu {

    constructor(config) {
        this.type = 'UI';
    }

    goCity() {
        ee.emit('screen', 'ScreenWorldmap');
    }

    back() {
        ee.emit('openScreen', 'ScreenMap');
    }

};
