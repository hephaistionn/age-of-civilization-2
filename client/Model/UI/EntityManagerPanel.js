const ee = require('../../services/eventEmitter');
const stateManager = require('../../services/stateManager');

module.exports = class EntityManagerPanel {

    constructor() {
        this.opened = false;
        this.yourCity = false;
        this.type = 'UI';
        this.description = '';
        this.currentEntity = null;
        this.updated = false;
        this._onBuild = null;
    }

    open(entity) {
        if(!entity.constructor.selectable) return;
        this.description = entity.constructor.description;
        if( entity.onAction) {
            this.currentAction = entity.onAction.bind(entity);
        }else {
            this.currentAction = null;
        }
        this.actionLabel = entity.constructor.actionLabel;
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

    onActionHandler() {
        if(this.currentAction) {
            const entityId = this.currentAction();
            if(entityId) this._onBuild(entityId);
        }
    }

    onBuild(fct) {
        this._onBuild = fct;
    }

    visit() {
        const cityId = this.currentEntity.id;
        const model = stateManager.loadCurrentCity(cityId);
        this.close();
        ee.emit('openScreen', 'ScreenMap', model);
    }

};
