const ee = require('../../services/eventEmitter');
const stateManager = require('../../services/stateManager');

module.exports = class EntityManagerPanel {

    constructor() {
        this.opened = false;
        this.type = 'UI';
        this.description = '';
    }

    open(entity) {
        if(this.opened === true) return;
        if(!entity.constructor.selectable) return;
        this.description = entity.constructor.description;
        this.opened = true;
        ee.emit('onUpdate', 'entityManagerPanel', this);
    }

    close() {
        if(this.opened === false) return;
        this.description = '';
        this.opened = false;
        ee.emit('onUpdate', 'entityManagerPanel', this);
    }

};
