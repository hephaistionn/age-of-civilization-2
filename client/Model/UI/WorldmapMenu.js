const ee = require('../../services/eventEmitter');
const stateManager = require('../../services/stateManager');

module.exports = class WorldmapMenu {

    constructor(config) {
        this.type = 'UI';
        this.constructMode = false;
        this.updated = true;
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
        this.updated = true;
    }

    onConstructMode(fct) {
        this.onConstructModeFct = ()=> {
            this.constructMode = true;
            fct();
            this.updated = true;
        };
    }

};
