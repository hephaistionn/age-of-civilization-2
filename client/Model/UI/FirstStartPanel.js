const ee = require('../../services/eventEmitter');
const stateManager = require('../../services/stateManager');

module.exports = class FirstStartPanel {

    constructor(config) {
        this.type = 'UI';
        this.message = "welcome to Age of Civilization";
        this.picture = '';
        this.fct = null;
        this.updated = false;
    }

    onClose(fct) {
        this.close = fct;
    }

};
