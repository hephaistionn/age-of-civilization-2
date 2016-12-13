const ee = require('../../services/eventEmitter');
const stateManager = require('../../services/stateManager');
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
