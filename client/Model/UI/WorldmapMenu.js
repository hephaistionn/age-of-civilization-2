const ee = require('../../services/eventEmitter');
const stateManager = require('../../services/stateManager');

module.exports = class WorldmapMenu {

    constructor(config) {
        this.type = 'UI';
        this.constructMode = false;
        this.onConstructModeFct = ()=>{};
        this.onConstructFct = ()=>{};
    }

    goCity() {
        ee.emit('screen', 'ScreenWorldmap');
    }

    back() {
        ee.emit('openScreen', 'ScreenMap');
    }

    switchConstrucMode(status) {
        this.constructMode = !this.constructMode;
        this.onConstructModeFct(this.constructMode);
        ee.emit('onUpdate', 'worldmapMenu', this);
    }

    onConstructMode(fct){
        this.onConstructModeFct = fct;
    }

};
