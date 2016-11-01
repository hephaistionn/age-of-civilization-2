const ee = require('../../services/eventEmitter');
const stateManager = require('../../services/stateManager');

module.exports = class LeaderCreationPanel {

    constructor(config) {
        this.type = 'UI';
        this.inputName = 'SARGON';
        this.labelName = 'leader name';
        this.valide = null;
    }

    onClose(fct) {
        this.valide = fct;
    }

};
