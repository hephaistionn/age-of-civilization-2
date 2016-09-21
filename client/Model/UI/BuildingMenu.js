const ee = require('../../services/eventEmitter');
const stateManager = require('../stateManager');


module.exports = class BuildingMenu {

    constructor(config) {
        this.categories = {
            resource: [{id: 'Destroy'}],
            factory: [{id: 'Destroy'}],
            service: [{id: 'Destroy'}],
            culture: [{id: 'EntityChurch', required: {}}, {id: 'Destroy'}],
            state: [
                {id: 'EntityHouse', required: {}, cost: {stone: 5}},
                {id: 'EntityChurch', required: {}, cost: {stone: 5, wood: 5}},
                {id: 'Road', required: {}, cost: {stone: 1}},
                {id: 'Destroy'},
                {id: 'Destroy'},
                {id: 'Destroy'}]
        };
        this.currentCategory = [];
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


    openCategory(cetegoryId) {
        this.displayed = true;
        const category = this.categories[cetegoryId];
        this.currentCategory = category.filter(this.filterEnableBuilding);
        ee.emit('onUpdate', 'buildingMenu', this);
    }

    filterEnableBuilding(buildings) {
        const required = buildings.required;
        if(!required) return true;
        for(let key in required) {
            if(stateManager.states[key] < required[key]) {
                return false;
            }
        }
        return true;
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
