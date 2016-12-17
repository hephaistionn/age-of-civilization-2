const ee = require('../../services/eventEmitter');
const stateManager = require('../../services/stateManager');

module.exports = class EntityManagerPanel {

    constructor() {
        this.opened = false;
        this.yourCity = false;
        this.type = 'UI';
        this.description = '';
        this.currentEntity = null;
        this.updated = true;
    }

    open(entity) {
        if(!entity.constructor.selectable) return;
        this.description = entity.constructor.description;
        this.opened = true;
        this.yourCity = entity.leader === stateManager.getCurrentLeader().id;
        this.currentEntity = entity;
        this.updated = true;
    }

    close() {
        this.description = '';
        this.opened = false;
        this.currentEntity = null;
        this.updated = true;
    }

    visit() {
        const cityId = this.currentEntity.id;
        const model = stateManager.loadCurrentCity(cityId);
        this.close();
        ee.emit('openScreen', 'ScreenMap', model);
    }

};
