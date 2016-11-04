const ee = require('../../services/eventEmitter');
const stateManager = require('../../services/stateManager');

module.exports = class WorldmapMenu {

    constructor(config) {
        this.type = 'UI';
        this.constructMode = false;
        this.onConstructModeFct = ()=> {
        };
        this.onConstructFct = ()=> {
        };
    }

    goCity() {
        ee.emit('screen', 'ScreenWorldmap');
    }

    back() {
        const cityId = stateManager.getCurrentCityId();
        const model = stateManager.loadCity(cityId).map;
        ee.emit('openScreen', 'ScreenMap', model);
    }

    switchConstrucMode(status) {
        this.constructMode = !this.constructMode;
        this.onConstructModeFct(this.constructMode);
        ee.emit('onUpdate', 'worldmapMenu', this);
    }

    onConstructMode(fct) {
        this.onConstructModeFct = fct;
    }

};
