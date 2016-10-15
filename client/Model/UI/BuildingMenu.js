const ee = require('../../services/eventEmitter');
const stateManager = require('../stateManager');
const ENTITIES = require('../Engine/Entity/listEntity');


module.exports = class BuildingMenu {

    constructor(config) {
        this.categories = {
            resource: ['Destroy'],
            factory: ['Destroy'],
            service: ['Destroy'],
            culture: ['EntityChurch', 'Destroy'],
            state: [
                'EntityHouse',
                'EntityChurch',
                'Road',
                'Destroy',
                'Destroy',
                'Destroy']
        };
        this.currentCategory = [];
        this.currentCategoryId = '';
        this.currentFocus = null;
        this.displayed = false;
        this.entityEditor = false;
        this.roadEditor = false;
        this.eraseEditor = false;

        this.type = 'UI';
    }

    open() {
        if(this.displayed === true) return;
        this.displayed = true;
        ee.emit('onUpdate', 'buildingMenu', this);
    }

    close() {
        if(this.displayed === false) return;
        this.displayed = false;
        this.currentCategory = [];
        if(this._close)this._close();
        ee.emit('onUpdate', 'buildingMenu', this);
    }


    openCategory(categoryId) {
        this.displayed = true;
        this.currentCategoryId = categoryId;
        this.updateCurrentCategory();
        ee.emit('onUpdate', 'buildingMenu', this);
    }

    updateCurrentCategory() {
        const category = this.categories[this.currentCategoryId];
        this.currentCategory = category.filter(this.filterEnableBuilding);
    }

    filterEnableBuilding(entityId) {
        const Entity = ENTITIES[entityId];
        if(!Entity) return true;
        return Entity.available();
    }

    showEntityEditor() {
        this.entityEditor = true;
        ee.emit('onUpdate', 'buildingMenu', this);
    }

    showRoadEditor() {
        this.roadEditor = true;
        ee.emit('onUpdate', 'buildingMenu', this);
    }

    showDeletionEditor() {
        this.eraseEditor = true;
        ee.emit('onUpdate', 'buildingMenu', this);
    }

    hideEditor() {
        this.entityEditor = false;
        this.roadEditor = false;
        this.eraseEditor = false;
        ee.emit('onUpdate', 'buildingMenu', this);
    }

    onConstructEditor(fct) {
        this._onConstructEditor = () => {
            fct();
        };
    }

    onCancelEditor(fct) {
        this._onCancelEditor = fct;
    }

    onClickBuilding(fct) {
        this._onClickBuilding = entityId => {
            this.currentFocus === entityId ? this.currentFocus = null : this.currentFocus = entityId;
            fct(entityId);
            ee.emit('onUpdate', 'buildingMenu', this);
        };
    }

    onClose(fct) {
        this._close = fct;
    }

    _onClickOpen() {
        this.open();
    }

    _onClickClose() {
        this.close();
    }

    _onClickBuilding() {
    }

    _onClickCategory(categoryId) {
        this.openCategory(categoryId)
    }

};
