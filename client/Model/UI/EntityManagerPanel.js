const ee = require('../../services/eventEmitter');
const stateManager = require('../../services/stateManager');

module.exports = class EntityManagerPanel {

    constructor() {
        this.opened = false;
        this.yourCity = false;
        this.type = 'UI';
        this.description = '';
        this.currentEntity = null;
    }

    open(entity) {
        if(this.opened === true) return;
        if(!entity.constructor.selectable) return;
        this.description = entity.constructor.description;
        this.opened = true;
        this.yourCity = entity.leader === stateManager.playerId;
        this.currentEntity = entity;
        ee.emit('onUpdate', 'entityManagerPanel', this);
    }

    close() {
        if(this.opened === false) return;
        this.description = '';
        this.opened = false;
        this.currentEntity = null;
        ee.emit('onUpdate', 'entityManagerPanel', this);
    }

    visit() {
        const cityId = this.currentEntity.id;
        const model = stateManager.loadCity(cityId).map;
        this.close();
        ee.emit('openScreen', 'ScreenMap', model);
    }

};
