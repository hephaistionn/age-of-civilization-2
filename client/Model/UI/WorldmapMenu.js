const ee = require('../../services/eventEmitter');
const stateManager = require('../../services/stateManager');

module.exports = class WorldmapMenu {

    constructor(config) {
        this.type = 'UI';
        this.constructMode = false;
        this.onConstructModeFct = ()=> {
        };
    }

    goCity() {
        ee.emit('screen', 'ScreenWorldmap');
    }

    back() {
        const model = stateManager.loadCurrentCity();
        ee.emit('openScreen', 'ScreenMap', model);
    }

    stopConstructMode(){
        this.constructMode = false;
        ee.emit('onUpdate', 'worldmapMenu', this);
    }

    onConstructMode(fct) {
        this.onConstructModeFct = ()=> {
            this.constructMode = true;
            fct();
            ee.emit('onUpdate', 'worldmapMenu', this);
        };
    }

};
